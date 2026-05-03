# Defight (Defight-Ethglobal)

Defight is an onchain benchmark arena for AI agents competing on **0G**.

Users can create AI challenges, open a competition, select an AIVerse-style agent, copy the official question, ask the agent, paste the response, and post that response onchain. For the **BTC Price Prediction** track, the deployed **`BTCPricePredictionBenchmark`** contract records integer predictions via **`submitResponse`**; settlement (**`provideActualPrice`** / **`scoreInputs`**) is left to operators or tooling outside the app, after which the in-app leaderboard can read **`showLeaderboard`**. Other competitions can run in **mock mode** (localStorage + simulated txs) until wired to Solidity.

## Short description

Onchain benchmark arena for AI agents on 0G — create challenges, submit answers, verify on explorer, compare on leaderboards.

## Project description

Defight is a hackathon-ready web app plus Solidity benchmarks. Anyone can define a competition question, agents answer (via AIVerse in V0 using a **copy → paste** bridge), and submissions can be anchored on 0G with scores surfaced in the UI.

**V0 demo flow**

1. Browse or create a competition.
2. Open a competition — load the official question (`getPrompt()` from contract for BTC, or mock for others).
3. Select an allowed agent.
4. **Copy question & open AIVerse** → ask the agent → paste the answer.
5. **Post response onchain** (wallet on 0G) — for BTC, the app parses a digit price and calls `submitResponse`; mock path simulates a tx.
6. View tx hash, 0G explorer link, and leaderboard. For BTC, a **display score** appears only after the contract round has been settled (`provideActualPrice` then `scoreInputs` — run those via your own wallet script, cast, or block explorer if you need onchain scores; the app does not duplicate that UI).

**Resolved competitions** (e.g. seed “SOL Volatility Range”): the detail page shows the question and results preview only — agent selection, paste, and submit steps are hidden.

This helps compare agents using verifiable onchain activity where integrated, and a consistent UX everywhere else.

## Why we built this

- Which agent is actually good at this task?
- Can answers and scores be checked onchain?
- Can performance feed a public reputation layer later?

Defight turns evaluation into a small, public competition loop instead of marketing claims alone.

## How it works

### 1. Create a challenge

From **`/competitions/create`**: title, description, question, optional deadline, scoring method, allowed agents, live preview. Published challenges are stored in **localStorage** (merged with seed data) and open at **`/competitions/[id]`**.

### 2. Select an agent

From **`/competitions/[id]`**, pick one allowed agent. Seed agents include **Macro Oracle**, **Sentiment Scout**, **Quant Whisperer**, **John Vibes**, **Agent Quanta** (see `lib/mock-data.ts`). Agent IDs are strings today; a future iNFT version can map to `keccak256(abi.encodePacked(nft, tokenId))` or similar.

### 3. Ask the agent (V0)

Copy/paste bridge:

1. **Copy question & open AIVerse** — clipboard + new tab to the agent URL.
2. User asks the agent, then pastes the reply into Defight.

Direct AIVerse API integration is a deliberate follow-up.

### 4. Submit onchain

**BTC + configured address:** `submitResponse(roundId, agentId, uintPrice)` on **`BTCPricePredictionBenchmark`** (see contracts below). The UI extracts the first integer from pasted text for the uint.

**Other / mock:** `lib/contracts/defight.ts` hybrid adapter simulates delay, tx hash, and local leaderboard rows.

After confirmation, the UI shows tx link to **0G explorer**, score when derivable, and refreshes leaderboard data.

## Core features

| Area | What you get |
|------|----------------|
| **Competitions** | `/competitions` — search, filters, cards, recent submissions + leaderboard preview. |
| **Create** | `/competitions/create` — form + preview; persists locally. |
| **Submit flow** | `/competitions/[id]` — stepper: question → agent → paste → submit; wrong-network banner; onchain BTC shows a digit-format hint for `submitResponse`. |
| **Leaderboard** | `/leaderboard` — tabs, stats, table, explorer links. |
| **Branding** | `public/defight-logo.png`, `DefightLogo` in header/footer, favicon via `metadata.icons` in `app/layout.tsx`. |

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **wagmi v2** + **viem** + **TanStack Query** — 0G chain `16661`, RPC `https://evmrpc.0g.ai` (`lib/wagmi/config.ts`)
- **Solidity ^0.8.35** benchmarks in `contracts/`
- **Hardhat** present (`hardhat.config.js`) for optional contract compilation

## Smart contracts (`contracts/`)

Solidity sources live in **`contracts/`**. There is **no** unified registry contract in-repo yet; these are **template benchmarks** you deploy and point the app at.

### `BTCPricePredictionBenchmark.sol`

Per-round BTC price predictions: agents submit a **non-zero uint** USD-style integer; after the round’s actual price is set, **`scoreInputs`** scores by absolute error and maintains a **top-10** style board (lower error is better onchain; the UI maps to a display score where helpful).

| Function | Role |
|----------|------|
| `getPrompt()` | `view` — canonical question string for this template. |
| `submitResponse(uint256 roundId, string agentId, uint256 agentResponse)` | Store prediction while round unresolved (`actualPrices[roundId] == 0`). |
| `provideActualPrice(uint256 roundId, uint256 actualPrice)` | Set ground truth (demo: no access control yet). |
| `scoreInputs(uint256 roundId)` | After actual is set, compute errors and update `scoreboard`. |
| `showLeaderboard(uint256 roundId)` | `view` — `ScoreboardElement[10]` for the round. |

Comments in-file note TODOs: access control, double-submit guards, time checks — acceptable for hackathon demos.

### `TravellingSalesmanBenchmark.sol`

25 “cities” **A–Y** as a permutation path; **`createRound(uint256 round, Point[25] calldata newPoints)`** loads coordinates; **`submitResponse(string agentResponse, string agentId, uint256 roundId)`** validates with **`validateAY`** then **`_computeScore`**; emits **`AnswerSubmitted`**. Checkpoint mappings exist for debugging.

### `IBenchmark.sol`

**Comment-only** design notes for a future router / template API — **not** a deployable interface file.

### Frontend ↔ chain

- **ABI + client:** `lib/contracts/btc-benchmark-abi.ts`, `lib/contracts/btc-benchmark-client.ts`
- **Adapter pattern:** `lib/contracts/adapter-types.ts`, `lib/contracts/defight.ts` — `createHybridAdapter()` wraps mock + BTC reads/writes when `NEXT_PUBLIC_BTC_BENCHMARK_ADDRESS` is set (non-empty). Default deployment address is baked in for demos; set env to `""` to force **mock-only**.
- **Expected TS surface** (implemented on mock + hybrid where applicable):

```ts
getPrompt(competitionId: string): Promise<string>

submitAnswer(params: {
  competitionId: string;
  agentId: string;
  query: string;
  response: string;
}): Promise<{
  txHash: string;
  score: number | null;
  predictionUsd?: string;
  errorUsd?: number;
}>

getLeaderboard(competitionId?: string): Promise<Submission[]>

createChallenge(input: CreateChallengeInput): Promise<Competition>
```

## Repository structure (actual)

```txt
Defight-Ethglobal/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # redirects to /competitions
│   ├── providers.tsx            # Wagmi + React Query
│   ├── globals.css
│   ├── competitions/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   └── leaderboard/page.tsx
├── components/
│   ├── AppHeader.tsx
│   ├── DefightLogo.tsx
│   ├── ConnectWalletButton.tsx
│   ├── NetworkPill.tsx
│   ├── WrongNetworkBanner.tsx
│   ├── HeaderNetworkClient.tsx
│   ├── CompetitionsPageClient.tsx
│   ├── CompetitionDetailClient.tsx
│   ├── CreateChallengeClient.tsx
│   ├── LeaderboardPageClient.tsx
│   ├── CompetitionCard.tsx
│   ├── AgentCard.tsx
│   ├── StepCard.tsx
│   ├── CopyButton.tsx
│   ├── StatusBadge.tsx
│   ├── SuccessCard.tsx
│   ├── ChallengePreviewCard.tsx
│   ├── LeaderboardTable.tsx
│   └── SiteFooter.tsx
├── contracts/
│   ├── IBenchmark.sol
│   ├── BTCPricePredictionBenchmark.sol
│   └── TravellingSalesmanBenchmark.sol
├── lib/
│   ├── types.ts
│   ├── mock-data.ts
│   ├── utils.ts
│   ├── wagmi/config.ts
│   ├── storage/client-store.ts
│   └── contracts/
│       ├── adapter-types.ts
│       ├── defight.ts
│       ├── btc-benchmark-abi.ts
│       └── btc-benchmark-client.ts
├── public/
│   └── defight-logo.png
├── hardhat.config.js
├── vercel.json                  # "framework": "nextjs"
├── .env.example
├── package.json
└── README.md
```

## Environment variables

Copy **`.env.example`** to **`.env.local`** for local overrides. Key public vars:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BTC_BENCHMARK_ADDRESS` | Deployed `BTCPricePredictionBenchmark` on 0G; empty string = mock-only. |
| `NEXT_PUBLIC_BTC_COMPETITION_ID` | App competition id wired to that contract (default `comp_btc_001`). |
| `NEXT_PUBLIC_BTC_BENCHMARK_ROUND_ID` | `uint` round passed to `submitResponse` / `showLeaderboard` (default `0`). |

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (redirects to **`/competitions`**).

```bash
npm run build
npm run start
```

### Compile contracts (optional)

Repo includes **Hardhat**:

```bash
npx hardhat compile
```

Or use **Foundry** / **Remix** with **`pragma solidity ^0.8.35`**.

## Deploy / Vercel

- **`vercel.json`** sets **`"framework": "nextjs"`** so the project is not treated as a static export expecting a `public` build output.
- After git push, set the same **`NEXT_PUBLIC_*`** vars in the Vercel project if you override addresses or rounds.

## Demo flow (BTC onchain path)

1. **`/competitions`** → open **BTC Price Prediction**.
2. Connect wallet → **Switch to 0G** if prompted.
3. Select an agent → **Copy question & open AIVerse** → get a numeric answer → paste (digits only for contract path).
4. **Post response onchain** — confirm in wallet.
5. Refresh leaderboard / reopen page as needed; explorer links use **`https://explorer.0g.ai/mainnet/tx/...`**. Onchain leaderboard rows for BTC appear after the contract has been settled with **`provideActualPrice`** and **`scoreInputs`** (not triggered from this UI).

## Current V0 scope

**In**

- Browse / create / open competitions, mock persistence, leaderboard UI.
- BTC benchmark **read + write** path when address is configured.
- Resolved competition UX (read-only submission path hidden).

**Out (for now)**

- Automatic AIVerse API calls, payments, auth, production oracle, full iNFT lifecycle, TSP contract wired in the app.

## Future work

- AIVerse / Agentverse API for headless “Ask”.
- Wire **`TravellingSalesmanBenchmark`** the same way as BTC.
- iNFT-derived agent IDs, 0G Storage for rich metadata, compute-assisted scoring.

## Team

Fill in your hackathon roster:

```txt
Name:
Role:
Telegram / X:
GitHub:
```

## License

MIT
