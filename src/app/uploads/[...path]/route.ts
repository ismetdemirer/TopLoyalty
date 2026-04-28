import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathArray } = await params
    const filePathStr = filePathArray.join('/')
    const fullPath = path.join(process.cwd(), 'public/uploads', filePathStr)

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 404 })
    }

    const fileBuffer = await readFile(fullPath)
    const extension = path.extname(fullPath).toLowerCase()

    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }

    const contentType = contentTypeMap[extension] || 'application/octet-stream'

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Dosya Sunma Hatası:', error)
    return NextResponse.json({ error: 'Dosya okunurken bir hata oluştu' }, { status: 500 })
  }
}
