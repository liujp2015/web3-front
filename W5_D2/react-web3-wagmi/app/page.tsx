"use client";
import { TokenBankABI } from "@/abi/TokenBankABI";
import { useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { parseEther, parseUnits } from "viem/utils";
import {
  injected,
  useConnect,
  useAccount,
  useDisconnect,
  useAccountEffect,
  useBalance,
  useSendTransaction,
  useReadContracts,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { metaMask } from "wagmi/connectors";

export default function Home() {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting, isDisconnected, connector } =
    useAccount();

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
  });
  const balance = Number(ethBalance?.value) / 1e18;
  const { sendTransaction } = useSendTransaction();
  const [transferAddress, setTransferAddress] = useState(
    "0x464a5fa3d105345b1be4813b139bfe385f98008c"
  );

  useAccountEffect({
    onConnect(data) {
      console.log("Connected!", data);
    },
    onDisconnect() {
      console.log("Disconnected!");
    },
  });
  const contract = "0x8Ff1927560f49488045025e71A2f596581411926";
  const allResult = useReadContracts({
    contracts: [
      {
        address: contract,
        abi: TokenBankABI,
        functionName: "getBankBalance",
      },
      {
        address: contract,
        abi: TokenBankABI,
        functionName: "token",
      },
      {
        address: contract,
        abi: TokenBankABI,
        functionName: "totalDeposits",
      },
      {
        address: contract,
        abi: TokenBankABI,
        functionName: "balanceOf",
        args: [address],
      },
    ],
  });

  console.log(allResult.data?.[0].result);
  console.log(allResult.data?.[1].result);
  console.log(allResult.data?.[2].result);
  console.log("余额", allResult.data?.[3].result);
  const bankBalance = allResult.data?.[0].result as string;
  const token = allResult.data?.[1].result as string;
  const totalDeposits = allResult.data?.[2].result as string;
  const balanceOf = allResult.data?.[3].result as string;
  const [transferAmount, setTransferAmount] = useState<number>(0.0001);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const { writeContract } = useWriteContract();
  const [mounted, setMounted] = useState(false);
  const { data: allowanceData } = useReadContract({
    abi: erc20Abi,
    address: "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA",
    functionName: "allowance",
    args: [address!, contract], // Ensure both args are properly typed
  });

  const approve = () => {
    console.log("approve");
    writeContract({
      abi: erc20Abi,
      address: "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA",
      functionName: "approve",
      args: [contract, parseEther(depositAmount.toString())],
    });
  };

  const deposit = () => {
    console.log(depositAmount);
    writeContract({
      abi: TokenBankABI,
      address: contract,
      functionName: "deposit",
      args: [depositAmount],
    });
  };
  const withdraw = () => {
    writeContract({
      abi: TokenBankABI,
      address: contract,
      functionName: "withdraw",
      args: [withdrawAmount],
    });
  };
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash, // 当 txHash 变化时自动开始监听
  });

  // 交易确认后自动刷新 ETH 余额
  useEffect(() => {
    if (isConfirmed) {
      refetchEthBalance(); // 刷新余额
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTxHash(undefined); // 重置，避免重复触发
      alert("转账成功");
    }
  }, [isConfirmed]);

  // 如果交易失败
  useEffect(() => {
    if (isConfirmError) {
      alert("转账失败");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTxHash(undefined);
    }
  }, [isConfirmError]);

  useEffect(() => {
    // 确保组件只在客户端“真正挂载后”才渲染动态内容
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // 服务端和客户端初次渲染都显示这个（一致）
    return <div>Loading...</div>;
  }

  const transferToAddress = async () => {
    if (!transferAddress) return;
    // const hash = sendTransaction({
    //   to: transferAddress as `0x${string}`,
    //   value: parseEther(transferAmount.toString()),
    // });
    // console.log("Transaction hash", hash);

    const config = {
      to: transferAddress as `0x${string}`,
      value: parseEther(transferAmount.toString()),
    };
    sendTransaction(config, {
      onSuccess(data) {
        // data 是交易哈希（`0x...`）
        console.log("Transaction hash:", data);
        setTxHash(data); // 保存 hash 用于监听
      },
      onError(error) {
        console.error("Transaction failed to send:", error);
      },
    });
  };

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center mt-10 gap-10">
        <div className="p-3 shadow-xl shadow-gray-400 rounded-xl w-130">
          <div className="flex gap-2 items-center justify-center mt-10 ">
            {address ? (
              <button
                className="bg-blue-400 text-white p-2 rounded-md w-25 hover:bg-blue-500"
                onClick={() => disconnect()}
              >
                断开连接
              </button>
            ) : (
              <button
                className="bg-blue-400 text-white p-2 rounded-md w-25 hover:bg-blue-500"
                onClick={() => connect({ connector: metaMask() })}
              >
                连接钱包
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4  p-3 rounded-xl bg-gradient-to-br from-gray-50 to-blue-100">
            <h1 className="text-2xl font-bold pl-3">钱包信息</h1>
            <p>账户地址:{address}</p>
            <p>我的余额为:{balance}</p>
            <p>我的代币余额为:{balanceOf}</p>
            <p>授权额度:{Number(allowanceData) / 1e18}</p>
            {/* <h1 className="text-2xl font-bold pl-3"> 合约信息</h1>
            <p>银行余额为:{Number(bankBalance) / 1e18}</p>
            <p>银行总存款:{Number(totalDeposits) / 1e18}</p>
            <p>erc20的address:{token}</p> */}
          </div>
        </div>
        <div className="p-3 shadow-xl shadow-gray-400 rounded-xl ">
          <h1 className="text-2xl font-bold pl-3">操作</h1>
          <span className="text-xl text-gray-600 p-3">地址:</span>
          <input
            className=" outline-none text-xl p-3 "
            value={transferAddress}
            onChange={(e) => {
              setTransferAddress(e.target.value);
            }}
          ></input>
          <span className="text-xl text-gray-600 p-3">转账金额:</span>
          <input
            className="outline-none text-xl p-3 w-40"
            value={transferAmount}
            onChange={(e) => {
              setTransferAmount(Number(e.target.value));
            }}
            type="number"
          />
          <button
            onClick={() => transferToAddress()}
            className="p-3 bg-blue-400 text-white hover:bg-blue-500 rounded-xl"
          >
            转账
          </button>

          <div>
            <input
              className="outline-none text-xl p-3 w-40"
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(Number(e.target.value));
              }}
              type="number"
            />
            <button
              onClick={() => approve()}
              className="p-3 bg-blue-400 text-white hover:bg-blue-500 rounded-xl mr-4 "
            >
              授权
            </button>

            <button
              onClick={() => deposit()}
              className="p-3 bg-blue-400 text-white hover:bg-blue-500 rounded-xl"
            >
              存款
            </button>
            <input
              className="outline-none text-xl p-3 w-40 ml-10"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(Number(e.target.value));
              }}
              type="number"
            />
            <button
              onClick={() => {
                withdraw();
              }}
              className="p-3 bg-blue-400 text-white hover:bg-blue-500 rounded-xl"
            >
              取款
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
