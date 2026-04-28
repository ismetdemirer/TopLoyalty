import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/stats
 * Admin ve Brand dashboard'ları için genel istatistikler.
 * ADMIN: platform geneli, BRAND: kendi markasına ait veriler.
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }

    // ── ADMIN istatistikleri ──
    if (role === 'ADMIN') {
      const [totalBrands, totalBranches, totalSubmissions, totalRewardsGiven, recentBrands] =
        await Promise.all([
          prisma.brand.count({ where: { active: true } }),
          prisma.branch.count({ where: { active: true } }),
          prisma.reviewSubmission.count(),
          prisma.rewardGiven.count(),
          prisma.brand.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              logoUrl: true,
              createdAt: true,
              _count: { select: { branches: true } },
            },
          }),
        ])

      return NextResponse.json({
        totalBrands,
        totalBranches,
        totalSubmissions,
        totalRewardsGiven,
        recentBrands,
      })
    }

    // ── BRAND istatistikleri ──
    if (role === 'BRAND' && userId) {
      // Bugünün tarih aralığı
      const todayStr = new Date().toISOString().split('T')[0]
      const todayStart = new Date(`${todayStr}T00:00:00.000Z`)
      const todayEnd = new Date(`${todayStr}T23:59:59.999Z`)

      const brandWhere = { brandId: userId }
      const todayWhere = {
        ...brandWhere,
        createdAt: { gte: todayStart, lte: todayEnd },
      }

      const [branchCount, todaySubmissions, todayRewardsGiven, pendingSubmissions, totalRewardsGiven] =
        await Promise.all([
          prisma.branch.count({ where: { brandId: userId } }),
          prisma.reviewSubmission.count({ where: todayWhere }),
          prisma.rewardGiven.count({ where: todayWhere }),
          prisma.reviewSubmission.count({
            where: { ...brandWhere, verificationStatus: 'PENDING' },
          }),
          prisma.rewardGiven.count({ where: brandWhere }),
        ])

      return NextResponse.json({
        branchCount,
        todaySubmissions,
        todayRewardsGiven,
        pendingSubmissions,
        totalRewardsGiven,
      })
    }

    return NextResponse.json({ error: 'Geçersiz rol.' }, { status: 403 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('Stats API hatası:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
