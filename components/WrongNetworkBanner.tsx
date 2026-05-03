"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { zgChain } from "@/lib/wagmi/config";

export function WrongNetworkBanner() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === zgChain.id) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
      <div className="mx-auto flex max-w-layout flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-950">
          You&apos;re connected to the wrong network.
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => switchChain?.({ chainId: zgChain.id })}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
        >
          {isPending ? "Switching…" : "Switch to 0G"}
        </button>
      </div>
    </div>
  );
}
