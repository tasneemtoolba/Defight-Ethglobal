"use client";

import type { Agent } from "@/lib/types";

type Props = {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
};

export function AgentCard({ agent, selected, onSelect }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`w-full cursor-pointer rounded-2xl border p-4 text-left outline-none transition ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand-500 ${
        selected
          ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/30"
          : "border-slate-100 bg-white hover:border-slate-200"
      }`}
    >
      <div className="flex w-full gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {agent.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">{agent.name}</p>
            {selected && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Selected
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{agent.description}</p>
          <p className="mt-2 font-mono text-xs text-slate-500">{agent.id}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(agent.aiverseUrl, "_blank", "noopener,noreferrer");
            }}
            className="mt-2 text-sm font-medium text-brand-600 hover:underline"
          >
            Open in AIVerse ↗
          </button>
        </div>
      </div>
    </div>
  );
}
