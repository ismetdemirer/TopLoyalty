import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { parseMapsUrl } from '@/lib/maps-parser'

function normalizeReviewUrl(reviewUrl: string, placeId: string | null) {
  // placeId varsa en güvenilir format
  if (placeId) return `https://search.google.com/local/writereview?placeid=${placeId}`
  // writereview?placeid= zaten doğru format
  if (reviewUrl && reviewUrl.includes('writereview?placeid=')) return reviewUrl
  return reviewUrl || ''
}

// 1. Şubeleri Listele
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: sessionBrandId } = session.user as { role?: string; id?: string }

    // Admin brandId query param ile filtreleme yapabilir
    const { searchParams } = new URL(req.url)
    const filterBrandId = searchParams.get('brandId')

    let branches;
    if (role === 'ADMIN') {
      // Admin: brandId parametresi varsa filtrele, yoksa tümünü getir
      const where = filterBrandId ? { brandId: filterBrandId } : {}
      branches = await prisma.branch.findMany({
        where,
        include: { brand: true },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // Marka yöneticisi sadece kendi şubelerini görür
      branches = await prisma.branch.findMany({
        where: { brandId: sessionBrandId },
        orderBy: { createdAt: 'desc' },
      })
    }

    const normalizedBranches = branches.map((branch) => ({
      ...branch,
      reviewUrl: normalizeReviewUrl(branch.reviewUrl, branch.placeId),
    }))

    return NextResponse.json(normalizedBranches)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 2. Şube Ekle
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { role, id: sessionUserId } = session.user as any
    const { name, googleMapsUrl, brandId: bodyBrandId, placeId: bodyPlaceId, verificationType, instagramLocationTag } = await req.json()

    // Eğer Admin ise body'den gelen brandId'yi kullan, değilse kendi id'sini kullan
    const targetBrandId = (role === 'ADMIN' && bodyBrandId) ? bodyBrandId : sessionUserId

    if (!targetBrandId) {
      return NextResponse.json({ error: 'Marka bilgisi gereklidir.' }, { status: 400 })
    }

    // Instagram kurgusu seçildiyse Maps alanlarını boş bırak
    const isInstagram = verificationType === 'INSTAGRAM'

    let branchData: {
      googleMapsCID: string
      placeId: string | null
      reviewUrl: string
      mapsUrl: string
      branchName: string | null
    }

    if (isInstagram) {
      // Instagram kurgusu — Maps alanları gerekli değil
      branchData = {
        googleMapsCID: '',
        placeId: null,
        reviewUrl: '',
        mapsUrl: '',
        branchName: typeof name === 'string' && name.trim() ? name.trim() : null,
      }
    } else if (bodyPlaceId) {
      // Places API üzerinden seçildi — writereview?placeid= formatı kullan
      branchData = {
        googleMapsCID: '',
        placeId: bodyPlaceId,
        reviewUrl: `https://search.google.com/local/writereview?placeid=${bodyPlaceId}`,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${bodyPlaceId}`,
        branchName: typeof name === 'string' && name.trim() ? name.trim() : null,
      }
    } else if (googleMapsUrl) {
      // Eski yontem: URL parse
      const mapsData = await parseMapsUrl(googleMapsUrl)
      branchData = {
        googleMapsCID: mapsData.cid,
        placeId: mapsData.placeId ?? null,
        reviewUrl: mapsData.reviewUrl,
        mapsUrl: mapsData.mapsUrl,
        branchName: mapsData.branchName?.trim() ?? null,
      }
    } else {
      // Ne URL ne placeId — sadece isimle kaydet
      branchData = {
        googleMapsCID: '',
        placeId: null,
        reviewUrl: '',
        mapsUrl: '',
        branchName: typeof name === 'string' && name.trim() ? name.trim() : null,
      }
    }

    const finalName = branchData.branchName || (typeof name === 'string' && name.trim() ? name.trim() : null)

    if (!finalName) {
      return NextResponse.json(
        { error: 'Şube adı bulunamadı. Lütfen şube adını manuel girin.' },
        { status: 400 }
      )
    }

    const newBranch = await prisma.branch.create({
      data: {
        brandId: targetBrandId,
        name: finalName,
        googleMapsCID: branchData.googleMapsCID,
        placeId: branchData.placeId,
        reviewUrl: branchData.reviewUrl,
        mapsUrl: branchData.mapsUrl,
        verificationType: isInstagram ? 'INSTAGRAM' : 'MAPS',
        instagramLocationTag: isInstagram ? (instagramLocationTag || null) : null,
        active: true,
      },
    })

    return NextResponse.json(newBranch, { status: 201 })
  } catch (error: any) {
    console.error('Şube Ekleme Hatası:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
