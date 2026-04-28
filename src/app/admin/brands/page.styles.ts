import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.35s ease both;
`

export const SearchWrap = styled.div`
  width: 320px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
    order: 2;
  }
`

export const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #E2E8F0;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease 0.05s both;
`

export const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
`

export const Thead = styled.thead`
  background: rgba(15, 118, 110, 0.05);
`

export const Th = styled.th`
  padding: 14px 20px;
  text-align: left;
  font-size: 11.5px;
  font-weight: 700;
  color: #0F766E;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;

  &:last-child {
    text-align: right;
  }
`

export const Tbody = styled.tbody``

export const Tr = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $clickable }) =>
      $clickable ? 'rgba(15, 118, 110, 0.05)' : 'rgba(15, 118, 110, 0.02)'};
  }
`

export const Td = styled.td`
  padding: 14px 20px;
  font-size: 14px;
  color: #0F172A;
  white-space: nowrap;

  &:last-child {
    text-align: right;
  }
`

export const BrandCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const BrandAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(15, 118, 110, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F766E;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const BrandName = styled.span`
  font-weight: 600;
`

export const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $active }) =>
    $active ? 'rgba(16, 185, 129, 0.10)' : 'rgba(239, 68, 68, 0.10)'};
  color: ${({ $active }) => ($active ? '#10B981' : '#EF4444')};
`

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`

export const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1.5px solid #E2E8F0;
  background: #ffffff;
  color: ${({ $danger }) => ($danger ? '#EF4444' : '#64748B')};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#EF4444' : '#0F766E')};
    color: ${({ $danger }) => ($danger ? '#EF4444' : '#0F766E')};
    background: ${({ $danger }) =>
      $danger ? 'rgba(239, 68, 68, 0.04)' : 'rgba(15, 118, 110, 0.04)'};
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
`

export const EmptyIcon = styled.div`
  font-size: 40px;
  color: #94A3B8;
`

export const EmptyText = styled.p`
  font-size: 14px;
  color: #94A3B8;
  font-weight: 500;
`

export const DateText = styled.span`
  font-size: 13px;
  color: #64748B;
`
