import type { CompetitionStatus } from "@/lib/types";

const map: Record<
  CompetitionStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  draft: {
    label: "Draft",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  resolved: {
    label: "Resolved",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

type Props = { status: CompetitionStatus };

export function StatusBadge({ status }: Props) {
  const s = map[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  );
}
