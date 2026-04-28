'use client'

import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import MessageBox from '@/components/ui/MessageBox'
import Loading from '@/components/ui/Loading'
import type { MessageBoxType } from '@/components/ui/MessageBox'
import {
  Page,
  Card,
  Logo,
  LogoPart,
  LogoTag,
  Form,
  RememberRow,
  Divider,
  FooterNote,
} from './page.styles'

interface MsgState {
  type: MessageBoxType
  title: string
  message: string
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<MsgState | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('rememberMe')
    if (saved === 'true') {
      setRememberMe(true)
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) setEmail(savedEmail)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('rememberedEmail', email)
    } else {
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('rememberedEmail')
    }
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setMsg({ type: 'error', title: 'Giriş Başarısız', message: 'E-posta veya şifre hatalı.' })
        setLoading(false)
        return
      }

      setMsg({ type: 'success', title: 'Giriş başarılı', message: 'Yönlendiriliyorsunuz...' })
      const sessionRes = await fetch('/api/auth/session')
      const session = sessionRes.ok ? await sessionRes.json() : null
      const role = session?.user?.role

      if (role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Beklenmedik bir hata oluştu.' })
      setLoading(false)
    }
  }

  return (
    <Page>
      <Card>
        <Logo>
          <LogoPart>Top</LogoPart>
          <LogoPart $accent>Loyalty</LogoPart>
        </Logo>
        <LogoTag>Yönetim Paneli</LogoTag>

        <Form onSubmit={handleSubmit}>
          <Input
            label="E-posta"
            type="email"
            placeholder="ornek@sirket.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            iconLeft={<FiMail />}
            required
          />
          <Input
            label="Şifre"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconLeft={<FiLock />}
            iconRight={
              showPw
                ? <FiEyeOff onClick={() => setShowPw(false)} />
                : <FiEye onClick={() => setShowPw(true)} />
            }
            required
          />
          <RememberRow>
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Beni Hatırla"
              name="rememberMe"
            />
          </RememberRow>
          <Divider />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Giriş Yap
          </Button>
        </Form>

        <FooterNote>TopLoyalty © 2026 — Tüm hakları saklıdır</FooterNote>
      </Card>

      <Loading visible={loading} />

      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}
    </Page>
  )
}
