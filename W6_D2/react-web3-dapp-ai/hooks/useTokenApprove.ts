'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { ERC20_ABI } from '@/lib/abis'

export function useTokenApprove() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = async (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: string,
    decimals: number = 18
  ) => {
    try {
      const amountInWei = parseUnits(amount.toString(), decimals)

      await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, amountInWei],
      })
    } catch (err) {
      console.error('Approve failed:', err)
      throw err
    }
  }

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}