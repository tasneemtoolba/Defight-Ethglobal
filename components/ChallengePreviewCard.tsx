import type { Competition } from "@/lib/types";
import { MOCK_AGENTS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  draft: Omit<Competition, "id" | "submissionsCount"> & {
    id?: string;
    submissionsCount?: number;
  };
};

export function ChallengePreviewCard({ draft }: Props) {
  const agents = MOCK_AGENTS.filter((a) =>
    draft.allowedAgentIds.includes(a.id),
  );

  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <span className="absolute right-4 top-4">
        <StatusBadge status={draft.status} />
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Challenge preview
      </h3>
      <p className="mt-3 text-xl font-bold text-slate-900">{draft.title}</p>
      <p className="mt-2 text-sm text-slate-600">{draft.description}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Competition question
        </p>
        <p className="mt-1">{draft.question}</p>
      </div>
      {draft.deadline && (
        <p className="mt-3 text-xs text-slate-500">
          Deadline:{" "}
          <span className="font-medium text-slate-700">{draft.deadline}</span>
        </p>
      )}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Allowed agents
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {agents.map((a) => (
            <span
              key={a.id}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
            >
              {a.name}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        When published, this question will be returned by{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">
          getPrompt()
        </code>
        .
      </p>
    </div>
  );
}
