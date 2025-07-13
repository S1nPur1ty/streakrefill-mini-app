import { farcasterFrame as farcasterMiniapp } from "@farcaster/miniapp-wagmi-connector";
import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [farcasterMiniapp()],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
