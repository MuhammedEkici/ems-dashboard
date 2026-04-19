import { NextRequest, NextResponse } from 'next/server'

// DMI Climate API — Heating Degree Days for Ringsted (municipality 0329)
// Docs: https://www.dmi.dk/friedata/dokumentation/apis
// Base URL: https://dmigw.govcloud.dk/v2/climateData/collections/municipalityValue/items

const mockHeatingDegreeDays = [
  { year: 2024, month: 1, value: 312, label: 'Januar 2024' },
  { year: 2024, month: 2, value: 278, label: 'Februar 2024' },
  { year: 2024, month: 3, value: 198, label: 'Marts 2024' },
  { year: 2024, month: 4, value: 98, label: 'April 2024' },
  { year: 2024, month: 5, value: 32, label: 'Maj 2024' },
  { year: 2024, month: 6, value: 8, label: 'Juni 2024' },
  { year: 2024, month: 7, value: 4, label: 'Juli 2024' },
  { year: 2024, month: 8, value: 12, label: 'August 2024' },
  { year: 2024, month: 9, value: 68, label: 'September 2024' },
  { year: 2024, month: 10, value: 158, label: 'Oktober 2024' },
  { year: 2024, month: 11, value: 248, label: 'November 2024' },
  { year: 2024, month: 12, value: 298, label: 'December 2024' },
  { year: 2023, month: 1, value: 325, label: 'Januar 2023' },
  { year: 2023, month: 2, value: 290, label: 'Februar 2023' },
  { year: 2023, month: 3, value: 210, label: 'Marts 2023' },
  { year: 2023, month: 4, value: 105, label: 'April 2023' },
  { year: 2023, month: 5, value: 38, label: 'Maj 2023' },
  { year: 2023, month: 6, value: 10, label: 'Juni 2023' },
  { year: 2023, month: 7, value: 5, label: 'Juli 2023' },
  { year: 2023, month: 8, value: 15, label: 'August 2023' },
  { year: 2023, month: 9, value: 72, label: 'September 2023' },
  { year: 2023, month: 10, value: 165, label: 'Oktober 2023' },
  { year: 2023, month: 11, value: 255, label: 'November 2023' },
  { year: 2023, month: 12, value: 310, label: 'December 2023' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year') || '2024'

  const apiKey = process.env.DMI_API_KEY

  if (!apiKey || apiKey === 'your_dmi_key_here') {
    const filtered = mockHeatingDegreeDays.filter(d => d.year === parseInt(year))
    return NextResponse.json({
      data: filtered,
      source: 'mock',
      municipality: '0329',
      parameter: 'heatingDegreeDays',
    })
  }

  try {
    const url = new URL('https://dmigw.govcloud.dk/v2/climateData/collections/municipalityValue/items')
    url.searchParams.set('municipalityId', '0329')
    url.searchParams.set('parameterId', 'heatingDegreeDays')
    url.searchParams.set('timeResolution', 'month')
    url.searchParams.set('datetime', `${year}-01-01T00:00:00Z/${year}-12-31T23:59:59Z`)
    url.searchParams.set('api-key', apiKey)
    url.searchParams.set('limit', '12')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`DMI API error: ${response.status}`)
    }

    const data = await response.json()

    const formatted = (data.features || []).map((f: { properties: { from: string; value: number } }) => {
      const date = new Date(f.properties.from)
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        value: f.properties.value,
        label: date.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' }),
      }
    })

    return NextResponse.json({
      data: formatted,
      source: 'live',
      municipality: '0329',
      parameter: 'heatingDegreeDays',
    })
  } catch (error) {
    console.error('DMI API error:', error)
    const filtered = mockHeatingDegreeDays.filter(d => d.year === parseInt(year))
    return NextResponse.json({
      data: filtered,
      source: 'mock',
      error: 'DMI API fejl — viser simuleret data',
    })
  }
}
