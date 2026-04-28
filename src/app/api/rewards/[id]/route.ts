import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Ödülü güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { id } = await params
    const { role, id: userId } = session.user as { role?: string; id?: string }

    const reward = await prisma.reward.findUnique({ where: { id } })
    if (!reward) {
      return NextResponse.json({ error: 'Ödül bulunamadı.' }, { status: 404 })
    }

    if (role !== 'ADMIN' && reward.brandId !== userId) {
      return NextResponse.json({ error: 'Bu ödül için yetkiniz yok.' }, { status: 403 })
    }

    const body = await req.json()
    const data: Record<string, unknown> = {}

    if (body.name !== undefined) data.name = body.name.trim()
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl
    if (body.dailyLimit !== undefined) data.dailyLimit = Number(body.dailyLimit)
    if (body.active !== undefined) data.active = Boolean(body.active)

    const oldValue = JSON.stringify({
      name: reward.name,
      dailyLimit: reward.dailyLimit,
      active: reward.active,
    })

    const updated = await prisma.reward.update({
      where: { id },
      data,
    })

    // Aktivite logu yaz
    await prisma.activityLog.create({
      data: {
        brandId: reward.brandId,
        action: 'reward_updated',
        entityType: 'Reward',
        entityId: id,
        oldValue,
        newValue: JSON.stringify(data),
        performedBy: session.user.email ?? userId ?? 'bilinmiyor',
      },
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Ödülü pasife al (soft delete)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { id } = await params
    const { role, id: userId } = session.user as { role?: string; id?: string }

    const reward = await prisma.reward.findUnique({ where: { id } })
    if (!reward) {
      return NextResponse.json({ error: 'Ödül bulunamadı.' }, { status: 404 })
    }

    if (role !== 'ADMIN' && reward.brandId !== userId) {
      return NextResponse.json({ error: 'Bu ödül için yetkiniz yok.' }, { status: 403 })
    }

    await prisma.reward.update({
      where: { id },
      data: { active: false },
    })

    // Aktivite logu yaz
    await prisma.activityLog.create({
      data: {
        brandId: reward.brandId,
        action: 'reward_removed',
        entityType: 'Reward',
        entityId: id,
        oldValue: JSON.stringify({ name: reward.name, active: true }),
        newValue: JSON.stringify({ active: false }),
        performedBy: session.user.email ?? userId ?? 'bilinmiyor',
      },
    })

    return NextResponse.json({ message: 'Ödül pasife alındı.' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
