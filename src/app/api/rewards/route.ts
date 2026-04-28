import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Ödülleri listele
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }

    const where = role === 'ADMIN' ? {} : { brandId: userId }

    const rewards = await prisma.reward.findMany({
      where,
      include: {
        stocks: {
          where: { date: new Date().toISOString().split('T')[0] },
        },
        branch: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(rewards)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Yeni ödül oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }
    const { name, imageUrl, dailyLimit, branchId } = await req.json()

    if (!name?.trim() || !branchId) {
      return NextResponse.json(
        { error: 'Ödül adı ve şube bilgisi gereklidir.' },
        { status: 400 }
      )
    }

    // Şubenin bu kullanıcıya ait olduğunu doğrula
    const branch = await prisma.branch.findUnique({ where: { id: branchId } })
    if (!branch) {
      return NextResponse.json({ error: 'Şube bulunamadı.' }, { status: 404 })
    }

    if (role !== 'ADMIN' && branch.brandId !== userId) {
      return NextResponse.json({ error: 'Bu şube için yetkiniz yok.' }, { status: 403 })
    }

    const limitValue = Number(dailyLimit) || 10
    const today = new Date().toISOString().split('T')[0]

    // Ödülü oluştur
    const reward = await prisma.reward.create({
      data: {
        brandId: branch.brandId,
        branchId,
        name: name.trim(),
        imageUrl: imageUrl || null,
        dailyLimit: limitValue,
      },
    })

    // Bugün için stok kaydı oluştur
    await prisma.rewardStock.create({
      data: {
        rewardId: reward.id,
        date: today,
        totalCount: limitValue,
        remainingCount: limitValue,
      },
    })

    // Aktivite logu yaz
    await prisma.activityLog.create({
      data: {
        brandId: branch.brandId,
        action: 'reward_added',
        entityType: 'Reward',
        entityId: reward.id,
        newValue: JSON.stringify({ name: reward.name, dailyLimit: limitValue }),
        performedBy: session.user.email ?? userId ?? 'bilinmiyor',
      },
    })

    return NextResponse.json(reward, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
