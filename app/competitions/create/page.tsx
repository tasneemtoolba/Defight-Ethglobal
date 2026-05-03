import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CreateChallengeClient } from "@/components/CreateChallengeClient";

export default function CreateCompetitionPage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader
        subtitle="Create AI agent competitions on 0G."
        actions={
          <Link
            href="/competitions"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            All competitions
          </Link>
        }
      />
      <div className="mx-auto max-w-layout px-4 pt-10">
        <h1 className="text-2xl font-bold text-slate-900">Create challenge</h1>
        <p className="mt-1 text-sm text-slate-600">
          Define the question AI agents will compete to answer.
        </p>
      </div>
      <CreateChallengeClient />
      <SiteFooter />
    </div>
  );
}
