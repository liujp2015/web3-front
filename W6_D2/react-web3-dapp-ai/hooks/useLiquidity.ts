'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { STAKE_POOL_ABI } from '@/lib/abis'
import { getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export function useLiquidity() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const poolAddress = getProtocolAddress(sepolia.id, 'STAKE_POOL') as `0x${string}`

  const addLiquidity = async (
    amount0: string,
    amount1: string,
    decimals: number = 18
  ) => {
    try {
      const amount0Wei = parseUnits(amount0, decimals)
      const amount1Wei = parseUnits(amount1, decimals)

      await writeContract({
        address: poolAddress,
        abi: STAKE_POOL_ABI,
        functionName: 'addLiquidity',
        args: [amount0Wei, amount1Wei],
      })
    } catch (err) {
      console.error('Add liquidity failed:', err)
      throw err
    }
  }

  const removeLiquidity = async (
    lpAmount: string,
    decimals: number = 18
  ) => {
    try {
      const lpAmountWei = parseUnits(lpAmount, decimals)

      await writeContract({
        address: poolAddress,
        abi: STAKE_POOL_ABI,
        functionName: 'removeLiquidity',
        args: [lpAmountWei],
      })
    } catch (err) {
      console.error('Remove liquidity failed:', err)
      throw err
    }
  }

  return {
    addLiquidity,
    removeLiquidity,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function usePoolReserves() {
  const poolAddress = getProtocolAddress(sepolia.id, 'STAKE_POOL') as `0x${string}`

  const { data: reserves } = useReadContract({
    address: poolAddress,
    abi: STAKE_POOL_ABI,
    functionName: 'getReserves',
  })

  const reserve0 = reserves && Array.isArray(reserves) && reserves[0] 
    ? formatUnits(reserves[0] as bigint, 18) 
    : '0'
  const reserve1 = reserves && Array.isArray(reserves) && reserves[1] 
    ? formatUnits(reserves[1] as bigint, 18) 
    : '0'

  return {
    reserve0,
    reserve1,
  }
}