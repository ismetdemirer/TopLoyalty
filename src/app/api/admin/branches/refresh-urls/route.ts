import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST() {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
  }

  const branches = await prisma.branch.findMany({
    where: { placeId: { not: null } },
    select: { id: true, name: true, placeId: true },
  })

  const results: { id: string; name: string; reviewUrl: string }[] = []

  for (const branch of branches) {
    if (!branch.placeId) continue
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${branch.placeId}`
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${branch.placeId}`
    await prisma.branch.update({
      where: { id: branch.id },
      data: { reviewUrl, mapsUrl },
    })
    results.push({ id: branch.id, name: branch.name, reviewUrl })
  }

  return NextResponse.json({ updated: results.length, results })
}
