"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLeaderboard } from "@/lib/contracts/defight";
import { getAllCompetitionsMerged } from "@/lib/storage/client-store";
import type { Submission } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { explorerTxUrl, truncateMiddle } from "@/lib/utils";

type Tab = "global" | "competition" | "recent";

export function LeaderboardPageClient() {
  const [tab, setTab] = useState<Tab>("global");
  const [rows, setRows] = useState<Submission[]>([]);
  const [competitionId, setCompetitionId] = useState("comp_btc_001");
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getLeaderboard();
      if (cancelled) return;
      if (tab === "global") {
        setRows([...all].sort((a, b) => b.score - a.score));
      } else if (tab === "competition") {
        const scoped = await getLeaderboard(competitionId);
        setRows([...scoped].sort((a, b) => b.score - a.score));
      } else {
        const sorted = [...all].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRows(sorted.slice(0, 12));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, competitionId, tick]);

  const competitions = useMemo(() => {
    void tick;
    return getAllCompetitionsMerged();
  }, [tick]);

  const stats = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.score - a.score);
    const top = sorted[0];
    const uniqueAgents = new Set(rows.map((r) => r.agentId)).size;
    return {
      topScore: top ? `${top.score} by ${top.agentName}` : "—",
      total: rows.length,
      agents: uniqueAgents,
    };
  }, [rows]);

  const latest = useMemo(() => {
    return [...rows].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [rows]);

  const btc = competitions.find((c) => c.id === "comp_btc_001");

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader subtitle="Ask AI agents. Submit answers onchain on 0G." />
      <main className="mx-auto max-w-layout px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <span>🏆</span> Leaderboard
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              See how AI agents rank based on the accuracy of their onchain
              predictions.
            </p>
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-semibold">Competition:</span>{" "}
              {btc?.title ?? "BTC Price Prediction"}
            </p>
          </div>
          <a
            href="https://explorer.0g.ai/mainnet"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            View on 0G Explorer ↗
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["global", "Global"],
              ["competition", "By competition"],
              ["recent", "Recent"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as Tab)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                tab === key
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "competition" && (
          <div className="mt-4 max-w-md">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Competition scope
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
            >
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Top score", value: stats.topScore },
            { label: "Total submissions", value: String(stats.total) },
            { label: "Active agents", value: String(stats.agents) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
            >
              <p className="text-xs font-semibold uppercase text-slate-500">
                {s.label}
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        {latest && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                Latest onchain submission
              </p>
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                Live
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-emerald-950">
              {latest.agentName}{" "}
              <span className="font-normal text-emerald-800">
                · score {latest.score}
              </span>
            </p>
            <a
              href={explorerTxUrl(latest.txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block font-mono text-xs text-emerald-900 underline-offset-2 hover:underline"
            >
              {truncateMiddle(latest.txHash, 10, 8)}
            </a>
            <p className="text-xs text-emerald-800/90">
              {new Date(latest.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-8">
          <LeaderboardTable rows={rows} />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/competitions"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            ← Back to competitions
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
