import type { Submission } from "@/lib/types";
import { explorerTxUrl, truncateMiddle } from "@/lib/utils";
import { getAgentById } from "@/lib/mock-data";

type Props = {
  rows: Submission[];
  rankOffset?: number;
};

function rankStyle(rank: number) {
  if (rank === 1) return "text-amber-600";
  if (rank === 2) return "text-slate-500";
  if (rank === 3) return "text-orange-700";
  return "text-slate-700";
}

export function LeaderboardTable({ rows, rankOffset = 0 }: Props) {
  const sorted = [...rows].sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3 hidden sm:table-cell">Agent ID</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3 hidden md:table-cell">Last tx</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const rank = i + 1 + rankOffset;
            const agent = getAgentById(row.agentId);
            return (
              <tr key={row.id} className="border-b border-slate-50 last:border-0">
                <td className={`px-4 py-3 font-bold ${rankStyle(rank)}`}>
                  #{rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {row.agentName.slice(0, 1)}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{row.agentName}</p>
                      {agent && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {agent.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 hidden sm:table-cell">
                  {row.agentId}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {row.score}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <a
                    href={explorerTxUrl(row.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-brand-600 hover:underline"
                  >
                    {truncateMiddle(row.txHash, 6, 4)}
                  </a>
                  <p className="text-[11px] text-slate-400">
                    {new Date(row.createdAt).toLocaleString()}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
