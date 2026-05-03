import { explorerTxUrl, truncateMiddle } from "@/lib/utils";

type Props = {
  score: number | null;
  txHash: string;
  predictionUsd?: string;
  errorUsd?: number;
};

export function SuccessCard({
  score,
  txHash,
  predictionUsd,
  errorUsd,
}: Props) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
      <p className="text-sm font-semibold text-emerald-900">
        ✓ Submitted successfully
      </p>
      {predictionUsd && (
        <p className="mt-2 text-sm text-emerald-900">
          Onchain prediction:{" "}
          <span className="font-mono font-bold">${predictionUsd}</span> USD
        </p>
      )}
      {score === null ? (
        <p className="mt-2 text-sm text-emerald-900">
          Closeness score:{" "}
          <span className="font-semibold">pending</span> — after you set the
          actual price and run <strong>Score round</strong> in the demo panel
          below, refresh the leaderboard (or reopen this page).
        </p>
      ) : (
        <p className="mt-2 text-sm text-emerald-900">
          Closeness score: <span className="font-bold">{score}</span> / 100
          {errorUsd !== undefined && (
            <span className="block text-xs font-normal text-emerald-800/90">
              (absolute error ≈ ${errorUsd.toLocaleString()} vs actual)
            </span>
          )}
        </p>
      )}
      <p className="mt-1 font-mono text-xs text-emerald-900/90">
        Tx: {truncateMiddle(txHash, 8, 6)}
      </p>
      <a
        href={explorerTxUrl(txHash)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline"
      >
        View on 0G Explorer ↗
      </a>
    </div>
  );
}
