import type { NextAuthConfig } from 'next-auth'

/**
 * Edge runtime'da çalışan hafif auth config.
 * Node.js bağımlılıkları (bcrypt, prisma) burada OLMAZ.
 * Middleware bu dosyayı kullanır.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    // JWT'ye kullanıcı rolünü ekle
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },

    // Session'a rolü aktar
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },

    // Yetkilendirme kontrolü
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      if (!isLoggedIn) return false

      const role = auth?.user?.role

      if (pathname.startsWith('/admin') && role !== 'ADMIN') return false
      if (
        (pathname.startsWith('/dashboard') ||
          pathname.startsWith('/branches') ||
          pathname.startsWith('/rewards') ||
          pathname.startsWith('/reports') ||
          pathname.startsWith('/brand')) &&
        role !== 'BRAND' &&
        role !== 'ADMIN'
      ) {
        return false
      }

      return true
    },
  },

  providers: [], // Providers auth.ts'de tanımlanır
}
