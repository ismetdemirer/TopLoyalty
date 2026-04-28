/**
 * placeId üzerinden Google Maps !9m1!1b1 formatında review URL üretir.
 * Bu format Google Maps'te doğrudan Yorumlar sekmesini açar.
 */

export async function buildReviewUrlForPlaceId(placeId: string): Promise<{
  reviewUrl: string
  mapsUrl: string
}> {
  const fallback = {
    reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return fallback

  try {
    // Places API v1 — isim, koordinat ve CID
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,location,googleMapsUri&key=${apiKey}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    const data = await res.json()

    const name: string = data?.displayName?.text
    const lat: number = data?.location?.latitude
    const lng: number = data?.location?.longitude
    const googleMapsUri: string = data?.googleMapsUri ?? ''

    if (!name || !lat || !lng) return fallback

    // CID'yi googleMapsUri'den çıkar
    const cidMatch = googleMapsUri.match(/[?&]cid=(\d+)/)
    const cid = cidMatch?.[1] ?? null

    // URL encode: boşluk → +
    const encodedName = name
      .split(' ')
      .map((w: string) => encodeURIComponent(w))
      .join('+')

    const latStr = lat.toFixed(7)
    const lngStr = lng.toFixed(7)

    let reviewUrl: string
    let mapsUrl: string

    const base = `https://www.google.com/maps/place/${encodedName}/@${latStr},${lngStr},17z`

    if (cid) {
      const cidHex = BigInt(cid).toString(16)
      reviewUrl = `${base}/data=!4m2!3m1!1s0x0:0x${cidHex}!9m1!1b1`
    } else {
      reviewUrl = `${base}/data=!3m1!4b1!9m1!1b1`
    }

    // mapsUrl: /data=!3m1!4b1 içeriyor — buildReviewUrlFromMapsUrl !9m1!1b1 ekleyebilir
    mapsUrl = `${base}/data=!3m1!4b1`

    return { reviewUrl, mapsUrl }
  } catch {
    return fallback
  }
}
