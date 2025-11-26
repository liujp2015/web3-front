'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { FARM_ABI } from '@/lib/abis'
import { getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export function useFarm() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const farmAddress = getProtocolAddress(sepolia.id, 'FARM') as `0x${string}`

  const stake = async (amount: string, decimals: number = 18) => {
    try {
      const amountWei = parseUnits(amount, decimals)

      await writeContract({
        address: farmAddress,
        abi: FARM_ABI,
        functionName: 'stake',
        args: [amountWei],
      })
    } catch (err) {
      console.error('Stake failed:', err)
      throw err
    }
  }

  const unstake = async (amount: string, decimals: number = 18) => {
    try {
      const amountWei = parseUnits(amount, decimals)

      await writeContract({
        address: farmAddress,
        abi: FARM_ABI,
        functionName: 'unstake',
        args: [amountWei],
      })
    } catch (err) {
      console.error('Unstake failed:', err)
      throw err
    }
  }

  const harvest = async () => {
    try {
      await writeContract({
        address: farmAddress,
        abi: FARM_ABI,
        functionName: 'harvest',
      })
    } catch (err) {
      console.error('Harvest failed:', err)
      throw err
    }
  }

  return {
    stake,
    unstake,
    harvest,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useFarmData(userAddress: `0x${string}` | undefined) {
  const farmAddress = getProtocolAddress(sepolia.id, 'FARM') as `0x${string}`

  const { data: stakedAmount } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'stakedBalance',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const { data: pendingRewards } = useReadContract({
    address: farmAddress,
    abi: FARM_ABI,
    functionName: 'pendingRewards',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  return {
    stakedAmount: stakedAmount ? formatUnits(stakedAmount as bigint, 18) : '0',
    pendingRewards: pendingRewards ? formatUnits(pendingRewards as bigint, 18) : '0',
  }
}