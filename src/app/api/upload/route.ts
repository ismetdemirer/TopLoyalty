import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Lütfen bir dosya seçin.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Benzersiz dosya adı oluştur
    const originalName = file.name
    const extension = originalName.substring(originalName.lastIndexOf('.'))
    const fileName = `${crypto.randomUUID()}${extension}`

    // Dizinin var olduğundan emin ol ve dosyayı kaydet
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    // Frontend için public erişim URL'sini döndür
    return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 200 })
  } catch (error) {
    console.error('Dosya Yükleme Hatası:', error)
    return NextResponse.json({ error: 'Dosya yüklenemedi.' }, { status: 500 })
  }
}
