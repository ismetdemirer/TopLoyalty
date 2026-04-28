import styled from 'styled-components'

export const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-family: 'DM Sans', sans-serif;
`

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`

export const Box = styled.span<{ $checked: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 8px;
  border: 2px solid ${({ $checked }) => ($checked ? '#0F766E' : '#E2E8F0')};
  background: ${({ $checked }) => ($checked ? '#0F766E' : '#ffffff')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #0F766E;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.10);
  }

  svg {
    color: #ffffff;
    font-size: 13px;
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transform: ${({ $checked }) => ($checked ? 'scale(1)' : 'scale(0.5)')};
    transition: all 0.15s ease;
  }
`

export const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
  line-height: 1;
`
