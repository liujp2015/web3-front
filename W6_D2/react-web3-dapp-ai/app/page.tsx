import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen py-32 px-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Web3 DAPP AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A comprehensive decentralized application platform featuring DeFi protocols, 
            cross-chain bridging, and AI-powered features for the next generation of Web3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          <Link href="/swap" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">💱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Swap</h3>
            <p className="text-gray-600">Exchange tokens instantly with optimal rates</p>
          </Link>

          <Link href="/pool" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Pool</h3>
            <p className="text-gray-600">Add liquidity to earn trading fees</p>
          </Link>

          <Link href="/farm" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Farms</h3>
            <p className="text-gray-600">Stake LP tokens to earn rewards</p>
          </Link>

          <Link href="/launchpad" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">LaunchPad</h3>
            <p className="text-gray-600">Invest in promising blockchain projects</p>
          </Link>

          <Link href="/dashboard" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Dashboard</h3>
            <p className="text-gray-600">Track your portfolio and transactions</p>
          </Link>

          <Link href="/bridge" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="text-4xl mb-4">🌉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Bridge</h3>
            <p className="text-gray-600">Transfer assets across blockchains</p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg">
            Connect Wallet to Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
