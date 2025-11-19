"use client";
import { ERC20TokenABI } from "@/abi/ERC20Token";
// import Button from "@/components/Button";
import WalletCard from "@/components/WalletCard";
import { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
const RPC_URL = "https://sepolia.infura.io/v3/62e401de662b4df0a6a9e770dc897b73";

export default function Home() {
  const account = privateKeyToAccount(
    `0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`
  );
  const [transferAddress, setTransferAddress] = useState(
    "0x464a5fa3d105345b1be4813b139bfe385f98008c"
  );
  const [readAddress, setReadAddress] = useState(
    "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA"
  );

  const [transferAmount, setTransferAmount] = useState("0.0001");
  const [mintAmount, setMintAmount] = useState("100");
  // console.log(
  //   "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA".substring(
  //     2,
  //     "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA".length
  //   )
  // );
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL),
  });

  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL),
  });

  const contract = getContract({
    address: readAddress as `0x${string}`,
    abi: ERC20TokenABI,
    client: publicClient,
  });

  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  //代币余额
  const [balance1, setBalance1] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalanceAndAddress = async () => {
      try {
        const bal = await publicClient.getBalance({
          address: account.address,
          blockTag: "latest",
        });
        console.log("Balance (ETH):", Number(bal) / 1e18);
        setBalance(Number(bal) / 1e18);

        const addresses = await client.getAddresses();
        console.log(`The wallet address is ${addresses}`);
        setAddress(addresses[0]);

        const bal1 = await contract.read.balanceOf([account.address]);
        setBalance1(Number(bal1) / 1e18);
        console.log("Balance (ETH):", Number(bal1) / 1e18);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchBalanceAndAddress();
  }, []);

  const transferToAddress = async () => {
    await client.sendTransaction({
      account,
      to: transferAddress as `0x${string}`,
      value: parseEther(transferAmount),
    });
  };

  const [contractInfo, setContractInfo] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    owner: "",
    remainingSupply: "",
    decimals: "",
    maxSupply: "",
    maxMintPerAddress: "",
  });

  const readContract = async () => {
    // 读取合约信息
    const [
      name,
      symbol,
      totalSupply,
      owner,
      remainingSupply,
      decimals,
      MAX_SUPPLY,
      MAX_MINT_PER_ADDRESS,
    ] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.totalSupply(),
      contract.read.owner(),
      contract.read.remainingSupply(),
      contract.read.decimals(),
      contract.read.MAX_SUPPLY(),
      contract.read.MAX_MINT_PER_ADDRESS(),
    ]);

    setContractInfo({
      name,
      symbol,
      totalSupply: totalSupply.toString(),
      owner,
      remainingSupply: remainingSupply.toString(),
      decimals: decimals.toString(),
      maxSupply: MAX_SUPPLY.toString(),
      maxMintPerAddress: MAX_MINT_PER_ADDRESS.toString(),
    });
    console.log(
      "name:",
      name,
      "symbol:",
      symbol,
      "totalSupply:",
      totalSupply.toString(),
      "owner:",
      owner,
      "remainingSupply:",
      remainingSupply.toString(),
      "decimals:",
      decimals.toString(),
      "maxSupply:"
    );
  };

  const mint = async () => {
    await client.writeContract({
      address: "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA",
      abi: ERC20TokenABI,
      functionName: "mint",
      args: [parseEther(mintAmount)],
    });
  };

  // // 读合约
  // const TOKEN_ADDRESS = "0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA";
  // const name = await publicClient.readContract({
  //   address: TOKEN_ADDRESS,
  //   abi: ERC20TokenABI,
  //   functionName: "name",
  // });

  // console.log("name:", name);

  // const contract = getContract({
  //   address: TOKEN_ADDRESS,
  //   abi: ERC20TokenABI,
  //   client: publicClient,
  // });

  // // 读取合约信息
  // const [
  //   name1,
  //   symbol,
  //   totalSupply,
  //   owner,
  //   remainingSupply,
  //   decimals,
  //   MAX_SUPPLY,
  //   MAX_MINT_PER_ADDRESS,
  // ] = await Promise.all([
  //   contract.read.name(),
  //   contract.read.symbol(),
  //   contract.read.totalSupply(),
  //   contract.read.owner(),
  //   contract.read.remainingSupply(),
  //   contract.read.decimals(),
  //   contract.read.MAX_SUPPLY(),
  //   contract.read.MAX_MINT_PER_ADDRESS(),
  // ]);

  // console.log(name1);
  // console.log(symbol);
  // console.log(totalSupply);
  // console.log(owner);
  // console.log(remainingSupply);
  // console.log(decimals);
  // console.log(MAX_SUPPLY);
  // console.log(MAX_MINT_PER_ADDRESS);

  // const walletClient = createWalletClient({
  //   account,
  //   chain: sepolia,
  //   transport: http(RPC_URL),
  // });

  // const hash = await walletClient.writeContract({
  //   address: TOKEN_ADDRESS,
  //   abi: ERC20TokenABI,
  //   functionName: "mint",
  //   args: [parseEther("99")],
  // });
  // console.log(hash);
  // const balance1 = await contract.read.balanceOf([account.address]);
  // console.log(balance1);
  // const mintedByAddress = await contract.read.mintedByAddress([
  //   account.address,
  // ]);
  // console.log(mintedByAddress);

  const F18 = (number: number | null) => {
    return Number(number) / 1e18;
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-20 ">
      <div className="p-20 shadow-lg shadow-gray-400">
        <h1 className="text-2xl">钱包账户</h1>
        <WalletCard
          balance={F18(balance)}
          balance1={Number(balance1) / 1e18}
          address={account.address}
        />
        <div className="mt-6 flex items-center  gap-2">
          <div className="flex">
            <div className="bg-gray-100 rounded-xl p-1">
              <span className="text-gray-500 text-xl ">账户地址:</span>
              <input
                className="text-xl p-3 outline-none focus:outline-none"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="bg-white ml-3 text-xl text-center p-1">
                数量:
              </span>
              <input
                className="text-xl p-3 outline-none focus:outline-none w-30 "
                type="number"
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                }}
              />
            </div>

            <div className="p-2">
              <button
                className="hover:bg-blue-500 p-2 rounded-md text-white bg-blue-400 text-xl w-20"
                onClick={() => {
                  transferToAddress();
                }}
              >
                转 账
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-start  flex-col gap-2">
          <div className="flex justify-start ">
            <div className="bg-gray-100 rounded-xl p-1">
              <span className="text-gray-500 text-xl ">合约地址:</span>
              <input
                className="text-xl p-3 outline-none focus:outline-none "
                value={readAddress}
                onChange={(e) => setReadAddress(e.target.value)}
              ></input>
            </div>

            <div className="p-2">
              <button
                className="hover:bg-blue-500 p-2 rounded-md text-white bg-blue-400 text-xl w-20"
                onClick={() => readContract()}
              >
                读合约
              </button>
            </div>
          </div>
          <h1 className="font-bold text-2xl">合约信息</h1>
          <div className="grid grid-cols-4  p-3 rounded-xl bg-gray-100 gap-2 ">
            <div>名称:</div>
            <div>{contractInfo.name}</div>
            <div>符号</div>
            <div>{contractInfo.name}</div>
            <div>总供应量:</div>
            <div>{contractInfo.name}</div>
            <div>拥有者:</div>
            <div>{contractInfo.name}</div>
            <div>剩余供应量:</div>
            <div>{contractInfo.name}</div>
            <div>精度:</div>
            <div>{contractInfo.name}</div>
            <div>最大供应量:</div>
            <div>{contractInfo.name}</div>
            <div>每个地址持币上限:</div>
            <div>{contractInfo.name}</div>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-2xl font-bold">mint铸造</h1>

          <span className="bg-white ml-3 text-xl text-center p-1">数量:</span>
          <input
            className="text-xl p-3 outline-none focus:outline-none w-30 "
            type="number"
            value={mintAmount}
            onChange={(e) => {
              setMintAmount(e.target.value);
            }}
          />
          <button
            className="hover:bg-blue-500 p-2 rounded-md text-white bg-blue-400 text-xl w-20"
            onClick={() => mint()}
          >
            铸造
          </button>
        </div>
      </div>
    </div>
  );
}
