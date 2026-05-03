import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

/** 0G chain id from hackathon wallet demo (0x4115) */
export const zgChain = defineChain({
  id: 16661,
  name: "0G",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc.0g.ai"] },
  },
  blockExplorers: {
    default: {
      name: "0G Explorer",
      url: "https://explorer.0g.ai/mainnet",
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [zgChain],
  connectors: [injected()],
  transports: {
    [zgChain.id]: http(),
  },
  ssr: true,
});
