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
  grid-template-columns: 1fr 1fr;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const RewardCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeUp} 0.4s ease both;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(15, 118, 110, 0.06);
  }
`

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`

export const RewardThumb = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  background: #F1F5F9;
`

export const ThumbPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
  background: rgba(15, 118, 110, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F766E;
  font-size: 28px;
`

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const RewardName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
`

export const BrandLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #0F766E;
  background: rgba(15, 118, 110, 0.08);
  padding: 2px 10px;
  border-radius: 999px;
  width: fit-content;
`

export const BranchLabel = styled.span`
  font-size: 13px;
  color: #64748B;
  font-family: 'DM Sans', sans-serif;
`

export const StockBadge = styled.span<{ $low?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  background: ${({ $low }) =>
    $low ? 'rgba(239, 68, 68, 0.10)' : 'rgba(15, 118, 110, 0.10)'};
  color: ${({ $low }) => ($low ? '#EF4444' : '#0F766E')};
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

export const ActiveBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  background: ${({ $active }) =>
    $active ? 'rgba(16, 185, 129, 0.10)' : 'rgba(239, 68, 68, 0.10)'};
  color: ${({ $active }) => ($active ? '#10B981' : '#EF4444')};
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

export const UploadLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-family: 'DM Sans', sans-serif;
`

export const ImageUploadArea = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 160px;
  border: 2px dashed ${({ $hasImage }) => ($hasImage ? '#0F766E' : '#D1D5DB')};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ $hasImage }) => ($hasImage ? '#F0FDF4' : '#F9FAFB')};
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: #0F766E;
    background: #F0FDF4;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9CA3AF;

  svg {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
  }
`
