import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

/**
 * Middleware — Edge runtime'da çalışır.
 * Hafif authConfig kullanır (Node.js bağımlılıkları yok).
 */
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user

  // Giriş yapılmamışsa login'e yönlendir
  if (!user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(loginUrl)
  }

  const role = user.role

  // /admin/* yalnızca ADMIN
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('error', 'yetkisiz')
    return Response.redirect(loginUrl)
  }

  // Marka paneli: /dashboard/*, /brand/* ve /branches/*
  if (
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/brand') ||
      pathname.startsWith('/branches') ||
      pathname.startsWith('/rewards') ||
      pathname.startsWith('/reports')) &&
    role !== 'BRAND' &&
    role !== 'ADMIN'
  ) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('error', 'yetkisiz')
    return Response.redirect(loginUrl)
  }
})

// Middleware'in çalışacağı yollar
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/brand/:path*',
    '/branches/:path*',
    '/rewards/:path*',
    '/reports/:path*',
  ],
}
