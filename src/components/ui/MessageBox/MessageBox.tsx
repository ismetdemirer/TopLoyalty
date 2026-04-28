'use client'

import React, { useEffect } from 'react'
import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import {
  Overlay,
  Container,
  Header,
  IconWrapper,
  Title,
  Message,
  CloseButton,
  ActionButton,
} from './MessageBox.styles'

export type MessageBoxType = 'success' | 'error' | 'warning' | 'info'

interface MessageBoxProps {
  type: MessageBoxType
  title: string
  message: string
  onClose: () => void
  actionText?: string
  onAction?: () => void
}

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
}

export default function MessageBox({
  type,
  title,
  message,
  onClose,
  actionText,
  onAction,
}: MessageBoxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const Icon = icons[type]

  return (
    <Overlay onClick={onClose}>
      <Container type={type} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={18} />
        </CloseButton>
        <Header>
          <IconWrapper type={type}>
            <Icon size={24} />
          </IconWrapper>
          <Title>{title}</Title>
        </Header>
        <Message>{message}</Message>
        {actionText && onAction && (
          <ActionButton type={type} onClick={onAction}>
            {actionText}
          </ActionButton>
        )}
      </Container>
    </Overlay>
  )
}
