'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'
import MessageBox from '@/components/ui/MessageBox'
import type { MessageBoxType } from '@/components/ui/MessageBox/MessageBox'
import {
  UsersGrid,
  AddUserCard,
  AddUserTitle,
  AddUserForm,
  FormRow,
  UserTableCard,
  TableScrollWrap,
  UserTable,
  UserTh,
  UserTr,
  UserTd,
  UserEmptyTd,
  RoleBadge,
} from './page.styles'

interface AdminUserItem {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<{ type: MessageBoxType; title: string; message: string } | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data: AdminUserItem[] = await res.json()
        setUsers(data)
      }
    } catch {
      setMsg({ type: 'error', title: 'Hata', message: 'Kullanıcılar yüklenemedi.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) return

    setAdding(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg({ type: 'error', title: 'Hata', message: data.error || 'Kullanıcı eklenemedi.' })
        return
      }

      setName('')
      setEmail('')
      setPassword('')
      setMsg({ type: 'success', title: 'Başarılı', message: 'Yeni admin kullanıcı eklendi.' })
      fetchUsers()
    } catch {
      setMsg({ type: 'error', title: 'Bağlantı Hatası', message: 'Sunucuya ulaşılamıyor.' })
    } finally {
      setAdding(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) return <Loading visible />

  return (
    <UsersGrid>
      {msg && (
        <MessageBox
          type={msg.type}
          title={msg.title}
          message={msg.message}
          onClose={() => setMsg(null)}
        />
      )}

      <AddUserCard>
        <AddUserTitle>Yeni Admin Ekle</AddUserTitle>
        <AddUserForm onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Ad Soyad"
              placeholder="Kullanıcı adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconLeft={<FiUser />}
              required
            />
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<FiMail />}
              required
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeft={<FiLock />}
              required
            />
            <Button type="submit" iconLeft={<FiUserPlus />} loading={adding}>
              Ekle
            </Button>
          </FormRow>
        </AddUserForm>
      </AddUserCard>

      <UserTableCard>
        <TableScrollWrap>
          <UserTable>
            <thead>
              <tr>
                <UserTh>Ad</UserTh>
                <UserTh>E-posta</UserTh>
                <UserTh>Rol</UserTh>
                <UserTh>Kayıt Tarihi</UserTh>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <UserEmptyTd colSpan={4}>
                    Henüz admin kullanıcı bulunmuyor.
                  </UserEmptyTd>
                </tr>
              ) : (
                users.map((u) => (
                  <UserTr key={u.id}>
                    <UserTd $bold>{u.name}</UserTd>
                    <UserTd>{u.email}</UserTd>
                    <UserTd>
                      <RoleBadge $role={u.role}>
                        {u.role === 'ADMIN' ? 'Süper Yönetici' : 'Marka'}
                      </RoleBadge>
                    </UserTd>
                    <UserTd>{formatDate(u.createdAt)}</UserTd>
                  </UserTr>
                ))
              )}
            </tbody>
          </UserTable>
        </TableScrollWrap>
      </UserTableCard>
    </UsersGrid>
  )
}
