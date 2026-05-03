"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_AGENTS } from "@/lib/mock-data";
import { createChallenge } from "@/lib/contracts/defight";
import { upsertStoredCompetition } from "@/lib/storage/client-store";
import { ChallengePreviewCard } from "@/components/ChallengePreviewCard";

const SCORING = [
  "Contract scoring",
  "Manual/admin scoring",
  "Oracle scoring later",
] as const;

export function CreateChallengeClient() {
  const router = useRouter();
  const [title, setTitle] = useState("BTC Price Prediction");
  const [description, setDescription] = useState(
    "Predict the BTC price on Binance at a specific future time.",
  );
  const [question, setQuestion] = useState(
    "What will the BTC price on Binance be on May 15th at 00:00 UTC?",
  );
  const [deadline, setDeadline] = useState("May 15, 00:00 UTC");
  const [scoringMethod, setScoringMethod] =
    useState<string>("Contract scoring");
  const [allowed, setAllowed] = useState<Record<string, boolean>>({
    agent_macro_001: true,
    agent_sent_002: true,
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allowedAgentIds = MOCK_AGENTS.filter(
    (a) => allowed[a.id] && ["agent_macro_001", "agent_sent_002"].includes(a.id),
  ).map((a) => a.id);

  async function onCreate() {
    setBusy(true);
    setMessage(null);
    try {
      if (allowedAgentIds.length === 0) {
        setMessage("Select at least one allowed agent.");
        setBusy(false);
        return;
      }
      const c = await createChallenge({
        title,
        description,
        question,
        deadline: deadline || undefined,
        scoringMethod,
        allowedAgentIds,
      });
      router.push(`/competitions/${c.id}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not create challenge.");
    } finally {
      setBusy(false);
    }
  }

  function onSaveDraft() {
    if (allowedAgentIds.length === 0) {
      setMessage("Select at least one allowed agent.");
      return;
    }
    const id = `draft_${Date.now().toString(36)}`;
    upsertStoredCompetition({
      id,
      title,
      description,
      question,
      deadline: deadline || undefined,
      status: "draft",
      allowedAgentIds,
      submissionsCount: 0,
    });
    setMessage("Draft saved locally.");
  }

  return (
    <div className="mx-auto grid max-w-layout gap-8 px-4 py-10 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xl">📄</span>
          <h2 className="text-lg font-semibold text-slate-900">
            Challenge details
          </h2>
        </div>
        {message && (
          <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        )}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Challenge title
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              {description.length}/200 (soft limit)
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Competition question
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">{question.length}/500</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Deadline (optional)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Scoring method
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
              value={scoringMethod}
              onChange={(e) => setScoringMethod(e.target.value)}
            >
              {SCORING.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Allowed agents</p>
            <div className="mt-2 flex flex-col gap-2">
              {MOCK_AGENTS.filter((a) =>
                ["agent_macro_001", "agent_sent_002"].includes(a.id),
              ).map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(allowed[a.id])}
                    onChange={(e) =>
                      setAllowed((prev) => ({
                        ...prev,
                        [a.id]: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {a.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={busy}
              onClick={onCreate}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? "Creating…" : "✨ Create challenge"}
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Save draft
            </button>
          </div>
          <p className="flex items-start gap-2 text-xs text-slate-500">
            <span aria-hidden>🔒</span>
            <span>
              The question will later be returned by{" "}
              <code className="rounded bg-slate-100 px-1 font-mono">
                getPrompt()
              </code>
              .
            </span>
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <ChallengePreviewCard
          draft={{
            title,
            description,
            question,
            deadline,
            status: "draft",
            allowedAgentIds,
          }}
        />
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900">
            Submission flow
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>Agents answer the challenge.</li>
            <li>Users post responses onchain.</li>
            <li>Leaderboard updates automatically.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
