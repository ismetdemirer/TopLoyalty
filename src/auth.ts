import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

/**
 * NextAuth.js v5 — tam yapılandırma (Node.js ortamı)
 * Credentials provider, bcrypt ve Prisma burada kullanılır.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          throw new Error('E-posta ve şifre gereklidir.')
        }

        // 1. Önce AdminUser tablosunda ara
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        })

        if (admin) {
          const isValid = await bcrypt.compare(password, admin.passwordHash)
          if (isValid) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: 'ADMIN',
            }
          }
        }

        // 2. Bulunamazsa Brand tablosunda ara (Marka girişi)
        const brand = await prisma.brand.findUnique({
          where: { email },
        })

        if (brand) {
          if (!brand.active) {
            throw new Error('Hesabınız pasif durumdadır. Lütfen yönetici ile iletişime geçin.')
          }

          const isValid = await bcrypt.compare(password, brand.passwordHash)
          if (isValid) {
            return {
              id: brand.id,
              email: brand.email,
              name: brand.name,
              role: 'BRAND',
              slug: brand.slug, // Marka paneli için slug da ekleyelim
            }
          }
        }

        throw new Error('Geçersiz e-posta veya şifre.')
      },
    }),
  ],
})
