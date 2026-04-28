import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 0 40px;

  @media (max-width: 768px) {
    gap: 24px;
  }
`

export const BranchAddBox = styled.div`
  background: #F8FAFC;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  margin-bottom: 24px;
`

export const BranchAddTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  margin-bottom: 16px;
`

export const BranchAddForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: flex-end;

  & > div:first-child {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;

    & > div:first-child {
      grid-column: auto;
    }
  }
`

export const BranchName = styled.div`
  font-weight: 600;
`

export const LinkAnchor = styled.a`
  color: #0F766E;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`

export const BranchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const BranchCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
`

export const BranchCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export const BranchCardLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

export const BranchCardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #94A3B8;
  font-size: 14px;
`

export const CheckboxRow = styled.div`
  margin-top: 16px;
`

export const QRModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

export const QRModalBox = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 28px 24px;
  max-width: 340px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const QRModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  text-align: center;
`

export const QRModalImage = styled.img`
  width: 100%;
  max-width: 260px;
  border-radius: 12px;
  border: 1.5px solid #E2E8F0;
`

export const QRModalActions = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;

  a, button {
    flex: 1;
    justify-content: center;
  }
`

export const QrButton = styled.button<{ $variant?: 'generate' | 'download' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1.5px solid ${({ $variant }) =>
    $variant === 'download' ? '#E2E8F0' : '#0F766E'};
  background: ${({ $variant }) =>
    $variant === 'download' ? '#ffffff' : '#0F766E'};
  color: ${({ $variant }) =>
    $variant === 'download' ? '#0F766E' : '#ffffff'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 14px;
    flex-shrink: 0;
  }
`
