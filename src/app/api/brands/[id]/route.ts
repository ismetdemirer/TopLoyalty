import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findUnique({ where: { id } })
    if (!brand) return NextResponse.json({ error: 'Marka bulunamadı' }, { status: 404 })
    return NextResponse.json(brand)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await req.json()
    const { name, email, password, contactName, contactPhone, logoUrl, active } = data

    const existingEmail = await prisma.brand.findFirst({
      where: { email, NOT: { id } },
    })
    if (existingEmail) return NextResponse.json({ error: 'E-posta kullanımda' }, { status: 400 })

    const updateData: any = { name, email, contactName, contactPhone, logoUrl, active }
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10)

    const updated = await prisma.brand.update({ where: { id }, data: updateData })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ message: 'Silindi' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
