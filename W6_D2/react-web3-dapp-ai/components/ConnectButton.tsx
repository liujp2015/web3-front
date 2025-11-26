'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatUnits } from 'viem'

export function ConnectButton() {
  const [showModal, setShowModal] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
    chainId: sepolia.id,
    query: {
      enabled: !!address,
    }
  })

  const handleConnect = (connector: any) => {
    connect({ connector })
    setShowModal(false)
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* 余额显示 */}
        {balance && (
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
            <span className="text-gray-600">{parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)}</span>
            <span className="text-gray-500">{balance.symbol}</span>
          </div>
        )}
        
        {/* 账户按钮 */}
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
      >
        Connect Wallet
      </button>

      {/* 连接钱包模态框 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {connector.name[0]}
                    </div>
                    <span className="text-gray-900 font-semibold">{connector.name}</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By connecting, you agree to our Terms of Service</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}