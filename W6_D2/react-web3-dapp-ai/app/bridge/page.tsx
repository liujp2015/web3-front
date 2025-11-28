'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { ERC20_ABI } from '@/lib/abis'

/**
 * Bridge Page (Cross-Chain Bridge)
 * 
 * Features:
 * - Source/Target chain selection
 * - Token and amount input
 * - Call /api/bridge/transfer to initiate transfer
 * - Real-time transfer status display (queued -> inflight -> complete)
 * - Mock mode support
 */

const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 11155111, name: 'Sepolia', symbol: 'SEP' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 42161, name: 'Arbitrum', symbol: 'ARB' },
  { id: 10, name: 'Optimism', symbol: 'OP' }
]

const SUPPORTED_TOKENS = [
  { symbol: 'TKA', name: 'Token A', address: process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS },
  { symbol: 'TKB', name: 'Token B', address: process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS },
  { symbol: 'DRT', name: 'Reward Token', address: process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS }
]

// Transfer record component
function TransferRecord({ transfer, onStatusUpdate }: { transfer: any; onStatusUpdate?: (id: string, status: string) => void }) {
  const [currentStatus, setCurrentStatus] = useState(transfer.status)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStatus === 'complete') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bridge/transfer?transferId=${transfer.transferId}`)
        const data = await res.json()

        if (data.success) {
          setCurrentStatus(data.status)
          setProgress(data.progress || 0)
          onStatusUpdate?.(transfer.transferId, data.status)
        }
      } catch (error) {
        console.error('Failed to query transfer status:', error)
      }
    }, 3000) // Query every 3 seconds

    return () => clearInterval(interval)
  }, [currentStatus, transfer.transferId, onStatusUpdate])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'queued':
        return { text: 'Queued', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'inflight':
        return { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: '🚀' }
      case 'complete':
        return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: '✓' }
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: '?' }
    }
  }

  const statusInfo = getStatusInfo(currentStatus)

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.text}
            </span>
            <span className="text-xs text-gray-500">
              Est. {transfer.estimatedTime} mins
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-lg mr-2">🔷</span>
              <span className="text-gray-900 font-semibold text-sm">{transfer.sourceChain}</span>
            </div>
            <span className="text-gray-500">→</span>
            <div className="flex items-center">
              <span className="text-lg mr-2">🟣</span>
              <span className="text-gray-900 font-semibold text-sm">{transfer.targetChain}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Amount</span>
              <span className="text-gray-900 font-semibold">
                {transfer.amount} {transfer.token}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Fee</span>
              <span className="text-gray-900">{transfer.fee} {transfer.token}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {currentStatus !== 'complete' && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 font-mono">
        ID: {transfer.transferId}
      </div>
    </div>
  )
}

export default function BridgePage() {
  const { address, isConnected } = useAccount()

  // Form state
  const [sourceChain, setSourceChain] = useState('Sepolia')
  const [targetChain, setTargetChain] = useState('Polygon')
  const [selectedToken, setSelectedToken] = useState('TKA')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  // Transfer state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [transfers, setTransfers] = useState([])

  // Read user token balance
  const tokenData = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken)
  const { data: balance } = useReadContract({
    address: tokenData?.address as `0x${string}` | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && tokenData?.address)
    }
  })

  const userBalance = balance ? formatUnits(balance as bigint, 18).substring(0, 10) : '0'

  // Auto-fill recipient address with current address
  useEffect(() => {
    if (address && !recipient) {
      setRecipient(address)
    }
  }, [address, recipient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid transfer amount')
      return
    }

    if (!recipient || !recipient.startsWith('0x')) {
      setError('Please enter a valid recipient address')
      return
    }

    if (sourceChain === targetChain) {
      setError('Source and target chains cannot be the same')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/bridge/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceChain,
          targetChain,
          token: selectedToken,
          amount,
          recipient
        })
      })

      const data = await res.json()

      if (data.success) {
        // Add to transfer records list
        setTransfers(prev => [data, ...prev])
        // Clear form
        setAmount('')
      } else {
        setError(data.error || 'Transfer submission failed')
      }
    } catch (err) {
      console.error('Transfer submission error:', err)
      setError('Network error, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = (transferId, newStatus) => {
    setTransfers(prev =>
      prev.map(t => t.transferId === transferId ? { ...t, status: newStatus } : t)
    )
  }

  const handleMaxAmount = () => {
    setAmount(userBalance)
  }

  const handleSwapChains = () => {
    const temp = sourceChain
    setSourceChain(targetChain)
    setTargetChain(temp)
  }

  // Filter available target chains
  const availableTargetChains = SUPPORTED_CHAINS.filter(c => c.name !== sourceChain)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌉 Cross-Chain Bridge
          </h1>
          <p className="text-gray-600 text-lg">
            Transfer assets securely across different blockchains
          </p>
        </div>

        {/* Demo mode notice */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-4xl mx-auto">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Demo Mode</p>
              <p className="text-sm text-yellow-700">
                Currently in demo mode, transfer status is simulated data. Actual cross-chain bridge requires integration with LayerZero, Wormhole or other cross-chain protocols.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Transfer form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Initiate Cross-Chain Transfer</h2>

              <form onSubmit={handleSubmit}>
                {/* Source chain selection */}
                <div className="mb-6">
                  <label className="text-gray-600 text-sm mb-3 block">From Chain</label>
                  <select
                    value={sourceChain}
                    onChange={(e) => setSourceChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SUPPORTED_CHAINS.map(chain => (
                      <option key={chain.id} value={chain.name}>
                        {chain.name} ({chain.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center my-6">
                  <button
                    type="button"
                    onClick={handleSwapChains}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full p-4 border border-gray-300 transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* Target chain selection */}
                <div className="mb-6">
                  <label className="text-gray-600 text-sm mb-3 block">To Chain</label>
                  <select
                    value={targetChain}
                    onChange={(e) => setTargetChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableTargetChains.map(chain => (
                      <option key={chain.id} value={chain.name}>
                        {chain.name} ({chain.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Token selection */}
                <div className="mb-4">
                  <label className="text-gray-600 text-sm mb-2 block">Token</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SUPPORTED_TOKENS.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-gray-600 text-sm">Transfer Amount</label>
                    {isConnected && (
                      <button
                        type="button"
                        onClick={handleMaxAmount}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Balance: {userBalance}
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent text-gray-900 text-3xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                      <div className="text-gray-600 font-semibold">
                        {selectedToken}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipient address */}
                <div className="mb-6">
                  <label className="text-gray-600 text-sm mb-2 block">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                {/* Bridge details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                  <h3 className="text-gray-900 font-semibold mb-3">Bridge Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">You will receive</span>
                    <span className="text-gray-900 font-semibold">{amount || '0.00'} {selectedToken}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bridge Fee</span>
                    <span className="text-gray-900">~$5.00 (0.5%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="text-gray-900">~5-15 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network Fee</span>
                    <span className="text-gray-900">~$2.50</span>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                {!isConnected ? (
                  <button
                    type="button"
                    className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !amount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Initiate Transfer'}
                  </button>
                )}
              </form>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <div className="text-yellow-700 font-semibold text-sm mb-1">Security Notice</div>
                    <div className="text-yellow-600 text-xs">
                      Always double-check the destination chain and address. Bridge transactions cannot be reversed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Transfer history */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Transfer History</h2>

              {transfers.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No transfer records</p>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  {transfers.map((transfer) => (
                    <TransferRecord
                      key={transfer.transferId}
                      transfer={transfer}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-4">Cross-Chain Bridge Instructions</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Select source and target chains, ensure they are different
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Enter the amount of tokens to transfer
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Confirm the recipient address is correct (defaults to current wallet address)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Cross-chain transfers require certain fees
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Transfer time depends on confirmation speed of source and target chains
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Do not close the page during transfer process
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}