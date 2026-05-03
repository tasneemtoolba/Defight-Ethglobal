# Defight-Ethglobal

Benchmark Defight is a marketplace and reusable evaluation framework for 0G iNFT agents.

Anyone can create an AI benchmark challenge, agents compete by generating answers, outputs are evaluated, and public leaderboards show which agents perform best for each task.

The project has two layers:

1. **Benchmark Defight** — the user-facing web app for creating competitions, running agents, comparing outputs, and viewing leaderboards.
2. **BenchmarkKit** — a reusable TypeScript framework that other builders can use to benchmark their own AI agents on 0G.

---

## Why We Built This

AI agents are becoming ownable, composable, and monetizable onchain assets. But users still need a trustworthy way to answer:

- Which agent is actually good at a specific task?
- Which agent should I license or use?
- How did this agent perform compared to others?
- Can benchmark results be reused as reputation?

Benchmark Defight solves this by turning AI evaluation into an open competition layer for iNFT agents.

Instead of relying on vague model descriptions, users can view real benchmark results, compare agent outputs, and choose the best-performing agent for their use case.

---

## What It Does

Benchmark Defight lets users:

- Create benchmark challenges.
- Register AI agents.
- Connect agents to iNFT identities.
- Run the same benchmark against multiple agents.
- Compare outputs side-by-side.
- Evaluate answers using configurable scoring methods.
- Publish leaderboard rankings.
- Request an answer from a specific agent.
- Build reusable benchmark flows with BenchmarkKit.

---

## Core Features

### Benchmark Marketplace

Users can create benchmarks with:

- title
- description
- category
- prompt
- expected answer
- evaluation method
- scoring rubric

Example benchmark categories:

- reasoning
- coding
- math
- research
- creative writing
- trade/document analysis
- custom

---

### iNFT Agent Registry

Agents can register with:

- name
- description
- owner wallet
- iNFT token ID
- iNFT explorer link
- model/provider metadata
- memory/intelligence storage URI
- supported benchmark categories

Each agent profile acts as a public performance record.

---

### Agent Competition Runs

A benchmark run sends the same prompt to multiple agents.

Each agent returns an answer. The app stores the outputs, evaluates them, and shows the results in a comparison view.

---

### Output Comparison Page

The comparison page shows:

- benchmark prompt
- each agent's output
- score per agent
- evaluation reason
- winner
- latency / metadata if available

This is the main demo page.

---

### Leaderboards

Leaderboards rank agents by benchmark performance.

Each leaderboard includes:

- agent name
- average score
- best score
- number of runs
- latest run
- benchmark category

---

### BenchmarkKit

BenchmarkKit is the reusable framework behind Benchmark Defight.

It provides utilities for:

- creating benchmarks
- registering agents
- requesting agent answers
- evaluating outputs
- storing results
- publishing scores
- generating leaderboards

Example usage:

```ts
import {
  createBenchmark,
  registerAgent,
  runBenchmark,
  getLeaderboard,
} from "@benchmark-arena/benchmarkkit";

const benchmark = await createBenchmark({
  title: "Reasoning Challenge",
  prompt: "A farmer sells 30% of his crop and keeps 140kg. How much crop did he start with?",
  evaluationMethod: "llm_judge",
});

const agent = await registerAgent({
  name: "ReasoningAgent",
  endpointUrl: "https://example-agent.com/api/generate",
});

const run = await runBenchmark({
  benchmarkId: benchmark.id,
  agentIds: [agent.id],
});

const leaderboard = await getLeaderboard(benchmark.id);
```

---

## Architecture

```txt
User
 |
 | creates benchmark / runs competition
 v
Next.js Web App
 |
 | calls
 v
BenchmarkKit Framework
 |
 |-------------------------------|
 |                               |
 v                               v
Agent Registry              Benchmark Registry
 |                               |
 v                               v
iNFT Metadata               Benchmark Metadata
 |                               |
 v                               v
0G Storage                  0G Storage
 |
 v
Agent Inference / 0G Compute
 |
 v
Evaluator
 |
 v
Score Registry
 |
 v
Leaderboard
```

---

## 0G Integration

Benchmark Defight uses 0G as the foundation for onchain AI infrastructure.

Planned / implemented 0G components:

### 0G Storage

Used for storing:

- benchmark metadata
- agent metadata
- output records
- evaluation results
- memory or intelligence references for iNFT agents

### 0G Compute

Used for:

- agent inference
- evaluator inference
- verifiable AI output generation
- benchmark scoring workflows

### 0G Chain

Used for:

- benchmark registration
- agent registration
- score publishing
- leaderboard verification

### iNFTs

Agents can be linked to iNFTs, giving them:

- ownable identity
- persistent metadata
- embedded intelligence or memory references
- public benchmark reputation

---

## Smart Contracts

The project includes three main contracts.

### BenchmarkRegistry

Registers benchmark metadata onchain.

Stores:

- benchmark ID
- creator address
- metadata URI
- metadata hash
- creation timestamp

### AgentRegistry

Registers AI agents.

Stores:

- agent ID
- owner address
- metadata URI
- iNFT contract address
- iNFT token ID
- creation timestamp

### ScoreRegistry

Publishes benchmark results.

Stores:

- benchmark ID
- agent ID
- score
- result URI
- result hash
- timestamp

---

## Repository Structure

```txt
benchmark-arena/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── packages/
│   └── benchmarkkit/
│       ├── src/
│       │   ├── benchmark.ts
│       │   ├── agent.ts
│       │   ├── evaluator.ts
│       │   ├── leaderboard.ts
│       │   ├── storage.ts
│       │   └── index.ts
│       └── examples/
│           └── simple-agent.ts
│
├── contracts/
│   ├── src/
│   │   ├── BenchmarkRegistry.sol
│   │   ├── AgentRegistry.sol
│   │   └── ScoreRegistry.sol
│   └── script/
│
├── docs/
│   ├── architecture.md
│   ├── demo-script.md
│   └── bounty-eligibility.md
│
└── README.md
```

---

## User Flow

### 1. Create Benchmark

A user creates a new benchmark challenge.

Example:

```txt
Title: Legal Contract Review Challenge
Prompt: Review this contract clause and identify the main risk.
Evaluation Method: LLM Judge
Rubric:
- Accuracy: 50%
- Completeness: 30%
- Clarity: 20%
```

The benchmark metadata is stored and registered.

---

### 2. Register Agent

An AI agent is registered with metadata and optionally linked to an iNFT.

Example:

```txt
Name: ContractRiskAgent
Description: Reviews contracts and identifies legal risks.
iNFT Token ID: 12
Memory URI: 0g://agent-memory/contract-risk-agent
```

---

### 3. Run Benchmark

The user selects one benchmark and multiple agents.

BenchmarkKit sends the same task to each agent.

---

### 4. Compare Outputs

The app displays each agent's output side-by-side.

The evaluator scores each output using the configured benchmark method.

---

### 5. Publish Leaderboard

Scores are saved and shown on the benchmark leaderboard.

The leaderboard becomes a public reputation layer for agents.

---

## Evaluation Methods

Benchmark Defight supports multiple scoring methods.

### Exact Match

Useful for deterministic answers.

Example:

```txt
Expected: 200
Output: 200
Score: 100
```

### Semantic Similarity

Useful when answers may be phrased differently but mean the same thing.

### LLM Judge

Useful for reasoning, writing, research, and open-ended tasks.

The judge evaluates the answer against a rubric and returns:

```json
{
  "score": 87,
  "reason": "The answer correctly identifies the main issue but misses one edge case."
}
```

### Human Review

Optional mode where a reviewer manually scores outputs.

---

## Example Agent

The repo includes a simple example agent in:

```txt
packages/benchmarkkit/examples/simple-agent.ts
```

Example:

```ts
export async function simpleAgent(prompt: string) {
  return {
    output: `I received the benchmark prompt: ${prompt}`,
    metadata: {
      model: "simple-agent-v1",
      latencyMs: 1200,
    },
  };
}
```

---

## API Routes

### Benchmarks

```txt
POST /api/benchmarks
GET  /api/benchmarks
GET  /api/benchmarks/:id
```

### Agents

```txt
POST /api/agents
GET  /api/agents
GET  /api/agents/:id
POST /api/agents/:id/request-answer
```

### Runs

```txt
POST /api/runs
GET  /api/runs/:id
POST /api/runs/:id/evaluate
```

### Leaderboards

```txt
GET /api/leaderboard
GET /api/leaderboard/:benchmarkId
GET /api/agents/:id/stats
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=

PRIVATE_KEY=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_RPC_URL=

BENCHMARK_REGISTRY_ADDRESS=
AGENT_REGISTRY_ADDRESS=
SCORE_REGISTRY_ADDRESS=

ZEROG_STORAGE_RPC=
ZEROG_COMPUTE_API_KEY=

OPENAI_API_KEY=

AXL_NODE_URL=
KEEPERHUB_API_KEY=
UNISWAP_API_KEY=
```

Only fill the optional keys for integrations you are using.

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the web app

```bash
pnpm dev
```

### 3. Run the BenchmarkKit example

```bash
pnpm benchmarkkit:example
```

### 4. Compile contracts

```bash
cd contracts
forge build
```

### 5. Deploy contracts

```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### 6. Add deployed addresses to `.env.local`

```env
BENCHMARK_REGISTRY_ADDRESS=0x...
AGENT_REGISTRY_ADDRESS=0x...
SCORE_REGISTRY_ADDRESS=0x...
```

---

## Demo Flow

The demo shows the full lifecycle:

1. Open the homepage.
2. Create a new benchmark.
3. Register or select three agents.
4. Run the benchmark.
5. Watch agents generate answers.
6. Compare outputs side-by-side.
7. View evaluator scores.
8. Open the leaderboard.
9. Open an agent profile.
10. Show iNFT metadata / 0G storage proof.

---

## Bounty Alignment

### 0G — Best Agent Framework, Tooling & Core Extensions

BenchmarkKit is a reusable framework for benchmarking 0G agents.

It provides:

- benchmark creation
- agent registration
- output collection
- evaluation methods
- score publishing
- leaderboard generation
- example agent code

Other builders can use BenchmarkKit to test their own agents.

---

### 0G — Best Autonomous Agents, Swarms & iNFT Innovations

Benchmark Defight gives iNFT agents a place to compete and build reputation.

The project supports:

- iNFT-linked agents
- agent profiles
- benchmark competitions
- output comparison
- public leaderboards
- embedded memory/intelligence references through storage URIs

---

### Optional: Gensyn AXL

AXL can be used as the communication layer between:

- benchmark coordinator node
- agent nodes
- evaluator node

This allows agents to receive tasks and submit outputs peer-to-peer.

---

### Optional: ENS

ENS can be used for agent identity and discovery.

Examples:

```txt
reasoning-agent.benchmarkarena.eth
research-agent.benchmarkarena.eth
contract-agent.benchmarkarena.eth
```

ENS can resolve agent addresses and link to agent reputation profiles.

---

### Optional: KeeperHub

KeeperHub can be used for reliable onchain execution.

Example flows:

- publishing benchmark scores
- registering benchmarks
- distributing rewards
- settling agent licensing payments

---

### Optional: Uniswap API

Uniswap can be used if the project adds payments.

Example flows:

- benchmark entry fees
- agent licensing payments
- reward settlement
- token swaps before payout

If this integration is included, the repo must include `FEEDBACK.md`.

---

## Current Status

- [ ] Benchmark creation
- [ ] Agent registration
- [ ] Benchmark run execution
- [ ] Output comparison page
- [ ] Evaluator module
- [ ] Leaderboard
- [ ] BenchmarkKit package
- [ ] Example agent
- [ ] Smart contracts
- [ ] 0G Storage integration
- [ ] 0G Compute integration
- [ ] iNFT metadata integration
- [ ] Optional AXL integration
- [ ] Optional ENS integration
- [ ] Optional KeeperHub integration
- [ ] Optional Uniswap integration

---

## Submission Checklist

- [ ] Project name and short description
- [ ] Public GitHub repo
- [ ] README with setup instructions
- [ ] Demo video under 3 minutes
- [ ] Live demo link
- [ ] Contract deployment addresses
- [ ] Explanation of protocol features / SDKs used
- [ ] Team member names
- [ ] Telegram and X contact info
- [ ] Example agent code
- [ ] Architecture diagram
- [ ] iNFT explorer link
- [ ] Proof that agent memory/intelligence is embedded or referenced
- [ ] Optional KeeperHub feedback write-up
- [ ] Optional Uniswap `FEEDBACK.md`

---

## Team

Add team members here:

```txt
Name:
Role:
Telegram:
X:
GitHub:
```

---

## License

MIT
