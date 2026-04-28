'use client'

import React, { useState, useEffect } from 'react'
import { FiShoppingBag, FiMapPin, FiFileText, FiGift } from 'react-icons/fi'
import Loading from '@/components/ui/Loading'
import {
  DashboardGrid,
  StatCard,
  StatIconWrap,
  StatContent,
  StatValue,
  StatLabel,
  StatChange,
  SectionTitle,
  RecentCard,
  RecentList,
  RecentItemLink,
  RecentAvatar,
  RecentInfo,
  RecentName,
  RecentMeta,
  StatusPill,
} from './page.styles'

interface RecentBrand {
  id: string
  name: string
  logoUrl: string | null
  createdAt: string
  _count: { branches: number }
}

interface AdminStats {
  totalBrands: number
  totalBranches: number
  totalSubmissions: number
  totalRewardsGiven: number
  recentBrands: RecentBrand[]
}

type CardVariant = 'teal' | 'amber' | 'success' | 'info'

interface StatItem {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
  variant: CardVariant
  href: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data: AdminStats = await res.json()
          setStats(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loading visible />

  const statCards: StatItem[] = [
    {
      icon: <FiShoppingBag />,
      label: 'Toplam Marka',
      value: String(stats?.totalBrands ?? 0),
      change: `${stats?.recentBrands?.length ?? 0} son eklenen`,
      positive: true,
      variant: 'teal',
      href: '/admin/brands',
    },
    {
      icon: <FiMapPin />,
      label: 'Aktif Şube',
      value: String(stats?.totalBranches ?? 0),
      change: 'Şubeleri görüntüle',
      positive: true,
      variant: 'amber',
      href: '/admin/branches',
    },
    {
      icon: <FiFileText />,
      label: 'Toplam Başvuru',
      value: String(stats?.totalSubmissions ?? 0),
      change: 'Tüm zamanlar',
      positive: true,
      variant: 'success',
      href: '/admin/logs',
    },
    {
      icon: <FiGift />,
      label: 'Verilen Ödül',
      value: String(stats?.totalRewardsGiven ?? 0),
      change: 'Ödülleri görüntüle',
      positive: true,
      variant: 'info',
      href: '/admin/rewards',
    },
  ]

  const recentBrands = stats?.recentBrands ?? []

  return (
    <>
      <DashboardGrid>
        {statCards.map((s) => (
          <StatCard key={s.label} href={s.href}>
            <StatIconWrap $variant={s.variant}>{s.icon}</StatIconWrap>
            <StatContent>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
              <StatChange $positive={s.positive}>{s.change}</StatChange>
            </StatContent>
          </StatCard>
        ))}
      </DashboardGrid>

      <SectionTitle>Son Eklenen Markalar</SectionTitle>
      <RecentCard>
        <RecentList>
          {recentBrands.length === 0 ? (
            <RecentItemLink href="/admin/brands/new">
              <RecentInfo>
                <RecentName>Henüz marka eklenmemiş — eklemek için tıklayın</RecentName>
              </RecentInfo>
            </RecentItemLink>
          ) : (
            recentBrands.map((brand) => (
              <RecentItemLink key={brand.id} href={`/admin/brands/${brand.id}`}>
                <RecentAvatar>{brand.name.charAt(0).toUpperCase()}</RecentAvatar>
                <RecentInfo>
                  <RecentName>{brand.name}</RecentName>
                  <RecentMeta>
                    {new Date(brand.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' · '}
                    {brand._count.branches} şube
                  </RecentMeta>
                </RecentInfo>
                <StatusPill $active>Aktif</StatusPill>
              </RecentItemLink>
            ))
          )}
        </RecentList>
      </RecentCard>
    </>
  )
}
