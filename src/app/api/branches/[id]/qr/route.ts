import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateBranchQR } from '@/lib/qr-generator'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { id } = await params
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { brand: true },
    })

    if (!branch) {
      return NextResponse.json({ error: 'Şube bulunamadı.' }, { status: 404 })
    }

    const { role, id: userId } = session.user as { role?: string; id?: string }
    if (role !== 'ADMIN' && userId !== branch.brandId) {
      return NextResponse.json({ error: 'Bu şube için yetkiniz yok.' }, { status: 403 })
    }

    const qrImagePath = await generateBranchQR(branch.id, branch.brand.slug, branch.brand.logoUrl)

    const updated = await prisma.branch.update({
      where: { id: branch.id },
      data: { qrImagePath },
    })

    return NextResponse.json(
      {
        message: 'QR kod oluşturuldu.',
        qrImagePath: updated.qrImagePath,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: `QR kod oluşturulamadı: ${message}` }, { status: 500 })
  }
}
