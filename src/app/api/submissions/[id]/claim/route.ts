import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { customerName } = await req.json()

    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: 'Ad soyad gereklidir.' }, { status: 400 })
    }

    // Submission'ı bul
    const submission = await prisma.reviewSubmission.findUnique({
      where: { id },
      include: { rewardGiven: true },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 })
    }

    if (submission.verificationStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'Başvuru onaylı değil.' }, { status: 400 })
    }

    if (submission.rewardGiven) {
      return NextResponse.json({ error: 'Bu başvuru için zaten ödül verilmiş.' }, { status: 409 })
    }

    // customerName güncelle
    await prisma.reviewSubmission.update({
      where: { id },
      data: { customerName: customerName.trim() },
    })

    const today = todayStr()
    const branchId = submission.branchId

    // Ödül bul ve ver
    const activeRewards = await prisma.reward.findMany({
      where: { branchId, active: true },
      include: {
        stocks: { where: { date: today } },
      },
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
          submissionId: id,
          rewardId: selectedReward.id,
          brandId: submission.brandId,
          branchId,
          customerName: customerName.trim(),
        },
      })

      await prisma.rewardStock.update({
        where: { id: selectedStock.id },
        data: { remainingCount: selectedStock.remainingCount - 1 },
      })

      return NextResponse.json({
        reward: {
          id: selectedReward.id,
          name: selectedReward.name,
          imageUrl: selectedReward.imageUrl,
        },
      })
    }

    // Onaylı ama ödül yok
    return NextResponse.json({ reward: null })
  } catch (error: any) {
    console.error('Claim hatası:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
