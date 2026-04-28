import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { buildReviewUrlFromMapsUrl } from '@/lib/maps-url-utils'

function normalizeReviewUrl(reviewUrl: string, googleMapsCID: string, mapsUrl: string) {
  const fromMaps = buildReviewUrlFromMapsUrl(mapsUrl, googleMapsCID)
  if (fromMaps) {
    return fromMaps
  }

  const fromReview = buildReviewUrlFromMapsUrl(reviewUrl, googleMapsCID)
  if (fromReview) {
    return fromReview
  }

  if (reviewUrl.includes('writereview?cid=')) {
    return `https://local.google.com/place?id=${googleMapsCID}&use=srp`
  }
  return reviewUrl
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { brand: true }
    })
    if (!branch) return NextResponse.json({ error: 'Şube bulunamadı' }, { status: 404 })
    return NextResponse.json({
      ...branch,
      reviewUrl: normalizeReviewUrl(branch.reviewUrl, branch.googleMapsCID, branch.mapsUrl),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { name, reviewUrl, mapsUrl, verificationType, instagramLocationTag, placeId, googleMapsCID } = body

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(reviewUrl !== undefined && { reviewUrl }),
        ...(mapsUrl !== undefined && { mapsUrl }),
        ...(placeId !== undefined && { placeId }),
        ...(googleMapsCID !== undefined && { googleMapsCID }),
        ...(verificationType !== undefined && { verificationType }),
        ...(instagramLocationTag !== undefined && { instagramLocationTag }),
      },
    })
    return NextResponse.json(branch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

    const { id } = await params

    // Önce ilişkili kayıtları sil (cascade)
    // 1. RewardGiven kayıtlarını sil (submission üzerinden)
    const submissions = await prisma.reviewSubmission.findMany({ where: { branchId: id }, select: { id: true } })
    const submissionIds = submissions.map(s => s.id)
    if (submissionIds.length > 0) {
      await prisma.rewardGiven.deleteMany({ where: { submissionId: { in: submissionIds } } })
    }
    // 2. Submissions'ları sil
    await prisma.reviewSubmission.deleteMany({ where: { branchId: id } })

    // 3. Rewards için: önce RewardGiven ve RewardStock sil
    const rewards = await prisma.reward.findMany({ where: { branchId: id }, select: { id: true } })
    const rewardIds = rewards.map(r => r.id)
    if (rewardIds.length > 0) {
      await prisma.rewardGiven.deleteMany({ where: { rewardId: { in: rewardIds } } })
      await prisma.rewardStock.deleteMany({ where: { rewardId: { in: rewardIds } } })
      await prisma.reward.deleteMany({ where: { branchId: id } })
    }

    // 4. Şubeyi sil
    await prisma.branch.delete({ where: { id } })
    return NextResponse.json({ message: 'Şube silindi' })
  } catch (error: any) {
    console.error('Şube silme hatası:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
