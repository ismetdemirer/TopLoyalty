import styled, { keyframes, css } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.12; transform: scale(0.82); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const popIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`

// fullscreen: tüm ekranı kaplar
export const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(240, 250, 250, 0.90);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.18s ease both;
`

// modal: ortada küçük kart, arka plan yarı saydam
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 118, 110, 0.06);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
`

export const ModalCard = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(15, 118, 110, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${popIn} 0.2s ease both;
`

// inline: arka plan yok, sadece grid
export const InlineWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const QRGrid = styled.div<{ $cellSize: number; $gap: number }>`
  display: grid;
  grid-template-columns: repeat(7, ${({ $cellSize }) => $cellSize}px);
  grid-template-rows: repeat(7, ${({ $cellSize }) => $cellSize}px);
  gap: ${({ $gap }) => $gap}px;
`

export const QRCell = styled.div<{ $active: boolean; $delay: number; $duration: number; $cellSize: number }>`
  width: ${({ $cellSize }) => $cellSize}px;
  height: ${({ $cellSize }) => $cellSize}px;
  border-radius: ${({ $cellSize }) => Math.max(1, Math.floor($cellSize * 0.2))}px;

  ${({ $active, $delay, $duration }) =>
    $active
      ? css`
          background: #0F766E;
          animation: ${pulse} ${$duration}s ease-in-out infinite;
          animation-delay: ${$delay}s;
        `
      : css`
          background: rgba(15, 118, 110, 0.07);
        `}
`
