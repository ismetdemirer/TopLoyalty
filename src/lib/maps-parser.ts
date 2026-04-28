import { extractBranchNameFromMapsUrl } from './maps-url-utils'

/**
 * Google Maps URL'sinden place_id alır.
 * Önce URL'deki parametrelerden çıkarmayı dener,
 * bulamazsa Places API Text Search kullanır.
 */

async function getPlaceIdFromText(query: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === 'OK' && data.candidates?.[0]?.place_id) {
      return data.candidates[0].place_id
    }
    return null
  } catch {
    return null
  }
}

async function getPlaceIdFromCid(cid: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?cid=${cid}&fields=place_id&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === 'OK' && data.result?.place_id) {
      return data.result.place_id
    }
    return null
  } catch {
    return null
  }
}

export async function parseMapsUrl(url: string) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    // 1. Kısa link ise redirect takip et
    let targetUrl = url
    if (url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl')) {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      targetUrl = res.url
    }

    const decodedUrl = decodeURIComponent(targetUrl)
    const branchName = extractBranchNameFromMapsUrl(decodedUrl)
    const hasPlacePath = decodedUrl.includes('/maps/place/')

    // 2. URL'de doğrudan place_id var mı?
    const directPlaceIdMatch =
      decodedUrl.match(/[?&]placeid=([A-Za-z0-9_-]+)/i) ||
      decodedUrl.match(/[?&]query_place_id=([A-Za-z0-9_-]+)/i) ||
      decodedUrl.match(/place_id:([A-Za-z0-9_-]+)/i) ||
      decodedUrl.match(/\/place\/[^/]+\/([A-Za-z0-9_-]{27,})/i)

    let placeId: string | null = directPlaceIdMatch?.[1] ?? null

    // 3. CID ayıkla
    let cid = ''
    const cidParamMatch = decodedUrl.match(/[?&](?:cid|ludocid)=(\d+)/i)
    const cidHexMatch = decodedUrl.match(/!1s0x[a-f0-9]+:0x([a-f0-9]+)/i)

    if (cidParamMatch?.[1]) {
      cid = cidParamMatch[1]
    } else if (cidHexMatch?.[1]) {
      cid = BigInt('0x' + cidHexMatch[1]).toString()
    }

    // 4. Places API ile place_id al (API key varsa)
    if (!placeId && apiKey) {
      if (cid) {
        placeId = await getPlaceIdFromCid(cid, apiKey)
      }
      if (!placeId && branchName) {
        placeId = await getPlaceIdFromText(branchName, apiKey)
      }
    }

    // 5. Review URL oluştur
    let reviewUrl: string
    if (placeId) {
      reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`
    } else if (cid) {
      reviewUrl = `https://local.google.com/place?id=${cid}&use=srp`
    } else {
      throw new Error('Geçerli bir Google Maps URL giriniz (CID veya place_id içermeli).')
    }

    // 6. Maps URL normalize et
    const mapsUrl = hasPlacePath
      ? decodedUrl.split('?')[0]
      : cid
        ? `https://www.google.com/maps?cid=${cid}`
        : targetUrl

    if (!branchName && !placeId && !cid) {
      throw new Error('Geçersiz Google Maps URL veya yer bilgisi bulunamadı.')
    }

    return {
      cid,
      placeId: placeId ?? undefined,
      reviewUrl,
      mapsUrl,
      branchName,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('Maps Parse Hatası:', error)
    throw new Error('URL çözümlenemedi: ' + message)
  }
}
