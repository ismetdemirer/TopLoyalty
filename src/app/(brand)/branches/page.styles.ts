import styled, { keyframes } from 'styled-components'

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const PageWrap = styled.div`
  display: grid;
  gap: 20px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  animation: ${fadeUp} 0.35s ease both;
`

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
`

export const FormCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 0;
  animation: ${fadeDown} 0.3s ease both;
`

export const FormTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  margin: 0 0 16px 0;
  letter-spacing: 0.05em;
  font-family: 'DM Sans', sans-serif;
`

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  padding-bottom: 2px;
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const BranchCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${fadeUp} 0.4s ease both;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(15, 118, 110, 0.06);
  }
`

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const BranchName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
`

export const BranchAddress = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
`

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const QRSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const QRBadge = styled.span<{ $has: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $has }) =>
    $has ? 'rgba(16, 185, 129, 0.10)' : 'rgba(148, 163, 184, 0.12)'};
  color: ${({ $has }) => ($has ? '#10B981' : '#94A3B8')};
`

export const QRActionBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #0F766E;
  background: rgba(15, 118, 110, 0.06);
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: rgba(15, 118, 110, 0.12);
  }

  svg {
    font-size: 14px;
    flex-shrink: 0;
  }
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #F1F5F9;
`

export const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1.5px solid #E2E8F0;
  background: #ffffff;
  color: #EF4444;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s;

  &:hover {
    border-color: #EF4444;
    background: rgba(239, 68, 68, 0.04);
  }
`

export const LinkGroup = styled.div`
  display: flex;
  gap: 10px;
`

export const LinkAnchor = styled.a`
  color: #0F766E;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`

export const EmptyCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  grid-column: 1 / -1;
`

export const EmptyIcon = styled.div`
  font-size: 40px;
  color: #94A3B8;
`

export const EmptyText = styled.p`
  font-size: 14px;
  color: #94A3B8;
  font-weight: 500;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
`

export const QRViewBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #0F766E;
  background: rgba(15, 118, 110, 0.06);
  border: none;
  transition: all 0.15s;
  white-space: nowrap;
  cursor: pointer;

  &:hover { background: rgba(15, 118, 110, 0.12); }
  svg { font-size: 14px; flex-shrink: 0; }
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
