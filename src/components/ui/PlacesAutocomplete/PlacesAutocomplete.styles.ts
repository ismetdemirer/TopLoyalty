import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Wrapper = styled.div`
  position: relative;
`

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
`

export const InputRow = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid ${({ $active }) => ($active ? '#0D9488' : '#E5E7EB')};
  border-radius: 10px;
  padding: 0 12px;
  gap: 8px;
  height: 44px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #0D9488;
  }
`

export const IconLeft = styled.span`
  color: #9CA3AF;
  display: flex;
  flex-shrink: 0;
`

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  color: #111827;
  min-width: 0;

  &::placeholder {
    color: #9CA3AF;
  }
`

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top-color: #0D9488;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`

export const ClearBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  display: flex;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s;

  &:hover {
    color: #6B7280;
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  z-index: 999;
  overflow: hidden;
`

export const DropdownItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #F0FDFA;
  }

  svg {
    color: #0D9488;
    margin-top: 2px;
    flex-shrink: 0;
  }
`

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const ItemMain = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
`

export const ItemSub = styled.span`
  font-size: 12px;
  color: #6B7280;
`
