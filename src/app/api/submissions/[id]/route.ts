import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { customerName } = await req.json()
    if (!customerName) return NextResponse.json({ error: 'İsim gerekli.' }, { status: 400 })

    await prisma.reviewSubmission.update({
      where: { id },
      data: { customerName },
    })
    // RewardGiven'daki customerName'i de güncelle
    await prisma.rewardGiven.updateMany({
      where: { submissionId: id },
      data: { customerName },
    })
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }
    const { role } = session.user as { role?: string }
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sadece admin silebilir.' }, { status: 403 })
    }

    const { id } = await params

    // Önce RewardGiven varsa sil
    await prisma.rewardGiven.deleteMany({ where: { submissionId: id } })
    // Sonra submission'ı sil
    await prisma.reviewSubmission.delete({ where: { id } })

    return NextResponse.json({ message: 'Kayıt silindi' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
