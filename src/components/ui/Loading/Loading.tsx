'use client'

import {
  FullscreenOverlay,
  ModalOverlay,
  ModalCard,
  InlineWrap,
  QRGrid,
  QRCell,
} from './Loading.styles'

const PATTERN = [
  1, 1, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1,
  1, 1, 1, 0, 0, 1, 1,
]

const DELAYS = [
  0.0, 0.1, 0.2, 0.0, 0.3, 0.4, 0.5,
  0.1, 0.0, 0.3, 0.0, 0.4, 0.0, 0.6,
  0.2, 0.3, 0.0, 0.0, 0.5, 0.6, 0.3,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.4, 0.5, 0.6, 0.0, 0.0, 0.2, 0.0,
  0.3, 0.0, 0.0, 0.0, 0.1, 0.0, 0.5,
  0.5, 0.6, 0.4, 0.0, 0.0, 0.3, 0.2,
]

const DURATIONS = [
  0.7, 0.9, 0.7, 0.0, 0.8, 0.7, 0.9,
  0.9, 0.0, 0.8, 0.0, 0.7, 0.0, 0.8,
  0.7, 0.8, 0.0, 0.0, 0.9, 0.8, 0.7,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.8, 0.7, 0.9, 0.0, 0.0, 0.8, 0.0,
  0.9, 0.0, 0.0, 0.0, 0.7, 0.0, 0.9,
  0.7, 0.8, 0.9, 0.0, 0.0, 0.7, 0.8,
]

export type LoadingVariant = 'fullscreen' | 'modal' | 'inline'

interface LoadingProps {
  visible: boolean
  variant?: LoadingVariant
}

const VARIANT_CONFIG: Record<LoadingVariant, { cellSize: number; gap: number }> = {
  fullscreen: { cellSize: 10, gap: 3 },
  modal:      { cellSize: 9,  gap: 3 },
  inline:     { cellSize: 6,  gap: 2 },
}

function QRCodeGrid({ cellSize, gap }: { cellSize: number; gap: number }) {
  return (
    <QRGrid $cellSize={cellSize} $gap={gap}>
      {PATTERN.map((active, i) => (
        <QRCell
          key={i}
          $active={active === 1}
          $delay={DELAYS[i]}
          $duration={DURATIONS[i]}
          $cellSize={cellSize}
        />
      ))}
    </QRGrid>
  )
}

export default function Loading({ visible, variant = 'fullscreen' }: LoadingProps) {
  if (!visible) return null

  const { cellSize, gap } = VARIANT_CONFIG[variant]

  if (variant === 'fullscreen') {
    return (
      <FullscreenOverlay>
        <QRCodeGrid cellSize={cellSize} gap={gap} />
      </FullscreenOverlay>
    )
  }

  if (variant === 'modal') {
    return (
      <ModalOverlay>
        <ModalCard>
          <QRCodeGrid cellSize={cellSize} gap={gap} />
        </ModalCard>
      </ModalOverlay>
    )
  }

  // inline
  return (
    <InlineWrap>
      <QRCodeGrid cellSize={cellSize} gap={gap} />
    </InlineWrap>
  )
}
