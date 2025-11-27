import { NextResponse } from 'next/server'

/**
 * GET /api/farm/stats
 * 
 * Returns farm statistics and pool information
 * 
 * Response fields:
 * - totalValueLocked: Total USD value locked across all pools (string)
 * - activeUsers: Number of active farming users (number)  
 * - pools: Array of farm pool objects
 *   - id: Pool ID (number)
 *   - name: Pool display name (string)
 *   - lpToken: LP token display name (string)
 *   - lpTokenAddress: LP token contract address (string)
 *   - apy: Annual Percentage Yield (number)
 *   - tvl: Pool Total Value Locked in USD (string)
 *   - active: Pool active status (boolean)
 * - source: Data source - "chain" or "mock" (string)
 * - timestamp: Response timestamp (string)
 */

// Generate mock farm data
function generateMockFarms() {
  return {
    totalValueLocked: '4500000', // $4.5M
    activeUsers: 1247,
    pools: [
      {
        id: 0,
        name: 'TKA-TKB LP Farm',
        lpToken: 'TKA-TKB LP',
        lpTokenAddress: process.env.NEXT_PUBLIC_SWAP_ADDRESS || '0x0000000000000000000000000000000000000000',
        apy: 45.6,
        tvl: '2500000', // $2.5M
        active: true
      },
      {
        id: 1, 
        name: 'TKA-USDC LP Farm',
        lpToken: 'TKA-USDC LP',
        lpTokenAddress: '0x0000000000000000000000000000000000000001',
        apy: 32.8,
        tvl: '1200000', // $1.2M
        active: true
      },
      {
        id: 2,
        name: 'TKB-USDC LP Farm', 
        lpToken: 'TKB-USDC LP',
        lpTokenAddress: '0x0000000000000000000000000000000000000002',
        apy: 28.5,
        tvl: '800000', // $0.8M
        active: true
      }
    ],
    source: 'mock',
    timestamp: new Date().toISOString()
  }
}

// Try to fetch from chain (placeholder for future implementation)
async function fetchChainFarms() {
  // TODO: Implement chain reading
  // const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA)
  // const farmContract = new Contract(process.env.NEXT_PUBLIC_FARM_ADDRESS, ABI, provider)
  // const poolCount = await farmContract.poolLength()
  // const farmData = await Promise.all([...])
  
  return null // Return null to fallback to mock data
}

export async function GET() {
  try {
    // Try to fetch from chain first
    const chainData = await fetchChainFarms()
    
    if (chainData) {
      return NextResponse.json(chainData)
    }
    
    // Fallback to mock data
    const mockData = generateMockFarms()
    return NextResponse.json(mockData)
    
  } catch (error) {
    console.error('Error fetching farm stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farm stats' },
      { status: 500 }
    )
  }
}