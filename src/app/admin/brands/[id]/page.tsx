'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  FiShoppingBag,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiUploadCloud,
  FiSave,
  FiMapPin,
  FiPlus,
  FiMap,
  FiArrowRight,
  FiTrash2,
  FiDownload,
  FiGrid,
  FiExternalLink,
  FiRefreshCw,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete/PlacesAutocomplete'
import type { PlacesResult } from '@/components/ui/PlacesAutocomplete/PlacesAutocomplete'
import Checkbox from '@/components/ui/Checkbox'
import Loading from '@/components/ui/Loading'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox'
import { extractBranchNameFromMapsUrl } from '@/lib/maps-url-utils'
import {
  FormCard,
  FormTitle,
  FormDesc,
  FormFields,
  Divider,
  ButtonRow,
  SectionTitle,
  GridFields,
  TopSection,
  LogoUploadContainer,
  PreviewBox,
  HiddenFileInput,
} from '../new/page.styles'
import {
  StatusBadge,
  ActionBtn,
} from '../page.styles'
import {
  PageWrapper,
  BranchAddBox,
  BranchAddTitle,
  BranchAddForm,
  BranchName,
  LinkAnchor,
  BranchList,
  BranchCard,
  BranchCardTop,
  BranchCardLinks,
  BranchCardActions,
  EmptyState,
  CheckboxRow,
  QrButton,
  QRModalOverlay,
  QRModalBox,
  QRModalTitle,
  QRModalImage,
  QRModalActions,
} from './page.styles'

interface Branch {
  id: string
  name: string
  googleMapsCID: string
  mapsUrl: string
  reviewUrl: string
  active: boolean
  qrImagePath: string | null
  brandId?: string
}

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function EditBrandPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [active, setActive] = useState(true)
  const [brandSlug, setBrandSlug] = useState<string>('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<MsgState | null>(null)

  const [branches, setBranches] = useState<Branch[]>([])
  const [newBranchName, setNewBranchName] = useState('')
  const [newBranchUrl, setNewBranchUrl] = useState('')
  const [branchNameTouched, setBranchNameTouched] = useState(false)
  const [addingBranch, setAddingBranch] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [generatingQr, setGeneratingQr] = useState<string | null>(null)
  const [qrModal, setQrModal] = useState<{ path: string; name: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      fetchBrand()
      fetchBranches()
    }
  }, [id])

  const fetchBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${id}`)
      if (!res.ok) throw new Error('Marka bilgileri alınamadı')
      const data = await res.json()
      setName(data.name)
      setEmail(data.email)
      setContactName(data.contactName)
      setContactPhone(data.contactPhone)
      setLogoPreview(data.logoUrl)
      setActive(data.active)
      setBrandSlug(data.slug || '')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setLoading(false)
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await fetch(`/api/branches`)
      if (res.ok) {
        const data: Branch[] = await res.json()
        setBranches(data.filter((b) => b.brandId === id))
      }
    } catch (err) {
      console.error('Şubeler yüklenemedi')
    }
  }

  const handleGenerateQr = async (branchId: string) => {
    setGeneratingQr(branchId)
    try {
      const res = await fetch(`/api/branches/${branchId}/qr`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'QR kod oluşturulamadı')
      }
      fetchBranches()
      setMsg({ type: 'success', title: 'Başarılı', message: 'QR kod oluşturuldu.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setGeneratingQr(null)
    }
  }

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBranchUrl.trim()) return

    setAddingBranch(true)
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBranchName,
          googleMapsUrl: newBranchUrl,
          brandId: id,
          placeId: selectedPlaceId,
        }),
      })
      if (!res.ok) throw new Error('Şube eklenemedi')
      setNewBranchName('')
      setNewBranchUrl('')
      setBranchNameTouched(false)
      setSelectedPlaceId(null)
      fetchBranches()
      setMsg({ type: 'success', title: 'Başarılı', message: 'Şube eklendi.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setAddingBranch(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let finalLogoUrl = logoPreview
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          finalLogoUrl = uploadData.url
        }
      }

      const res = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, password: password.trim() || undefined,
          contactName, contactPhone, logoUrl: finalLogoUrl, active,
        }),
      })

      if (!res.ok) throw new Error('Güncelleme hatası')
      setMsg({ type: 'success', title: 'Güncellendi', message: 'Değişiklikler kaydedildi.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading visible={true} />

  return (
    <PageWrapper>
      <FormCard>
        <FormTitle>Marka Bilgileri</FormTitle>
        <FormDesc>Marka ayarlarını ve yetkili bilgilerini güncelleyin.</FormDesc>
        <FormFields onSubmit={handleSubmit}>
          <TopSection>
            <div>
              <Input label="Marka Adı" value={name} onChange={(e) => setName(e.target.value)} iconLeft={<FiShoppingBag />} required />
              <CheckboxRow>
                <Checkbox label="Marka Aktif" checked={active} onChange={setActive} />
              </CheckboxRow>
            </div>
            <LogoUploadContainer>
              <PreviewBox onClick={() => fileInputRef.current?.click()}>
                {logoPreview ? <img src={logoPreview} alt="Preview" /> : <><FiUploadCloud /><span>Logo Yükle</span></>}
              </PreviewBox>
              <HiddenFileInput type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
            </LogoUploadContainer>
          </TopSection>
          <Divider />
          <SectionTitle>Yetkili & Giriş</SectionTitle>
          <GridFields>
            <Input label="Yetkili Ad Soyad" value={contactName} onChange={(e) => setContactName(e.target.value)} iconLeft={<FiUser />} required />
            <Input label="Yetkili Telefon" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} iconLeft={<FiPhone />} required />
            <Input label="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} iconLeft={<FiMail />} required />
            <Input label="Yeni Şifre" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} iconLeft={<FiLock />} />
          </GridFields>
          <Divider />
          <ButtonRow>
            <Button type="submit" size="lg" loading={saving} iconLeft={<FiSave />}>Değişiklikleri Kaydet</Button>
            <Button type="button" variant="ghost" size="lg" onClick={() => router.push('/admin/brands')}>Vazgeç</Button>
          </ButtonRow>
        </FormFields>
      </FormCard>

      <FormCard>
        <FormTitle>Markaya Ait Şubeler</FormTitle>
        <FormDesc>Bu markaya yeni şube ekleyebilir veya mevcutları yönetebilirsiniz.</FormDesc>

        <BranchAddBox>
           <BranchAddTitle>Hızlı Şube Ekle</BranchAddTitle>
           <BranchAddForm onSubmit={handleAddBranch}>
              <PlacesAutocomplete
                label="Mekan Ara (Places API)"
                placeholder="Mekan adını yazın, listeden seçin..."
                onSelect={(result: PlacesResult) => {
                  setNewBranchName(result.name)
                  setNewBranchUrl(result.mapsUrl)
                  setSelectedPlaceId(result.placeId)
                  setBranchNameTouched(true)
                }}
              />
              <Input
                label="Şube Adı (Opsiyonel)"
                placeholder="Boş bırakılırsa linkten otomatik alınır"
                value={newBranchName}
                onChange={(e) => {
                  setBranchNameTouched(true)
                  setNewBranchName(e.target.value)
                }}
                iconLeft={<FiMapPin />}
              />
              <Input
                label="Maps URL"
                placeholder="Harita linki"
                value={newBranchUrl}
                onChange={(e) => {
                  const value = e.target.value
                  setNewBranchUrl(value)
                  if (!branchNameTouched || !newBranchName.trim()) {
                    const parsedName = extractBranchNameFromMapsUrl(value)
                    if (parsedName) {
                      setNewBranchName(parsedName)
                    }
                  }
                }}
                iconLeft={<FiMap />}
                required
              />
              <Button type="submit" loading={addingBranch} iconLeft={<FiPlus />}>Ekle</Button>
           </BranchAddForm>
        </BranchAddBox>

        <BranchList>
          {branches.length === 0 ? (
            <EmptyState>Bu markaya henüz şube eklenmemiş.</EmptyState>
          ) : (
            branches.map((b) => (
              <BranchCard key={b.id}>
                <BranchCardTop>
                  <BranchName>{b.name}</BranchName>
                  <StatusBadge $active={b.active}>{b.active ? 'Aktif' : 'Pasif'}</StatusBadge>
                </BranchCardTop>
                <BranchCardLinks>
                  {b.mapsUrl && (
                    <LinkAnchor href={b.mapsUrl} target="_blank" rel="noreferrer">
                      <FiMap /> Haritada Gör
                    </LinkAnchor>
                  )}
                  {b.reviewUrl && (
                    <LinkAnchor href={b.reviewUrl} target="_blank" rel="noreferrer">
                      <FiArrowRight /> Yorum Yaz
                    </LinkAnchor>
                  )}
                </BranchCardLinks>
                <BranchCardActions>
                  {b.qrImagePath ? (
                    <>
                      <QrButton type="button" $variant="download" onClick={() => setQrModal({ path: b.qrImagePath!, name: b.name })}>
                        <FiEye />Görüntüle
                      </QrButton>
                      <QrButton as="a" $variant="download" href={b.qrImagePath} download={`qr-${b.name}.png`}>
                        <FiDownload />İndir
                      </QrButton>
                      {brandSlug && (
                        <QrButton
                          as="a"
                          $variant="download"
                          href={`https://toployalty.raspyai.com/r/${brandSlug}?branch=${b.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FiExternalLink />QR Linki
                        </QrButton>
                      )}
                      <QrButton
                        type="button"
                        disabled={generatingQr === b.id}
                        onClick={() => handleGenerateQr(b.id)}
                      >
                        <FiRefreshCw />{generatingQr === b.id ? 'Yenileniyor...' : 'QR Yenile'}
                      </QrButton>
                    </>
                  ) : (
                    <QrButton disabled={generatingQr === b.id} onClick={() => handleGenerateQr(b.id)}>
                      <FiGrid />{generatingQr === b.id ? 'Üretiliyor...' : 'QR Üret'}
                    </QrButton>
                  )}
                  <ActionBtn $danger title="Sil" onClick={async () => {
                    if (window.confirm('Bu şubeyi silmek istediğinize emin misiniz?')) {
                      await fetch(`/api/branches/${b.id}`, { method: 'DELETE' })
                      fetchBranches()
                    }
                  }}>
                    <FiTrash2 />
                  </ActionBtn>
                </BranchCardActions>
              </BranchCard>
            ))
          )}
        </BranchList>
      </FormCard>

      {msg && <MessageBox type={msg.type} title={msg.title} message={msg.message} onClose={() => setMsg(null)} />}

      {qrModal && (
        <QRModalOverlay onClick={() => setQrModal(null)}>
          <QRModalBox onClick={(e) => e.stopPropagation()}>
            <QRModalTitle>{qrModal.name} — QR Kod</QRModalTitle>
            <QRModalImage src={qrModal.path} alt={`${qrModal.name} QR`} />
            <QRModalActions>
              <QrButton
                as="a"
                $variant="download"
                href={qrModal.path}
                download={`qr-${qrModal.name}.png`}
              >
                <FiDownload />İndir
              </QrButton>
              <QrButton type="button" onClick={() => setQrModal(null)}>
                Kapat
              </QrButton>
            </QRModalActions>
          </QRModalBox>
        </QRModalOverlay>
      )}
    </PageWrapper>
  )
}
