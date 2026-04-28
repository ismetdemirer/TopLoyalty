import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 11.5px;
  font-weight: 700;
  color: #0F766E;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-family: 'DM Sans', sans-serif;
`

export const Wrapper = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#EF4444' : '#E2E8F0')};
  border-radius: 999px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? '#EF4444' : '#0F766E')};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'rgba(239,68,68,0.10)' : 'rgba(15,118,110,0.10)'};
  }
`

export const StyledSelect = styled.select<{ $hasValue: boolean }>`
  width: 100%;
  height: 46px;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 40px 0 16px;
  font-size: 14px;
  font-weight: 400;
  font-family: 'DM Sans', sans-serif;
  color: ${({ $hasValue }) => ($hasValue ? '#0F172A' : '#CBD5E1')};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
`

export const ChevronWrap = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94A3B8;
  font-size: 16px;
  display: flex;
  align-items: center;
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: #EF4444;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
`

export const HintText = styled.span`
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
`
