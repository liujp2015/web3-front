import { createConfig, http, injected } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    // metaMask(), // 明确指定 MetaMask
  ],
});
