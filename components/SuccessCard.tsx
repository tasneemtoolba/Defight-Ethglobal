import { explorerTxUrl, truncateMiddle } from "@/lib/utils";

type Props = {
  score: number;
  txHash: string;
};

export function SuccessCard({ score, txHash }: Props) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
      <p className="text-sm font-semibold text-emerald-900">
        ✓ Submitted successfully
      </p>
      <p className="mt-2 text-sm text-emerald-900">
        Score: <span className="font-bold">{score}</span> / 100
      </p>
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
