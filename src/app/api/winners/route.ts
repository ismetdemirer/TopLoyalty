import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: sessionBrandId } = session.user as { role?: string; id?: string }
    const { searchParams } = new URL(req.url)
    const filterBrandId = searchParams.get('brandId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (role === 'ADMIN') {
      if (filterBrandId) where.brandId = filterBrandId
    } else {
      where.brandId = sessionBrandId
    }

    const [items, total] = await Promise.all([
      prisma.rewardGiven.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          submission: {
            select: {
              ipAddress: true,
              ipCity: true,
              ipRegion: true,
              ipDistrict: true,
              ipCountry: true,
              verificationNote: true,
              userAgent: true,
            },
          },
          reward: { select: { name: true } },
          branch: {
            select: {
              name: true,
              verificationType: true,
              instagramLocationTag: true,
            },
          },
        },
      }),
      prisma.rewardGiven.count({ where }),
    ])

    return NextResponse.json({ items, total })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
