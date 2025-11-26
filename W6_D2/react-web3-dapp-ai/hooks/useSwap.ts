'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { SWAP_ABI } from '@/lib/abis'
import { getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export function useSwap() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const swapAddress = getProtocolAddress(sepolia.id, 'SWAP') as `0x${string}`

  const swap = async (
    token0Address: `0x${string}`,
    token1Address: `0x${string}`,
    amountIn: string,
    amountOutMin: string = '0',
    decimals: number = 18
  ) => {
    try {
      const amountInWei = parseUnits(amountIn, decimals)
      const amountOutMinWei = parseUnits(amountOutMin, decimals)

      await writeContract({
        address: swapAddress,
        abi: SWAP_ABI,
        functionName: 'swap',
        args: [token0Address, token1Address, amountInWei, amountOutMinWei],
      })
    } catch (err) {
      console.error('Swap failed:', err)
      throw err
    }
  }

  return {
    swap,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useGetSwapAmount(
  token0Address: `0x${string}` | undefined,
  token1Address: `0x${string}` | undefined,
  amountIn: string
) {
  const swapAddress = getProtocolAddress(sepolia.id, 'SWAP') as `0x${string}`

  const { data: amountOut, isLoading } = useReadContract({
    address: swapAddress,
    abi: SWAP_ABI,
    functionName: 'getAmountOut',
    args: token0Address && token1Address && amountIn 
      ? [token0Address, token1Address, parseUnits(amountIn, 18)]
      : undefined,
    query: {
      enabled: !!token0Address && !!token1Address && !!amountIn && parseFloat(amountIn) > 0,
    }
  })

  return {
    amountOut: amountOut ? formatUnits(amountOut as bigint, 18) : '0',
    isLoading,
  }
}