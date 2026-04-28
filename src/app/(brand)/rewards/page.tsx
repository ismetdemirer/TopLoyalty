'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  FiPlus,
  FiGift,
  FiTrash2,
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
  branch?: { id: string; name: string }
  stocks?: RewardStock[]
}

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function BrandRewardsPage() {
  const [items, setItems] = useState<RewardItem[]>([])
  const [branches, setBranches] = useState<BranchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState<MsgState | null>(null)

  // Form alanları
  const [formBranchId, setFormBranchId] = useState('')
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formDailyLimit, setFormDailyLimit] = useState('100')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches')
      if (res.ok) {
        const data: BranchItem[] = await res.json()
        setBranches(data)
        if (data.length > 0) {
          setFormBranchId((prev) => prev || data[0].id)
        }
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Şubeler yüklenemedi.' })
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchRewards(), fetchBranches()]).finally(() => {
      setLoading(false)
    })
  }, [fetchRewards, fetchBranches])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setFormName('')
    setFormDesc('')
    setFormImageUrl('')
    setFormDailyLimit('100')
    setImageFile(null)
    setImagePreview('')
    setShowForm(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formBranchId) return

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
          dailyLimit: Number(formDailyLimit) || 100,
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

  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }))

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
        <Title>Ödüller</Title>
        {!showForm && (
          <Button size="md" iconLeft={<FiPlus />} onClick={() => setShowForm(true)}>
            Yeni Ödül Ekle
          </Button>
        )}
      </Header>

      {showForm && (
        <FormCard>
          <FormTitle>Yeni Ödül Ekle</FormTitle>
          <FormGrid onSubmit={handleAdd}>
            <Select
              label="Şube Seç"
              placeholder="Şube seçin"
              options={branchOptions}
              value={formBranchId}
              onChange={setFormBranchId}
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
              label="Açıklama (Opsiyonel)"
              placeholder="Ödül açıklaması"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
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
            <Input
              label="Günlük Stok/Limit"
              type="number"
              placeholder="100"
              value={formDailyLimit}
              onChange={(e) => setFormDailyLimit(e.target.value)}
              iconLeft={<FiLayers />}
            />
            <FormActions>
              <Button type="submit" loading={adding} iconLeft={<FiPlus />}>Kaydet</Button>
              <Button type="button" variant="ghost" iconLeft={<FiX />} onClick={resetForm}>İptal</Button>
            </FormActions>
          </FormGrid>
        </FormCard>
      )}

      <CardGrid>
        {items.length === 0 ? (
          <EmptyCard>
            <EmptyIcon><FiGift /></EmptyIcon>
            <EmptyText>Henüz ödül tanımı eklenmemiş</EmptyText>
          </EmptyCard>
        ) : (
          items.map((item) => (
            <RewardCard key={item.id}>
              <CardTop>
                {item.imageUrl ? (
                  <RewardThumb src={item.imageUrl} alt={item.name} />
                ) : (
                  <ThumbPlaceholder><FiGift /></ThumbPlaceholder>
                )}
                <CardInfo>
                  <RewardName>{item.name}</RewardName>
                  <BranchLabel>{item.branch?.name || '-'}</BranchLabel>
                  <StockBadge>Günlük: {item.dailyLimit}</StockBadge>
                </CardInfo>
              </CardTop>

              <CardActions>
                <ActiveBadge $active={item.active}>
                  {item.active ? 'Aktif' : 'Pasif'}
                </ActiveBadge>
                {item.active && (
                  <DeleteBtn title="Pasife Al" onClick={() => handleDelete(item.id, item.name)}>
                    <FiTrash2 />
                  </DeleteBtn>
                )}
              </CardActions>
            </RewardCard>
          ))
        )}
      </CardGrid>
    </PageWrap>
  )
}
