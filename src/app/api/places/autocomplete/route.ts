import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get('input')
  if (!input || input.trim().length < 2) return NextResponse.json({ predictions: [] })

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key eksik' }, { status: 500 })

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&language=tr&types=establishment&components=country:tr`

  const res = await fetch(url)
  const data = await res.json()
  return NextResponse.json(data)
}
