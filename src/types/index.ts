export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type UserRole = 'ADMIN' | 'BRAND'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
  brandId?: string
  brandSlug?: string
}
