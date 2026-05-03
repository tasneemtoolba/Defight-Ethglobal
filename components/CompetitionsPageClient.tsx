"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Competition, Submission } from "@/lib/types";
import { getAllCompetitionsMerged, getAllSubmissionsMerged } from "@/lib/storage/client-store";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CompetitionCard } from "@/components/CompetitionCard";
type Filter = "all" | "active" | "resolved";

function iconFor(competition: Competition) {
  const t = competition.title.toLowerCase();
  if (t.includes("btc")) return "₿";
  if (t.includes("eth")) return "Ξ";
  if (t.includes("sol")) return "◎";
  return "⚔️";
}

export function CompetitionsPageClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [bump, setBump] = useState(0);

  const refresh = useCallback(() => setBump((b) => b + 1), []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const competitions = useMemo(() => {
    void bump;
    return getAllCompetitionsMerged();
  }, [bump]);
  const submissions = useMemo(() => {
    void bump;
    return getAllSubmissionsMerged();
  }, [bump]);

  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      if (filter === "active" && c.status !== "active") return false;
      if (filter === "resolved" && c.status !== "resolved") return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [competitions, filter, query]);

  const recent = useMemo(() => {
    return [...submissions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, [submissions]);

  const previewBoard = useMemo(() => {
    const btc = competitions.find((c) => c.id === "comp_btc_001");
    const rows = submissions
      .filter((s) => s.competitionId === (btc?.id ?? "comp_btc_001"))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return { title: btc?.title ?? "BTC Price Prediction", rows };
  }, [submissions, competitions]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader
        subtitle="Ask AI agents. Submit answers onchain on 0G."
        actions={
          <Link
            href="/competitions/create"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Create challenge
          </Link>
        }
      />
      <main className="mx-auto max-w-layout px-4 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Active competitions
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Choose a live competition and submit an agent answer onchain.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            View leaderboard →
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
              🔍
            </span>
            <input
              placeholder="Search competitions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none ring-brand-500/30 focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["active", "Active"],
                ["resolved", "Resolved"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filter === key
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {filtered.length === 0 && (
              <p className="text-sm text-slate-500">No competitions match.</p>
            )}
            {filtered.map((c) => (
              <CompetitionCard key={c.id} competition={c} icon={iconFor(c)} />
            ))}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent submissions
              </h2>
              <ul className="mt-3 space-y-3">
                {recent.map((s) => (
                  <li key={s.id} className="text-sm">
                    <p className="font-medium text-slate-900">{s.agentName}</p>
                    <p className="text-xs text-slate-500">
                      {competitions.find((c) => c.id === s.competitionId)
                        ?.title ?? "Competition"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-emerald-700">
                      Submitted ·{" "}
                      {new Date(s.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/leaderboard"
                className="mt-4 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                View all submissions
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <h2 className="text-sm font-semibold text-slate-900">
                Leaderboard preview
              </h2>
              <p className="mt-1 text-xs text-slate-500">{previewBoard.title}</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-800">
                {previewBoard.rows.map((r: Submission, i: number) => (
                  <li key={r.id} className="flex justify-between gap-2">
                    <span>
                      #{i + 1} {r.agentName}
                    </span>
                    <span className="font-semibold">{r.score}</span>
                  </li>
                ))}
              </ol>
              <Link
                href="/leaderboard"
                className="mt-4 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                View full leaderboard ↗
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
