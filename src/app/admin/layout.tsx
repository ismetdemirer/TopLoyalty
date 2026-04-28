'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FiBarChart2,
  FiShoppingBag,
  FiMapPin,
  FiUsers,
  FiGift,
  FiActivity,
  FiAward,
  FiList,
  FiSettings,
  FiBell,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi'
import {
  LayoutWrapper,
  Sidebar,
  SidebarOverlay,
  MobileSidebar,
  LogoArea,
  LogoText,
  LogoSubText,
  NavList,
  NavItem,
  NavTextGroup,
  NavDesc,
  NavDivider,
  SidebarFooter,
  UserChip,
  UserAvatar,
  UserInfo,
  UserName,
  UserRole,
  MainArea,
  Header,
  HeaderLeft,
  MenuButton,
  PageTitle,
  HeaderRight,
  HeaderIconBtn,
  NotifBadge,
  ContentArea,
} from './layout.styles'

interface NavLink {
  href: string
  label: string
  desc: string
  icon: React.ReactNode
}

const navLinks: NavLink[] = [
  { href: '/admin', label: 'Dashboard', desc: 'Genel bakış', icon: <FiBarChart2 /> },
  { href: '/admin/brands', label: 'Markalar', desc: 'Marka listesi', icon: <FiShoppingBag /> },
  { href: '/admin/branches', label: 'Şubeler', desc: 'Tüm şubeler', icon: <FiMapPin /> },
  { href: '/admin/rewards', label: 'Ödüller', desc: 'Ödül listesi', icon: <FiGift /> },
  { href: '/admin/logs', label: 'Loglar', desc: 'Aksiyon geçmişi', icon: <FiActivity /> },
  { href: '/admin/winners', label: 'Kazananlar', desc: 'Ödül alanlar', icon: <FiAward /> },
  { href: '/admin/submissions', label: 'Başvurular', desc: 'Tüm başvurular', icon: <FiList /> },
  { href: '/admin/users', label: 'Kullanıcılar', desc: 'Admin hesapları', icon: <FiUsers /> },
]

const bottomLinks: NavLink[] = [
  { href: '/admin/settings', label: 'Ayarlar', desc: 'Sistem', icon: <FiSettings /> },
]

const pageTitles: Record<string, string> = {
  '/admin': 'Gösterge Paneli',
  '/admin/brands': 'Markalar',
  '/admin/brands/new': 'Yeni Marka',
  '/admin/branches': 'Şubeler',
  '/admin/users': 'Kullanıcılar',
  '/admin/rewards': 'Ödüller',
  '/admin/logs': 'Loglar',
  '/admin/winners': 'Kazananlar',
  '/admin/submissions': 'Başvurular',
  '/admin/settings': 'Ayarlar',
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      <LogoArea>
        <LogoText>Top</LogoText>
        <LogoText $accent>Loyalty</LogoText>
      </LogoArea>
      <LogoSubText>Yönetim Paneli</LogoSubText>

      <NavList>
        {navLinks.map((link) => (
          <NavItem
            key={link.href}
            as={Link}
            href={link.href}
            $active={isActive(link.href)}
            onClick={onClose}
          >
            {link.icon}
            <NavTextGroup>
              {link.label}
              <NavDesc>{link.desc}</NavDesc>
            </NavTextGroup>
          </NavItem>
        ))}

        <NavDivider />

        {bottomLinks.map((link) => (
          <NavItem
            key={link.href}
            as={Link}
            href={link.href}
            $active={isActive(link.href)}
            onClick={onClose}
          >
            {link.icon}
            <NavTextGroup>
              {link.label}
              <NavDesc>{link.desc}</NavDesc>
            </NavTextGroup>
          </NavItem>
        ))}
      </NavList>

      <SidebarFooter>
        <UserChip>
          <UserAvatar>A</UserAvatar>
          <UserInfo>
            <UserName>Admin</UserName>
            <UserRole>Süper Yönetici</UserRole>
          </UserInfo>
        </UserChip>
      </SidebarFooter>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentTitle = pageTitles[pathname] ?? 'Yönetim'

  return (
    <LayoutWrapper>
      <Sidebar>
        <SidebarContent pathname={pathname} />
      </Sidebar>

      <SidebarOverlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <MobileSidebar $open={mobileOpen}>
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </MobileSidebar>

      <MainArea>
        <Header>
          <HeaderLeft>
            <MenuButton onClick={() => setMobileOpen(true)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </MenuButton>
            <PageTitle>{currentTitle}</PageTitle>
          </HeaderLeft>
          <HeaderRight>
            <HeaderIconBtn>
              <FiBell />
              <NotifBadge />
            </HeaderIconBtn>
            <HeaderIconBtn>
              <FiLogOut />
            </HeaderIconBtn>
          </HeaderRight>
        </Header>
        <ContentArea>{children}</ContentArea>
      </MainArea>
    </LayoutWrapper>
  )
}
