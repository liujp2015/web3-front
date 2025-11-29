'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokenMint } from '@/hooks/useTokenMint'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { getTokenAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const [mintAmountUSDC, setMintAmountUSDC] = useState('')
  const [mintAmountTKA, setMintAmountTKA] = useState('')
  const [mintAmountTKB, setMintAmountTKB] = useState('')
  const [activeMint, setActiveMint] = useState<'USDC' | 'TKA' | 'TKB' | null>(null)

  const usdcAddress = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as `0x${string}` | undefined
  const tokenAAddress = getTokenAddress(sepolia.id, 'TKA') as `0x${string}` | undefined
  const tokenBAddress = getTokenAddress(sepolia.id, 'TKB') as `0x${string}` | undefined

  const { balance: usdcBalance, refetch: refetchUSDC } = useTokenBalance(usdcAddress, address)
  const { balance: tokenABalance, refetch: refetchTKA } = useTokenBalance(tokenAAddress, address)
  const { balance: tokenBBalance, refetch: refetchTKB } = useTokenBalance(tokenBAddress, address)

  const {
    mint,
    isPending: isMinting,
    isSuccess: isMintSuccess,
    hash
  } = useTokenMint()

  useEffect(() => {
    if (isMintSuccess) {
      console.log('✅ Mint successful!')
      
      // Clear the specific mint amount based on active mint
      if (activeMint === 'USDC') {
        setMintAmountUSDC('')
        setTimeout(() => refetchUSDC(), 1000)
      } else if (activeMint === 'TKA') {
        setMintAmountTKA('')
        setTimeout(() => refetchTKA(), 1000)
      } else if (activeMint === 'TKB') {
        setMintAmountTKB('')
        setTimeout(() => refetchTKB(), 1000)
      }

      setActiveMint(null)
    }
  }, [isMintSuccess, activeMint, refetchUSDC, refetchTKA, refetchTKB])

  const handleMintUSDC = async () => {
    if (!usdcAddress || !mintAmountUSDC) {
      console.error('Missing params:', { usdcAddress, mintAmountUSDC })
      return
    }
    
    setActiveMint('USDC')
    try {
      await mint(usdcAddress, mintAmountUSDC, 18)
    } catch (error) {
      console.error('Mint failed:', error)
      setActiveMint(null)
    }
  }

  const handleMintTKA = async () => {
    if (!tokenAAddress || !mintAmountTKA) {
      console.error('Missing params:', { tokenAAddress, mintAmountTKA })
      return
    }
    
    setActiveMint('TKA')
    try {
      await mint(tokenAAddress, mintAmountTKA, 18)
    } catch (error) {
      console.error('Mint failed:', error)
      setActiveMint(null)
    }
  }

  const handleMintTKB = async () => {
    if (!tokenBAddress || !mintAmountTKB) {
      console.error('Missing params:', { tokenBAddress, mintAmountTKB })
      return
    }
    
    setActiveMint('TKB')
    try {
      await mint(tokenBAddress, mintAmountTKB, 18)
    } catch (error) {
      console.error('Mint failed:', error)
      setActiveMint(null)
    }
  }

  const handleMaxAmount = (token: 'USDC' | 'TKA' | 'TKB') => {
    const maxAmount = '1000'
    if (token === 'USDC') setMintAmountUSDC(maxAmount)
    else if (token === 'TKA') setMintAmountTKA(maxAmount)
    else if (token === 'TKB') setMintAmountTKB(maxAmount)
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 lg:py-12">
      {/* Header */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">💎</div>
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Token Mint</h1>
        <p className="text-gray-600 text-base lg:text-lg px-4">
          Mint test tokens for development and testing
        </p>
      </div>

      {/* Balance Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl lg:text-3xl">💰</div>
            <div className="text-xs lg:text-sm opacity-90">USDC</div>
          </div>
          <div className="text-xl lg:text-2xl font-bold mb-1">
            {parseFloat(usdcBalance || '0').toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm opacity-75">Current Balance</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl lg:text-3xl">🔶</div>
            <div className="text-xs lg:text-sm opacity-90">TKA</div>
          </div>
          <div className="text-xl lg:text-2xl font-bold mb-1">
            {parseFloat(tokenABalance || '0').toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm opacity-75">Current Balance</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-4 lg:p-6 text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl lg:text-3xl">🔷</div>
            <div className="text-xs lg:text-sm opacity-90">TKB</div>
          </div>
          <div className="text-xl lg:text-2xl font-bold mb-1">
            {parseFloat(tokenBBalance || '0').toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm opacity-75">Current Balance</div>
        </div>
      </div>

      {!isConnected ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 text-center">
          <div className="text-4xl lg:text-6xl mb-4">🔗</div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6 px-4">
            Please connect your wallet to start minting tokens
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* USDC Mint Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200">
            <div className="text-center mb-4 lg:mb-6">
              <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">💰</div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Mint USDC</h3>
              <p className="text-gray-600 text-sm">Free USDC for testing</p>
            </div>

            <div className="mb-4 lg:mb-6">
              <div className="bg-gray-50 rounded-xl p-3 lg:p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-600 text-sm">Amount</label>
                  <button 
                    onClick={() => handleMaxAmount('USDC')}
                    className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
                  >
                    MAX (1000)
                  </button>
                </div>
                <input
                  type="number"
                  value={mintAmountUSDC}
                  onChange={(e) => setMintAmountUSDC(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-gray-900 text-lg lg:text-xl font-semibold focus:outline-none placeholder-gray-400"
                  max="1000"
                />
              </div>
            </div>

            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                🎁 Free USDC for testing! Max 1,000 per transaction.
              </p>
            </div>

            <button
              onClick={handleMintUSDC}
              disabled={
                isMinting ||
                !mintAmountUSDC ||
                parseFloat(mintAmountUSDC) <= 0 ||
                parseFloat(mintAmountUSDC) > 1000 ||
                activeMint === 'USDC'
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {activeMint === 'USDC' ? 'Minting...' : 'Mint USDC'}
            </button>
          </div>

          {/* TKA Mint Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200">
            <div className="text-center mb-4 lg:mb-6">
              <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">🔶</div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Mint TKA</h3>
              <p className="text-gray-600 text-sm">Token A for liquidity pools</p>
            </div>

            <div className="mb-4 lg:mb-6">
              <div className="bg-gray-50 rounded-xl p-3 lg:p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-600 text-sm">Amount</label>
                  <button 
                    onClick={() => handleMaxAmount('TKA')}
                    className="text-orange-600 text-sm font-semibold hover:text-orange-700 transition-colors"
                  >
                    MAX (1000)
                  </button>
                </div>
                <input
                  type="number"
                  value={mintAmountTKA}
                  onChange={(e) => setMintAmountTKA(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-gray-900 text-lg lg:text-xl font-semibold focus:outline-none placeholder-gray-400"
                  max="1000"
                />
              </div>
            </div>

            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm">
                🎁 Free Token A for testing! Max 1,000 per transaction.
              </p>
            </div>

            <button
              onClick={handleMintTKA}
              disabled={
                isMinting ||
                !mintAmountTKA ||
                parseFloat(mintAmountTKA) <= 0 ||
                parseFloat(mintAmountTKA) > 1000 ||
                activeMint === 'TKA'
              }
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {activeMint === 'TKA' ? 'Minting...' : 'Mint TKA'}
            </button>
          </div>

          {/* TKB Mint Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200">
            <div className="text-center mb-4 lg:mb-6">
              <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">🔷</div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Mint TKB</h3>
              <p className="text-gray-600 text-sm">Token B for liquidity pools</p>
            </div>

            <div className="mb-4 lg:mb-6">
              <div className="bg-gray-50 rounded-xl p-3 lg:p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-600 text-sm">Amount</label>
                  <button 
                    onClick={() => handleMaxAmount('TKB')}
                    className="text-cyan-600 text-sm font-semibold hover:text-cyan-700 transition-colors"
                  >
                    MAX (1000)
                  </button>
                </div>
                <input
                  type="number"
                  value={mintAmountTKB}
                  onChange={(e) => setMintAmountTKB(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-gray-900 text-lg lg:text-xl font-semibold focus:outline-none placeholder-gray-400"
                  max="1000"
                />
              </div>
            </div>

            <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-cyan-800 text-sm">
                🎁 Free Token B for testing! Max 1,000 per transaction.
              </p>
            </div>

            <button
              onClick={handleMintTKB}
              disabled={
                isMinting ||
                !mintAmountTKB ||
                parseFloat(mintAmountTKB) <= 0 ||
                parseFloat(mintAmountTKB) > 1000 ||
                activeMint === 'TKB'
              }
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {activeMint === 'TKB' ? 'Minting...' : 'Mint TKB'}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isMintSuccess && hash && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold mb-2">✅ Mint Successful!</p>
          <p className="text-green-700 text-sm mb-2">Your tokens have been minted successfully.</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View on Etherscan →
          </a>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 lg:mt-8 bg-gray-50 rounded-2xl p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Token Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💰 USDC</h4>
            <p className="text-gray-600">Stablecoin for payments and investing in projects</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🔶 Token A (TKA)</h4>
            <p className="text-gray-600">Used for liquidity provision and swapping</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🔷 Token B (TKB)</h4>
            <p className="text-gray-600">Paired with TKA for liquidity pools</p>
          </div>
        </div>
      </div>
    </div>
  )
}