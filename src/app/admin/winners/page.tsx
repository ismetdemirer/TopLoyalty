'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight, FiMap, FiInstagram, FiMapPin, FiAward } from 'react-icons/fi'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import {
  LogsGrid,
  FilterCard,
  FilterTitle,
  FilterRow,
  LogTableCard,
  TableScrollWrap,
  LogTable,
  LogTh,
  LogTr,
  LogTd,
  LogEmptyTd,
  ActionBadge,
  PaginationRow,
  PaginationInfo,
  PaginationButtons,
} from '../logs/page.styles'

interface WinnerItem {
  id: string
  customerName: string
  createdAt: string
  reward: { name: string }
  branch: {
    name: string
    verificationType: 'MAPS' | 'INSTAGRAM'
    instagramLocationTag: string | null
  }
  submission: {
    ipAddress: string
    ipCity: string | null
    ipRegion: string | null
    ipDistrict: string | null
    ipCountry: string | null
    verificationNote: string | null
  } | null
}

interface BrandItem { id: string; name: string }

const PAGE_SIZE = 50

export default function AdminWinnersPage() {
  const [items, setItems] = useState<WinnerItem[]>([])
  const [total, setTotal] = useState(0)
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [brandId, setBrandId] = useState('')
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) setBrands(await res.json())
    } catch { /* sessiz hata */ }
  }, [])

  const fetchWinners = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (brandId) params.set('brandId', brandId)
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(offset))
      const res = await fetch(`/api/winners?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? [])
        setTotal(data.total ?? 0)
      }
    } catch { /* sessiz hata */ }
    finally {
      setLoading(false)
    }
  }, [brandId, offset])

  useEffect(() => { fetchBrands() }, [fetchBrands])
  useEffect(() => { fetchWinners() }, [fetchWinners])

  const brandOptions = [{ value: '', label: 'Tüm Markalar' }, ...brands.map(b => ({ value: b.id, label: b.name }))]
  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const formatDate = (d: string) => new Date(d).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const formatLocation = (item: WinnerItem) => {
    const s = item.submission
    if (!s) return '\u2014'
    const parts = [s.ipCity, s.ipRegion, s.ipDistrict].filter(Boolean)
    if (parts.length === 0) return s.ipAddress || '\u2014'
    return parts.join(' / ')
  }

  if (loading) return <Loading visible={true} />

  return (
    <LogsGrid>
      <FilterCard>
        <FilterTitle>Kazananlar</FilterTitle>
        <FilterRow>
          <Select
            label="Marka"
            options={brandOptions}
            value={brandId}
            onChange={(v) => { setBrandId(v); setOffset(0) }}
          />
        </FilterRow>
      </FilterCard>

      <LogTableCard>
        <TableScrollWrap>
          <LogTable>
            <thead>
              <tr>
                <LogTh>Müşteri</LogTh>
                <LogTh>Ödül</LogTh>
                <LogTh>Şube</LogTh>
                <LogTh>Kurgu</LogTh>
                <LogTh>Konum (IP)</LogTh>
                <LogTh>IP Adresi</LogTh>
                <LogTh>Tarih</LogTh>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><LogEmptyTd colSpan={7}>Henüz kayıt yok</LogEmptyTd></tr>
              ) : items.map(item => (
                <LogTr key={item.id}>
                  <LogTd $bold>
                    {item.customerName || '\u2014'}
                  </LogTd>
                  <LogTd>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiAward size={14} style={{ color: '#F59E0B' }} />
                      {item.reward?.name || '\u2014'}
                    </span>
                  </LogTd>
                  <LogTd>{item.branch?.name || '\u2014'}</LogTd>
                  <LogTd>
                    {item.branch?.verificationType === 'INSTAGRAM' ? (
                      <ActionBadge $bg="rgba(225,48,108,0.10)" $color="#E1306C">
                        <FiInstagram size={12} style={{ marginRight: 4 }} /> Instagram
                      </ActionBadge>
                    ) : (
                      <ActionBadge $bg="rgba(66,133,244,0.10)" $color="#4285F4">
                        <FiMap size={12} style={{ marginRight: 4 }} /> Maps
                      </ActionBadge>
                    )}
                  </LogTd>
                  <LogTd>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiMapPin size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                      {formatLocation(item)}
                    </span>
                  </LogTd>
                  <LogTd style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>
                    {item.submission?.ipAddress || '\u2014'}
                  </LogTd>
                  <LogTd style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                    {formatDate(item.createdAt)}
                  </LogTd>
                </LogTr>
              ))}
            </tbody>
          </LogTable>
        </TableScrollWrap>

        <PaginationRow>
          <PaginationInfo>{total} kayıt \u2014 Sayfa {page} / {totalPages || 1}</PaginationInfo>
          <PaginationButtons>
            <Button size="sm" variant="outline" iconLeft={<FiChevronLeft />} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))} disabled={offset === 0}>Önceki</Button>
            <Button size="sm" variant="outline" iconRight={<FiChevronRight />} onClick={() => setOffset(offset + PAGE_SIZE)} disabled={page >= totalPages}>Sonraki</Button>
          </PaginationButtons>
        </PaginationRow>
      </LogTableCard>
    </LogsGrid>
  )
}
