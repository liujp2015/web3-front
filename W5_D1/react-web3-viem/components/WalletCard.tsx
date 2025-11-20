"use client";

export default function WalletCard({
  balance,
  balance1,
  address,
}: {
  balance: string | null;
  balance1: string | null;
  address: string;
}) {
  const copyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      alert("地址已复制！");
    });
  };

  return (
    <div className="flex items-center justify-start">
      <div
        className="max-w-xl w-full rounded-2xl p-6 text-white font-sans shadow-lg"
        style={{ background: "linear-gradient(135deg, #6e45e2, #88d3ce)" }}
      >
        <div className="text-3xl font-bold mb-5">{balance} ETH</div>
        <div className="text-3xl font-bold mb-5">{balance1} 代币</div>

        <div
          className="flex items-center justify-center bg-white bg-opacity-20 px-4 py-3 rounded-xl font-mono text-sm gap-2"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <span className="truncate">
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </span>
          <button
            onClick={copyAddress}
            className="bg-black bg-opacity-10 hover:bg-opacity-20 text-white py-1 px-3 rounded text-xs focus:outline-none"
          >
            📋 复制
          </button>
        </div>
      </div>
    </div>
  );
}
