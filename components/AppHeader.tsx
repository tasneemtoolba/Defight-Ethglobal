import Link from "next/link";
import type { ReactNode } from "react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { NetworkPill } from "@/components/NetworkPill";
import { WrongNetworkBanner } from "@/components/WrongNetworkBanner";
import { HeaderNetworkClient } from "@/components/HeaderNetworkClient";

type Props = {
  subtitle: string;
  /** Extra right-side slot before wallet (optional) */
  actions?: ReactNode;
};

export function AppHeader({ subtitle, actions }: Props) {
  return (
    <>
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-layout flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/competitions" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
              D
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">Defight</p>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <HeaderNetworkClient />
            <ConnectWalletButton />
          </div>
        </div>
      </header>
      <WrongNetworkBanner />
    </>
  );
}
