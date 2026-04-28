'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiBarChart2, FiGift, FiMapPin, FiAward, FiMenu, FiX } from 'react-icons/fi'
import {
  BrandLayout,
  Sidebar,
  SidebarOverlay,
  MobileSidebar,
  Logo,
  LogoAccent,
  Caption,
  Nav,
  NavLink,
  LinkWrap,
  NavTextGroup,
  NavDesc,
  Main,
  Header,
  HeaderLeft,
  MenuButton,
  HeaderTitle,
  HeaderSub,
  HeaderInfo,
  Body,
} from './layout.styles'

interface NavItem {
  href: string
  label: string
  desc: string
  icon: React.ReactNode
}

const links: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', desc: 'Günlük özet', icon: <FiBarChart2 /> },
  { href: '/branches', label: 'Şubeler & QR', desc: 'QR kod üret, şube ekle', icon: <FiMapPin /> },
  { href: '/rewards', label: 'Ödül Yönetimi', desc: 'Günlük ödül tanımla', icon: <FiGift /> },
  { href: '/reports', label: 'Kazananlar', desc: 'Yorum ve ödül listesi', icon: <FiAward /> },
]

const titles: Record<string, { title: string; sub: string }> = {
  '/brand': { title: 'Marka Dashboard', sub: 'Genel performans ve günlük özet' },
  '/dashboard': { title: 'Marka Dashboard', sub: 'Genel performans ve günlük özet' },
  '/branches': { title: 'Şube Yönetimi', sub: 'Şube ve Google yorum akışlarını yönetin' },
  '/rewards': { title: 'Ödül Yönetimi', sub: 'Ödül tanımları ve günlük limit yönetimi' },
  '/reports': { title: 'Raporlar', sub: 'Kazanımlar, başvurular ve operasyon metrikleri' },
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <Logo>
        Top<LogoAccent>Loyalty</LogoAccent>
      </Logo>
      <Caption>Marka Paneli</Caption>
      <Nav>
        {links.map((item) => (
          <LinkWrap key={item.href}>
            <Link href={item.href} onClick={onClose}>
              <NavLink $active={pathname.startsWith(item.href)}>
                {item.icon}
                <NavTextGroup>
                  {item.label}
                  <NavDesc>{item.desc}</NavDesc>
                </NavTextGroup>
              </NavLink>
            </Link>
          </LinkWrap>
        ))}
      </Nav>
    </>
  )
}

export default function BrandPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const heading = titles[pathname] ?? { title: 'Marka Paneli', sub: 'Yönetim' }

  return (
    <BrandLayout>
      <Sidebar>
        <SidebarContent pathname={pathname} />
      </Sidebar>

      <SidebarOverlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <MobileSidebar $open={mobileOpen}>
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </MobileSidebar>

      <Main>
        <Header>
          <HeaderLeft>
            <MenuButton onClick={() => setMobileOpen(true)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </MenuButton>
            <HeaderInfo>
              <HeaderTitle>{heading.title}</HeaderTitle>
              <HeaderSub>{heading.sub}</HeaderSub>
            </HeaderInfo>
          </HeaderLeft>
        </Header>
        <Body>{children}</Body>
      </Main>
    </BrandLayout>
  )
}
