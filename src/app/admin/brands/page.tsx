'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox'
import {
  TopBar,
  SearchWrap,
  TableCard,
  TableWrap,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  BrandCell,
  BrandAvatar,
  BrandName,
  StatusBadge,
  ActionGroup,
  ActionBtn,
  EmptyState,
  EmptyIcon,
  EmptyText,
  DateText,
} from './page.styles'

interface Brand {
  id: string
  name: string
  logoUrl: string | null
  active: boolean
  createdAt: string
  _count: {
    branches: number
  }
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState<{ type: MessageBoxType, title: string, message: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data = await res.json()
        setBrands(data)
      }
    } catch (err) {
      console.error('Markalar getirilirken hata oluştu:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMsg({ type: 'success', title: 'Silindi', message: 'Marka başarıyla silindi.' })
        fetchBrands() // Listeyi tazele
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (err: any) {
      setMsg({ type: 'error', title: 'Hata', message: err.message })
    }
  }

  const filtered = useMemo(
    () =>
      brands.filter((b) =>
        b.name.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'))
      ),
    [search, brands]
  )

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) return <Loading visible={true} />

  return (
    <>
      <TopBar>
        <SearchWrap>
          <Input
            placeholder="Marka ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<FiSearch />}
          />
        </SearchWrap>
        <Link href="/admin/brands/new">
          <Button size="md" iconLeft={<FiPlus />}>
            Yeni Marka
          </Button>
        </Link>
      </TopBar>

      <TableCard>
        {filtered.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiShoppingBag />
            </EmptyIcon>
            <EmptyText>{brands.length === 0 ? 'Henüz marka eklenmemiş' : 'Sonuç bulunamadı'}</EmptyText>
          </EmptyState>
        ) : (
          <TableWrap>
            <Table>
              <Thead>
                <tr>
                  <Th>Marka Adı</Th>
                  <Th>Şube Sayısı</Th>
                  <Th>Durum</Th>
                  <Th>Kayıt Tarihi</Th>
                  <Th>İşlemler</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map((brand) => (
                  <Tr
                    key={brand.id}
                    $clickable
                    onClick={() => router.push(`/admin/brands/${brand.id}`)}
                  >
                    <Td>
                      <BrandCell>
                        <BrandAvatar>
                          {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.name} />
                          ) : (
                            brand.name.charAt(0)
                          )}
                        </BrandAvatar>
                        <BrandName>{brand.name}</BrandName>
                      </BrandCell>
                    </Td>
                    <Td>{brand._count.branches} şube</Td>
                    <Td>
                      <StatusBadge $active={brand.active}>
                        {brand.active ? 'Aktif' : 'Pasif'}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <DateText>{formatDate(brand.createdAt)}</DateText>
                    </Td>
                    <Td>
                      <ActionGroup>
                        <ActionBtn
                          title="Düzenle"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/brands/${brand.id}`)
                          }}
                        >
                          <FiEdit2 />
                        </ActionBtn>
                        <ActionBtn
                          $danger
                          title="Sil"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm(`${brand.name} markasını silmek istediğinize emin misiniz?`)) {
                              handleDelete(brand.id)
                            }
                          }}
                        >
                          <FiTrash2 />
                        </ActionBtn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </TableCard>

      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}
    </>
  )
}
