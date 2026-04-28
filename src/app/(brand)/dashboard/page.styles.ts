import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const DashboardGrid = styled.div`
  display: grid;
  gap: 20px;
  animation: ${fadeUp} 0.4s ease both;
`

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`

export const StatCard = styled.a`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    border-color: rgba(15, 118, 110, 0.2);
    box-shadow: 0 4px 16px rgba(15, 118, 110, 0.08);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 14px;
    gap: 10px;
  }
`

export const StatIconWrap = styled.div<{ $variant?: 'teal' | 'amber' | 'success' | 'info' }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  ${({ $variant }) => {
    switch ($variant) {
      case 'amber':
        return `background: rgba(245, 158, 11, 0.10); color: #F59E0B;`
      case 'success':
        return `background: rgba(16, 185, 129, 0.10); color: #10B981;`
      case 'info':
        return `background: rgba(59, 130, 246, 0.10); color: #3B82F6;`
      default:
        return `background: rgba(15, 118, 110, 0.10); color: #0F766E;`
    }
  }}
`

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const StatValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.1;
  letter-spacing: -0.5px;
  font-family: 'DM Sans', sans-serif;
`

export const StatLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  font-family: 'DM Sans', sans-serif;
`

export const StatSub = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #10B981;
  margin-top: 2px;
  font-family: 'DM Sans', sans-serif;
`

export const PlaceholderCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 24px;
`

export const PlaceholderTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  font-family: 'DM Sans', sans-serif;
`

export const PlaceholderDesc = styled.p`
  margin: 0;
  color: #64748B;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
`
