'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  FiPlus,
  FiMapPin,
  FiTrash2,
  FiEdit2,
  FiLayout,
  FiMap,
  FiArrowRight,
  FiDownload,
  FiEye,
  FiGrid,
  FiX,
  FiInstagram,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete/PlacesAutocomplete'
import type { PlacesResult } from '@/components/ui/PlacesAutocomplete/PlacesAutocomplete'
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
  BranchCard,
  CardTop,
  BranchName,
  BranchAddress,
  CardInfo,
  QRSection,
  QRBadge,
  QRActionBtn,
  QRViewBtn,
  QRModalOverlay,
  QRModalBox,
  QRModalTitle,
  QRModalImage,
  QRModalActions,
  CardActions,
  DeleteBtn,
  LinkGroup,
  LinkAnchor,
  EmptyCard,
  EmptyIcon,
  EmptyText,
} from './page.styles'

interface Branch {
  id: string
  name: string
  googleMapsCID: string
  reviewUrl: string
  mapsUrl: string
  qrImagePath: string | null
  active: boolean
  createdAt: string
  verificationType: 'MAPS' | 'INSTAGRAM'
  instagramLocationTag: string | null
}

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function BrandBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [qrGenerating, setQrGenerating] = useState<string | null>(null)
  const [qrModal, setQrModal] = useState<{ path: string; name: string } | null>(null)
  const [msg, setMsg] = useState<MsgState | null>(null)

  // Edit state'leri
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [editName, setEditName] = useState('')
  const [editVerificationType, setEditVerificationType] = useState<'MAPS' | 'INSTAGRAM'>('MAPS')
  const [editInstagramTag, setEditInstagramTag] = useState('')
  const [saving, setSaving] = useState(false)

  // Form alanları
  const [formName, setFormName] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formMapsUrl, setFormMapsUrl] = useState('')
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [formVerificationType, setFormVerificationType] = useState<'MAPS' | 'INSTAGRAM'>('MAPS')
  const [formInstagramTag, setFormInstagramTag] = useState('')

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches')
      if (res.ok) {
        const data = await res.json()
        setBranches(data)
      }
    } catch (err) {
      console.error('Şubeler yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const resetForm = () => {
    setFormName('')
    setFormAddress('')
    setFormMapsUrl('')
    setSelectedPlaceId(null)
    setFormVerificationType('MAPS')
    setFormInstagramTag('')
    setShowForm(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    setAdding(true)
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          googleMapsUrl: formVerificationType === 'MAPS' ? (formMapsUrl.trim() || undefined) : undefined,
          placeId: formVerificationType === 'MAPS' ? selectedPlaceId : null,
          verificationType: formVerificationType,
          instagramLocationTag: formVerificationType === 'INSTAGRAM' ? formInstagramTag.trim() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Şube eklenemedi')

      setMsg({ type: 'success', title: 'Başarılı', message: 'Şube başarıyla eklendi.' })
      resetForm()
      fetchBranches()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" şubesini silmek istediğinize emin misiniz?`)) return
    try {
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMsg({ type: 'success', title: 'Silindi', message: 'Şube başarıyla silindi.' })
        fetchBranches()
      } else {
        const data = await res.json()
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Şube silinemedi.' })
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Şube silinemedi.' })
    }
  }

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setEditName(branch.name)
    setEditVerificationType(branch.verificationType || 'MAPS')
    setEditInstagramTag(branch.instagramLocationTag || '')
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBranch) return
    setSaving(true)
    try {
      const res = await fetch(`/api/branches/${editingBranch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          verificationType: editVerificationType,
          instagramLocationTag: editVerificationType === 'INSTAGRAM' ? editInstagramTag.trim() : null,
        }),
      })
      if (res.ok) {
        setMsg({ type: 'success', title: 'Güncellendi', message: 'Şube başarıyla güncellendi.' })
        setEditingBranch(null)
        fetchBranches()
      } else {
        const data = await res.json()
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Güncelleme başarısız.' })
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Güncelleme başarısız.' })
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateQR = async (id: string) => {
    setQrGenerating(id)
    try {
      const res = await fetch(`/api/branches/${id}/qr`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'QR üretilemedi')

      setMsg({ type: 'success', title: 'Başarılı', message: 'QR Kod üretildi.' })
      fetchBranches()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Beklenmeyen hata'
      setMsg({ type: 'error', title: 'Hata', message })
    } finally {
      setQrGenerating(null)
    }
  }

  if (loading) return <Loading visible={true} />

  return (
    <>
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
        <Title>Şubeler</Title>
        {!showForm && (
          <Button size="md" iconLeft={<FiPlus />} onClick={() => setShowForm(true)}>
            Yeni Şube Ekle
          </Button>
        )}
      </Header>

      {showForm && (
        <FormCard>
          <FormTitle>Yeni Şube Ekle</FormTitle>
          <FormGrid onSubmit={handleAdd}>
            {/* Doğrulama Kurgusu Seçici */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary, #1a1a2e)' }}>
                Doğrulama Kurgusu
              </label>
              <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--border-color, #e2e8f0)' }}>
                <button
                  type="button"
                  onClick={() => setFormVerificationType('MAPS')}
                  style={{
                    flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                    background: formVerificationType === 'MAPS' ? 'var(--accent-color, #F59E0B)' : 'transparent',
                    color: formVerificationType === 'MAPS' ? '#fff' : 'var(--text-secondary, #64748b)',
                  }}
                >
                  <FiMap size={16} /> Maps Kurgusu
                </button>
                <button
                  type="button"
                  onClick={() => setFormVerificationType('INSTAGRAM')}
                  style={{
                    flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                    background: formVerificationType === 'INSTAGRAM' ? 'var(--accent-color, #F59E0B)' : 'transparent',
                    color: formVerificationType === 'INSTAGRAM' ? '#fff' : 'var(--text-secondary, #64748b)',
                  }}
                >
                  <FiInstagram size={16} /> Instagram Kurgusu
                </button>
              </div>
            </div>

            {/* Maps Kurgusu alanları */}
            {formVerificationType === 'MAPS' && (
              <PlacesAutocomplete
                label="Mekan Ara (Places API)"
                placeholder="Mekan adını yazın, listeden seçin..."
                onSelect={(result: PlacesResult) => {
                  setFormName(result.name)
                  setFormMapsUrl(result.mapsUrl)
                  setSelectedPlaceId(result.placeId)
                }}
              />
            )}

            <Input
              label="Şube Adı"
              placeholder="Şube adını girin"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              iconLeft={<FiMapPin />}
              required
            />

            {/* Instagram Kurgusu alanı */}
            {formVerificationType === 'INSTAGRAM' && (
              <Input
                label="Instagram Konum Etiketi"
                placeholder="Örn: Spada Coffee Etiler"
                value={formInstagramTag}
                onChange={(e) => setFormInstagramTag(e.target.value)}
                iconLeft={<FiInstagram />}
              />
            )}

            {/* Maps Kurgusu ek alanları */}
            {formVerificationType === 'MAPS' && (
              <>
                <Input
                  label="Adres (Opsiyonel)"
                  placeholder="Şube adresi"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
                <Input
                  label="Google Maps URL (Opsiyonel)"
                  placeholder="https://maps.google.com/..."
                  value={formMapsUrl}
                  onChange={(e) => setFormMapsUrl(e.target.value)}
                  iconLeft={<FiMap />}
                />
              </>
            )}
            <FormActions>
              <Button type="submit" loading={adding} iconLeft={<FiPlus />}>Kaydet</Button>
              <Button type="button" variant="ghost" iconLeft={<FiX />} onClick={resetForm}>İptal</Button>
            </FormActions>
          </FormGrid>
        </FormCard>
      )}

      <CardGrid>
        {branches.length === 0 ? (
          <EmptyCard>
            <EmptyIcon><FiLayout /></EmptyIcon>
            <EmptyText>Henüz şube eklenmemiş</EmptyText>
          </EmptyCard>
        ) : (
          branches.map((b) => {
            const reviewHref = b.reviewUrl || b.mapsUrl

            return (
              <BranchCard key={b.id}>
                <CardTop>
                  <CardInfo>
                    <BranchName>{b.name}</BranchName>
                    {b.mapsUrl && (
                      <BranchAddress>{b.mapsUrl.substring(0, 60)}...</BranchAddress>
                    )}
                  </CardInfo>
                  <LinkGroup>
                    {b.mapsUrl && (
                      <LinkAnchor href={b.mapsUrl} target="_blank" rel="noreferrer" title="Haritada Gör">
                        <FiMap />
                      </LinkAnchor>
                    )}
                    {reviewHref && (
                      <LinkAnchor href={reviewHref} target="_blank" rel="noreferrer" title="Yorum Linki">
                        <FiArrowRight />
                      </LinkAnchor>
                    )}
                  </LinkGroup>
                </CardTop>

                <QRSection>
                  {qrGenerating === b.id ? (
                    <QRBadge $has={false}>Üretiliyor...</QRBadge>
                  ) : b.qrImagePath ? (
                    <>
                      <QRBadge $has={true}>QR Hazır</QRBadge>
                      <QRViewBtn onClick={() => setQrModal({ path: b.qrImagePath!, name: b.name })}>
                        <FiEye /> Görüntüle
                      </QRViewBtn>
                      <QRActionBtn href={b.qrImagePath} download={`qr-${b.name}.png`}>
                        <FiDownload /> İndir
                      </QRActionBtn>
                    </>
                  ) : (
                    <>
                      <QRBadge $has={false}>QR Yok</QRBadge>
                      <Button size="sm" onClick={() => handleGenerateQR(b.id)} iconLeft={<FiGrid />}>
                        QR Üret
                      </Button>
                    </>
                  )}
                </QRSection>

                <CardActions>
                  <DeleteBtn title="Düzenle" onClick={() => openEdit(b)} style={{ color: 'var(--accent-color, #F59E0B)' }}>
                    <FiEdit2 />
                  </DeleteBtn>
                  <DeleteBtn title="Şubeyi Sil" onClick={() => handleDelete(b.id, b.name)}>
                    <FiTrash2 />
                  </DeleteBtn>
                </CardActions>
              </BranchCard>
            )
          })
        )}
      </CardGrid>
      </PageWrap>

      {qrModal && (
        <QRModalOverlay onClick={() => setQrModal(null)}>
          <QRModalBox onClick={(e) => e.stopPropagation()}>
            <QRModalTitle>{qrModal.name} — QR Kod</QRModalTitle>
            <QRModalImage src={qrModal.path} alt={`${qrModal.name} QR`} />
            <QRModalActions>
              <QRActionBtn href={qrModal.path} download={`qr-${qrModal.name}.png`}>
                <FiDownload /> İndir
              </QRActionBtn>
              <QRViewBtn onClick={() => setQrModal(null)}>
                <FiX /> Kapat
              </QRViewBtn>
            </QRModalActions>
          </QRModalBox>
        </QRModalOverlay>
      )}

      {editingBranch && (
        <QRModalOverlay onClick={() => setEditingBranch(null)}>
          <QRModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, width: '100%' }}>
            <QRModalTitle>{editingBranch.name} — Düzenle</QRModalTitle>
            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              <Input
                label="Şube Adı"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                iconLeft={<FiMapPin />}
                required
              />

              {/* Doğrulama Kurgusu Seçici */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary, #1a1a2e)' }}>
                  Doğrulama Kurgusu
                </label>
                <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--border-color, #e2e8f0)' }}>
                  <button
                    type="button"
                    onClick={() => setEditVerificationType('MAPS')}
                    style={{
                      flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                      background: editVerificationType === 'MAPS' ? 'var(--accent-color, #F59E0B)' : 'transparent',
                      color: editVerificationType === 'MAPS' ? '#fff' : 'var(--text-secondary, #64748b)',
                    }}
                  >
                    <FiMap size={16} /> Maps Kurgusu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditVerificationType('INSTAGRAM')}
                    style={{
                      flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                      background: editVerificationType === 'INSTAGRAM' ? 'var(--accent-color, #F59E0B)' : 'transparent',
                      color: editVerificationType === 'INSTAGRAM' ? '#fff' : 'var(--text-secondary, #64748b)',
                    }}
                  >
                    <FiInstagram size={16} /> Instagram Kurgusu
                  </button>
                </div>
              </div>

              {editVerificationType === 'INSTAGRAM' && (
                <Input
                  label="Instagram Konum Etiketi"
                  placeholder="Örn: Spada Coffee Etiler"
                  value={editInstagramTag}
                  onChange={(e) => setEditInstagramTag(e.target.value)}
                  iconLeft={<FiInstagram />}
                />
              )}

              <QRModalActions>
                <Button type="submit" loading={saving}>Kaydet</Button>
                <QRViewBtn as="button" type="button" onClick={() => setEditingBranch(null)}>
                  <FiX /> İptal
                </QRViewBtn>
              </QRModalActions>
            </form>
          </QRModalBox>
        </QRModalOverlay>
      )}
    </>
  )
}
