'use client'

import { useAccount } from 'wagmi'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useFarmData } from '@/hooks/useFarm'
import { usePoolReserves } from '@/hooks/useLiquidity'
import { getTokenAddress, getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()

  const tkaAddress = getTokenAddress(sepolia.id, 'TKA') as `0x${string}` | undefined
  const tkbAddress = getTokenAddress(sepolia.id, 'TKB') as `0x${string}` | undefined
  const usdcAddress = getTokenAddress(sepolia.id, 'USDC') as `0x${string}` | undefined
  const drtAddress = getTokenAddress(sepolia.id, 'DRT') as `0x${string}` | undefined
  const lpAddress = getProtocolAddress(sepolia.id, 'STAKE_POOL') as `0x${string}` | undefined

  const { balance: tkaBalance } = useTokenBalance(tkaAddress, address)
  const { balance: tkbBalance } = useTokenBalance(tkbAddress, address)
  const { balance: usdcBalance } = useTokenBalance(usdcAddress, address)
  const { balance: drtBalance } = useTokenBalance(drtAddress, address)
  const { balance: lpBalance } = useTokenBalance(lpAddress, address)

  const { stakedAmount, pendingRewards } = useFarmData(address)
  const { reserve0, reserve1 } = usePoolReserves()

  const assets = [
    { symbol: 'TKA', name: 'Token A', balance: tkaBalance, value: `$${(parseFloat(tkaBalance) * 1.2).toFixed(2)}`, change: '+3.2%', changePositive: true },
    { symbol: 'TKB', name: 'Token B', balance: tkbBalance, value: `$${(parseFloat(tkbBalance) * 0.8).toFixed(2)}`, change: '-1.1%', changePositive: false },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, value: `$${parseFloat(usdcBalance).toFixed(2)}`, change: '0.0%', changePositive: true },
    { symbol: 'DRT', name: 'DeFi Reward Token', balance: drtBalance, value: `$${(parseFloat(drtBalance) * 2.5).toFixed(2)}`, change: '+12.5%', changePositive: true },
  ]

  const liquidityPositions = [
    { 
      pair: 'TKA/TKB', 
      value: `$${(parseFloat(lpBalance) * 10).toFixed(2)}`, 
      share: lpBalance ? ((parseFloat(lpBalance) / (parseFloat(reserve0) + parseFloat(reserve1))) * 100).toFixed(3) + '%' : '0.000%', 
      earned: '$45.67' 
    },
  ]

  const stakingPositions = [
    { 
      pool: 'TKA/TKB LP', 
      staked: `${parseFloat(stakedAmount).toFixed(4)} LP`, 
      value: `$${(parseFloat(stakedAmount) * 10).toFixed(2)}`, 
      apr: '45.6%', 
      earned: `${parseFloat(pendingRewards).toFixed(4)} DRT` 
    },
  ]

  const transactions = [
    { type: 'Swap', description: 'Swapped 1.5 TKA for 1.2 TKB', time: '2 hours ago', status: 'success' },
    { type: 'Add Liquidity', description: 'Added TKA/TKB liquidity', time: '5 hours ago', status: 'success' },
    { type: 'Stake', description: `Staked ${parseFloat(stakedAmount).toFixed(2)} TKA/TKB LP`, time: '1 day ago', status: 'success' },
    { type: 'Harvest', description: `Harvested ${parseFloat(pendingRewards).toFixed(2)} DRT tokens`, time: '2 days ago', status: 'success' },
  ]

  const totalBalance = assets.reduce((sum, asset) => sum + parseFloat(asset.value.slice(1)), 0)
  const totalStakedValue = parseFloat(stakedAmount) * 10
  const totalEarned = parseFloat(pendingRewards)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard
        </h1>

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4">Connect your wallet to view your portfolio</h2>
            <p className="text-gray-500">Your dashboard will show real-time balances and positions once connected</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-gray-600 text-sm mb-2">Total Balance</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">${totalBalance.toFixed(2)}</div>
                <div className="text-gray-500 text-xs">Token Holdings</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-gray-600 text-sm mb-2">Liquidity Value</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">${(parseFloat(lpBalance) * 10).toFixed(2)}</div>
                <div className="text-blue-600 text-xs font-semibold">Active Pools</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-gray-600 text-sm mb-2">Staked Value</div>
                <div className="text-3xl font-bold text-green-600 mb-1">${totalStakedValue.toFixed(2)}</div>
                <div className="text-gray-500 text-xs">Earning rewards</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-gray-600 text-sm mb-2">Pending Rewards</div>
                <div className="text-3xl font-bold text-purple-600 mb-1">{totalEarned.toFixed(4)}</div>
                <div className="text-gray-500 text-xs">DRT tokens</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Assets</h2>
                  <div className="space-y-3">
                    {assets.map((asset, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                              {asset.symbol[0]}
                            </div>
                            <div>
                              <div className="text-gray-900 font-semibold">{asset.symbol}</div>
                              <div className="text-gray-500 text-sm">{asset.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-900 font-semibold">{asset.value}</div>
                            <div className="text-gray-600 text-sm">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</div>
                          </div>
                          <div className={`text-sm font-semibold ${asset.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                            {asset.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Liquidity Positions</h2>
                  <div className="space-y-3">
                    {liquidityPositions.map((position, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-900 font-semibold text-lg">{position.pair}</div>
                          <div className="text-gray-900 font-semibold">{position.value}</div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pool Share: {position.share}</span>
                          <span className="text-green-600 font-semibold">LP: {parseFloat(lpBalance).toFixed(4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {parseFloat(lpBalance) === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No liquidity positions found. Add liquidity to start earning fees.
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Staking Positions</h2>
                  <div className="space-y-3">
                    {stakingPositions.map((position, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-gray-900 font-semibold text-lg">{position.pool}</div>
                            <div className="text-gray-500 text-sm">{position.staked}</div>
                          </div>
                          <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {position.apr} APR
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Value: {position.value}</span>
                          <span className="text-green-600 font-semibold">Earned: {position.earned}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {parseFloat(stakedAmount) === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No staking positions found. Stake LP tokens to start earning rewards.
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                  <div className="space-y-4">
                    {transactions.map((tx, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-gray-900 font-semibold text-sm mb-1">{tx.type}</div>
                            <div className="text-gray-600 text-xs">{tx.description}</div>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full ml-2 mt-1"></div>
                        </div>
                        <div className="text-gray-500 text-xs">{tx.time}</div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 font-semibold py-3 rounded-lg transition-all">
                    View All Transactions
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}