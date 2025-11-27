'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import ApproveButton from '@/components/ApproveButton'
import { getProtocolAddress } from '@/lib/constants'
import { FARM_ABI, ERC20_ABI } from '@/lib/abis'

// Farm pool component for each individual pool
function FarmPoolCard({ pool, farmAddress, userAddress, isMockMode, chainId }) {
  const [amount, setAmount] = useState('')
  const [activeTab, setActiveTab] = useState('deposit') // 'deposit' or 'withdraw'

  // Read user info from chain
  const { data: userInfo } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'userInfo',
    args: userAddress && pool.id !== undefined ? [BigInt(pool.id), userAddress] : undefined,
    query: {
      enabled: Boolean(farmAddress && userAddress && pool.id !== undefined && farmAddress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Read pending rewards
  const { data: pendingReward } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'pendingReward',
    args: userAddress && pool.id !== undefined ? [BigInt(pool.id), userAddress] : undefined,
    query: {
      enabled: Boolean(farmAddress && userAddress && pool.id !== undefined && farmAddress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Read user LP token balance
  const { data: lpBalance } = useReadContract({
    address: pool.lpTokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: Boolean(pool.lpTokenAddress && userAddress && pool.lpTokenAddress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Deposit transaction
  const { data: depositHash, writeContract: deposit, isPending: isDepositing } = useWriteContract()
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash
  })

  // Withdraw transaction
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawing } = useWriteContract()
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash
  })

  // Harvest transaction
  const { data: harvestHash, writeContract: harvest, isPending: isHarvesting } = useWriteContract()
  const { isLoading: isHarvestConfirming, isSuccess: isHarvestSuccess } = useWaitForTransactionReceipt({
    hash: harvestHash
  })

  const userStaked = userInfo ? formatUnits(userInfo[0], 18).slice(0, 8) : '0'
  const userPending = pendingReward ? formatUnits(pendingReward, 18).slice(0, 8) : '0'
  const userLpBalance = lpBalance ? formatUnits(lpBalance, 18).slice(0, 8) : '0'

  const handleDeposit = () => {
    if (!farmAddress || !amount || pool.id === undefined) return
    const amountWei = parseUnits(amount, 18)
    deposit({
      address: farmAddress,
      abi: FARM_ABI,
      functionName: 'deposit',
      args: [BigInt(pool.id), amountWei]
    })
  }

  const handleWithdraw = () => {
    if (!farmAddress || !amount || pool.id === undefined) return
    const amountWei = parseUnits(amount, 18)
    withdraw({
      address: farmAddress,
      abi: FARM_ABI,
      functionName: 'withdraw',
      args: [BigInt(pool.id), amountWei]
    })
  }

  const handleHarvest = () => {
    if (!farmAddress || pool.id === undefined) return
    harvest({
      address: farmAddress,
      abi: FARM_ABI,
      functionName: 'harvest',
      args: [BigInt(pool.id)]
    })
  }

  const handleMax = () => {
    if (activeTab === 'deposit') {
      setAmount(userLpBalance)
    } else {
      setAmount(userStaked)
    }
  }

  const formatUSD = (value) => {
    const num = parseFloat(value)
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`
    }
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 transition-all mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{pool.name}</h3>
          <div className="text-gray-500 text-sm">{pool.lpToken}</div>
        </div>
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold">
          {pool.apy.toFixed(1)}% APY
        </div>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-gray-600 text-xs mb-1">TVL</div>
          <div className="text-lg font-semibold text-blue-600">{formatUSD(pool.tvl)}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="text-gray-600 text-xs mb-1">Your Staked</div>
          <div className="text-lg font-semibold text-green-600">{userStaked} LP</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="text-gray-600 text-xs mb-1">LP Balance</div>
          <div className="text-lg font-semibold text-purple-600">{userLpBalance} LP</div>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-sm mb-1">Pending Rewards</div>
            <div className="text-2xl font-bold text-orange-600">{userPending} DRT</div>
          </div>
          {!isMockMode ? (
            <button
              onClick={handleHarvest}
              disabled={isHarvesting || isHarvestConfirming || parseFloat(userPending) === 0}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isHarvesting || isHarvestConfirming ? 'Harvesting...' : 'Harvest'}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Harvest (Mock)
            </button>
          )}
        </div>
      </div>

      {/* Harvest Success */}
      {isHarvestSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-semibold">Harvest Successful!</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${harvestHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View on Etherscan →
          </a>
        </div>
      )}

      {/* Deposit/Withdraw Tabs */}
      <div className="border-t pt-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'deposit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'withdraw'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-600">
                {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
              </label>
              <button onClick={handleMax} className="text-sm text-blue-600 hover:text-blue-700">
                Balance: {activeTab === 'deposit' ? userLpBalance : userStaked}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 text-xl font-semibold bg-transparent outline-none placeholder-gray-400"
              />
              <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 font-semibold text-sm">
                LP
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!userAddress ? (
          <button className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed">
            Connect Wallet
          </button>
        ) : isMockMode ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed"
          >
            {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} (Mock Mode - Contract Not Deployed)
          </button>
        ) : activeTab === 'deposit' ? (
          <ApproveButton
            tokenAddress={pool.lpTokenAddress}
            spenderAddress={farmAddress}
            amount={amount ? parseUnits(amount, 18) : 0n}
            disabled={!amount || isDepositing || isDepositConfirming}
          >
            <button
              onClick={handleDeposit}
              disabled={!amount || isDepositing || isDepositConfirming}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isDepositing || isDepositConfirming ? 'Depositing...' : 'Deposit'}
            </button>
          </ApproveButton>
        ) : (
          <button
            onClick={handleWithdraw}
            disabled={!amount || isWithdrawing || isWithdrawConfirming}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isWithdrawing || isWithdrawConfirming ? 'Withdrawing...' : 'Withdraw'}
          </button>
        )}

        {/* Transaction Success Messages */}
        {isDepositSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">Deposit Successful!</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${depositHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View on Etherscan →
            </a>
          </div>
        )}

        {isWithdrawSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">Withdraw Successful!</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${withdrawHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View on Etherscan →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FarmPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const farmAddress = getProtocolAddress(chainId, 'FARM')

  // State
  const [farmData, setFarmData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMockMode, setIsMockMode] = useState(false)

  // Fetch farm data from API
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetch('/api/farm/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch farm data')
        return res.json()
      })
      .then(data => {
        setFarmData(data)
        // Check if using mock mode - only set to true if contract not deployed
        if (!farmAddress) {
          setIsMockMode(true)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching farm data:', err)
        setError(err.message)
        setIsLoading(false)
      })
  }, [farmAddress])

  const formatUSD = (value) => {
    const num = parseFloat(value)
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`
    }
    return `$${num.toLocaleString()}`
  }

  const formatNumber = (value) => {
    return value.toLocaleString()
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🌾</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Yield Farms</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading farm pools...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🌾</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Yield Farms</h1>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-semibold text-gray-800 mb-2">Error Loading Farm Data</p>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty State
  if (!farmData || !farmData.pools || farmData.pools.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🌾</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Yield Farms</h1>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-xl font-semibold text-gray-800 mb-2">No Farm Pools Available</p>
              <p className="text-gray-600">Check back later for farming opportunities</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-3">🌾</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Yield Farms</h1>
          <p className="text-gray-600 text-lg">
            Stake LP tokens to earn DRT rewards
          </p>
        </div>

        {/* Mock Mode Warning */}
        {isMockMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800">Mock Mode Active</p>
                <p className="text-sm text-yellow-700">
                  Farm contract not deployed or unavailable. Displaying simulated data. Transactions are disabled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Total Value Locked</div>
            <div className="text-3xl font-bold">
              {formatUSD(farmData.totalValueLocked)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Active Farms</div>
            <div className="text-3xl font-bold">
              {farmData.pools.length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Active Users</div>
            <div className="text-3xl font-bold">
              {formatNumber(farmData.activeUsers)}
            </div>
          </div>
        </div>

        {/* Farm Pools */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Available Pools</h2>
          {farmData.pools.map((pool, index) => (
            <FarmPoolCard
              key={pool.id !== undefined ? pool.id : `pool-${index}`}
              pool={pool}
              farmAddress={farmAddress}
              userAddress={address}
              isMockMode={isMockMode}
              chainId={chainId}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-4">How Farming Works</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Deposit LP tokens to start earning DRT rewards
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Rewards are calculated based on your share of the pool
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Harvest rewards at any time without unstaking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Withdraw your LP tokens anytime (rewards auto-harvest)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              Higher APY pools may have higher risk or lower liquidity
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}