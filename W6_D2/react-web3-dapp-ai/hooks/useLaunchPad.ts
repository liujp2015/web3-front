'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits } from 'viem'
import { LAUNCHPAD_ABI } from '@/lib/abis'
import { getProtocolAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export function useLaunchPad() {
  const { address } = useAccount()
  const [error, setError] = useState<string | null>(null)
  
  const launchpadAddress = getProtocolAddress(sepolia.id, 'LAUNCHPAD') as `0x${string}` | undefined

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createProject = async (
    name: string,
    symbol: string, 
    targetAmount: string,
    pricePerToken: string,
    duration: number,
    description: string
  ) => {
    if (!address || !launchpadAddress) {
      throw new Error('Wallet not connected or LaunchPad not configured')
    }

    try {
      setError(null)
      const targetAmountWei = parseUnits(targetAmount, 18)
      const pricePerTokenWei = parseUnits(pricePerToken, 18)
      
      await writeContract({
        address: launchpadAddress,
        abi: LAUNCHPAD_ABI,
        functionName: 'createProject',
        args: [name, symbol, targetAmountWei, pricePerTokenWei, duration, description],
      })
    } catch (err) {
      console.error('Create project failed:', err)
      setError(err instanceof Error ? err.message : 'Create project failed')
      throw err
    }
  }

  const investInProject = async (projectId: number, amount: string) => {
    if (!address || !launchpadAddress) {
      throw new Error('Wallet not connected or LaunchPad not configured')
    }

    try {
      setError(null)
      const amountWei = parseUnits(amount, 18)
      
      await writeContract({
        address: launchpadAddress,
        abi: LAUNCHPAD_ABI,
        functionName: 'buy',
        args: [BigInt(projectId), amountWei],
      })
    } catch (err) {
      console.error('Investment failed:', err)
      setError(err instanceof Error ? err.message : 'Investment failed')
      throw err
    }
  }

  return {
    createProject,
    investInProject,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || writeError?.message,
    hash
  }
}

export function useLaunchPadData() {
  const launchpadAddress = getProtocolAddress(sepolia.id, 'LAUNCHPAD') as `0x${string}` | undefined

  const { data: projectCount } = useReadContract({
    address: launchpadAddress,
    abi: LAUNCHPAD_ABI,
    functionName: 'projectCount',
    query: {
      enabled: !!launchpadAddress,
    }
  })

  const getProject = (projectId: number) => {
    const { data: projectData } = useReadContract({
      address: launchpadAddress,
      abi: LAUNCHPAD_ABI,
      functionName: 'projects',
      args: [projectId],
      query: {
        enabled: !!launchpadAddress && projectId >= 0,
      }
    })

    return projectData
  }

  return {
    projectCount: projectCount ? Number(projectCount) : 0,
    getProject
  }
}