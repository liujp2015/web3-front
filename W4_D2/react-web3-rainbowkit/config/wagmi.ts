import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const USE_CUSTOM_RPC = true;

const sepoliaConfig = USE_CUSTOM_RPC
  ? {
      ...sepolia,
      rpcUrls: {
        default: {
          http: [
            "https://sepolia.infura.io/v3/62e401de662b4df0a6a9e770dc897b73",
          ],
        },
        public: {
          http: [
            "https://sepolia.infura.io/v3/62e401de662b4df0a6a9e770dc897b73",
          ],
        },
      },
    }
  : sepolia;

const transports = USE_CUSTOM_RPC
  ? {
      [sepolia.id]: http(
        "https://sepolia.infura.io/v3/62e401de662b4df0a6a9e770dc897b73"
      ),
    }
  : {
      [sepolia.id]: http(),
    };

const connectors = [
  injected(),
  walletConnect({
    projectId: "d452a1819999d5a65dd139fc813c5cda",
    showQrModal: true,
    metadata: {
      name: "Web3test",
      description: "web3test",
      url: "https://web3test.com",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  }),
];

export const config = createConfig({
  chains: [sepoliaConfig],
  transports,
  connectors,
  ssr: true,
});
