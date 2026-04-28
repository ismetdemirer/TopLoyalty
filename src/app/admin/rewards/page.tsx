'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  FiPlus,
  FiGift,
  FiTrash2,
  FiEdit2,
  FiUpload,
  FiLayers,
  FiX,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Loading from '@/components/ui/Loading'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox'
import {
  PageWrap,
  Header,
  Title,
  FormCard,
  FormTitle,
  FormGrid,
  FormActions,
  CardGrid,
  RewardCard,
  CardTop,
  RewardThumb,
  ThumbPlaceholder,
  CardInfo,
  RewardName,
  BrandLabel,
  BranchLabel,
  StockBadge,
  CardActions,
  DeleteBtn,
  ActiveBadge,
  EmptyCard,
  EmptyIcon,
  EmptyText,
  ImageUploadArea,
  UploadPlaceholder,
  UploadLabel,
} from './page.styles'

interface BrandItem {
  id: string
  name: string
}

interface BranchItem {
  id: string
  name: string
}

interface RewardStock {
  remainingCount: number
}

interface RewardItem {
  id: string
  name: string
  dailyLimit: number
  active: boolean
  imageUrl: string | null
  brandId: string
  branch?: { id: string; name: string }
  stocks?: RewardStock[]
  brand?: { id: string; name: string }
}

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function AdminRewardsPage() {
  const [items, setItems] = useState<RewardItem[]>([])
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [branches, setBranches] = useState<BranchItem[]>([])
  const [brandFilter, setBrandFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState<MsgState | null>(null)

  // Form alanları
  const [formBrandId, setFormBrandId] = useState('')
  const [formBranchId, setFormBranchId] = useState('')
  const [formName, setFormName] = useState('')
  const [formLimit, setFormLimit] = useState('10')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [stockModal, setStockModal] = useState<{ id: string; name: string; dailyLimit: number; currentStock: number | null } | null>(null)
  const [stockAmount, setStockAmount] = useState('')
  const [savingStock, setSavingStock] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data: BrandItem[] = await res.json()
        setBrands(data)
      }
    } catch {
      // Sessiz
    }
  }, [])

  const fetchRewards = useCallback(async () => {
    try {
      const res = await fetch('/api/rewards')
      if (res.ok) {
        const data: RewardItem[] = await res.json()
        setItems(data)
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Ödüller yüklenemedi.' })
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchBrands(), fetchRewards()]).finally(() => {
      setLoading(false)
    })
  }, [fetchBrands, fetchRewards])

  const fetchBranchesForBrand = useCallback(async (brandId: string) => {
    if (!brandId) {
      setBranches([])
      setFormBranchId('')
      return
    }
    setLoadingBranches(true)
    try {
      const res = await fetch(`/api/branches?brandId=${brandId}`)
      if (res.ok) {
        const data: BranchItem[] = await res.json()
        setBranches(data)
        if (data.length > 0) {
          setFormBranchId(data[0].id)
        } else {
          setFormBranchId('')
        }
      }
    } catch {
      setBranches([])
      setFormBranchId('')
    } finally {
      setLoadingBranches(false)
    }
  }, [])

  const handleBrandChange = (value: string) => {
    setFormBrandId(value)
    fetchBranchesForBrand(value)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setFormName('')
    setFormLimit('10')
    setFormImageUrl('')
    setImageFile(null)
    setImagePreview('')
    setShowForm(false)
  }

  const addReward = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formBranchId || !formBrandId) {
      setMsg({ type: 'warning', title: 'Eksik Alan', message: 'Marka, şube ve ödül adı zorunludur.' })
      return
    }

    setAdding(true)
    try {
      // Fotoğraf seçildiyse önce yükle
      let uploadedImageUrl = formImageUrl.trim() || undefined
      if (imageFile) {
        setUploading(true)
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })
        setUploading(false)
        if (!uploadRes.ok) {
          setMsg({ type: 'error', title: 'Hata', message: 'Fotoğraf yüklenemedi.' })
          return
        }
        const uploadJson = await uploadRes.json()
        uploadedImageUrl = uploadJson.url
      }

      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          dailyLimit: Number(formLimit) || 10,
          branchId: formBranchId,
          imageUrl: uploadedImageUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Ödül eklenemedi.' })
        return
      }

      setMsg({ type: 'success', title: 'Başarılı', message: 'Ödül başarıyla eklendi.' })
      resetForm()
      fetchRewards()
    } catch {
      setMsg({ type: 'error', title: 'Bağlantı Hatası', message: 'Sunucuya ulaşılamıyor.' })
    } finally {
      setAdding(false)
    }
  }

  const openStockModal = (item: RewardItem) => {
    setStockModal({
      id: item.id,
      name: item.name,
      dailyLimit: item.dailyLimit,
      currentStock: item.stocks?.[0]?.remainingCount ?? null,
    })
    setStockAmount(String(item.dailyLimit))
  }

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stockModal) return
    setSavingStock(true)
    try {
      const res = await fetch(`/api/rewards/${stockModal.id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalCount: Number(stockAmount) }),
      })
      if (res.ok) {
        setMsg({ type: 'success', title: 'Güncellendi', message: `${stockModal.name} için bugünkü stok ${stockAmount} olarak ayarlandı.` })
        setStockModal(null)
        fetchRewards()
      } else {
        const data = await res.json()
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Stok güncellenemedi.' })
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Bağlantı hatası.' })
    } finally {
      setSavingStock(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" ödülünü silmek istediğinize emin misiniz?`)) return
    try {
      const res = await fetch(`/api/rewards/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMsg({ type: 'success', title: 'Başarılı', message: 'Ödül pasife alındı.' })
        fetchRewards()
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Silme işlemi başarısız.' })
    }
  }

  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }))
  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }))

  const filteredItems = brandFilter
    ? items.filter((r) => r.brandId === brandFilter)
    : items

  if (loading) return <Loading visible />

  return (
    <PageWrap>
      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}

      <Header>
        <Title>Ödül Yönetimi</Title>
        {!showForm && (
          <Button size="md" iconLeft={<FiPlus />} onClick={() => setShowForm(true)}>
            Yeni Ödül Ekle
          </Button>
        )}
        {!showForm && brands.length > 1 && (
          <Select
            label=""
            placeholder="Tüm Markalar"
            options={brandOptions}
            value={brandFilter}
            onChange={setBrandFilter}
          />
        )}
      </Header>

      {showForm && (
        <FormCard>
          <FormTitle>Yeni Ödül Ekle</FormTitle>
          <FormGrid onSubmit={addReward}>
            <Select
              label="Marka Seç"
              placeholder="Marka seçin"
              options={brandOptions}
              value={formBrandId}
              onChange={handleBrandChange}
            />
            <Select
              label="Şube Seç"
              placeholder={loadingBranches ? 'Yükleniyor...' : 'Şube seçin'}
              options={branchOptions}
              value={formBranchId}
              onChange={setFormBranchId}
              disabled={!formBrandId || loadingBranches}
            />
            <Input
              label="Ödül Adı"
              placeholder="Örn: Medium Latte"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              iconLeft={<FiGift />}
              required
            />
            <Input
              label="Günlük Limit"
              type="number"
              placeholder="10"
              value={formLimit}
              onChange={(e) => setFormLimit(e.target.value)}
              iconLeft={<FiLayers />}
            />
            <div>
              <UploadLabel>Fotoğraf (Opsiyonel)</UploadLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                hidden
              />
              <ImageUploadArea
                $hasImage={!!imagePreview}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Önizleme" />
                ) : (
                  <UploadPlaceholder>
                    <FiUpload />
                    <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
                  </UploadPlaceholder>
                )}
              </ImageUploadArea>
            </div>
            <FormActions>
              <Button type="submit" loading={adding} iconLeft={<FiPlus />}>Kaydet</Button>
              <Button type="button" variant="ghost" iconLeft={<FiX />} onClick={resetForm}>İptal</Button>
            </FormActions>
          </FormGrid>
        </FormCard>
      )}

      <CardGrid>
        {filteredItems.length === 0 ? (
          <EmptyCard>
            <EmptyIcon><FiGift /></EmptyIcon>
            <EmptyText>Henüz ödül tanımı bulunmuyor</EmptyText>
          </EmptyCard>
        ) : (
          filteredItems.map((item) => (
            <RewardCard key={item.id}>
              <CardTop>
                {item.imageUrl ? (
                  <RewardThumb src={item.imageUrl} alt={item.name} />
                ) : (
                  <ThumbPlaceholder><FiGift /></ThumbPlaceholder>
                )}
                <CardInfo>
                  <RewardName>{item.name}</RewardName>
                  {item.brand && <BrandLabel>{item.brand.name}</BrandLabel>}
                  <BranchLabel>{item.branch?.name || '-'}</BranchLabel>
                  <StockBadge $low={(item.stocks?.[0]?.remainingCount ?? 0) <= 2}>
                    Günlük: {item.dailyLimit} / Kalan: {item.stocks?.[0]?.remainingCount ?? '-'}
                  </StockBadge>
                </CardInfo>
              </CardTop>

              <CardActions>
                <ActiveBadge $active={item.active}>
                  {item.active ? 'Aktif' : 'Pasif'}
                </ActiveBadge>
                {item.active && (
                  <>
                    <DeleteBtn title="Stok Güncelle" onClick={() => openStockModal(item)} style={{ color: '#0F766E' }}>
                      <FiEdit2 />
                    </DeleteBtn>
                    <DeleteBtn title="Pasife Al" onClick={() => handleDelete(item.id, item.name)}>
                      <FiTrash2 />
                    </DeleteBtn>
                  </>
                )}
              </CardActions>
            </RewardCard>
          ))
        )}
      </CardGrid>

      {stockModal && (
        <div
          onClick={() => setStockModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 28,
              width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>
              Stok Güncelle
            </h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '0.9rem' }}>
              {stockModal.name}
            </p>

            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Günlük limit:</span>
                <span style={{ fontWeight: 600 }}>{stockModal.dailyLimit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Bugün kalan:</span>
                <span style={{ fontWeight: 600, color: stockModal.currentStock === null ? '#94a3b8' : stockModal.currentStock <= 2 ? '#ef4444' : '#059669' }}>
                  {stockModal.currentStock === null ? 'Stok girilmemiş' : stockModal.currentStock}
                </span>
              </div>
            </div>

            <form onSubmit={handleStockUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                label="Bugün için stok miktarı"
                type="number"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
                iconLeft={<FiLayers />}
                required
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Button type="submit" loading={savingStock} style={{ flex: 1 }}>
                  Kaydet
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStockModal(null)}>
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrap>
  )
}
