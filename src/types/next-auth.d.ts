/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

/**
 * NextAuth tip genişletmesi
 * Session ve JWT'ye role alanı eklenir
 */
declare module 'next-auth' {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    id?: string
  }
}
