'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiFilter } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Loading from '@/components/ui/Loading'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox/MessageBox'
import {
  ReportsGrid,
  FilterCard,
  FilterTitle,
  FilterRow,
  FilterActions,
  ReportTableCard,
  TableScrollWrap,
  ReportTable,
  ReportTh,
  ReportTr,
  ReportTd,
  ReportEmptyTd,
} from './page.styles'

interface BranchItem {
  id: string
  name: string
}

interface ReportItem {
  id: string
  customerName: string
  branch: { id: string; name: string }
  reward: { id: string; name: string }
  ipAddress: string
  createdAt: string
}

export default function BrandReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([])
  const [branches, setBranches] = useState<BranchItem[]>([])
  const [branchId, setBranchId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ type: MessageBoxType; title: string; message: string } | null>(null)

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches')
      if (res.ok) {
        const data: BranchItem[] = await res.json()
        setBranches(data)
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Şubeler yüklenemedi.' })
    }
  }, [])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (branchId) params.set('branchId', branchId)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      const res = await fetch(`/api/reports?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? [])
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Raporlar yüklenemedi.' })
    } finally {
      setLoading(false)
    }
  }, [branchId, startDate, endDate])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }))

  const handleFilter = () => {
    fetchReports()
  }

  return (
    <ReportsGrid>
      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}

      <FilterCard>
        <FilterTitle>Filtreler</FilterTitle>
        <FilterRow>
          <Select
            label="Şube"
            placeholder="Tüm Şubeler"
            options={branchOptions}
            value={branchId}
            onChange={setBranchId}
          />
          <Input
            label="Başlangıç Tarihi"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Bitiş Tarihi"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <FilterActions>
            <Button iconLeft={<FiFilter />} onClick={handleFilter} size="md">
              Filtrele
            </Button>
          </FilterActions>
        </FilterRow>
      </FilterCard>

      <ReportTableCard>
        {loading ? (
          <Loading visible variant="inline" />
        ) : (
          <TableScrollWrap>
            <ReportTable>
              <thead>
                <tr>
                  <ReportTh>Müşteri</ReportTh>
                  <ReportTh>Şube</ReportTh>
                  <ReportTh>Ödül</ReportTh>
                  <ReportTh>Tarih</ReportTh>
                  <ReportTh>IP</ReportTh>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <ReportEmptyTd colSpan={5}>
                      Henüz ödül kazanımı bulunmuyor.
                    </ReportEmptyTd>
                  </tr>
                ) : (
                  items.map((r) => (
                    <ReportTr key={r.id}>
                      <ReportTd $bold>{r.customerName}</ReportTd>
                      <ReportTd>{r.branch?.name ?? '-'}</ReportTd>
                      <ReportTd>{r.reward?.name ?? '-'}</ReportTd>
                      <ReportTd>{formatDate(r.createdAt)}</ReportTd>
                      <ReportTd $muted>{r.ipAddress}</ReportTd>
                    </ReportTr>
                  ))
                )}
              </tbody>
            </ReportTable>
          </TableScrollWrap>
        )}
      </ReportTableCard>
    </ReportsGrid>
  )
}
