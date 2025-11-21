"use client";
import { config } from "@/config/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";
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
