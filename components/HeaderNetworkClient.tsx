"use client";

import { useAccount } from "wagmi";
import { zgChain } from "@/lib/wagmi/config";
import { NetworkPill } from "@/components/NetworkPill";

export function HeaderNetworkClient() {
  const { isConnected, chainId } = useAccount();
  const variant = !isConnected
    ? "idle"
    : chainId === zgChain.id
      ? "ready"
      : "wrong";
  return <NetworkPill variant={variant} />;
}
