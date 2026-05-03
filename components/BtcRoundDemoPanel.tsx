"use client";

import { useState } from "react";
import type { Address } from "viem";
import {
  demoProvideActualPrice,
  demoScoreRound,
  getBtcBenchmarkAddress,
  getBtcCompetitionId,
  getBtcRoundId,
} from "@/lib/contracts/btc-benchmark-client";
import { explorerTxUrl, truncateMiddle } from "@/lib/utils";

type Props = {
  competitionId: string;
  onChainUpdated: () => void;
};

export function BtcRoundDemoPanel({
  competitionId,
  onChainUpdated,
}: Props) {
  const btcComp = getBtcCompetitionId();
  const contractAddr = getBtcBenchmarkAddress();
  const roundId = getBtcRoundId();

  const [actualInput, setActualInput] = useState("");
  const [busy, setBusy] = useState<"price" | "score" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);

  if (!contractAddr) return null;
  if (competitionId !== btcComp) return null;

  const address: Address = contractAddr;

  async function onProvideActual() {
    setMsg(null);
    setLastTx(null);
    const digits = actualInput.replace(/[$,\s]/g, "").match(/\d+/);
    if (!digits) {
      setMsg("Enter the resolved BTC price as digits (e.g. 94250).");
      return;
    }
    const v = BigInt(digits[0]!);
    if (v === 0n) {
      setMsg("Actual price cannot be zero.");
      return;
    }
    setBusy("price");
    try {
      const hash = await demoProvideActualPrice(address, roundId, v);
      setLastTx(hash);
      setMsg("Actual price stored onchain.");
      onChainUpdated();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Transaction failed.");
    } finally {
      setBusy(null);
    }
  }

  async function onScore() {
    setMsg(null);
    setLastTx(null);
    setBusy("score");
    try {
      const hash = await demoScoreRound(address, roundId);
      setLastTx(hash);
      setMsg("Round scored, leaderboard updated onchain.");
      onChainUpdated();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Transaction failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-card">
      <h2 className="text-base font-semibold text-slate-900">
        Demo: resolve BTC round on 0G
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        The contract records predictions first; an oracle step sets the real
        price, then <code className="rounded bg-white px-1 text-xs">scoreInputs</code>{" "}
        builds the onchain leaderboard (absolute USD error: lower is better).
        Use the same connected wallet for this hackathon demo.
      </p>
      <p className="mt-2 font-mono text-xs text-slate-500">
        Contract {truncateMiddle(address, 6, 4)} · round{" "}
        {roundId.toString()}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-600">
            Actual BTC price (USD, integer)
          </label>
          <input
            value={actualInput}
            onChange={(e) => setActualInput(e.target.value)}
            placeholder="e.g. 94250"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
          />
        </div>
        <button
          type="button"
          disabled={busy !== null}
          onClick={onProvideActual}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {busy === "price" ? "Sending…" : "1. Provide actual price"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={onScore}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
        >
          {busy === "score" ? "Scoring…" : "2. Score round"}
        </button>
      </div>
      {msg && (
        <p className="mt-3 text-sm text-slate-700" role="status">
          {msg}
        </p>
      )}
      {lastTx && (
        <a
          href={explorerTxUrl(lastTx)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
        >
          Last tx on explorer ↗
        </a>
      )}
    </section>
  );
}
