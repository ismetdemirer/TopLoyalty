import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  animation: ${fadeUp} 0.4s ease both;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`

export const StatCard = styled.a`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1.5px solid #E2E8F0;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    border-color: rgba(15, 118, 110, 0.2);
    box-shadow: 0 4px 16px rgba(15, 118, 110, 0.08);
    transform: translateY(-2px);
  }

  @media (max-width: 560px) {
    padding: 16px;
    gap: 12px;
  }
`

export const RecentItemLink = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(15, 118, 110, 0.04);
  }
`

export const StatIconWrap = styled.div<{ $variant?: 'teal' | 'amber' | 'success' | 'info' }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
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
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.1;
  letter-spacing: -0.5px;
`

export const StatLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
`

export const StatChange = styled.span<{ $positive?: boolean }>`
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? '#10B981' : '#EF4444')};
  margin-top: 4px;
`

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin-top: 36px;
  margin-bottom: 16px;
`

export const RecentCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #E2E8F0;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease 0.1s both;
`

export const RecentList = styled.div`
  display: flex;
  flex-direction: column;
`

export const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(15, 118, 110, 0.02);
  }
`

export const RecentAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(15, 118, 110, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F766E;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`

export const RecentInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const RecentName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  display: block;
`

export const RecentMeta = styled.span`
  font-size: 12px;
  color: #94A3B8;
`

export const StatusPill = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $active }) =>
    $active ? 'rgba(16, 185, 129, 0.10)' : 'rgba(239, 68, 68, 0.10)'};
  color: ${({ $active }) => ($active ? '#10B981' : '#EF4444')};
`
