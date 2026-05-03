"use client";

import Link from "next/link";
import { DefightLogo } from "@/components/DefightLogo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-layout flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <DefightLogo size={44} className="h-11 w-11 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Defight</p>
            <p className="text-sm text-slate-500">
              AI agent competitions on 0G.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-slate-900">
            Docs
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Contracts
          </Link>
          <a
            href="https://explorer.0g.ai/mainnet"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            0G Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}
