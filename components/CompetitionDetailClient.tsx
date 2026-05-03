"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import type { Agent, Competition } from "@/lib/types";
import { MOCK_AGENTS } from "@/lib/mock-data";
import {
  getLeaderboard,
  getMergedCompetition,
  getPrompt,
  submitAnswer,
} from "@/lib/contracts/defight";
import { zgChain } from "@/lib/wagmi/config";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StepCard } from "@/components/StepCard";
import { CopyButton } from "@/components/CopyButton";
import { AgentCard } from "@/components/AgentCard";
import { SuccessCard } from "@/components/SuccessCard";
import { StatusBadge } from "@/components/StatusBadge";
type SubmitPhase = "idle" | "pending" | "confirming" | "success" | "error";

type Props = { competitionId: string };

function iconForTitle(title: string) {
  if (title.toLowerCase().includes("btc")) return "₿";
  if (title.toLowerCase().includes("eth")) return "Ξ";
  if (title.toLowerCase().includes("sol")) return "◎";
  return "⚔️";
}

export function CompetitionDetailClient({ competitionId }: Props) {
  const { isConnected, chainId } = useAccount();
  const onCorrectNetwork = isConnected && chainId === zgChain.id;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [officialQuestion, setOfficialQuestion] = useState("");
  const [editDemo, setEditDemo] = useState(false);
  const [questionDraft, setQuestionDraft] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<Awaited<
    ReturnType<typeof getLeaderboard>
  >>([]);

  const loadCompetition = useCallback(() => {
    const c = getMergedCompetition(competitionId);
    setCompetition(c ?? null);
  }, [competitionId]);

  const refreshBoard = useCallback(async () => {
    const rows = await getLeaderboard(competitionId);
    setPreviewRows(rows);
  }, [competitionId]);

  useEffect(() => {
    loadCompetition();
  }, [loadCompetition]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = await getPrompt(competitionId);
        if (!cancelled) {
          setOfficialQuestion(q);
          setQuestionDraft(q);
        }
      } catch {
        if (!cancelled) setOfficialQuestion("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [competitionId]);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  const displayedQuestion = editDemo ? questionDraft : officialQuestion;

  const agents: Agent[] = useMemo(() => {
    if (!competition) return [];
    return MOCK_AGENTS.filter((a) =>
      competition.allowedAgentIds.includes(a.id),
    );
  }, [competition]);

  async function onCopyAndOpen() {
    const selectedAgent = agents.find((a) => a.id === selectedAgentId);
    if (!selectedAgent) {
      setToast("Select an agent first.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    try {
      await navigator.clipboard.writeText(displayedQuestion);
      window.open(selectedAgent.aiverseUrl, "_blank", "noopener,noreferrer");
      setToast(
        "Question copied. Ask the selected agent in AIVerse, then paste the response below.",
      );
      setTimeout(() => setToast(null), 4000);
    } catch {
      setToast("Could not copy to clipboard.");
      setTimeout(() => setToast(null), 2500);
    }
  }

  async function onSubmit() {
    if (!competition || !selectedAgentId) return;
    setErrorMsg(null);
    setPhase("pending");
    await new Promise((r) => setTimeout(r, 450));
    setPhase("confirming");
    try {
      const result = await submitAnswer({
        competitionId,
        agentId: selectedAgentId,
        query: displayedQuestion,
        response: response.trim(),
      });
      setLastScore(result.score);
      setLastTx(result.txHash);
      setPhase("success");
      await refreshBoard();
      loadCompetition();
    } catch (e) {
      setPhase("error");
      setErrorMsg(e instanceof Error ? e.message : "Transaction failed.");
    }
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <AppHeader subtitle="Ask AI agents. Submit answers onchain on 0G." />
        <div className="mx-auto max-w-layout px-4 py-16 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Competition not found
          </p>
          <Link
            href="/competitions"
            className="mt-4 inline-block text-brand-600 hover:underline"
          >
            ← Back to competitions
          </Link>
        </div>
      </div>
    );
  }

  const isResolved = competition.status === "resolved";

  const canSubmit =
    !isResolved &&
    isConnected &&
    onCorrectNetwork &&
    Boolean(selectedAgentId) &&
    response.trim().length > 0 &&
    phase !== "pending" &&
    phase !== "confirming";

  const topTwo = [...previewRows]
    .filter((r) => r.competitionId === competitionId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader subtitle="Ask AI agents. Submit answers onchain on 0G." />
      {toast && (
        <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-900">
          {toast}
        </div>
      )}
      <main className="mx-auto max-w-layout space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-card">
            {iconForTitle(competition.title)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {competition.title}
              </h1>
              <StatusBadge status={competition.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{competition.description}</p>
            {competition.deadline && (
              <p className="mt-2 text-xs text-slate-500">
                Deadline:{" "}
                <span className="font-medium text-slate-700">
                  {competition.deadline}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <StepCard step={1} title="Competition question">
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-800 whitespace-pre-wrap">
              {displayedQuestion || "Loading…"}
            </p>
            {editDemo && (
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                rows={4}
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
              />
            )}
            <div className="flex flex-wrap gap-2">
              <CopyButton text={displayedQuestion} label="Copy question" />
              <button
                type="button"
                onClick={() => {
                  setEditDemo((v) => !v);
                  if (!editDemo) setQuestionDraft(displayedQuestion);
                }}
                className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {editDemo ? "Done editing" : "Edit for demo"}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              This question is fetched via{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">
                getPrompt()
              </code>
              {editDemo ? " (overridden locally for demo)." : "."}
            </p>
          </StepCard>

          <StepCard step={2} title="Select agent">
            <div className="grid gap-3 md:grid-cols-2">
              {agents.map((a) => (
                <AgentCard
                  key={a.id}
                  agent={a}
                  selected={selectedAgentId === a.id}
                  onSelect={() => setSelectedAgentId(a.id)}
                />
              ))}
            </div>
          </StepCard>

          <StepCard step={3} title="Ask / paste response">
            <button
              type="button"
              onClick={onCopyAndOpen}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 md:w-auto"
            >
              Copy question &amp; open AIVerse ↗
            </button>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Paste agent response
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                rows={6}
                placeholder="Paste the selected agent’s answer here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                {response.length} characters
              </p>
            </div>
          </StepCard>

          <StepCard step={4} title="Submit onchain">
            <p className="text-sm text-slate-600">
              Submit your agent&apos;s response to be recorded on 0G.
            </p>
            {isResolved && (
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                This competition is resolved — submissions are closed for demo.
              </p>
            )}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onSubmit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {phase === "pending"
                ? "Posting response…"
                : phase === "confirming"
                  ? "Confirming on 0G…"
                  : "⛓ Post response onchain"}
            </button>
            {!isConnected && (
              <p className="text-xs text-amber-800">
                Connect your wallet to submit.
              </p>
            )}
            {isConnected && !onCorrectNetwork && (
              <p className="text-xs text-amber-800">
                Switch to 0G to submit onchain.
              </p>
            )}
            {phase === "error" && errorMsg && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                {errorMsg}
              </div>
            )}
            {phase === "success" && lastScore != null && lastTx && (
              <SuccessCard score={lastScore} txHash={lastTx} />
            )}
          </StepCard>
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Current leaderboard
            </h2>
            <Link
              href="/leaderboard"
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              View full leaderboard →
            </Link>
          </div>
          <ol className="space-y-2 text-sm text-slate-700">
            {topTwo.length === 0 && (
              <li className="text-slate-500">No submissions yet.</li>
            )}
            {topTwo.map((r, i) => (
              <li key={r.id} className="flex justify-between gap-2">
                <span>
                  #{i + 1} {r.agentName}
                </span>
                <span className="font-semibold">{r.score}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
