import styled from 'styled-components'

export const BrandLayout = styled.div`
  min-height: 100vh;
  background: #F0FAFA;
  display: flex;
`

export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  border-right: 1.5px solid #E2E8F0;
  background: #ffffff;
  padding: 22px 14px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.28s ease;

  @media (max-width: 768px) {
    transform: translateX(-100%);
  }
`

export const SidebarOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(2px);
    z-index: 99;
  }
`

export const MobileSidebar = styled.aside<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: #ffffff;
    flex-direction: column;
    padding: 22px 14px;
    z-index: 101;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.28s ease;
    box-shadow: ${({ $open }) => ($open ? '4px 0 24px rgba(0,0,0,0.10)' : 'none')};
  }
`

export const Logo = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #0F766E;
  padding: 0 8px;
  margin-bottom: 8px;
`

export const LogoAccent = styled.span`
  color: #F59E0B;
`

export const Caption = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #94A3B8;
  padding: 0 8px;
  margin: 0 0 28px;
  display: block;
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

export const NavLink = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  min-height: 42px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) => ($active ? '#0F766E' : '#64748B')};
  background: ${({ $active }) => ($active ? 'rgba(15, 118, 110, 0.08)' : 'transparent')};
  cursor: pointer;
  transition: all 0.18s ease;
  text-decoration: none;

  &:hover {
    background: rgba(15, 118, 110, 0.06);
    color: #0F766E;
  }

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }
`

export const LinkWrap = styled.div`
  a {
    text-decoration: none;
  }
`

export const NavTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`

export const NavDesc = styled.span`
  font-size: 11px;
  opacity: 0.6;
  margin-top: 2px;
  font-weight: 400;
`

export const Main = styled.main`
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1.5px solid #E2E8F0;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: none;
  background: rgba(15, 118, 110, 0.08);
  color: #0F766E;
  cursor: pointer;
  font-size: 20px;
  transition: background 0.15s;

  &:hover {
    background: rgba(15, 118, 110, 0.14);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
`

export const HeaderSub = styled.p`
  font-size: 12px;
  color: #64748B;
  margin: 2px 0 0;
`

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const Body = styled.div`
  flex: 1;
  padding: 28px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`
