// // components/AppKitProvider.tsx
// "use client";

// import { createAppKit } from "@reown/appkit/react";
// import {
//   arbitrum,
//   mainnet,
//   optimism,
//   polygon,
//   sepolia,
// } from "@reown/appkit/networks";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { type ReactNode } from "react";
// import { config } from "@/config/wagmiConfig";
// import { WagmiProvider } from "wagmi";

// // Define networks with explicit typing to satisfy tuple requirement
// const networks = [mainnet, sepolia] as const;

// // Create AppKit instance
// const modal = createAppKit({
//   networks: [...networks],
//   projectId: "d452a1819999d5a65dd139fc813c5cda",
//   features: {
//     analytics: true,
//   },
// });

// const queryClient = new QueryClient();

// export function AppKitProvider({ children }: { children: ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </WagmiProvider>
//   );
// }
