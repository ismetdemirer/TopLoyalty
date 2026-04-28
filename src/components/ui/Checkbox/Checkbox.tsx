'use client'

import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { Wrapper, HiddenInput, Box, Label } from './Checkbox.styles'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  name?: string
}

export default function Checkbox({ checked, onChange, label, name }: CheckboxProps) {
  return (
    <Wrapper>
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        name={name}
      />
      <Box $checked={checked}>
        <FiCheck />
      </Box>
      {label && <Label>{label}</Label>}
    </Wrapper>
  )
}
