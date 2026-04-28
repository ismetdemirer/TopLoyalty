import styled from 'styled-components'

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F0FAFA;
`

export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1.5px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  padding: 28px 16px 20px;
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
    padding: 28px 16px 20px;
    z-index: 101;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.28s ease;
    box-shadow: ${({ $open }) => ($open ? '4px 0 24px rgba(0,0,0,0.10)' : 'none')};
  }
`

export const LogoArea = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  padding: 0 8px;
  margin-bottom: 8px;
`

export const LogoText = styled.span<{ $accent?: boolean }>`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ $accent }) => ($accent ? '#F59E0B' : '#0F766E')};
`

export const LogoSubText = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #94A3B8;
  padding: 0 8px;
  margin-bottom: 28px;
  display: block;
`

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

export const NavItem = styled.a<{ $active?: boolean }>`
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

export const NavDivider = styled.div`
  height: 1px;
  background: #F1F5F9;
  margin: 8px 0;
`

export const SidebarFooter = styled.div`
  padding: 12px 8px 0;
  border-top: 1.5px solid #F1F5F9;
  margin-top: auto;
`

export const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 16px;
`

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(15, 118, 110, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F766E;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserRole = styled.span`
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
`

export const MainArea = styled.main`
  flex: 1;
  margin-left: 260px;
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

export const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HeaderIconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1.5px solid #E2E8F0;
  background: #ffffff;
  color: #64748B;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.15s;
  position: relative;

  &:hover {
    border-color: #0F766E;
    color: #0F766E;
  }
`

export const NotifBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #EF4444;
  border: 2px solid #ffffff;
`

export const ContentArea = styled.div`
  flex: 1;
  padding: 28px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`
