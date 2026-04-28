import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const LogoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

export const PreviewBox = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 16px;
  border: 2px dashed #CBD5E1;
  background-color: #F8FAFC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748B;
  position: relative;

  &:hover {
    border-color: #0F766E;
    color: #0F766E;
    background-color: #F0FDF4;
  }

  svg {
    font-size: 28px;
    margin-bottom: 8px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const HiddenFileInput = styled.input`
  display: none;
`

export const FormCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  border: 1.5px solid #E2E8F0;
  padding: 36px 36px 32px;
  max-width: 100%;
  width: 100%;
  animation: ${fadeUp} 0.35s ease both;

  @media (max-width: 640px) {
    padding: 28px 20px 24px;
    border-radius: 20px;
  }
`

export const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 12px;
  margin-bottom: 4px;
`

export const GridFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;
`

export const FormDesc = styled.p`
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 28px;
`

export const FormFields = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Divider = styled.div`
  height: 1px;
  background: #F1F5F9;
  margin: 4px 0;
`

export const CheckboxRow = styled.div`
  margin-top: 16px;
`

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;

    & > * {
      width: 100%;
    }
  }
`
