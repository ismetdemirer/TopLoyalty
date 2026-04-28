import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, password, contactName, contactPhone, logoUrl, active } = data

    if (!name || !email || !password || !contactName || !contactPhone) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun.' },
        { status: 400 }
      )
    }

    // 1. E-posta kontrolü
    const existingBrand = await prisma.brand.findUnique({
      where: { email },
    })

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda.' },
        { status: 400 }
      )
    }

    // 2. Slug oluşturma (Basit bir slug fonksiyonu)
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // 3. Slug çakışma kontrolü
    const existingSlug = await prisma.brand.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      // Slug çakışırsa ismin sonuna rastgele sayı ekleyebiliriz
      // Ancak şimdilik hata döndürelim
      return NextResponse.json(
        { error: 'Bu marka adı ile daha önce bir kayıt oluşturulmuş.' },
        { status: 400 }
      )
    }

    // 4. Şifre hashleme
    const passwordHash = await bcrypt.hash(password, 10)

    // 5. Marka oluşturma
    const newBrand = await prisma.brand.create({
      data: {
        name,
        slug,
        email,
        passwordHash,
        contactName,
        contactPhone,
        logoUrl,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json(
      { message: 'Marka başarıyla oluşturuldu.', brand: newBrand },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Marka Oluşturma Hatası:', error)
    return NextResponse.json(
      { error: 'Bir sunucu hatası oluştu: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { branches: true, rewards: true, submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(brands)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Markalar getirilemedi: ' + error.message },
      { status: 500 }
    )
  }
}
