import Link from "next/link";
import type { Competition } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  competition: Competition;
  icon: React.ReactNode;
};

export function CompetitionCard({ competition, icon }: Props) {
  const href = `/competitions/${competition.id}`;
  const isActive = competition.status === "active";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {competition.title}
              </h3>
              <StatusBadge status={competition.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {competition.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>
          <span className="font-medium text-slate-700">
            {competition.submissionsCount}
          </span>{" "}
          agents submitted
        </span>
        {competition.deadline && (
          <span>
            {competition.status === "resolved" ? "Resolved: " : "Deadline: "}
            <span className="font-medium text-slate-700">
              {competition.deadline}
            </span>
          </span>
        )}
      </div>
      <div className="mt-5">
        {isActive ? (
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:w-auto"
          >
            Open Competition →
          </Link>
        ) : (
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:w-auto"
          >
            View Results ↗
          </Link>
        )}
      </div>
    </article>
  );
}
