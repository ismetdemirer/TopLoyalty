import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

export const Label = styled.label`
  font-size: 11.5px;
  font-weight: 700;
  color: #0F766E;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

export const Wrapper = styled.div<{ $hasError: boolean; $hasLeft: boolean; $hasRight: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#EF4444' : '#E2E8F0')};
  border-radius: 999px;
  overflow: hidden;
  transition: border-color 0.18s, box-shadow 0.18s;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? '#EF4444' : '#0F766E')};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'rgba(239,68,68,0.10)' : 'rgba(15,118,110,0.10)'};
  }
`

export const IconBox = styled.span<{ $side: 'left' | 'right' }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 15px;
  transition: color 0.15s, background 0.15s;

  ${({ $side }) => $side === 'left' && `
    margin-left: 7px;
    background: rgba(15, 118, 110, 0.10);
    color: #0F766E;
  `}

  ${({ $side }) => $side === 'right' && `
    margin-right: 7px;
    background: transparent;
    color: #94A3B8;
    cursor: pointer;
    &:hover {
      background: rgba(15, 118, 110, 0.08);
      color: #0F766E;
    }
  `}
`

export const Field = styled.input`
  flex: 1;
  height: 46px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  color: #0F172A;
  padding: 0 14px 0 10px;

  &::placeholder { color: #CBD5E1; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &[type='password'] { letter-spacing: 0.12em; }
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: #EF4444;
  font-weight: 500;
`

export const HintText = styled.span`
  font-size: 12px;
  color: #94A3B8;
`
