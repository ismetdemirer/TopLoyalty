import styled from 'styled-components'

export const SettingsGrid = styled.div`
  display: grid;
  gap: 20px;
`

export const SettingsCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 24px;
`

export const CardTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #0F766E;
  font-size: 18px;
`

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  font-family: 'DM Sans', sans-serif;
`

export const InfoGrid = styled.div`
  display: grid;
  gap: 12px;
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`

export const InfoLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  min-width: 140px;
  font-family: 'DM Sans', sans-serif;
`

export const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
  font-family: 'DM Sans', sans-serif;
`

export const PasswordForm = styled.form`
  display: grid;
  gap: 16px;
`

export const PasswordFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
