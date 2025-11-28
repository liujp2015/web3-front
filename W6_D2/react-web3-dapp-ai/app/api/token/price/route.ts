import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const now = Date.now()
    const series = []
    const basePrice = 1.5

    for (let i = 24; i >= 0; i--) {
      const ts = now - (i * 60 * 60 * 1000)
      const variation = Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * 0.05
      const price = basePrice + variation
      series.push({
        ts,
        price: parseFloat(price.toFixed(4))
      })
    }

    const currentPrice = series[series.length - 1].price
    const price24hAgo = series[0].price
    const change24h = ((currentPrice - price24hAgo) / price24hAgo) * 100

    const data = {
      price: currentPrice,
      symbol: 'DRT',
      change24h: parseFloat(change24h.toFixed(2)),
      series,
      source: 'mock',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching token price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token price' },
      { status: 500 }
    )
  }
}
