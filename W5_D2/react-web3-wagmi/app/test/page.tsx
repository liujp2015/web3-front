"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { walletConnect, metaMask } from "wagmi/connectors";

// Define your WalletConnect project ID here
// const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// if (!projectId) {
//   throw new Error("WalletConnect Project ID is required.");
// }

export default function Page() {
  const { connect } = useConnect();

  // Predefine the WalletConnect connector with proper configuration
  const walletConnectConnector = walletConnect({
    projectId: "d452a1819999d5a65dd139fc813c5cda",
    showQrModal: true,
    metadata: {
      name: "My DApp Dev",
      description: "Development version",
      url: "http://localhost:3000", // ✅ 允许 localhost（仅限开发）
      icons: ["http://localhost:3000/favicon.ico"],
    },
  });
  const { address, isConnected, isConnecting, isDisconnected, connector } =
    useAccount();
  const { disconnect } = useDisconnect();
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className=" p-2 mx-6 bg-blue-400 rounded-md text-white">
        <button onClick={() => connect({ connector: metaMask() })}>
          Connect MetaMask
        </button>
        <button onClick={() => connect({ connector: walletConnectConnector })}>
          Connect WalletConnect
        </button>
        <button onClick={() => disconnect()}>Disconnect</button>
        <div>{address}</div>
      </div>
    </div>
  );
}
