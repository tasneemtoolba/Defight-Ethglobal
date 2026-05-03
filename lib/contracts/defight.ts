import type {
  Competition,
  CreateChallengeInput,
  SubmitAnswerParams,
  SubmitAnswerResult,
  Submission,
} from "@/lib/types";
import type { DefightAdapter } from "@/lib/contracts/adapter-types";
import { createHybridAdapter } from "@/lib/contracts/btc-benchmark-client";
import { getAgentById, SEED_COMPETITIONS } from "@/lib/mock-data";
import {
  appendSubmission,
  getAllCompetitionsMerged,
  getAllSubmissionsMerged,
  upsertStoredCompetition,
} from "@/lib/storage/client-store";

/** 0G mainnet explorer base — replace if your deployment uses another path */
export const EXPLORER_TX_BASE =
  "https://explorer.0g.ai/mainnet/tx/";

export type { DefightAdapter } from "@/lib/contracts/adapter-types";

function randomTxHash(): string {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function findCompetition(id: string): Competition | undefined {
  return getAllCompetitionsMerged().find((c) => c.id === id);
}

function scoreFromAgent(agentId: string, response: string): number {
  const base: Record<string, number> = {
    agent_macro_001: 82,
    agent_sent_002: 91,
    agent_quant_003: 76,
  };
  const noise = (response.length % 13) + Math.floor(Math.random() * 8);
  const cap = Math.min(95, (base[agentId] ?? 78) + noise - 6);
  return Math.max(70, cap);
}

const mockAdapter: DefightAdapter = {
  async getPrompt(competitionId) {
    await delay(200);
    const c = findCompetition(competitionId);
    if (!c) throw new Error("Competition not found");
    return c.question;
  },

  async submitAnswer({ competitionId, agentId, query, response }) {
    await delay(900);
    const c = findCompetition(competitionId);
    if (!c) throw new Error("Competition not found");
    if (!c.allowedAgentIds.includes(agentId)) {
      throw new Error("Agent not allowed for this competition");
    }
    const agent = getAgentById(agentId);
    const score = scoreFromAgent(agentId, response);
    const txHash = randomTxHash();
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      competitionId,
      agentId,
      agentName: agent?.name ?? agentId,
      response,
      score,
      txHash,
      createdAt: new Date().toISOString(),
    };
    appendSubmission(sub);
    const nextCount = getAllSubmissionsMerged().filter(
      (s) => s.competitionId === competitionId,
    ).length;
    upsertStoredCompetition({ ...c, submissionsCount: nextCount });
    return { score, txHash, predictionUsd: undefined, errorUsd: undefined };
  },

  async getLeaderboard(competitionId) {
    await delay(150);
    let rows = getAllSubmissionsMerged();
    if (competitionId) {
      rows = rows.filter((s) => s.competitionId === competitionId);
    }
    return [...rows].sort((a, b) => b.score - a.score);
  },

  async createChallenge(input) {
    await delay(400);
    const id = `comp_${Date.now().toString(36)}`;
    const c: Competition = {
      id,
      title: input.title,
      description: input.description,
      question: input.question,
      deadline: input.deadline,
      status: "active",
      allowedAgentIds: input.allowedAgentIds,
      submissionsCount: 0,
    };
    upsertStoredCompetition(c);
    return c;
  },
};

let adapter: DefightAdapter = createHybridAdapter(mockAdapter);

export function setDefightAdapter(next: DefightAdapter) {
  adapter = next;
}

export function getDefightAdapter(): DefightAdapter {
  return adapter;
}

/** Official competition question — swap body for `readContract` later */
export async function getPrompt(competitionId: string): Promise<string> {
  return getDefightAdapter().getPrompt(competitionId);
}

/**
 * Posts answer onchain (mock) or via viem later.
 * Adapter can map to `submitAnswer(competitionId, agentId, response)` or include query onchain.
 */
export async function submitAnswer(
  params: SubmitAnswerParams,
): Promise<SubmitAnswerResult> {
  return getDefightAdapter().submitAnswer(params);
}

export async function getLeaderboard(
  competitionId?: string,
): Promise<Submission[]> {
  return getDefightAdapter().getLeaderboard(competitionId);
}

export async function createChallenge(
  input: CreateChallengeInput,
): Promise<Competition> {
  return getDefightAdapter().createChallenge(input);
}

export function getCompetitionById(id: string): Competition | undefined {
  return getAllCompetitionsMerged().find((c) => c.id === id);
}

export function listCompetitions(): Competition[] {
  return getAllCompetitionsMerged();
}

/** Merge user-stored draft/active over seed by id */
export function getMergedCompetition(id: string): Competition | undefined {
  return getAllCompetitionsMerged().find((c) => c.id === id);
}

export { SEED_COMPETITIONS };
