import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }
    const { searchParams } = new URL(req.url)

    // Filtre parametreleri
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Where koşulları
    const where: Record<string, unknown> = {}

    // BRAND rolü sadece kendi markasını görebilir
    if (role === 'BRAND') {
      where.brandId = userId
    }

    // Şube filtresi
    if (branchId) {
      where.branchId = branchId
    }

    // Tarih filtresi
    if (startDate || endDate) {
      const createdAt: Record<string, Date> = {}
      if (startDate) createdAt.gte = new Date(`${startDate}T00:00:00.000Z`)
      if (endDate) createdAt.lte = new Date(`${endDate}T23:59:59.999Z`)
      where.createdAt = createdAt
    }

    const items = await prisma.rewardGiven.findMany({
      where,
      include: {
        reward: { select: { id: true, name: true, imageUrl: true } },
        submission: {
          select: {
            id: true,
            ipAddress: true,
            customerName: true,
            aiDetectedName: true,
            verificationStatus: true,
            branch: { select: { id: true, name: true } },
            brand: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Veriyi düzleştir
    const formatted = items.map((item) => ({
      id: item.id,
      customerName: item.customerName,
      createdAt: item.createdAt,
      ipAddress: item.submission.ipAddress,
      branch: { id: item.submission.branch.id, name: item.submission.branch.name },
      reward: { id: item.reward.id, name: item.reward.name, imageUrl: item.reward.imageUrl },
      brand: { id: item.submission.brand.id, name: item.submission.brand.name },
      verificationStatus: item.submission.verificationStatus,
      aiDetectedName: item.submission.aiDetectedName,
    }))

    return NextResponse.json({ items: formatted, total: formatted.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
