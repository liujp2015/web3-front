"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const queryClient = new QueryClient();

// Create modal instance
export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: "d452a1819999d5a65dd139fc813c5cda",
  enableAnalytics: false, // 可选
  allWallets: "SHOW", // 显示所有钱包（包括未安装的）
});

interface Web3ProvidersProps {
  children: ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode
          // modalSize="compact"
          theme={midnightTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
