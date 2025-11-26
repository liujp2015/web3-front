'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokenApprove } from '@/hooks/useTokenApprove'
import { useFarm, useFarmData } from '@/hooks/useFarm'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { getTokenAddress, getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export default function FarmPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('stake')
  const [amount, setAmount] = useState('')

  const lpTokenAddress = getProtocolAddress(sepolia.id, 'STAKE_POOL') as `0x${string}` | undefined
  const farmAddress = getProtocolAddress(sepolia.id, 'FARM') as `0x${string}` | undefined
  const rewardTokenAddress = getTokenAddress(sepolia.id, 'DRT') as `0x${string}` | undefined

  const { balance: lpBalance } = useTokenBalance(lpTokenAddress, address)
  const { balance: rewardBalance } = useTokenBalance(rewardTokenAddress, address)
  const { stakedAmount, pendingRewards } = useFarmData(address)

  const { approve, isPending: isApproving, isSuccess: isApproveSuccess } = useTokenApprove()
  const { stake, unstake, harvest, isPending, isSuccess } = useFarm()

  useEffect(() => {
    if (isSuccess) {
      setAmount('')
    }
  }, [isSuccess])

  const handleApprove = async () => {
    if (!lpTokenAddress || !farmAddress || !amount) return
    try {
      await approve(lpTokenAddress, farmAddress, amount, 18)
    } catch (error) {
      console.error('Approve failed:', error)
    }
  }

  const handleStake = async () => {
    if (!amount) return
    try {
      await stake(amount, 18)
    } catch (error) {
      console.error('Stake failed:', error)
    }
  }

  const handleUnstake = async () => {
    if (!amount) return
    try {
      await unstake(amount, 18)
    } catch (error) {
      console.error('Unstake failed:', error)
    }
  }

  const handleHarvest = async () => {
    try {
      await harvest()
    } catch (error) {
      console.error('Harvest failed:', error)
    }
  }

  const totalStaked = '2,345,678'
  const totalEarned = pendingRewards || '0'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Yield Farms
          </h1>
          <p className="text-gray-600 text-lg">
            Stake LP tokens to earn rewards
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="text-gray-600 text-sm mb-2">Total Value Locked</div>
              <div className="text-3xl font-bold text-blue-600">${totalStaked}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="text-gray-600 text-sm mb-2">My Total Staked</div>
              <div className="text-3xl font-bold text-green-600">{parseFloat(stakedAmount).toFixed(4)} LP</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="text-gray-600 text-sm mb-2">Total Earned</div>
              <div className="text-3xl font-bold text-purple-600">{parseFloat(totalEarned).toFixed(4)} DRT</div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">TKA/TKB LP</h3>
                <div className="text-gray-500 text-sm">Earn DRT</div>
              </div>
              <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold">
                45.6% APR
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVL</span>
                <span className="text-gray-900 font-semibold">${totalStaked}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Staked</span>
                <span className="text-gray-900 font-semibold">{parseFloat(stakedAmount).toFixed(4)} LP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Earned</span>
                <span className="text-green-600 font-semibold">{parseFloat(pendingRewards).toFixed(4)} DRT</span>
              </div>
            </div>

            {parseFloat(pendingRewards) > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-600 text-xs mb-1">Rewards Available</div>
                    <div className="text-green-600 font-bold text-lg">{parseFloat(pendingRewards).toFixed(4)} DRT</div>
                  </div>
                  <button 
                    onClick={handleHarvest}
                    disabled={isPending}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    {isPending ? 'Harvesting...' : 'Harvest'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('stake')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'stake'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setActiveTab('unstake')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'unstake'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Unstake
                </button>
              </div>

              <div className="flex items-center bg-white rounded-lg px-3 py-2 mb-3 border border-gray-200">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-gray-900 focus:outline-none placeholder-gray-400"
                />
                <button 
                  onClick={() => setAmount(activeTab === 'stake' ? lpBalance : stakedAmount)}
                  className="text-blue-500 text-sm font-semibold hover:text-blue-600"
                >
                  MAX
                </button>
              </div>

              <div className="text-gray-500 text-xs mb-3">
                Available: {parseFloat(activeTab === 'stake' ? lpBalance : stakedAmount).toFixed(4)} LP
              </div>

              {!isConnected ? (
                <button 
                  disabled
                  className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg cursor-not-allowed"
                >
                  Connect Wallet
                </button>
              ) : activeTab === 'stake' ? (
                !isApproveSuccess && parseFloat(amount) > 0 ? (
                  <button 
                    onClick={handleApprove}
                    disabled={isApproving || !amount}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    {isApproving ? 'Approving...' : 'Approve LP Tokens'}
                  </button>
                ) : (
                  <button 
                    onClick={handleStake}
                    disabled={isPending || !amount || parseFloat(amount) <= 0}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    {isPending ? 'Staking...' : 'Stake LP Tokens'}
                  </button>
                )
              ) : (
                <button 
                  onClick={handleUnstake}
                  disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(stakedAmount)}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {isPending ? 'Unstaking...' : 'Unstake LP Tokens'}
                </button>
              )}
            </div>

            <button className="w-full text-gray-500 hover:text-gray-700 text-sm font-semibold transition-all">
              View Contract ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}