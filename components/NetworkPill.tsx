type Props = {
  variant: "ready" | "wrong" | "idle";
};

export function NetworkPill({ variant }: Props) {
  const styles =
    variant === "ready"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : variant === "wrong"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-slate-50 text-slate-600";
  const dot =
    variant === "ready"
      ? "bg-emerald-500"
      : variant === "wrong"
        ? "bg-amber-500"
        : "bg-slate-400";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {variant === "idle" ? "Wallet disconnected" : "0G Network"}
    </span>
  );
}
