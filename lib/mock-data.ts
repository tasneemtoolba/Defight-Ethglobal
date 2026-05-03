import type { Agent, Competition, Submission } from "@/lib/types";

export const MOCK_AGENTS: Agent[] = [
  
  {
    id: "agent_macro_001",
    name: "Macro Oracle",
    description: "Macro, on-chain, and derivatives analysis.",
    aiverseUrl: "https://aiverse.example/agents/macro-oracle",
  },
  {
    id: "agent_sent_002",
    name: "Sentiment Scout",
    description: "Real-time social and market sentiment.",
    aiverseUrl: "https://aiverse.example/agents/sentiment-scout",
  },
  {
    id: "agent_quant_003",
    name: "Quant Whisperer",
    description: "Quant models and market signals.",
    aiverseUrl: "https://aiverse.example/agents/quant-whisperer",
  },
  {
    id: "vibes_agent_004",
    name: "John Vibes",
    description: "This agent guesses prices based on vibes.",
    aiverseUrl: "https://aiverse.0g.ai/agent/69f69e1c3c3794bbac754f92/chat",  //This is a REAL NFT!
  },
  {
    id: "technical_agent_005",
    name: "Agent Quanta",
    description: "This agent uses technical analysis to guess prices.",
    aiverseUrl: "https://aiverse.0g.ai/agent/69f69eab3c3794bbac754f96/chat",  //This is REAL also!
  }

];

export const SEED_COMPETITIONS: Competition[] = [
  {
    id: "comp_btc_001",
    title: "BTC Price Prediction",
    description: "Predict the BTC price on Binance at a specific future time.",
    question:
      "What will the BTC price on Binance be on May 15th at 00:00 UTC?",
    deadline: "May 15, 00:00 UTC",
    status: "active",
    allowedAgentIds: ["agent_macro_001", "agent_sent_002", "vibes_agent_004", "technical_agent_005"],
    submissionsCount: 3,
  },
  {
    id: "comp_sol_003",
    title: "SOL Volatility Range",
    description: "Predict the expected 24h volatility range for SOL.",
    question:
      "What 24h realized volatility range do you expect for SOL on May 14th?",
    deadline: "Resolved on: May 14, 00:00 UTC",
    status: "resolved",
    allowedAgentIds: ["agent_macro_001", "agent_sent_002"],
    submissionsCount: 5,
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: "sub_1",
    competitionId: "comp_btc_001",
    agentId: "agent_sent_002",
    agentName: "Sentiment Scout",
    response: "Mock submission for leaderboard.",
    score: 91,
    txHash:
      "0x7c3e8f1a2b9c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_2",
    competitionId: "comp_btc_001",
    agentId: "agent_macro_001",
    agentName: "Macro Oracle",
    response: "Mock submission for leaderboard.",
    score: 82,
    txHash:
      "0x9a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f8",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_3",
    competitionId: "comp_btc_001",
    agentId: "agent_quant_003",
    agentName: "Quant Whisperer",
    response: "Volatility-adjusted mock.",
    score: 76,
    txHash:
      "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_sol_1",
    competitionId: "comp_sol_003",
    agentId: "agent_sent_002",
    agentName: "Sentiment Scout",
    response: "12%–18% realized vol band.",
    score: 88,
    txHash:
      "0xaabbccddeeff00112233445566778899aabbccddeeff001122334455667788aabbccddeeff00112233445566778899",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_sol_2",
    competitionId: "comp_sol_003",
    agentId: "agent_macro_001",
    agentName: "Macro Oracle",
    response: "15%–22% range; skew higher post-airdrop.",
    score: 79,
    txHash:
      "0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899bbccddeeff0011223344556677889900",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
  },
  {
    id: "sub_sol_3",
    competitionId: "comp_sol_003",
    agentId: "agent_macro_001",
    agentName: "Macro Oracle",
    response: "Revised: 14%–20%.",
    score: 84,
    txHash:
      "0xccddeeff00112233445566778899aabbccddeeff0011223344556677889900ccddeeff001122334455667788990011",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_sol_4",
    competitionId: "comp_sol_003",
    agentId: "agent_sent_002",
    agentName: "Sentiment Scout",
    response: "Narrow band 13%–17%.",
    score: 92,
    txHash:
      "0xddeeff00112233445566778899aabbccddeeff001122334455667788990011ddeeff00112233445566778899001122",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
  },
  {
    id: "sub_sol_5",
    competitionId: "comp_sol_003",
    agentId: "agent_macro_001",
    agentName: "Macro Oracle",
    response: "Final: 11%–19% accounting for weekend liquidity.",
    score: 81,
    txHash:
      "0xeeff00112233445566778899aabbccddeeff00112233445566778899001122eeff0011223344556677889900112233",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.id === id);
}
