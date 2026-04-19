import { NextRequest, NextResponse } from 'next/server'

// TODO: Connect to real Eloverblik API
// POST https://api.eloverblik.dk/customerapi/api/meterdata/gettimeseries/{dateFrom}/{dateTo}/{aggregation}
// Headers: Authorization: Bearer {data_access_token}
// Body: { "meteringPoints": { "meteringPoint": [process.env.ELOVERBLIK_METERING_CONSUMPTION] } }

// Mock data matching Eloverblik API response format
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
  const type = searchParams.get('type') || 'consumption' // 'consumption' | 'production'

  const refreshToken = process.env.ELOVERBLIK_REFRESH_TOKEN
  const meteringPoint = type === 'production'
    ? process.env.ELOVERBLIK_METERING_PRODUCTION
    : process.env.ELOVERBLIK_METERING_CONSUMPTION

  if (!refreshToken || refreshToken === 'your_token_here') {
    // Return mock data with "Simuleret" indicator
    return NextResponse.json({
      data: generateMockTimeSeries(dateFrom, dateTo),
      source: 'mock',
      meteringPoint,
      dateFrom,
      dateTo,
    })
  }

  try {
    // Step 1: Get data access token
    const tokenResponse = await fetch('https://api.eloverblik.dk/customerapi/api/token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Eloverblik token')
    }

    const tokenData = await tokenResponse.json()
    const dataToken = tokenData.result?.token

    if (!dataToken) {
      throw new Error('No data token received')
    }

    // Step 2: Fetch time series data
    // TODO: Implement actual time series fetch
    // const tsResponse = await fetch(
    //   `https://api.eloverblik.dk/customerapi/api/meterdata/gettimeseries/${dateFrom}/${dateTo}/Day`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${dataToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       meteringPoints: { meteringPoint: [meteringPoint] }
    //     }),
    //   }
    // )

    // For now return mock data even with token (until full implementation)
    return NextResponse.json({
      data: generateMockTimeSeries(dateFrom, dateTo),
      source: 'mock',
      meteringPoint,
      dateFrom,
      dateTo,
      note: 'Token obtained but time series fetch not yet implemented',
    })
  } catch (error) {
    console.error('Eloverblik timeseries error:', error)
    return NextResponse.json({
      data: generateMockTimeSeries(dateFrom, dateTo),
      source: 'mock',
      error: 'API fejl — viser simuleret data',
    })
  }
}
