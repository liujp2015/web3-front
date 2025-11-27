'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { useRouter } from 'next/navigation'

export default function CreateSalePage() {
  const { address } = useAccount()
  const router = useRouter()

  const launchpadAddress = process.env.NEXT_PUBLIC_LAUNCHPAD_ADDRESS as `0x${string}` | undefined
  const paymentTokenAddress = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as `0x${string}` | undefined

  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    decimals: '18',
    totalSupply: '',
    saleAmount: '',
    price: '',
    startTime: '',
    endTime: '',
    minPurchase: '',
    maxPurchase: ''
  })

  const { data: createHash, writeContract: createSale, isPending: isCreating, error: createError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
    hash: createHash
  })

  const error = createError || confirmError

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!launchpadAddress || !address || !paymentTokenAddress) {
      alert('LaunchPad or Payment Token not configured')
      return
    }

    try {
      const totalSupplyWei = parseUnits(formData.totalSupply, parseInt(formData.decimals))
      const saleAmountWei = parseUnits(formData.saleAmount, parseInt(formData.decimals))
      const priceWei = parseUnits(formData.price, 18)
      const minPurchaseWei = parseUnits(formData.minPurchase, parseInt(formData.decimals))
      const maxPurchaseWei = parseUnits(formData.maxPurchase, parseInt(formData.decimals))

      const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000)
      const currentTimestamp = Math.floor(Date.now() / 1000)

      if (startTimestamp <= currentTimestamp) {
        alert('Start time must be in the future!')
        return
      }

      if (endTimestamp <= startTimestamp) {
        alert('End time must be after start time!')
        return
      }

      console.log('Creating sale with params:', {
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        decimals: parseInt(formData.decimals),
        totalSupply: totalSupplyWei.toString(),
        paymentToken: paymentTokenAddress,
        price: priceWei.toString(),
        saleAmount: saleAmountWei.toString(),
        startTime: startTimestamp,
        endTime: endTimestamp,
        minPurchase: minPurchaseWei.toString(),
        maxPurchase: maxPurchaseWei.toString()
      })

      createSale({
        address: launchpadAddress,
        abi: [
          {
            "inputs": [
              {"internalType": "string", "name": "_name", "type": "string"},
              {"internalType": "string", "name": "_symbol", "type": "string"},
              {"internalType": "uint8", "name": "_decimals", "type": "uint8"},
              {"internalType": "uint256", "name": "_initialSupply", "type": "uint256"},
              {"internalType": "address", "name": "_paymentToken", "type": "address"},
              {"internalType": "uint256", "name": "_price", "type": "uint256"},
              {"internalType": "uint256", "name": "_saleAmount", "type": "uint256"},
              {"internalType": "uint256", "name": "_startTime", "type": "uint256"},
              {"internalType": "uint256", "name": "_endTime", "type": "uint256"},
              {"internalType": "uint256", "name": "_minPurchase", "type": "uint256"},
              {"internalType": "uint256", "name": "_maxPurchase", "type": "uint256"}
            ],
            "name": "createTokenAndSale",
            "outputs": [
              {"internalType": "uint256", "name": "saleId", "type": "uint256"},
              {"internalType": "address", "name": "tokenAddress", "type": "address"}
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'createTokenAndSale',
        args: [
          formData.tokenName,
          formData.tokenSymbol,
          parseInt(formData.decimals),
          totalSupplyWei,
          paymentTokenAddress,
          priceWei,
          saleAmountWei,
          BigInt(startTimestamp),
          BigInt(endTimestamp),
          minPurchaseWei,
          maxPurchaseWei
        ],
        gas: 5000000n
      })
    } catch (error) {
      console.error('Error creating sale:', error)
      alert('Failed to create sale: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Connect Wallet</h2>
            <p className="text-gray-600">You need to connect your wallet to create a token sale</p>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">✅</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Sale Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your token has been deployed and sale has been created</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Transaction Hash</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${createHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {createHash}
              </a>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/launchpad')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                View All Projects
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Create New Project
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">🚀</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Launch Your Token
          </h1>
          <p className="text-xl text-gray-600">Deploy your ERC20 token and start your IDO in minutes</p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Auto Deploy</h3>
            <p className="text-sm text-gray-600">ERC20 token automatically deployed to blockchain</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Sale</h3>
            <p className="text-sm text-gray-600">Smart contract ensures safe token distribution</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-gray-900 mb-2">2% Fee Only</h3>
            <p className="text-sm text-gray-600">Low platform fee, high flexibility for creators</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-purple-200 to-blue-200">
              <div className="text-2xl mr-3">🪙</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Token Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Token Name *
                </label>
                <input
                  type="text"
                  name="tokenName"
                  value={formData.tokenName}
                  onChange={handleInputChange}
                  placeholder="e.g., My Awesome Token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  name="tokenSymbol"
                  value={formData.tokenSymbol}
                  onChange={handleInputChange}
                  placeholder="e.g., MAT"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Decimals *
                  </label>
                  <input
                    type="number"
                    name="decimals"
                    value={formData.decimals}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="0"
                    max="18"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Usually 18</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Supply *
                  </label>
                  <input
                    type="number"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    min="0"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-pink-200">
              <div className="text-2xl mr-3">⚙️</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Sale Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sale Amount *
                  </label>
                  <input
                    type="number"
                    name="saleAmount"
                    value={formData.saleAmount}
                    onChange={handleInputChange}
                    placeholder="500000"
                    min="0"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Tokens for sale</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (USDC) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.1"
                    min="0"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">USDC per token</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Purchase *
                  </label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="0"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Purchase *
                  </label>
                  <input
                    type="number"
                    name="maxPurchase"
                    value={formData.maxPurchase}
                    onChange={handleInputChange}
                    placeholder="10000"
                    min="0"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💎</div>
              <p className="text-sm text-yellow-900">
                <span className="font-bold text-base">Platform Fee:</span> Only 2% of total sale amount
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl">
              <p className="text-base font-bold text-red-800 mb-2 flex items-center">
                <span className="text-2xl mr-2">⚠️</span> Creation Failed
              </p>
              <p className="text-sm text-red-700 ml-8">
                {error.message || error.toString()}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isCreating || isConfirming}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none"
          >
            {isCreating || isConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Your Token Sale...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🚀</span>
                Launch Token Sale
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
