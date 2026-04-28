import styled, { keyframes, css } from 'styled-components'

/* ── Animasyonlar ── */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const confettiFall = keyframes`
  0%   { transform: translateY(-100%) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100dvh) rotate(720deg); opacity: 0; }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
`

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`

/* ── Sayfa Sarmalayıcıları ── */

export const FlowWrapper = styled.div`
  min-height: 100dvh;
  background: #FAFAF9;
  font-family: 'DM Sans', sans-serif;
`

export const FlowInner = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px 48px;
`

/* ── Marka Başlığı ── */

export const BrandHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(250, 250, 249, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`

export const BrandLogoFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #0F766E;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
`

export const BrandTitle = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #1C1917;
`

/* ── İlerleme Çubuğu ── */

export const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 24px;
  animation: ${fadeUp} 0.3s ease both;
`

export const ProgressText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #78716C;
  white-space: nowrap;
`

export const ProgressTrack = styled.div`
  flex: 1;
  height: 4px;
  background: #E7E5E4;
  border-radius: 999px;
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: #0F766E;
  border-radius: 999px;
  transition: width 0.4s ease;
`

/* ── Adım Başlık ve Açıklamaları ── */

export const StepContent = styled.div`
  animation: ${fadeUp} 0.4s ease both;
`

export const StepHeading = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  color: #1C1917;
  line-height: 1.25;
`

export const StepSubtext = styled.p`
  margin: 0 0 24px;
  font-size: 15px;
  color: #78716C;
  line-height: 1.5;
`

/* ── Şube Listesi ── */

export const BranchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`

export const BranchButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 54px;
  border: 2px solid ${({ $selected }) => ($selected ? '#0F766E' : '#E7E5E4')};
  background: ${({ $selected }) => ($selected ? 'rgba(15, 118, 110, 0.06)' : '#ffffff')};
  border-radius: 999px;
  padding: 14px 20px;
  text-align: left;
  font-weight: 600;
  color: ${({ $selected }) => ($selected ? '#0F766E' : '#1C1917')};
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0F766E;
    background: rgba(15, 118, 110, 0.04);
  }

  &:active {
    transform: scale(0.98);
  }
`

/* ── Butonlar ── */

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  min-height: 54px;
  border: none;
  border-radius: 999px;
  padding: 14px 20px;
  background: ${({ $disabled }) => ($disabled ? '#D6D3D1' : '#0F766E')};
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ $disabled }) =>
    !$disabled &&
    css`
      box-shadow: 0 4px 14px rgba(15, 118, 110, 0.3);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(15, 118, 110, 0.38);
      }

      &:active {
        transform: scale(0.98);
      }
    `}
`

export const GhostButton = styled.button`
  width: 100%;
  min-height: 54px;
  border: 2px solid #0F766E;
  border-radius: 999px;
  padding: 14px 20px;
  background: transparent;
  color: #0F766E;
  font-weight: 700;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(15, 118, 110, 0.04);
  }

  &:active {
    transform: scale(0.98);
  }
`

/* ── Talimat Kartları ── */

export const InstructionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
`

export const InstructionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #ffffff;
  border: 1.5px solid #E7E5E4;
  border-radius: 16px;
  padding: 14px 16px;
  transition: border-color 0.2s;
`

export const InstructionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0F766E;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`

export const InstructionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const InstructionTitle = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #1C1917;
`

export const InstructionDesc = styled.span`
  font-size: 13px;
  color: #78716C;
  line-height: 1.4;
`

/* ── Yükleme Alanı ── */

export const UploadZone = styled.div<{ $uploading?: boolean; $hasFile?: boolean }>`
  border: 2px dashed ${({ $hasFile }) => ($hasFile ? 'transparent' : '#CBD5E1')};
  border-radius: 24px;
  min-height: ${({ $hasFile }) => ($hasFile ? 'auto' : '180px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $hasFile }) => ($hasFile ? '0' : '32px 20px')};
  cursor: ${({ $uploading }) => ($uploading ? 'not-allowed' : 'pointer')};
  transition: all 0.25s ease;
  background: ${({ $uploading }) => ($uploading ? 'rgba(15, 118, 110, 0.03)' : 'transparent')};
  opacity: ${({ $uploading }) => ($uploading ? 0.7 : 1)};
  pointer-events: ${({ $uploading }) => ($uploading ? 'none' : 'auto')};
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  ${({ $hasFile, $uploading }) =>
    !$hasFile &&
    !$uploading &&
    css`
      &:hover {
        border-color: #0F766E;
        background: rgba(15, 118, 110, 0.03);
      }
    `}
`

export const UploadIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
  color: #A8A29E;
`

export const UploadLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1C1917;
`

export const UploadHint = styled.span`
  font-size: 13px;
  color: #A8A29E;
  margin-top: 4px;
`

export const UploadPreview = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 16px;
`

export const RetryLink = styled.button`
  margin-top: 12px;
  background: none;
  border: none;
  color: #0F766E;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #134E4A;
  }
`

/* ── Yükleniyor Göstergesi ── */

export const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
`

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #E7E5E4;
  border-top-color: #0F766E;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

export const LoadingText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0F766E;
`

/* ── Hata Kutusu ── */

export const ErrorBox = styled.div`
  background: rgba(239, 68, 68, 0.06);
  border: 1.5px solid rgba(239, 68, 68, 0.18);
  border-radius: 16px;
  padding: 14px 18px;
  margin-bottom: 16px;
  color: #DC2626;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`

/* ── Sonuç Ekranı ── */

export const ResultWrapper = styled.div`
  min-height: 100dvh;
  background: linear-gradient(160deg, #0F766E 0%, #064E3B 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
`

export const ConfettiPiece = styled.div<{ $delay: number; $left: number; $color: string }>`
  position: absolute;
  top: -20px;
  left: ${({ $left }) => $left}%;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  animation: ${confettiFall} ${({ $delay }) => 2.5 + $delay * 0.5}s ease-in ${({ $delay }) => $delay * 0.3}s infinite;
  opacity: 0;
`

export const ResultCheckCircle = styled.div`
  width: 88px;
  height: 88px;
  background: rgba(255, 255, 255, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  margin-bottom: 20px;
  animation: ${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  backdrop-filter: blur(8px);
`

export const ResultGreeting = styled.p`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  animation: ${floatUp} 0.5s ease 0.2s both;
`

export const ResultTitle = styled.h1`
  margin: 0 0 28px;
  font-size: 30px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  animation: ${floatUp} 0.5s ease 0.3s both;
`

export const RewardCard = styled.div`
  width: 100%;
  max-width: 340px;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px;
  animation: ${floatUp} 0.5s ease 0.4s both;
`

export const RewardCardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`

export const RewardCardImagePlaceholder = styled.div`
  width: 100%;
  height: 110px;
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
`

export const RewardCardBody = styled.div`
  padding: 18px 22px 22px;
  text-align: left;
`

export const RewardCardLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0F766E;
  background: rgba(15, 118, 110, 0.08);
  border-radius: 999px;
  padding: 3px 10px;
  display: inline-block;
  margin-bottom: 10px;
`

export const RewardCardName = styled.h2`
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 800;
  color: #1C1917;
  line-height: 1.2;
`

export const RewardCardSub = styled.p`
  margin: 0;
  font-size: 13px;
  color: #78716C;
`

export const CashierBadge = styled.div`
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 14px 20px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  max-width: 340px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${floatUp} 0.5s ease 0.5s both;
  line-height: 1.4;
  text-align: center;
`

/* ── Buton Alanı (alt kısım) ── */

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
