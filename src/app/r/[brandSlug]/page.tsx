import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReviewFlowClient from './ReviewFlowClient'

export default async function PublicReviewPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>
}) {
  const { brandSlug } = await params

  const brand = await prisma.brand.findUnique({
    where: { slug: brandSlug },
    include: {
      branches: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
      rewards: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!brand) {
    notFound()
  }

  return (
    <ReviewFlowClient
      brand={{ name: brand.name, logoUrl: brand.logoUrl }}
      branches={brand.branches.map((b) => ({
        id: b.id,
        name: b.name,
        reviewUrl: b.reviewUrl,
        verificationType: b.verificationType,
        instagramLocationTag: b.instagramLocationTag,
      }))}
      rewards={brand.rewards.map((r) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.imageUrl,
        branchId: r.branchId,
      }))}
    />
  )
}
