import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0FAFA;
  padding: 24px;
`

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 32px;
  padding: 40px 40px 36px;
  box-shadow: 0 4px 24px rgba(15, 118, 110, 0.08);
  animation: ${fadeUp} 0.4s ease both;

  @media (max-width: 480px) {
    border-radius: 28px;
    padding: 32px 24px 28px;
    margin: 0 auto;
    text-align: center;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    justify-content: center;
  }
`

export const LogoPart = styled.span<{ $accent?: boolean }>`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ $accent }) => ($accent ? '#F59E0B' : '#0F766E')};
`

export const LogoTag = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #94A3B8;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    text-align: center;
  }
`

export const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    text-align: center;
  }
`

export const Sub = styled.p`
  font-size: 14px;
  color: #64748B;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    text-align: center;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const RememberRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
`

export const Divider = styled.div`
  height: 1px;
  background: #F1F5F9;
  margin: 4px 0;
`

export const FooterNote = styled.p`
  font-size: 12px;
  color: #94A3B8;
  text-align: center;
  margin-top: 24px;
`
