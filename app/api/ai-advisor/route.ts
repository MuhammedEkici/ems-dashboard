import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_key_here') {
    return NextResponse.json(
      { error: 'NO_API_KEY', message: 'Tilføj din Anthropic API nøgle i .env.local for at aktivere AI-rådgiveren' },
      { status: 200 }
    )
  }

  try {
    const body = await request.json()
    const { spotPrices, weather, consumption, solarProduction } = body

    const systemPrompt = `Du er en intelligent energirådgiver for Ekici EMS hjemmet i Ringsted, Danmark. Du har adgang til realtidsdata om elpriser, vejr og energiforbrug. Giv korte, praktiske råd på dansk om hvornår det er billigst at bruge strøm i dag, hvad vejret betyder for solproduktionen, og hvordan husstanden kan spare penge. Hold svar under 4 sætninger. Vær specifik med tidspunkter og priser når muligt.`

    const userMessage = `Her er dagens data:
Elpriser (næste 24 timer): ${JSON.stringify(spotPrices?.slice(0, 24) || [])}
Vejr: ${JSON.stringify(weather || {})}
Elforbrug denne måned: ${consumption || '1.245 kWh'}
Solproduktion i dag: ${solarProduction || '12.5 kWh'}

Giv mig et kort, praktisk energiråd for i dag.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const advice = data.content?.[0]?.text || 'Ingen rådgivning tilgængelig.'

    return NextResponse.json({ advice, source: 'live' })
  } catch (error) {
    console.error('AI Advisor error:', error)
    // Fallback mock advice
    return NextResponse.json({
      advice: 'I dag er elprisen lav mellem 01:00–06:00. Overvej at starte vaskemaskinen eller oplade elbilen om natten. Vejret er delvist skyet — begrænset solproduktion forventes i formiddagstimerne. Batteriet er godt ladet og kan dække aftenforbruget.',
      source: 'mock'
    })
  }
}

export async function GET(request: NextRequest) {
  // Support for simple chat messages
  const { searchParams } = new URL(request.url)
  const message = searchParams.get('message')

  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_key_here') {
    return NextResponse.json(
      { error: 'NO_API_KEY', reply: 'AI-rådgiveren er ikke aktiveret. Tilføj din Anthropic API nøgle i .env.local.' },
      { status: 200 }
    )
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: 'Du er en dansk energirådgiver for Ekici EMS. Du har adgang til følgende data: elpriser, vejr og forbrugsdata for et hjem i Ringsted. Svar altid på dansk og hold svarene korte og praktiske.',
        messages: [
          { role: 'user', content: message }
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Ingen svar tilgængeligt.'

    return NextResponse.json({ reply, source: 'live' })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({
      reply: 'Beklager, jeg kunne ikke behandle dit spørgsmål lige nu. Prøv igen om lidt.',
      source: 'error'
    })
  }
}
