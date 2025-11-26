'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokenApprove } from '@/hooks/useTokenApprove'
import { useSwap, useGetSwapAmount } from '@/hooks/useSwap'
import { useTokenBalance, useTokenAllowance } from '@/hooks/useTokenBalance'
import { getTokenAddress, getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'
import { parseUnits } from 'viem'

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const [fromToken, setFromToken] = useState('TKA')
  const [toToken, setToToken] = useState('TKB')
  const [fromAmount, setFromAmount] = useState('')

  const tokens = ['TKA', 'TKB', 'USDC', 'DRT']

  const fromTokenAddress = getTokenAddress(sepolia.id, fromToken) as `0x${string}` | undefined
  const toTokenAddress = getTokenAddress(sepolia.id, toToken) as `0x${string}` | undefined
  const swapAddress = getProtocolAddress(sepolia.id, 'SWAP') as `0x${string}` | undefined

  const { balance: fromBalance } = useTokenBalance(fromTokenAddress, address)
  const { balance: toBalance } = useTokenBalance(toTokenAddress, address)
  const { allowance } = useTokenAllowance(fromTokenAddress, address, swapAddress)
  const { amountOut, isLoading: isCalculating } = useGetSwapAmount(fromTokenAddress, toTokenAddress, fromAmount)
  
  const { approve, isPending: isApproving, isSuccess: isApproveSuccess } = useTokenApprove()
  const { swap, isPending: isSwapping, isSuccess: isSwapSuccess } = useSwap()

  const needsApproval = allowance && fromAmount 
    ? allowance < parseUnits(fromAmount, 18)
    : true

  useEffect(() => {
    if (isApproveSuccess || isSwapSuccess) {
      setFromAmount('')
    }
  }, [isApproveSuccess, isSwapSuccess])

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount('')
  }

  const handleApprove = async () => {
    if (!fromTokenAddress || !swapAddress || !fromAmount) return
    try {
      await approve(fromTokenAddress, swapAddress, fromAmount, 18)
    } catch (error) {
      console.error('Approve failed:', error)
    }
  }

  const handleSwap = async () => {
    if (!fromTokenAddress || !toTokenAddress || !fromAmount) return
    try {
      await swap(fromTokenAddress, toTokenAddress, fromAmount, '0', 18)
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Swap Tokens
          </h1>
          <p className="text-gray-600">
            Exchange your tokens instantly
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="mb-4">
            <label className="text-gray-600 text-sm mb-2 block">From</label>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tokens.map(token => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">
                  Balance: {parseFloat(fromBalance).toFixed(4)}
                </span>
              </div>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-center my-4">
            <button
              onClick={handleSwapTokens}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 border border-gray-300 transition-all"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="text-gray-600 text-sm mb-2 block">To</label>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tokens.map(token => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">
                  Balance: {parseFloat(toBalance).toFixed(4)}
                </span>
              </div>
              <div className="w-full text-gray-900 text-2xl font-semibold">
                {isCalculating ? 'Calculating...' : parseFloat(amountOut).toFixed(4)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">You will receive</span>
              <span className="text-gray-900 font-semibold">
                {parseFloat(amountOut).toFixed(4)} {toToken}
              </span>
            </div>
            {fromAmount && parseFloat(fromAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="text-gray-900 font-semibold">
                  1 {fromToken} = {(parseFloat(amountOut) / parseFloat(fromAmount)).toFixed(4)} {toToken}
                </span>
              </div>
            )}
          </div>

          {!isConnected ? (
            <button 
              disabled
              className="w-full bg-gray-400 text-white font-semibold py-4 rounded-xl cursor-not-allowed"
            >
              Connect Wallet to Swap
            </button>
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
            <button 
              disabled
              className="w-full bg-gray-400 text-white font-semibold py-4 rounded-xl cursor-not-allowed"
            >
              Enter Amount
            </button>
          ) : needsApproval ? (
            <button 
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
            >
              {isApproving ? 'Approving...' : `Approve ${fromToken}`}
            </button>
          ) : (
            <button 
              onClick={handleSwap}
              disabled={isSwapping}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}