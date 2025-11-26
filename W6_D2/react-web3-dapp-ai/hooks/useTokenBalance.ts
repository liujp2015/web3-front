'use client'

import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { ERC20_ABI } from '@/lib/abis'

export function useTokenBalance(
  tokenAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined
) {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
    }
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    }
  })

  const formattedBalance = balance && decimals
    ? formatUnits(balance as bigint, decimals as number)
    : '0'

  return {
    balance: formattedBalance,
    rawBalance: balance as bigint | undefined,
    decimals: decimals as number | undefined,
    isLoading,
    refetch,
  }
}

export function useTokenAllowance(
  tokenAddress: `0x${string}` | undefined,
  ownerAddress: `0x${string}` | undefined,
  spenderAddress: `0x${string}` | undefined
) {
  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    }
  })

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  }
}