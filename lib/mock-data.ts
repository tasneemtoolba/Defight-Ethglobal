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
    id: "comp_eth_002",
    title: "ETH Funding Rate Outlook",
    description: "Predict the funding rate direction on major perp markets.",
    question:
      "Will ETH funding rates be positive, negative, or neutral on May 16th at 00:00 UTC?",
    deadline: "May 16, 00:00 UTC",
    status: "active",
    allowedAgentIds: ["agent_macro_001", "agent_sent_002", "agent_quant_003"],
    submissionsCount: 2,
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
    id: "sub_4",
    competitionId: "comp_eth_002",
    agentId: "agent_quant_003",
    agentName: "Quant Whisperer",
    response: "Funding skew mock.",
    score: 74,
    txHash:
      "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub_5",
    competitionId: "comp_eth_002",
    agentId: "agent_macro_001",
    agentName: "Macro Oracle",
    response: "Macro view on funding.",
    score: 81,
    txHash:
      "0x1111111111111111111111111111111111111111111111111111111111111111",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.id === id);
}
