'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { ERC20_ABI } from '@/lib/abis'

export function useTokenMint() {
  const { address } = useAccount()
  const [error, setError] = useState<string | null>(null)
  
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = async (tokenAddress: `0x${string}`, amount: string, decimals: number = 18) => {
    if (!address || !tokenAddress || !amount) {
      throw new Error('Missing required parameters')
    }

    try {
      setError(null)
      const amountInWei = parseUnits(amount, decimals)
      
      await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [amountInWei],
      })
    } catch (err) {
      console.error('Mint failed:', err)
      setError(err instanceof Error ? err.message : 'Mint failed')
      throw err
    }
  }

  return {
    mint,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || writeError?.message,
    hash
  }
}