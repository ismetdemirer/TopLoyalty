import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFile } from 'fs/promises'
import path from 'path'

// IP adresinden konum bilgisi çöz (ip-api.com — ücretsiz, API key gerekmez)
async function resolveIpLocation(ip: string): Promise<{
  city: string | null
  region: string | null
  district: string | null
  country: string | null
}> {
  try {
    // Lokal/private IP'ler için geolocation yapma
    if (!ip || ip === 'bilinmiyor' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('127.') || ip === '::1') {
      return { city: null, region: null, district: null, country: null }
    }
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,district&lang=tr`, {
      signal: AbortSignal.timeout(3000), // 3 saniye timeout
    })
    if (!res.ok) return { city: null, region: null, district: null, country: null }
    const data = await res.json()
    if (data.status !== 'success') return { city: null, region: null, district: null, country: null }
    return {
      city: data.regionName || null,    // İl (İstanbul, Ankara...)
      region: data.city || null,        // İlçe (Kadıköy, Çankaya...)
      district: data.district || null,  // Semt/Mahalle
      country: data.country || null,    // Ülke
    }
  } catch {
    return { city: null, region: null, district: null, country: null }
  }
}

// Gemini API istemcisi
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API anahtarı bulunamadı. GEMINI_API_KEY env değişkenini ayarlayın.')
  }
  return new GoogleGenerativeAI(apiKey)
}

// Görseli base64'e çevir
async function imageToBase64(imagePath: string): Promise<{ base64: string; mimeType: string }> {
  // /uploads/xxx.png şeklinde gelen yolu public/ altından oku
  const normalizedPath = imagePath.replace(/^\/+/, '')
  const absolutePath = path.join(process.cwd(), 'public', normalizedPath)
  const buffer = await readFile(absolutePath)
  const base64 = buffer.toString('base64')

  const ext = path.extname(imagePath).toLowerCase()
  const mimeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  }

  return { base64, mimeType: mimeMap[ext] || 'image/png' }
}

// Gemini Vision ile yorum doğrulama (Maps kurgusu)
function getMapsPrompt(): string {
  return `Bu ekran görüntüsünü analiz et.
Şu soruları yanıtla:
1. Bu bir Google Maps / Google Haritalar yorum ekran görüntüsü mü?
2. Yorum gerçek bir kullanıcı tarafından yazılmış görünüyor mu?
3. Yorum son 24 saat içinde yapılmış olabilir mi? (tarih/zaman bilgisi varsa kontrol et)
4. Yorum yapan kullanıcının adı ne?

SADECE JSON formatında yanıt ver, başka bir şey yazma:
{ "isValid": true/false, "detectedName": "Kullanıcı Adı" veya null, "reason": "Kısa açıklama" }`
}

// Gemini Vision ile Instagram hikaye doğrulama
function getInstagramPrompt(locationTag: string): string {
  return `Bu ekran görüntüsünü dikkatlice analiz et.

ADIM 1 — Ekran görüntüsü türünü belirle:
Bu bir Instagram hikayesi (story) ekran görüntüsü mü? Instagram hikayelerinde genellikle üstte profil fotoğrafı + kullanıcı adı bulunur, ekran yatay kenarlara kadar uzanan dikey bir format vardır.

ADIM 2 — Konum etiketini bul ve oku:
Instagram hikayelerinde konum etiketi genellikle bir "pin" (📍) ikonu ve konum adından oluşan beyaz/renkli bir sticker şeklinde görünür. Bu sticker'ın üzerindeki metni HARF HARF oku.

Beklenen konum etiketi: "${locationTag}"

Sticker'daki metin ile beklenen metni karşılaştır:
- Tam eşleşme veya çok yakın eşleşme (büyük/küçük harf farkı, kısa çizgi, boşluk farkı gibi) → geçerli say
- Tamamen farklı bir mekan adı → geçersiz say
- Konum sticker'ı hiç yok → geçersiz say

ADIM 3 — Hikaye sahibini tespit et:
Hikayenin üst kısmındaki kullanıcı adını veya profilden görünen adı oku.

SADECE şu JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "isValid": true veya false,
  "detectedName": "tespit edilen kullanıcı adı veya gerçek ad" veya null,
  "detectedLocationTag": "sticker'da okunan konum metni" veya null,
  "reason": "Kısa açıklama — neden geçerli veya geçersiz"
}`
}

async function verifyScreenshot(
  screenshotPath: string,
  verificationType: string = 'MAPS',
  instagramLocationTag: string | null = null
): Promise<{
  isValid: boolean
  detectedName: string | null
  reason: string
}> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    const { base64, mimeType } = await imageToBase64(screenshotPath)

    // Kurgu tipine göre uygun promptu seç
    const prompt = verificationType === 'INSTAGRAM'
      ? getInstagramPrompt(instagramLocationTag || '')
      : getMapsPrompt()

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
    ])

    const text = result.response.text().trim()
    // JSON'u ayıkla (bazen markdown code block içinde gelebilir)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { isValid: false, detectedName: null, reason: 'AI yanıtı ayrıştırılamadı.' }
    }

    const parsed = JSON.parse(jsonMatch[0])
    // Instagram kurgusu için okunan konum etiketini reason'a ekle
    let reason = parsed.reason || ''
    if (verificationType === 'INSTAGRAM' && parsed.detectedLocationTag) {
      reason = `[Okunan etiket: "${parsed.detectedLocationTag}"] ${reason}`
    }
    return {
      isValid: Boolean(parsed.isValid),
      detectedName: parsed.detectedName || null,
      reason,
    }
  } catch (error) {
    console.error('Gemini doğrulama hatası:', error)
    // API hatası olursa yine de devam et, ama PENDING bırak
    return { isValid: false, detectedName: null, reason: 'AI doğrulama servisi şu anda kullanılamıyor.' }
  }
}

// Bugünün tarih stringi
function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const { branchId, screenshotPath } = await req.json()

    if (!branchId || !screenshotPath) {
      return NextResponse.json(
        { error: 'Şube ve ekran görüntüsü bilgisi gereklidir.' },
        { status: 400 }
      )
    }

    // Şubeyi ve markayı bul
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { brand: true },
    })

    if (!branch) {
      return NextResponse.json({ error: 'Şube bulunamadı.' }, { status: 404 })
    }

    // IP adresi al
    const forwarded = req.headers.get('x-forwarded-for')
    const ipAddress = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'bilinmiyor'

    // IP kontrolü: aynı IP + aynı branchId + aynı gün = max 1 başvuru
    const today = todayStr()
    const todayStart = new Date(`${today}T00:00:00.000Z`)
    const todayEnd = new Date(`${today}T23:59:59.999Z`)

    const existingSubmission = await prisma.reviewSubmission.findFirst({
      where: {
        branchId,
        ipAddress,
        verificationStatus: { in: ['APPROVED', 'PENDING'] },
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Bu şubeye bugün zaten başvuru yaptınız. Yarın tekrar deneyebilirsiniz.' },
        { status: 429 }
      )
    }

    // IP geolocation çöz
    const ipLocation = await resolveIpLocation(ipAddress)

    // 1. ReviewSubmission kaydı oluştur (PENDING)
    const submission = await prisma.reviewSubmission.create({
      data: {
        branchId,
        brandId: branch.brandId,
        screenshotPath,
        verificationStatus: 'PENDING',
        ipAddress,
        userAgent: req.headers.get('user-agent') || null,
        ipCity: ipLocation.city,
        ipRegion: ipLocation.region,
        ipDistrict: ipLocation.district,
        ipCountry: ipLocation.country,
      },
    })

    // 2. Gemini Vision ile doğrulama yap (kurgu tipine göre)
    const verification = await verifyScreenshot(
      screenshotPath,
      branch.verificationType,
      branch.instagramLocationTag
    )

    // 3. AI yanıtına göre güncelle
    if (verification.isValid) {
      await prisma.reviewSubmission.update({
        where: { id: submission.id },
        data: {
          verificationStatus: 'APPROVED',
          aiDetectedName: verification.detectedName,
          verificationNote: verification.reason,
          customerName: verification.detectedName || null,
        },
      })

      // 4. Onaylandıysa: o şubede bugün için aktif RewardStock'u bul
      const activeRewards = await prisma.reward.findMany({
        where: { branchId, active: true },
        include: { stocks: { where: { date: today } } },
      })

      let selectedReward = null
      let selectedStock = null

      for (const reward of activeRewards) {
        const stock = reward.stocks[0]
        if (stock && stock.remainingCount > 0) {
          selectedReward = reward
          selectedStock = stock
          break
        }
        if (!stock && reward.dailyLimit > 0) {
          const newStock = await prisma.rewardStock.create({
            data: {
              rewardId: reward.id,
              date: today,
              totalCount: reward.dailyLimit,
              remainingCount: reward.dailyLimit,
            },
          })
          selectedReward = reward
          selectedStock = newStock
          break
        }
      }

      if (selectedReward && selectedStock && selectedStock.remainingCount > 0) {
        await prisma.rewardGiven.create({
          data: {
            submissionId: submission.id,
            rewardId: selectedReward.id,
            brandId: branch.brandId,
            branchId,
            customerName: verification.detectedName || 'Bilinmeyen Müşteri',
          },
        })
        await prisma.rewardStock.update({
          where: { id: selectedStock.id },
          data: { remainingCount: selectedStock.remainingCount - 1 },
        })

        return NextResponse.json({
          submissionId: submission.id,
          status: 'APPROVED',
          reward: {
            id: selectedReward.id,
            name: selectedReward.name,
            imageUrl: selectedReward.imageUrl,
          },
        })
      }

      // Onaylandı ama ödül kalmamış
      return NextResponse.json({
        submissionId: submission.id,
        status: 'APPROVED',
        reward: null,
      })
    } else {
      // Reddedildi
      await prisma.reviewSubmission.update({
        where: { id: submission.id },
        data: {
          verificationStatus: 'REJECTED',
          verificationNote: verification.reason,
        },
      })

      return NextResponse.json({
        submissionId: submission.id,
        status: 'REJECTED',
        reason: verification.reason,
        reward: null,
      })
    }
  } catch (error: unknown) {
    console.error('Submission hatası:', error)
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
