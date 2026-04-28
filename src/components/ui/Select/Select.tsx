'use client'

import { forwardRef, useId } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import {
  Container,
  Label,
  Wrapper,
  StyledSelect,
  ChevronWrap,
  ErrorText,
  HintText,
} from './Select.styles'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  name?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, value, onChange, disabled, name }, ref) => {
    const uid = useId()

    return (
      <Container>
        {label && <Label htmlFor={uid}>{label}</Label>}
        <Wrapper $hasError={!!error} $disabled={!!disabled}>
          <StyledSelect
            ref={ref}
            id={uid}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            $hasValue={!!value}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </StyledSelect>
          <ChevronWrap>
            <FiChevronDown />
          </ChevronWrap>
        </Wrapper>
        {error && <ErrorText>{error}</ErrorText>}
        {hint && !error && <HintText>{hint}</HintText>}
      </Container>
    )
  }
)

Select.displayName = 'Select'

export default Select
