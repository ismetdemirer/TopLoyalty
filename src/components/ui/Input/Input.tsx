'use client'

import React, { forwardRef, useId } from 'react'
import type { ReactNode } from 'react'
import { Container, Label, Wrapper, Field, IconBox, ErrorText, HintText } from './Input.styles'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, ...props }, ref) => {
    const uid = useId()

    return (
      <Container>
        {label && <Label htmlFor={uid}>{label}</Label>}
        <Wrapper $hasError={!!error} $hasLeft={!!iconLeft} $hasRight={!!iconRight}>
          {iconLeft && <IconBox $side="left">{iconLeft}</IconBox>}
          <Field ref={ref} id={uid} {...props} />
          {iconRight && <IconBox $side="right">{iconRight}</IconBox>}
        </Wrapper>
        {error && <ErrorText>{error}</ErrorText>}
        {hint && !error && <HintText>{hint}</HintText>}
      </Container>
    )
  }
)

Input.displayName = 'Input'
export default Input
