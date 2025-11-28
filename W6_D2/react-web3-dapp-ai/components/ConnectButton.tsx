'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatUnits } from 'viem'

const walletIcons: Record<string, string> = {
  'MetaMask': '🦊',
  'Coinbase Wallet': '🔵',
  'WalletConnect': '🔗',
  'Injected': '💳',
}

export function ConnectButton() {
  const [showModal, setShowModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
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

  const handleDisconnect = () => {
    disconnect()
    setShowAccountModal(false)
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (isConnected && address) {
    return (
      <>
        <div className="flex items-center gap-2">
          {/* 余额显示 */}
          {balance && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 font-semibold text-sm">
                {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3)}
              </span>
              <span className="text-gray-500 text-sm font-medium">{balance.symbol}</span>
            </div>
          )}
          
          {/* 账户按钮 */}
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </button>
        </div>

        {/* 账户详情模态框 */}
        {showAccountModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={() => setShowAccountModal(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account</h2>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* 账户信息卡片 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {address.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Connected with {chain?.name}</div>
                      <div className="text-sm font-semibold text-gray-900">{address.slice(0, 8)}...{address.slice(-6)}</div>
                    </div>
                  </div>
                </div>
                
                {balance && (
                  <div className="bg-white/80 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all font-medium text-gray-700 border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Address
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-semibold border border-red-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Connect Wallet
      </button>

      {/* 连接钱包模态框 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
                <p className="text-sm text-gray-500 mt-1">Choose your preferred wallet</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      {walletIcons[connector.name] || '💼'}
                    </div>
                    <div className="text-left">
                      <div className="text-gray-900 font-semibold text-lg">{connector.name}</div>
                      <div className="text-gray-500 text-xs">Connect to {connector.name}</div>
                    </div>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="flex gap-3">
                <div className="text-blue-600 text-xl">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium mb-1">New to Web3?</p>
                  <p className="text-xs text-blue-700">Learn more about wallets and how to get started with cryptocurrency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}