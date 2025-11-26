'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import clsx from 'clsx'
import { useTokenApprove } from '@/hooks/useTokenApprove'
import { useLiquidity, usePoolReserves } from '@/hooks/useLiquidity'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { getTokenAddress, getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export default function PoolPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('add')
  const [token0, setToken0] = useState('TKA')
  const [token1, setToken1] = useState('TKB')
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [removePercentage, setRemovePercentage] = useState(25)

  const tokens = ['TKA', 'TKB', 'USDC', 'DRT']

  const token0Address = getTokenAddress(sepolia.id, token0) as `0x${string}` | undefined
  const token1Address = getTokenAddress(sepolia.id, token1) as `0x${string}` | undefined
  const poolAddress = getProtocolAddress(sepolia.id, 'STAKE_POOL') as `0x${string}` | undefined

  const { balance: balance0 } = useTokenBalance(token0Address, address)
  const { balance: balance1 } = useTokenBalance(token1Address, address)
  const { balance: lpBalance } = useTokenBalance(poolAddress, address)
  const { reserve0, reserve1 } = usePoolReserves()

  const { approve: approve0, isPending: isApproving0, isSuccess: isApprove0Success } = useTokenApprove()
  const { approve: approve1, isPending: isApproving1, isSuccess: isApprove1Success } = useTokenApprove()
  const { addLiquidity, removeLiquidity, isPending, isSuccess } = useLiquidity()

  useEffect(() => {
    if (isSuccess) {
      setAmount0('')
      setAmount1('')
    }
  }, [isSuccess])

  const handleApprove0 = async () => {
    if (!token0Address || !poolAddress || !amount0) return
    try {
      await approve0(token0Address, poolAddress, amount0, 18)
    } catch (error) {
      console.error('Approve token0 failed:', error)
    }
  }

  const handleApprove1 = async () => {
    if (!token1Address || !poolAddress || !amount1) return
    try {
      await approve1(token1Address, poolAddress, amount1, 18)
    } catch (error) {
      console.error('Approve token1 failed:', error)
    }
  }

  const handleAddLiquidity = async () => {
    if (!amount0 || !amount1) return
    try {
      await addLiquidity(amount0, amount1, 18)
    } catch (error) {
      console.error('Add liquidity failed:', error)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!lpBalance) return
    const removeAmount = (parseFloat(lpBalance) * removePercentage / 100).toString()
    try {
      await removeLiquidity(removeAmount, 18)
    } catch (error) {
      console.error('Remove liquidity failed:', error)
    }
  }

  const mockPools = [
    { pair: 'TKA/TKB', liquidity: `$${(parseFloat(reserve0) + parseFloat(reserve1)).toFixed(2)}`, apr: '12.5%', myShare: lpBalance ? ((parseFloat(lpBalance) / (parseFloat(reserve0) + parseFloat(reserve1))) * 100).toFixed(2) + '%' : '0.00%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Liquidity Pools
          </h1>
          <p className="text-gray-600">
            Add liquidity to earn trading fees
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('add')}
                  className={clsx(
                    'flex-1 py-3 rounded-xl font-semibold transition-all',
                    activeTab === 'add'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Add Liquidity
                </button>
                <button
                  onClick={() => setActiveTab('remove')}
                  className={clsx(
                    'flex-1 py-3 rounded-xl font-semibold transition-all',
                    activeTab === 'remove'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Remove Liquidity
                </button>
              </div>

              {activeTab === 'add' ? (
                <>
                  <div className="mb-4">
                    <label className="text-gray-600 text-sm mb-2 block">Token 1</label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <select
                          value={token0}
                          onChange={(e) => setToken0(e.target.value)}
                          className="bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {tokens.map(token => (
                            <option key={token} value={token}>
                              {token}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-500 text-sm">Balance: {parseFloat(balance0).toFixed(4)}</span>
                      </div>
                      <input
                        type="number"
                        value={amount0}
                        onChange={(e) => setAmount0(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="bg-gray-100 rounded-full p-3 border border-gray-300">
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">Token 2</label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <select
                          value={token1}
                          onChange={(e) => setToken1(e.target.value)}
                          className="bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {tokens.map(token => (
                            <option key={token} value={token}>
                              {token}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-500 text-sm">Balance: {parseFloat(balance1).toFixed(4)}</span>
                      </div>
                      <input
                        type="number"
                        value={amount1}
                        onChange={(e) => setAmount1(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pool Reserves</span>
                      <span className="text-gray-900 font-semibold">
                        {parseFloat(reserve0).toFixed(2)} {token0} / {parseFloat(reserve1).toFixed(2)} {token1}
                      </span>
                    </div>
                  </div>

                  {!isConnected ? (
                    <button disabled className="w-full bg-gray-400 text-white font-semibold py-4 rounded-xl cursor-not-allowed">
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {!isApprove0Success && (
                        <button 
                          onClick={handleApprove0}
                          disabled={isApproving0 || !amount0}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all"
                        >
                          {isApproving0 ? 'Approving...' : `Approve ${token0}`}
                        </button>
                      )}
                      {!isApprove1Success && (
                        <button 
                          onClick={handleApprove1}
                          disabled={isApproving1 || !amount1}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all"
                        >
                          {isApproving1 ? 'Approving...' : `Approve ${token1}`}
                        </button>
                      )}
                      <button 
                        onClick={handleAddLiquidity}
                        disabled={isPending || !amount0 || !amount1}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                      >
                        {isPending ? 'Adding...' : 'Add Liquidity'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">
                      Amount to Remove
                    </label>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-gray-900 mb-2">{removePercentage}%</div>
                        <div className="text-gray-500 text-sm">of your liquidity</div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="25"
                        value={removePercentage}
                        onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                    <div className="text-gray-600 text-sm mb-2">Your LP Balance:</div>
                    <div className="text-gray-900 font-semibold text-lg">
                      {parseFloat(lpBalance).toFixed(4)} LP
                    </div>
                    <div className="text-gray-600 text-sm">
                      You will remove: {(parseFloat(lpBalance) * removePercentage / 100).toFixed(4)} LP
                    </div>
                  </div>

                  {!isConnected ? (
                    <button disabled className="w-full bg-gray-400 text-white font-semibold py-4 rounded-xl cursor-not-allowed">
                      Connect Wallet
                    </button>
                  ) : (
                    <button 
                      onClick={handleRemoveLiquidity}
                      disabled={isPending || parseFloat(lpBalance) === 0}
                      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                    >
                      {isPending ? 'Removing...' : 'Remove Liquidity'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Liquidity</h2>

              <div className="space-y-4">
                {mockPools.map((pool, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-gray-900 font-semibold text-lg">{pool.pair}</div>
                        <div className="text-gray-500 text-sm">Liquidity: {pool.liquidity}</div>
                      </div>
                      <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {pool.apr} APR
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">My Share:</span>
                      <span className="text-gray-900 font-semibold">{pool.myShare}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center text-gray-500 text-sm">
                {!isConnected && <p>Connect wallet to see your liquidity positions</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}