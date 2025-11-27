import { NextRequest, NextResponse } from 'next/server'

/**
 * Bridge Transfer API
 * 
 * POST /api/bridge/transfer - Submit a cross-chain transfer
 * GET /api/bridge/transfer?transferId=xxx - Query transfer status
 */

// Mock transfer storage (in production, use database)
const transfers = new Map()

// Mock transfer processing simulation
function simulateTransferProgress(transferId: string) {
  setTimeout(() => {
    const transfer = transfers.get(transferId)
    if (transfer && transfer.status === 'queued') {
      transfer.status = 'inflight'
      transfer.progress = 30
      transfers.set(transferId, transfer)
    }
  }, 2000) // 2 seconds to inflight

  setTimeout(() => {
    const transfer = transfers.get(transferId)
    if (transfer && transfer.status === 'inflight') {
      transfer.status = 'complete'
      transfer.progress = 100
      transfers.set(transferId, transfer)
    }
  }, 8000) // 8 seconds total to complete
}

function generateTransferId() {
  return 'tx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function calculateFee(amount: string, token: string) {
  const amountNum = parseFloat(amount)
  // 0.5% fee with minimum $1
  const fee = Math.max(amountNum * 0.005, 1)
  return fee.toFixed(6)
}

function estimateTime(sourceChain: string, targetChain: string) {
  // Mock time estimation based on chains
  const timeMap: Record<string, number> = {
    'Ethereum': 15,
    'Sepolia': 5,
    'Polygon': 2,
    'Arbitrum': 8,
    'Optimism': 8,
    'BSC': 3
  }
  
  const sourceTime = timeMap[sourceChain] || 10
  const targetTime = timeMap[targetChain] || 10
  
  return Math.ceil((sourceTime + targetTime) / 2)
}

export async function POST(request: NextRequest) {
  try {
    const { sourceChain, targetChain, token, amount, recipient } = await request.json()

    // Validation
    if (!sourceChain || !targetChain || !token || !amount || !recipient) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (sourceChain === targetChain) {
      return NextResponse.json(
        { success: false, error: 'Source and target chains cannot be the same' },
        { status: 400 }
      )
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipient address' },
        { status: 400 }
      )
    }

    // Create transfer record
    const transferId = generateTransferId()
    const fee = calculateFee(amount, token)
    const estimatedTime = estimateTime(sourceChain, targetChain)

    const transfer = {
      transferId,
      sourceChain,
      targetChain,
      token,
      amount,
      recipient,
      fee,
      estimatedTime,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString()
    }

    // Store transfer
    transfers.set(transferId, transfer)

    // Start simulation
    simulateTransferProgress(transferId)

    return NextResponse.json({
      success: true,
      ...transfer
    })

  } catch (error) {
    console.error('Bridge transfer error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transferId = searchParams.get('transferId')

    if (!transferId) {
      return NextResponse.json(
        { success: false, error: 'Transfer ID is required' },
        { status: 400 }
      )
    }

    const transfer = transfers.get(transferId)

    if (!transfer) {
      return NextResponse.json(
        { success: false, error: 'Transfer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ...transfer
    })

  } catch (error) {
    console.error('Bridge query error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}