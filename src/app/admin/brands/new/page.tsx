'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FiShoppingBag,
  FiMail,
  FiLock,
  FiImage,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiUploadCloud,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox'
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
  CheckboxRow,
} from './page.styles'

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function NewBrandPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [active, setActive] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<MsgState | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !contactName.trim() ||
      !contactPhone.trim()
    ) {
      setMsg({
        type: 'warning',
        title: 'Eksik Alan',
        message:
          'Lütfen tüm zorunlu alanları doldurun (Marka adı, yetkili bilgileri, e-posta ve şifre).',
      })
      return
    }

    setLoading(true)
    try {
      let finalLogoUrl = ''

      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('Logo yüklenemedi')
        }

        const uploadData = await uploadRes.json()
        finalLogoUrl = uploadData.url
      }

      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          contactName,
          contactPhone,
          logoUrl: finalLogoUrl,
          active,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Marka oluşturulurken bir hata oluştu.')
      }

      setMsg({
        type: 'success',
        title: 'Marka Oluşturuldu',
        message: `${name} başarıyla eklendi. Markalar listesine yönlendiriliyorsunuz...`,
      })
      setTimeout(() => router.push('/admin/brands'), 1500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Marka oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      setMsg({
        type: 'error',
        title: 'Hata',
        message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <FormCard>
        <FormTitle>Yeni Marka Ekle</FormTitle>
        <FormDesc>Sisteme yeni bir marka kaydı oluşturun.</FormDesc>

        <FormFields onSubmit={handleSubmit}>
          <TopSection>
            <div>
              <Input
                label="Marka Adı"
                placeholder="örn: Kahve Dünyası"
                value={name}
                onChange={(e) => setName(e.target.value)}
                iconLeft={<FiShoppingBag />}
                required
              />
              <CheckboxRow>
                <Checkbox
                  label="Marka Aktif"
                  checked={active}
                  onChange={setActive}
                />
              </CheckboxRow>
            </div>

            <LogoUploadContainer>
              <PreviewBox onClick={triggerFileInput}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" />
                ) : (
                  <>
                    <FiUploadCloud />
                    <span>Logo Yükle</span>
                  </>
                )}
              </PreviewBox>
              <HiddenFileInput
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {logoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLogoFile(null)
                    setLogoPreview(null)
                  }}
                >
                  Logoyu Kaldır
                </Button>
              )}
            </LogoUploadContainer>
          </TopSection>

          <Divider />
          <SectionTitle>Yetkili Bilgileri</SectionTitle>

          <GridFields>
            <Input
              label="Yetkili Ad Soyad"
              placeholder="Ad Soyad"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              iconLeft={<FiUser />}
              required
            />

            <Input
              label="Yetkili Telefon"
              placeholder="05xx xxx xx xx"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              iconLeft={<FiPhone />}
              required
            />
          </GridFields>

          <Divider />
          <SectionTitle>Giriş Bilgileri</SectionTitle>

          <GridFields>
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@marka.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<FiMail />}
              required
            />

            <Input
              label="Şifre"
              type={showPw ? 'text' : 'password'}
              placeholder="En az 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeft={<FiLock />}
              iconRight={
                showPw ? (
                  <FiEyeOff onClick={() => setShowPw(false)} />
                ) : (
                  <FiEye onClick={() => setShowPw(true)} />
                )
              }
              required
            />
          </GridFields>

          <Divider />

          <ButtonRow>
            <Button type="submit" size="lg" loading={loading}>
              Marka Oluştur
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.push('/admin/brands')}
            >
              İptal
            </Button>
          </ButtonRow>
        </FormFields>
      </FormCard>

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
