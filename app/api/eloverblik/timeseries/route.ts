import { NextRequest, NextResponse } from 'next/server'

const generateMockTimeSeries = (dateFrom: string, dateTo: string) => {
  const data = []
  const start = new Date(dateFrom)
  const end = new Date(dateTo)
  const current = new Date(start)
  while (current <= end) {
    data.push({
      timestamp: current.toISOString(),
      kwh_consumed: Math.round((30 + Math.random() * 20) * 10) / 10,
      kwh_produced: Math.round((5 + Math.random() * 15) * 10) / 10,
      price_dkk: Math.round((60 + Math.random() * 40) * 10) / 10,
    })
    current.setDate(current.getDate() + 1)
  }
  return data
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateFrom = searchParams.get('from') || '2024-01-01'
  const dateTo = searchParams.get('to') || '2024-12-31'
  const type = searchParams.get('type') || 'consumption'

  const refreshToken = process.env.ELOVERBLIK_REFRESH_TOKEN
  const meteringPoint = type === 'production'
    ? process.env.ELOVERBLIK_METERING_PRODUCTION
    : process.env.ELOVERBLIK_METERING_CONSUMPTION

  if (!refreshToken || refreshToken === 'your_token_here') {
    return NextResponse.json({
      data: generateMockTimeSeries(dateFrom, dateTo),
      source: 'mock',
      message: 'Refresh token ikke konfigureret',
    })
  }

  try {
    // Step 1: Get data access token
    const tokenResponse = await fetch('https://api.eloverblik.dk/customerapi/api/token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
      },
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token fejl: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const dataToken = typeof tokenData.result === 'string' 
      ? tokenData.result 
      : tokenData.result?.token

    if (!dataToken) {
      throw new Error('Ingen data token modtaget')
    }

    // Step 2: Fetch time series data
    const tsResponse = await fetch(
      `https://api.eloverblik.dk/customerapi/api/meterdata/gettimeseries/${dateFrom}/${dateTo}/Day`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dataToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          meteringPoints: {
            meteringPoint: [meteringPoint]
          }
        }),
      }
    )

    if (!tsResponse.ok) {
      throw new Error(`Timeseries fejl: ${tsResponse.status}`)
    }

    const tsData = await tsResponse.json()

    // Parse Eloverblik response format
    const timeSeries = tsData.result?.[0]?.MyEnergyData_MarketDocument?.TimeSeries
    if (!timeSeries || timeSeries.length === 0) {
      throw new Error('Ingen data i response')
    }

    const data = timeSeries[0]?.Period?.flatMap((period: any) => {
      const startTime = new Date(period.timeInterval?.start)
      return period.Point?.map((point: any, index: number) => {
        const timestamp = new Date(startTime)
        timestamp.setDate(timestamp.getDate() + index)
        return {
          timestamp: timestamp.toISOString(),
          kwh_consumed: type === 'consumption' ? parseFloat(point['out_Quantity.quantity'] || point.quantity || 0) : 0,
          kwh_produced: type === 'production' ? parseFloat(point['out_Quantity.quantity'] || point.quantity || 0) : 0,
          price_dkk: 0,
        }
      }) || []
    }) || []

    return NextResponse.json({
      data,
      source: 'live',
      meteringPoint,
      dateFrom,
      dateTo,
    })

  } catch (error) {
    console.error('Eloverblik timeseries error:', error)
    return NextResponse.json({
      data: generateMockTimeSeries(dateFrom, dateTo),
      source: 'mock',
      error: `API fejl: ${error instanceof Error ? error.message : 'Ukendt fejl'}`,
    })
  }
}