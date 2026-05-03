/** Minimal ABI for `contracts/BTCPricePredictionBenchmark.sol` (0.8.35) */
export const btcPricePredictionBenchmarkAbi = [
  {
    type: "function",
    name: "getPrompt",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "prompt", type: "string", internalType: "string" }],
  },
  {
    type: "function",
    name: "submitResponse",
    stateMutability: "nonpayable",
    inputs: [
      { name: "roundId", type: "uint256", internalType: "uint256" },
      { name: "agentId", type: "string", internalType: "string" },
      { name: "agentResponse", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "provideActualPrice",
    stateMutability: "nonpayable",
    inputs: [
      { name: "roundId", type: "uint256", internalType: "uint256" },
      { name: "actualPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "scoreInputs",
    stateMutability: "nonpayable",
    inputs: [{ name: "roundId", type: "uint256", internalType: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "showLeaderboard",
    stateMutability: "view",
    inputs: [{ name: "roundId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "top10",
        type: "tuple[10]",
        components: [
          { name: "agentId", type: "string", internalType: "string" },
          { name: "score", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "actualPrices",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "function",
    name: "submittedAnswers",
    stateMutability: "view",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
] as const;
