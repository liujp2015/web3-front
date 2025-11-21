"use client";
import { config } from "@/config/wagmiConfig";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";
// Define networks with explicit typing to satisfy tuple requirement
const networks = [mainnet, sepolia] as const;

// Create AppKit instance
const modal = createAppKit({
  networks: [...networks],
  projectId: "d452a1819999d5a65dd139fc813c5cda",
  features: {
    analytics: true,
  },
});
const queryClient = new QueryClient();
export const WagmiProviderWrap: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
