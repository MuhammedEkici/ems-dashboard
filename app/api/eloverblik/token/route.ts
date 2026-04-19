import { NextResponse } from 'next/server'

// TODO: Connect to real Eloverblik API
// POST https://api.eloverblik.dk/customerapi/api/token
// Body: { "refreshToken": process.env.ELOVERBLIK_REFRESH_TOKEN }
// Returns: { "result": { "token": "..." } }

export async function GET() {
  const refreshToken = process.env.ELOVERBLIK_REFRESH_TOKEN

  if (!refreshToken || refreshToken === 'your_token_here') {
    return NextResponse.json({
      token: null,
      source: 'mock',
      message: 'Eloverblik refresh token ikke konfigureret i .env.local'
    })
  }

  try {
    const response = await fetch('https://api.eloverblik.dk/customerapi/api/token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Eloverblik token error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ token: data.result?.token, source: 'live' })
  } catch (error) {
    console.error('Eloverblik token error:', error)
    return NextResponse.json({
      token: null,
      source: 'mock',
      message: 'Kunne ikke hente Eloverblik token'
    })
  }
}
