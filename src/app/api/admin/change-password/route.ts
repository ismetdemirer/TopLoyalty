import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }
    if (role !== 'ADMIN' || !userId) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mevcut şifre ve yeni şifre zorunludur.' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 6 karakter olmalıdır.' },
        { status: 400 }
      )
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: userId } })
    if (!admin) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash },
    })

    return NextResponse.json({ message: 'Şifre başarıyla değiştirildi.' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
