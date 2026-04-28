import QRCode from 'qrcode'
import sharp from 'sharp'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

/**
 * Şubeye özel, ortasında marka logosu bulunan QR kod üreten servis.
 */
export async function generateBranchQR(branchId: string, brandSlug: string, logoPath?: string | null) {
  try {
    const qrDir = path.join(process.cwd(), 'public/uploads/qr')
    if (!existsSync(qrDir)) mkdirSync(qrDir, { recursive: true })

    const fileName = `qr-${branchId}.png`
    const outputPath = path.join(qrDir, fileName)
    const publicUrl = `/uploads/qr/${fileName}`

    // 1. QR Kod URL'si (Müşteri akışına yönlendirme)
    const qrUrl = `${process.env.NEXTAUTH_URL}/r/${brandSlug}?branch=${branchId}`

    // 2. Temel QR kodunu tampon (buffer) olarak üret
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 600,
      color: {
        dark: '#0F172A', // Koyu lacivert/siyah tonu
        light: '#FFFFFF',
      },
    })

    if (!logoPath) {
      // Logo yoksa direkt kaydet
      await sharp(qrBuffer).toFile(outputPath)
      return publicUrl
    }

    // 3. Logo varsa (public yolu veya tam yol)
    const normalizedLogoPath = logoPath.replace(/^\/+/, '')
    const absoluteLogoPath = path.join(process.cwd(), 'public', normalizedLogoPath)
    if (!existsSync(absoluteLogoPath)) {
      await sharp(qrBuffer).toFile(outputPath)
      return publicUrl
    }

    // 4. Sharp ile logoyu QR'ın ortasına yapıştır
    const logoImg = await sharp(absoluteLogoPath)
      .resize(140, 140, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer()

    await sharp(qrBuffer)
      .composite([{ input: logoImg, gravity: 'center' }])
      .toFile(outputPath)

    return publicUrl
  } catch (error) {
    console.error('QR Üretim Hatası:', error)
    throw new Error('QR kod üretilemedi.')
  }
}
