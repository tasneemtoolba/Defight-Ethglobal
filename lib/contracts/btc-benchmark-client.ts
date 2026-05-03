import { createPublicClient, http, type Address, type Hash } from "viem";
import { getWalletClient, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/lib/wagmi/config";
import { zgChain } from "@/lib/wagmi/config";
import { btcPricePredictionBenchmarkAbi } from "@/lib/contracts/btc-benchmark-abi";
import type { DefightAdapter } from "@/lib/contracts/adapter-types";
import type { Submission, SubmitAnswerParams, SubmitAnswerResult } from "@/lib/types";
import { getAgentById } from "@/lib/mock-data";

const DEFAULT_BTC_ADDRESS =
  "0xd7259ba74751f09c810de52d921e248af1fb7fae" as const;

export function getBtcBenchmarkAddress(): Address | null {
  const env = process.env.NEXT_PUBLIC_BTC_BENCHMARK_ADDRESS?.trim();
  /** Empty string disables onchain integration (mock only). */
  if (env === "") return null;
  const raw = env && env.length >= 42 ? env : DEFAULT_BTC_ADDRESS;
  if (!raw.startsWith("0x") || raw.length < 42) return null;
  return raw as Address;
}

export function getBtcCompetitionId(): string {
  return process.env.NEXT_PUBLIC_BTC_COMPETITION_ID?.trim() || "comp_btc_001";
}

export function getBtcRoundId(): bigint {
  const raw = process.env.NEXT_PUBLIC_BTC_BENCHMARK_ROUND_ID?.trim() ?? "0";
  try {
    return BigInt(raw);
  } catch {
    return 0n;
  }
}

export function isBtcContractConfigured(): boolean {
  return getBtcBenchmarkAddress() !== null;
}

const transport = http("https://evmrpc.0g.ai");

export const btcPublicClient = createPublicClient({
  chain: zgChain,
  transport,
});

/** First run of digits in pasted text → integer USD (contract rejects 0). */
export function parseBtcPriceFromResponse(text: string): bigint {
  const compact = text.replace(/[$,\s]/g, "");
  const match = compact.match(/\d+/);
  if (!match) {
    throw new Error(
      "Include a USD price as digits (e.g. 94250), matching the onchain prompt.",
    );
  }
  const n = BigInt(match[0]!);
  if (n === 0n) {
    throw new Error("Price cannot be zero — the contract rejects 0.");
  }
  return n;
}

/** Map absolute error (USD) to a 0–100 “closeness” score for the UI. */
export function errorToDisplayScore(errorUsd: bigint): number {
  const e = Number(errorUsd);
  if (!Number.isFinite(e) || e < 0) return 0;
  const capped = Math.min(e, 50_000);
  return Math.max(0, Math.min(100, Math.round(100 - capped / 500)));
}

export async function readBtcGetPrompt(address: Address): Promise<string> {
  return btcPublicClient.readContract({
    address,
    abi: btcPricePredictionBenchmarkAbi,
    functionName: "getPrompt",
  });
}

export async function readBtcLeaderboardRows(
  address: Address,
  roundId: bigint,
  competitionId: string,
): Promise<Submission[]> {
  const top = await btcPublicClient.readContract({
    address,
    abi: btcPricePredictionBenchmarkAbi,
    functionName: "showLeaderboard",
    args: [roundId],
  });

  const rows: Submission[] = [];
  const now = new Date().toISOString();

  top.forEach((el, i) => {
    if (el.score === 0n) return;
    const agentId = el.agentId?.trim() || `rank_${i + 1}`;
    const agent = getAgentById(agentId);
    const displayScore = errorToDisplayScore(el.score);
    rows.push({
      id: `chain_${address}_${roundId}_${i}_${el.score}`,
      competitionId,
      agentId,
      agentName: agent?.name || agentId || `Entry ${i + 1}`,
      response: "",
      score: displayScore,
      txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      createdAt: now,
    });
  });

  return rows.sort((a, b) => b.score - a.score);
}

export async function submitBtcPrediction(params: {
  address: Address;
  roundId: bigint;
  agentId: string;
  responseText: string;
}): Promise<{ txHash: Hash; prediction: bigint }> {
  const prediction = parseBtcPriceFromResponse(params.responseText);
  const walletClient = await getWalletClient(wagmiConfig);
  if (!walletClient) {
    throw new Error("Connect a wallet on 0G to submit.");
  }

  const hash = await walletClient.writeContract({
    address: params.address,
    abi: btcPricePredictionBenchmarkAbi,
    functionName: "submitResponse",
    args: [params.roundId, params.agentId, prediction],
    chain: zgChain,
  });

  await waitForTransactionReceipt(wagmiConfig, { hash, chainId: zgChain.id });
  return { txHash: hash, prediction };
}

export async function readBtcSubmissionError(
  address: Address,
  roundId: bigint,
  agentId: string,
): Promise<{ actual: bigint; submitted: bigint; error: bigint } | null> {
  const actual = await btcPublicClient.readContract({
    address,
    abi: btcPricePredictionBenchmarkAbi,
    functionName: "actualPrices",
    args: [roundId],
  });
  if (actual === 0n) return null;

  const submitted = await btcPublicClient.readContract({
    address,
    abi: btcPricePredictionBenchmarkAbi,
    functionName: "submittedAnswers",
    args: [roundId, agentId],
  });
  if (submitted === 0n) return null;

  const err =
    actual > submitted ? actual - submitted : submitted - actual;
  return { actual, submitted, error: err };
}

export function createHybridAdapter(base: DefightAdapter): DefightAdapter {
  const addr = getBtcBenchmarkAddress();
  const btcComp = getBtcCompetitionId();
  const roundId = getBtcRoundId();

  if (!addr) return base;

  return {
    async getPrompt(competitionId) {
      if (competitionId === btcComp) {
        return readBtcGetPrompt(addr);
      }
      return base.getPrompt(competitionId);
    },

    async submitAnswer(params: SubmitAnswerParams): Promise<SubmitAnswerResult> {
      if (params.competitionId !== btcComp) {
        return base.submitAnswer(params);
      }

      const { txHash, prediction } = await submitBtcPrediction({
        address: addr,
        roundId,
        agentId: params.agentId,
        responseText: params.response,
      });

      const errInfo = await readBtcSubmissionError(
        addr,
        roundId,
        params.agentId,
      );
      const score = errInfo
        ? errorToDisplayScore(errInfo.error)
        : null;

      return {
        txHash,
        score,
        predictionUsd: prediction.toString(),
        errorUsd: errInfo ? Number(errInfo.error) : undefined,
      };
    },

    async getLeaderboard(competitionId?: string) {
      if (competitionId === undefined || competitionId === btcComp) {
        const chainRows = await readBtcLeaderboardRows(addr, roundId, btcComp);
        if (competitionId === btcComp) {
          return chainRows;
        }
        const rest = (await base.getLeaderboard(undefined)).filter(
          (s) => s.competitionId !== btcComp,
        );
        return [...rest, ...chainRows].sort((a, b) => b.score - a.score);
      }
      return base.getLeaderboard(competitionId);
    },

    createChallenge: base.createChallenge.bind(base),
  };
}
