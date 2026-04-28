'use client'

import { useEffect, useState } from 'react'
import { FiMapPin, FiGift, FiCheckCircle, FiClock } from 'react-icons/fi'
import Loading from '@/components/ui/Loading'
import {
  DashboardGrid,
  StatGrid,
  StatCard,
  StatIconWrap,
  StatContent,
  StatValue,
  StatLabel,
  StatSub,
  PlaceholderCard,
  PlaceholderTitle,
  PlaceholderDesc,
} from './page.styles'

interface BrandStats {
  branchCount: number
  todaySubmissions: number
  todayRewardsGiven: number
  pendingSubmissions: number
  totalRewardsGiven: number
}

type CardVariant = 'teal' | 'amber' | 'success' | 'info'

interface StatCardItem {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  variant: CardVariant
  href: string
}

export default function BrandDashboardPage() {
  const [stats, setStats] = useState<BrandStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data: BrandStats = await res.json()
          setStats(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loading visible />

  const cards: StatCardItem[] = [
    {
      label: 'Aktif Şube',
      value: String(stats?.branchCount ?? 0),
      sub: 'Şubeleri görüntüle',
      icon: <FiMapPin />,
      variant: 'teal',
      href: '/branches',
    },
    {
      label: 'Bugün Yorum',
      value: String(stats?.todaySubmissions ?? 0),
      sub: 'Raporları görüntüle',
      icon: <FiCheckCircle />,
      variant: 'amber',
      href: '/reports',
    },
    {
      label: 'Bugün Ödül',
      value: String(stats?.todayRewardsGiven ?? 0),
      sub: `Toplam: ${stats?.totalRewardsGiven ?? 0}`,
      icon: <FiGift />,
      variant: 'success',
      href: '/rewards',
    },
    {
      label: 'Bekleyen Doğrulama',
      value: String(stats?.pendingSubmissions ?? 0),
      sub: 'İnceleme bekliyor',
      icon: <FiClock />,
      variant: 'info',
      href: '/reports',
    },
  ]

  return (
    <DashboardGrid>
      <StatGrid>
        {cards.map((c) => (
          <StatCard key={c.label} href={c.href}>
            <StatIconWrap $variant={c.variant}>{c.icon}</StatIconWrap>
            <StatContent>
              <StatValue>{c.value}</StatValue>
              <StatLabel>{c.label}</StatLabel>
              <StatSub>{c.sub}</StatSub>
            </StatContent>
          </StatCard>
        ))}
      </StatGrid>

      <PlaceholderCard>
        <PlaceholderTitle>Günlük Görünüm</PlaceholderTitle>
        <PlaceholderDesc>
          Takvim ve ödül trendleri yakında bu panelde aktif olacak.
        </PlaceholderDesc>
      </PlaceholderCard>
    </DashboardGrid>
  )
}
