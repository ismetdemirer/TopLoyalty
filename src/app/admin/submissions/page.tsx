'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight, FiMap, FiInstagram, FiMapPin, FiGift, FiTrash2 } from 'react-icons/fi'
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

interface SubmissionItem {
  id: string
  customerName: string | null
  aiDetectedName: string | null
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  verificationNote: string | null
  ipAddress: string
  ipCity: string | null
  ipRegion: string | null
  ipDistrict: string | null
  createdAt: string
  brand: { name: string } | null
  branch: {
    name: string
    verificationType: 'MAPS' | 'INSTAGRAM'
    instagramLocationTag: string | null
  } | null
  rewardGiven: {
    reward: { name: string }
  } | null
}

interface BrandItem { id: string; name: string }

const PAGE_SIZE = 50

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  APPROVED: { bg: 'rgba(16,185,129,0.12)', color: '#059669', label: 'Onaylı' },
  REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#DC2626', label: 'Reddedildi' },
  PENDING:  { bg: 'rgba(245,158,11,0.12)', color: '#D97706', label: 'Bekliyor' },
}

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<SubmissionItem[]>([])
  const [total, setTotal] = useState(0)
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [brandId, setBrandId] = useState('')
  const [status, setStatus] = useState('')
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) setBrands(await res.json())
    } catch { /* sessiz hata */ }
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (brandId) params.set('brandId', brandId)
      if (status) params.set('status', status)
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(offset))
      const res = await fetch(`/api/submissions-list?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? [])
        setTotal(data.total ?? 0)
      }
    } catch { /* sessiz hata */ }
    finally {
      setLoading(false)
    }
  }, [brandId, status, offset])

  useEffect(() => { fetchBrands() }, [fetchBrands])
  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const brandOptions = [{ value: '', label: 'Tüm Markalar' }, ...brands.map(b => ({ value: b.id, label: b.name }))]
  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'APPROVED', label: 'Onaylı' },
    { value: 'REJECTED', label: 'Reddedildi' },
    { value: 'PENDING', label: 'Bekliyor' },
  ]

  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const formatDate = (d: string) => new Date(d).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const formatLocation = (item: SubmissionItem) => {
    const parts = [item.ipCity, item.ipRegion, item.ipDistrict].filter(Boolean)
    return parts.length > 0 ? parts.join(' / ') : null
  }

  const getName = (item: SubmissionItem) => item.customerName || item.aiDetectedName || '\u2014'

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Bu başvuru kaydı silinecek. Emin misiniz?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id))
        setTotal(prev => prev - 1)
      } else {
        const data = await res.json()
        alert(data.error || 'Silinemedi.')
      }
    } catch {
      alert('Silinemedi.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loading visible={true} />

  return (
    <LogsGrid>
      <FilterCard>
        <FilterTitle>Başvurular</FilterTitle>
        <FilterRow style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 600 }}>
          <Select label="Marka" options={brandOptions} value={brandId} onChange={(v) => { setBrandId(v); setOffset(0) }} />
          <Select label="Durum" options={statusOptions} value={status} onChange={(v) => { setStatus(v); setOffset(0) }} />
        </FilterRow>
      </FilterCard>

      <LogTableCard>
        <TableScrollWrap>
          <LogTable>
            <thead>
              <tr>
                <LogTh>Durum</LogTh>
                <LogTh>Müşteri</LogTh>
                <LogTh>Marka / Şube</LogTh>
                <LogTh>Kurgu</LogTh>
                <LogTh>Konum</LogTh>
                <LogTh>IP</LogTh>
                <LogTh>Ödül</LogTh>
                <LogTh>Not</LogTh>
                <LogTh>Tarih</LogTh>
                <LogTh>İşlem</LogTh>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><LogEmptyTd colSpan={10}>Henüz kayıt yok</LogEmptyTd></tr>
              ) : items.map(item => {
                const st = STATUS_STYLES[item.verificationStatus] || STATUS_STYLES.PENDING
                const location = formatLocation(item)
                return (
                  <LogTr key={item.id}>
                    <LogTd>
                      <ActionBadge $bg={st.bg} $color={st.color}>
                        {st.label}
                      </ActionBadge>
                    </LogTd>
                    <LogTd $bold>
                      {getName(item)}
                    </LogTd>
                    <LogTd>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.brand?.name || '\u2014'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.branch?.name || '\u2014'}</div>
                    </LogTd>
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
                      {location ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiMapPin size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                          {location}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                          {item.ipAddress === 'bilinmiyor' ? '\u2014' : 'Yerel IP'}
                        </span>
                      )}
                    </LogTd>
                    <LogTd style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                      {item.ipAddress || '\u2014'}
                    </LogTd>
                    <LogTd>
                      {item.rewardGiven ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#F59E0B', fontSize: '0.82rem', fontWeight: 600 }}>
                          <FiGift size={13} />
                          {item.rewardGiven.reward.name}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{'\u2014'}</span>
                      )}
                    </LogTd>
                    <LogTd style={{ maxWidth: 220, fontSize: '0.78rem', color: '#64748b', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.4' }}>
                      {item.verificationNote || '\u2014'}
                    </LogTd>
                    <LogTd style={{ color: '#64748b', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {formatDate(item.createdAt)}
                    </LogTd>
                    <LogTd>
                      <button
                        onClick={() => handleDeleteSubmission(item.id)}
                        disabled={deleting === item.id}
                        title="Sil"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: deleting === item.id ? '#cbd5e1' : '#ef4444',
                          padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center'
                        }}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </LogTd>
                  </LogTr>
                )
              })}
            </tbody>
          </LogTable>
        </TableScrollWrap>

        <PaginationRow>
          <PaginationInfo>{total} kayıt {'\u2014'} Sayfa {page} / {totalPages || 1}</PaginationInfo>
          <PaginationButtons>
            <Button size="sm" variant="outline" iconLeft={<FiChevronLeft />} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))} disabled={offset === 0}>Önceki</Button>
            <Button size="sm" variant="outline" iconRight={<FiChevronRight />} onClick={() => setOffset(offset + PAGE_SIZE)} disabled={page >= totalPages}>Sonraki</Button>
          </PaginationButtons>
        </PaginationRow>
      </LogTableCard>
    </LogsGrid>
  )
}
