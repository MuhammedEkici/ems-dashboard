import { NextResponse } from 'next/server'

export async function GET() {
  const refreshToken = process.env.ELOVERBLIK_REFRESH_TOKEN

  if (!refreshToken || refreshToken === 'your_token_here') {
    return NextResponse.json({
      token: null,
      source: 'mock',
      message: 'Refresh token ikke konfigureret'
    })
  }

  try {
    const response = await fetch('https://api.eloverblik.dk/customerapi/api/token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
      },
    })

    const rawData = await response.json()

    return NextResponse.json({
      source: 'live',
      status: response.status,
      rawData: rawData,
      token: rawData.result?.token ?? null,
    })

  } catch (error) {
    return NextResponse.json({
      source: 'error',
      message: String(error)
    })
  }
}