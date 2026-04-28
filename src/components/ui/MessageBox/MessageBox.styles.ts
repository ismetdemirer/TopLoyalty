import styled, { keyframes } from 'styled-components'
import type { MessageBoxType } from './MessageBox'

const popIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`

const colorMap = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
}

const bgMap = {
  success: 'rgba(16,185,129,0.08)',
  error: 'rgba(239,68,68,0.08)',
  warning: 'rgba(245,158,11,0.08)',
  info: 'rgba(59,130,246,0.08)',
}

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(4px);
  z-index: 2000;
`

export const Container = styled.div<{ type: MessageBoxType }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.15);
  animation: ${popIn} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2001;
`

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #64748B;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;

  &:hover {
    background: #F1F5F9;
    color: #0F172A;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

export const IconWrapper = styled.div<{ type: MessageBoxType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ type }) => colorMap[type]};
  flex-shrink: 0;
`

export const Title = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.3;
`

export const Message = styled.p`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  padding-left: 36px;
`

export const ActionButton = styled.button<{ type: MessageBoxType }>`
  display: block;
  width: 100%;
  margin-top: 20px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: ${({ type }) => colorMap[type]};
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`
