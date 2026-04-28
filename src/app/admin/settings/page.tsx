'use client'

import { useState } from 'react'
import { FiLock, FiInfo } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox/MessageBox'
import {
  SettingsGrid,
  SettingsCard,
  CardTitle,
  CardTitleWrap,
  InfoGrid,
  InfoRow,
  InfoLabel,
  InfoValue,
  PasswordForm,
  PasswordFormRow,
} from './page.styles'

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: MessageBoxType; title: string; message: string } | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: 'warning', title: 'Eksik Alan', message: 'Tüm alanları doldurun.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', title: 'Hata', message: 'Yeni şifre ve onay eşleşmiyor.' })
      return
    }

    if (newPassword.length < 6) {
      setMsg({ type: 'error', title: 'Hata', message: 'Yeni şifre en az 6 karakter olmalıdır.' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Şifre değiştirilemedi.' })
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMsg({ type: 'success', title: 'Başarılı', message: 'Şifreniz başarıyla değiştirildi.' })
    } catch {
      setMsg({ type: 'error', title: 'Bağlantı Hatası', message: 'Sunucuya ulaşılamıyor.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <SettingsGrid>
      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}

      <SettingsCard>
        <CardTitleWrap>
          <FiInfo />
          <CardTitle>Sistem Bilgileri</CardTitle>
        </CardTitleWrap>
        <InfoGrid>
          <InfoRow>
            <InfoLabel>Proje Adı</InfoLabel>
            <InfoValue>TopLoyalty</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Versiyon</InfoLabel>
            <InfoValue>0.1.0</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Ortam</InfoLabel>
            <InfoValue>{process.env.NODE_ENV ?? 'production'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Framework</InfoLabel>
            <InfoValue>Next.js 16 + Prisma 7</InfoValue>
          </InfoRow>
        </InfoGrid>
      </SettingsCard>

      <SettingsCard>
        <CardTitleWrap>
          <FiLock />
          <CardTitle>Admin Şifre Değiştir</CardTitle>
        </CardTitleWrap>
        <PasswordForm onSubmit={handleChangePassword}>
          <PasswordFormRow>
            <Input
              label="Mevcut Şifre"
              type="password"
              placeholder="Mevcut şifreniz"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              iconLeft={<FiLock />}
              required
            />
            <Input
              label="Yeni Şifre"
              type="password"
              placeholder="En az 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              iconLeft={<FiLock />}
              required
            />
            <Input
              label="Yeni Şifre (Tekrar)"
              type="password"
              placeholder="Yeni şifreyi onaylayın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconLeft={<FiLock />}
              required
            />
          </PasswordFormRow>
          <Button type="submit" loading={saving}>
            Şifreyi Değiştir
          </Button>
        </PasswordForm>
      </SettingsCard>
    </SettingsGrid>
  )
}
