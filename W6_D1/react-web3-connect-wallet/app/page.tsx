"use client";

import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { walletConnect, metaMask } from "wagmi/connectors";

export default function Page() {
  const { connect } = useConnect();

  // Predefine the WalletConnect connector with proper configuration
  // const walletConnectConnector = walletConnect({
  //   projectId: "d452a1819999d5a65dd139fc813c5cda",
  //   showQrModal: true,
  //   metadata: {
  //     name: "My DApp Dev",
  //     description: "Development version",
  //     url: "http://localhost:3001", // ✅ 允许 localhost（仅限开发）
  //     icons: ["http://localhost:3001/favicon.ico"],
  //   },
  // });
  // const { address, isConnected, isConnecting, isDisconnected, connector } =
  //   useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // 确保组件只在客户端“真正挂载后”才渲染动态内容
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // 服务端和客户端初次渲染都显示这个（一致）
    return <div>Loading...</div>;
  }
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {/* <div className=" p-2 mx-6 bg-blue-400 rounded-md text-white">
        <button onClick={() => connect({ connector: metaMask() })}>
          Connect MetaMask
        </button>
        <button onClick={() => connect({ connector: walletConnectConnector })}>
          Connect WalletConnect
        </button>
        <button onClick={() => disconnect()}>Disconnect</button>
        <div>{address}</div>
      </div> */}
      {address ? (
        <div>
          <p>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p>Network: {caipNetwork?.name}</p>
          <button onClick={() => open({ view: "Account" })}>
            Open Account Modal
          </button>
        </div>
      ) : (
        <button onClick={() => open()}>Connect Wallet</button>
      )}
    </div>
  );
}
