import styled, { keyframes, css } from 'styled-components'
import type { ButtonVariant, ButtonSize } from './Button'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const variantMap: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: #0F766E;
    color: #fff;
    box-shadow: 0 2px 10px rgba(15,118,110,0.28);
    &:hover:not(:disabled) {
      background: #0D6B63;
      box-shadow: 0 4px 14px rgba(15,118,110,0.38);
      transform: translateY(-1px);
    }
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 1px 6px rgba(15,118,110,0.20);
    }
  `,
  secondary: css`
    background: rgba(15,118,110,0.08);
    color: #0F766E;
    &:hover:not(:disabled) {
      background: rgba(15,118,110,0.14);
      transform: translateY(-1px);
    }
  `,
  ghost: css`
    background: transparent;
    color: #334155;
    border: 1.5px solid #E2E8F0;
    &:hover:not(:disabled) {
      border-color: #0F766E;
      color: #0F766E;
      background: rgba(15,118,110,0.04);
    }
  `,
  danger: css`
    background: #EF4444;
    color: #fff;
    box-shadow: 0 2px 10px rgba(239,68,68,0.25);
    &:hover:not(:disabled) {
      background: #DC2626;
      box-shadow: 0 4px 14px rgba(239,68,68,0.35);
      transform: translateY(-1px);
    }
  `,
}

const sizeMap: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`height: 34px; padding: 0 16px; font-size: 13px; border-radius: 999px; gap: 6px;`,
  md: css`height: 40px; padding: 0 20px; font-size: 14px; border-radius: 999px; gap: 8px;`,
  lg: css`height: 46px; padding: 0 28px; font-size: 14.5px; border-radius: 999px; gap: 8px; font-weight: 700;`,
}

export const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.18s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => variantMap[$variant]}
  ${({ $size }) => sizeMap[$size]}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus-visible {
    outline: 2px solid rgba(15,118,110,0.4);
    outline-offset: 2px;
  }
`

export const SpinnerRing = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.65s linear infinite;
  flex-shrink: 0;
`
