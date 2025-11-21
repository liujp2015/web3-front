"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
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
  const { address, isConnected, isConnecting, isDisconnected, connector } =
    useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address: appKitAddress } = useAppKitAccount(); // Renamed to avoid conflict
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
    <div className="flex flex-col items-center justify-center mt-10 gap-8">
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

      {address || appKitAddress ? (
        <div className="p-3 shadow-lg shadow-gray-400 flex-col gap-4 rounded-lg">
          <h1 className="text-xl font-bold">钱包信息</h1>
          <div>
            地址:{address ? address : appKitAddress}
            {address || appKitAddress ? (
              <button
                onClick={() => disconnect()}
                className="bg-blue-400 p-2 rounded-lg text-white ml-3"
              >
                断开连接
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {appKitAddress ? (
        <div className="p-3 shadow-lg shadow-gray-400 flex-col gap-8 rounded-lg justify-center items-center">
          <h1 className="text-xl font-bold text-center">appkit</h1>
          <p>
            地址: {appKitAddress.slice(0, 6)}...{appKitAddress.slice(-4)}
          </p>
          <p>网络: {caipNetwork?.name}</p>
          <div className="flex justify-center items-center">
            <button
              onClick={() => open({ view: "Account" })}
              className="bg-green-400 py-2 px-4 rounded-xl text-white font-bold hover:scale-103"
            >
              打开appkit
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 shadow-lg shadow-gray-400 flex-col gap-8 rounded-lg">
          <h1 className="text-xl font-bold text-center">appkit</h1>
          <div className="flex justify-center items-center">
            <button
              onClick={() => open()}
              className="bg-green-400 py-2 px-4 rounded-xl text-white font-bold hover:scale-103"
            >
              连接钱包
            </button>
          </div>
        </div>
      )}

      <div className="p-3 shadow-lg shadow-gray-400 flex-col gap-8 rounded-lg">
        <h1 className="text-xl font-bold text-center">rainbowkit</h1>
        <div className="flex justify-center items-center">
          <ConnectButton
            accountStatus="avatar"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
