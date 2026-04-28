export function extractBranchNameFromMapsUrl(url: string) {
  if (!url) return null

  let decodedUrl = url
  try {
    decodedUrl = decodeURIComponent(url)
  } catch {
    // URL tam decode edilemiyorsa ham haliyle parse etmeyi deneriz.
  }

  const placeMatch = decodedUrl.match(/\/maps\/place\/([^/]+)/i)
  if (!placeMatch?.[1]) return null

  const name = placeMatch[1]
    .replace(/\+/g, ' ')
    .replace(/_/g, ' ')
    .trim()

  return name.length > 0 ? name : null
}

function safeDecode(url: string) {
  try {
    return decodeURIComponent(url)
  } catch {
    return url
  }
}

export function buildReviewUrlFromMapsUrl(url: string, fallbackCid?: string) {
  const decodedUrl = safeDecode(url)
  const cleanUrl = decodedUrl.split('?')[0]

  if (decodedUrl.includes('/maps/place/')) {
    if (cleanUrl.includes('!9m1!1b1')) return cleanUrl
    if (cleanUrl.includes('!16s')) return cleanUrl.replace('!16s', '!9m1!1b1!16s')
    if (cleanUrl.includes('/data=')) return `${cleanUrl}!9m1!1b1`
    return cleanUrl
  }

  let params: URLSearchParams
  try {
    params = new URL(decodedUrl).searchParams
  } catch {
    return fallbackCid ? `https://local.google.com/place?id=${fallbackCid}&use=srp` : null
  }
  const cidFromUrl = params.get('ludocid') ?? params.get('cid') ?? fallbackCid
  if (decodedUrl.includes('/search') && cidFromUrl) {
    const query = params.get('q') ?? ''
    const cidHex = BigInt(cidFromUrl).toString(16)
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&ludocid=${cidFromUrl}#lrd=0x0:0x${cidHex},3`
  }

  if (cidFromUrl) {
    return `https://local.google.com/place?id=${cidFromUrl}&use=srp`
  }

  return null
}
