'use client'

import { useEffect, useRef, useState } from 'react'

interface LineChartEchartsProps {
  series?: Array<{
    name: string
    data: Array<[number, number]>
  }>
  xField?: string
  yField?: string
  height?: number
  title?: string
  yAxisFormatter?: string
  areaStyle?: boolean
  darkMode?: boolean
  smooth?: boolean
  customOptions?: any
}

export default function LineChartEcharts({
  series = [],
  xField = 'ts',
  yField = 'value',
  height = 400,
  title = '',
  yAxisFormatter = '{value}',
  areaStyle = true,
  darkMode = false,
  smooth = true,
  customOptions = {}
}: LineChartEchartsProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [echarts, setEcharts] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)

    import('echarts').then((module: any) => {
      setEcharts(module.default || module)
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isClient || !echarts || !chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, darkMode ? 'dark' : null)
    }

    const processedSeries = series.map((item, index) => {
      const colors = [
        'rgb(99, 102, 241)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(168, 85, 247)',
      ]

      return {
        name: item.name || `Series ${index + 1}`,
        type: 'line',
        data: item.data || [],
        smooth,
        lineStyle: {
          color: colors[index % colors.length],
          width: 2
        },
        itemStyle: {
          color: colors[index % colors.length]
        },
        areaStyle: areaStyle ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.3)')
              },
              {
                offset: 1,
                color: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.05)')
              }
            ]
          }
        } : undefined
      }
    })

    const option = {
      title: title ? {
        text: title,
        left: 'center',
        textStyle: {
          color: darkMode ? '#fff' : '#333',
          fontSize: 16,
          fontWeight: 'bold'
        }
      } : undefined,

      tooltip: {
        trigger: 'axis',
        backgroundColor: darkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: darkMode ? '#555' : '#ccc',
        textStyle: {
          color: darkMode ? '#fff' : '#333'
        },
        formatter: (params: any) => {
          if (!params || params.length === 0) return ''

          const date = new Date(params[0].data[0])
          let tooltip = `${date.toLocaleString()}<br/>`

          params.forEach((param: any) => {
            const value = param.data[1]
            const formattedValue = typeof value === 'number'
              ? value.toLocaleString(undefined, { maximumFractionDigits: 4 })
              : value

            tooltip += `
              <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>
              ${param.seriesName}: <strong>${formattedValue}</strong><br/>
            `
          })

          return tooltip
        }
      },

      legend: series.length > 1 ? {
        data: series.map((item, index) => item.name || `Series ${index + 1}`),
        top: title ? 35 : 10,
        textStyle: {
          color: darkMode ? '#fff' : '#333'
        }
      } : undefined,

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: series.length > 1 ? (title ? 65 : 40) : (title ? 45 : 20),
        containLabel: true
      },

      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: darkMode ? '#555' : '#ccc'
          }
        },
        axisLabel: {
          color: darkMode ? '#aaa' : '#666',
          formatter: (value: number) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: darkMode ? '#333' : '#f0f0f0'
          }
        }
      },

      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: darkMode ? '#aaa' : '#666',
          formatter: yAxisFormatter
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? '#333' : '#f0f0f0'
          }
        }
      },

      series: processedSeries,

      ...customOptions
    }

    chartInstance.current.setOption(option, true)

  }, [isClient, echarts, series, darkMode, title, yAxisFormatter, areaStyle, smooth, customOptions])

  useEffect(() => {
    if (!chartInstance.current) return

    let resizeTimer: NodeJS.Timeout | null = null

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)

      resizeTimer = setTimeout(() => {
        if (chartInstance.current) {
          chartInstance.current.resize()
        }
      }, 200)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [isClient, echarts])

  if (!isClient) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="flex items-center justify-center bg-gray-50 rounded-lg"
      >
        <div className="text-gray-400">Loading chart...</div>
      </div>
    )
  }

  return (
    <div
      ref={chartRef}
      style={{ height: `${height}px`, width: '100%' }}
    />
  )
}

export function transformDataForEcharts(data: any[], xField = 'ts', yField = 'value'): Array<[number, number]> {
  if (!Array.isArray(data)) return []

  return data.map(item => [
    item[xField],
    item[yField]
  ])
}

export function filterDataByDays(data: any[], days: number): any[] {
  if (!Array.isArray(data) || data.length === 0) return []

  const now = Date.now()
  const cutoffTime = now - (days * 24 * 60 * 60 * 1000)

  return data.filter(item => {
    const timestamp = Array.isArray(item) ? item[0] : item.ts
    return timestamp >= cutoffTime
  })
}

export function generateMockData(days = 7, baseValue = 100, variance = 10): Array<[number, number]> {
  const data: Array<[number, number]> = []
  const now = Date.now()
  const interval = (days * 24 * 60 * 60 * 1000) / 100

  for (let i = 0; i < 100; i++) {
    const ts = now - ((99 - i) * interval)
    const randomChange = (Math.random() - 0.5) * variance
    const value = baseValue + randomChange + Math.sin(i * 0.2) * (variance / 2)

    data.push([ts, parseFloat(value.toFixed(4))])
  }

  return data
}
