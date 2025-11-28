'use client'

import { useAccount, useBalance, useDisconnect } from 'wagmi'

export default function TestWalletPage() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h1>
          <p className="text-gray-600">Please connect your wallet from the header to view wallet information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Wallet Information</h1>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div>
            <div className="text-gray-600 text-sm mb-2 font-semibold">Connected Address</div>
            <div className="text-gray-900 text-lg font-mono bg-gray-50 p-3 rounded-lg break-all">{address}</div>
          </div>

          <div>
            <div className="text-gray-600 text-sm mb-2 font-semibold">Network</div>
            <div className="text-gray-900 text-lg bg-gray-50 p-3 rounded-lg">
              {chain?.name || 'Unknown'} (Chain ID: {chain?.id})
            </div>
          </div>

          <div>
            <div className="text-gray-600 text-sm mb-2 font-semibold">Balance</div>
            <div className="text-gray-900 text-lg bg-gray-50 p-3 rounded-lg">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </div>
          </div>

          <div>
            <div className="text-gray-600 text-sm mb-2 font-semibold">Connection Status</div>
            <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-semibold">Connected</span>
            </div>
          </div>

          <button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Disconnect Wallet
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">💡 About This Page</h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            This page demonstrates the use of Wagmi React Hooks for Web3 interactions. 
            It shows how to read wallet information including address, network, and balance 
            using <code className="bg-blue-100 px-2 py-1 rounded">useAccount()</code>, <code className="bg-blue-100 px-2 py-1 rounded">useBalance()</code>, 
            and <code className="bg-blue-100 px-2 py-1 rounded">useDisconnect()</code> hooks.
          </p>
        </div>
      </div>
    </div>
  )
}
