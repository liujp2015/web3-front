'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import LineChartEcharts, { transformDataForEcharts, filterDataByDays, generateMockData } from '@/components/charts/LineChartEcharts'

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

const FARM_ABI = [
  {
    name: 'userInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'address' }
    ],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'rewardDebt', type: 'uint256' }
    ]
  },
  {
    name: 'pendingReward',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'user', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [poolsData, setPoolsData] = useState<any>(null)
  const [farmData, setFarmData] = useState<any>(null)
  const [priceData, setPriceData] = useState<any>(null)
  const [priceDays, setPriceDays] = useState(7)
  const [apyDays, setApyDays] = useState(30)

  const swapAddress = process.env.NEXT_PUBLIC_SWAP_ADDRESS as `0x${string}` | undefined
  const farmAddress = process.env.NEXT_PUBLIC_FARM_ADDRESS as `0x${string}` | undefined

  // Read token balances
  const { data: balanceTKA } = useReadContract({
    address: process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  const { data: balanceTKB } = useReadContract({
    address: process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  const { data: balanceUSDC } = useReadContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  // Read LP Token balance
  const { data: lpBalance } = useReadContract({
    address: swapAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && swapAddress)
    }
  })

  // Read Farm Pool data
  const { data: farmPool0 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'userInfo',
    args: address ? [0n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  const { data: farmPool1 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'userInfo',
    args: address ? [1n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  const { data: farmPool2 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'userInfo',
    args: address ? [2n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  // Read pending rewards
  const { data: pendingPool0 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'pendingReward',
    args: address ? [0n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  const { data: pendingPool1 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'pendingReward',
    args: address ? [1n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  const { data: pendingPool2 } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'pendingReward',
    args: address ? [2n, address] : undefined,
    query: {
      enabled: Boolean(address && farmAddress)
    }
  })

  // Calculate totals
  const tkaBalance = balanceTKA ? formatUnits(balanceTKA, 18) : '0'
  const tkbBalance = balanceTKB ? formatUnits(balanceTKB, 18) : '0'
  const usdcBalance = balanceUSDC ? formatUnits(balanceUSDC, 18) : '0'
  const totalLPHoldings = lpBalance ? formatUnits(lpBalance, 18) : '0'

  const totalStaked = [farmPool0, farmPool1, farmPool2].reduce((sum, pool) => {
    if (!pool || !Array.isArray(pool)) return sum
    return sum + Number(formatUnits(pool[0] as bigint, 18))
  }, 0)

  const totalPendingRewards = [pendingPool0, pendingPool1, pendingPool2].reduce((sum, pending) => {
    if (!pending) return sum
    return sum + Number(formatUnits(pending as bigint, 18))
  }, 0)

  // Fetch API data
  useEffect(() => {
    fetch('/api/token/price')
      .then(res => res.json())
      .then(data => setPriceData(data))
      .catch(console.error)

    fetch('/api/stake/pools')
      .then(res => res.json())
      .then(data => setPoolsData(data))
      .catch(console.error)

    fetch('/api/farm/stats')
      .then(res => res.json())
      .then(data => setFarmData(data))
      .catch(console.error)
  }, [])

  const priceChartData = priceData?.series
    ? filterDataByDays(
        transformDataForEcharts(priceData.series, 'ts', 'price'),
        priceDays
      )
    : generateMockData(priceDays, 1.5, 0.2)

  const tvlChartData = poolsData?.pools?.[0]?.history && Array.isArray(poolsData.pools[0].history) && poolsData.pools[0].history.length > 0
    ? [{
        name: 'Total TVL',
        data: transformDataForEcharts(
          poolsData.pools[0].history,
          'ts',
          'tvl'
        )
      }]
    : [{ name: 'Total TVL', data: generateMockData(30, 1000000, 50000) }]

  const apyChartSeries = farmData?.apyHistory
    ? [
        {
          name: 'Pool 0',
          data: filterDataByDays(
            farmData.apyHistory
              .filter((item: any) => item.poolId === 0)
              .map((item: any) => [item.ts, item.apy]),
            apyDays
          )
        },
        {
          name: 'Pool 1',
          data: filterDataByDays(
            farmData.apyHistory
              .filter((item: any) => item.poolId === 1)
              .map((item: any) => [item.ts, item.apy]),
            apyDays
          )
        },
        {
          name: 'Pool 2',
          data: filterDataByDays(
            farmData.apyHistory
              .filter((item: any) => item.poolId === 2)
              .map((item: any) => [item.ts, item.apy]),
            apyDays
          )
        }
      ]
    : [
        { name: 'Pool 0', data: generateMockData(apyDays, 45, 5) },
        { name: 'Pool 1', data: generateMockData(apyDays, 35, 4) },
        { name: 'Pool 2', data: generateMockData(apyDays, 55, 6) }
      ]

  const assets = [
    { symbol: 'TKA', name: 'Token A', balance: tkaBalance, value: `$${(parseFloat(tkaBalance) * 1.2).toFixed(2)}`, change: '+3.2%', changePositive: true },
    { symbol: 'TKB', name: 'Token B', balance: tkbBalance, value: `$${(parseFloat(tkbBalance) * 0.8).toFixed(2)}`, change: '-1.1%', changePositive: false },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, value: `$${parseFloat(usdcBalance).toFixed(2)}`, change: '0.0%', changePositive: true },
  ]

  const liquidityPositions = [
    { 
      pair: 'TKA/TKB', 
      value: `$${(parseFloat(totalLPHoldings) * 10).toFixed(2)}`, 
      share: '0.000%', 
      earned: '$45.67' 
    },
  ]

  const stakingPositions = [
    { 
      pool: 'TKA/TKB LP', 
      staked: `${totalStaked.toFixed(4)} LP`, 
      value: `$${(totalStaked * 10).toFixed(2)}`, 
      apr: '45.6%', 
      earned: `${totalPendingRewards.toFixed(4)} DRT` 
    },
  ]

  const transactions = [
    { type: 'Swap', description: 'Swapped 1.5 TKA for 1.2 TKB', time: '2 hours ago', status: 'success' },
    { type: 'Add Liquidity', description: 'Added TKA/TKB liquidity', time: '5 hours ago', status: 'success' },
    { type: 'Stake', description: `Staked ${totalStaked.toFixed(2)} TKA/TKB LP`, time: '1 day ago', status: 'success' },
    { type: 'Harvest', description: `Harvested ${totalPendingRewards.toFixed(2)} DRT tokens`, time: '2 days ago', status: 'success' },
  ]

  const totalBalance = assets.reduce((sum, asset) => sum + parseFloat(asset.value.slice(1)), 0)
  const totalStakedValue = totalStaked * 10
  const totalEarned = totalPendingRewards

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
                <div className="text-3xl font-bold text-gray-900 mb-1">${(parseFloat(totalLPHoldings) * 10).toFixed(2)}</div>
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Token Price</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPriceDays(7)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          priceDays === 7
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        7天
                      </button>
                      <button
                        onClick={() => setPriceDays(30)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          priceDays === 30
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        30天
                      </button>
                    </div>
                  </div>
                  <LineChartEcharts
                    series={[{ name: 'Price', data: priceChartData }]}
                    height={300}
                    yAxisFormatter="${value}"
                    areaStyle={true}
                    smooth={true}
                  />
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
                          <span className="text-green-600 font-semibold">LP: {parseFloat(totalLPHoldings).toFixed(4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {parseFloat(totalLPHoldings) === 0 && (
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
                  {totalStaked === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No staking positions found. Stake LP tokens to start earning rewards.
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Farm APY History</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setApyDays(7)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          apyDays === 7
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        7天
                      </button>
                      <button
                        onClick={() => setApyDays(30)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          apyDays === 30
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        30天
                      </button>
                    </div>
                  </div>
                  <LineChartEcharts
                    series={apyChartSeries}
                    height={350}
                    yAxisFormatter="{value}%"
                    areaStyle={false}
                    smooth={true}
                  />
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

                  <button 
                    onClick={() => window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')}
                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 font-semibold py-3 rounded-lg transition-all"
                  >
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