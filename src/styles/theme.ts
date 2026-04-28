export const theme = {
  colors: {
    primary: '#0F766E',       // Teal - ana renk
    primaryDark: '#0D5C56',
    primaryLight: '#14B8A6',
    accent: '#F59E0B',        // Amber - vurgu
    accentDark: '#D97706',

    bg: '#FAFAFA',
    bgCard: '#FFFFFF',
    bgHover: 'rgba(15, 118, 110, 0.04)',

    text: '#0F172A',
    textMid: '#334155',
    textLight: '#64748B',

    border: '#E2E8F0',
    borderFocus: '#0F766E',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.10)',
    xl: '0 16px 40px rgba(0,0,0,0.12)',
  },
  fonts: {
    sans: "'DM Sans', sans-serif",
  },
} as const

export type Theme = typeof theme
