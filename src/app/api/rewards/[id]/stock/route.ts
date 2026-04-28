import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Belirli ödülün bugünkü stok durumunu döndür
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { id } = await params
    const today = new Date().toISOString().split('T')[0]

    const stock = await prisma.rewardStock.findUnique({
      where: { rewardId_date: { rewardId: id, date: today } },
    })

    if (!stock) {
      return NextResponse.json({
        rewardId: id,
        date: today,
        totalCount: 0,
        remainingCount: 0,
        exists: false,
      })
    }

    return NextResponse.json({ ...stock, exists: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Belirli gün için stok güncelle veya oluştur
export async function POST(
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

    // Ödülün sahibi mi kontrol et
    const reward = await prisma.reward.findUnique({ where: { id } })
    if (!reward) {
      return NextResponse.json({ error: 'Ödül bulunamadı.' }, { status: 404 })
    }

    if (role !== 'ADMIN' && reward.brandId !== userId) {
      return NextResponse.json({ error: 'Bu ödül için yetkiniz yok.' }, { status: 403 })
    }

    const { date, totalCount } = await req.json()
    const targetDate = date || new Date().toISOString().split('T')[0]
    const count = Number(totalCount)

    if (!count || count < 0) {
      return NextResponse.json({ error: 'Geçerli bir stok miktarı girin.' }, { status: 400 })
    }

    // Upsert: varsa güncelle, yoksa oluştur
    const stock = await prisma.rewardStock.upsert({
      where: { rewardId_date: { rewardId: id, date: targetDate } },
      update: {
        totalCount: count,
        remainingCount: count,
      },
      create: {
        rewardId: id,
        date: targetDate,
        totalCount: count,
        remainingCount: count,
      },
    })

    return NextResponse.json(stock)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
