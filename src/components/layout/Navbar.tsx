'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'

const STORAGE_KEY = 'admirata_favoritos'

function getFavCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]).length : 0
  } catch {
    return 0
  }
}

const NAV_LINKS = [
  { href: '/',                label: 'Home' },
  { href: '/imoveis/locacao', label: 'Locação' },
  { href: '/lancamentos',     label: 'Lançamentos' },
  { href: '/condominios',     label: 'Condomínios' },
  { href: '/anuncie',         label: 'Anuncie' },
  { href: '/sobre',           label: 'Sobre' },
  { href: '/contato',         label: 'Contato' },
]

// Social icon paths
const SOCIAL = {
  instagram: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM17.4 6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z',
  youtube:   'M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C19.3 5 12 5 12 5s-7.3 0-8.9.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8C4.7 19 12 19 12 19s7.3 0 8.9-.5a2.5 2.5 0 0 0 1.7-1.8C23 15.2 23 12 23 12ZM9.7 15.1V8.9l5.4 3.1-5.4 3.1Z',
  tiktok:    'M16.5 2c.3 2.2 1.5 3.7 3.5 4v2.6c-1.3 0-2.5-.4-3.5-1v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2.1 2.9V2h2.7Z',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const transparente = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setFavCount(getFavCount())
    const onFav = () => setFavCount(getFavCount())
    window.addEventListener('admirata_favoritos_change', onFav)
    return () => window.removeEventListener('admirata_favoritos_change', onFav)
  }, [])

  useEffect(() => setMenuAberto(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuAberto])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: transparente ? 88 : 72,
          background: transparente ? 'transparent' : 'rgba(13,27,62,0.92)',
          backdropFilter: transparente ? 'none' : 'blur(14px)',
          WebkitBackdropFilter: transparente ? 'none' : 'blur(14px)',
          borderBottom: transparente ? 'none' : '1px solid rgba(184,150,12,0.18)',
          transition: 'all .4s cubic-bezier(.25,.46,.45,.94)',
        }}
      >
        <nav
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            height: '100%',
            padding: '0 clamp(1.5rem, 4vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
          aria-label="Navegacao principal"
        >
          {/* Logo */}
          <Link href="/" aria-label="Admirata Imoveis - inicio" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <Image
              src="/logo-horizontal.png"
              alt="Admirata Imoveis"
              width={724}
              height={310}
              style={{ height: 46, width: 'auto', display: 'block', transform: 'translateY(4px)' }}
              priority
            />
          </Link>

          {/* Links desktop */}
          <ul
            className="adm-nav-links"
            style={{ display: 'flex', alignItems: 'center', gap: 26, listStyle: 'none', flex: 1, justifyContent: 'center', margin: 0, padding: 0 }}
            role="list"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const hrefPath = href.split('?')[0]
              const ativo = label === 'Home' ? pathname === '/' : pathname?.startsWith(hrefPath) && hrefPath !== '/'
              return (
                <li key={label}>
                  <Link
                    href={href}
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      paddingBottom: 3,
                      textDecoration: 'none',
                      transition: 'color .2s',
                      whiteSpace: 'nowrap',
                      color: ativo ? 'var(--color-gold, #b8960c)' : 'rgba(255,255,255,0.78)',
                      borderBottom: ativo ? '1px solid var(--color-gold, #b8960c)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => { if (!ativo) (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={(e) => { if (!ativo) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.78)' }}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Acoes direita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>

            {/* Social icons */}
            <div className="adm-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {(Object.entries(SOCIAL) as [keyof typeof SOCIAL, string][]).map(([kind, path]) => (
                <a
                  key={kind}
                  href={
                    kind === 'instagram' ? 'https://instagram.com/admirataimoveis'
                    : kind === 'youtube' ? 'https://youtube.com/@admirataimoveis'
                    : 'https://tiktok.com/@admirataimoveis'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={kind}
                  style={{ color: 'rgba(255,255,255,0.6)', transition: 'color .2s', display: 'flex' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gold, #b8960c)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                    <path d={path} />
                  </svg>
                </a>
              ))}

              {/* Favoritos / coração */}
              <Link
                href="/favoritos"
                aria-label={favCount > 0 ? `Favoritos (${favCount})` : 'Favoritos'}
                style={{ color: 'rgba(255,255,255,0.6)', transition: 'color .2s', display: 'flex', position: 'relative' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gold, #b8960c)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {favCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    minWidth: 14, height: 14, padding: '0 2px',
                    background: 'var(--color-gold, #b8960c)', color: '#fff',
                    fontSize: 9, fontWeight: 600, borderRadius: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  }}>
                    {favCount > 99 ? '99+' : favCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Botao CLIENTE */}
            <div className="adm-hide-mobile">
              <Link
                href="/cliente"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '9px 24px',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: '#fff',
                  borderRadius: 999,
                  textDecoration: 'none',
                  transition: 'all .25s',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(255,255,255,0.1)'
                  el.style.borderColor = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.borderColor = 'rgba(255,255,255,0.5)'
                }}
              >
                Cliente
              </Link>
            </div>

            {/* Hamburger mobile */}
            <button
              className="adm-show-mobile"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, width: 32, height: 32, padding: 0 }}
              onClick={() => setMenuAberto((v) => !v)}
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
            >
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'block', transformOrigin: 'center', transform: menuAberto ? 'rotate(45deg) translateY(9px)' : '', transition: 'transform .3s' }} />
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'block', opacity: menuAberto ? 0 : 1, transition: 'opacity .3s' }} />
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'block', transformOrigin: 'center', transform: menuAberto ? 'rotate(-45deg) translateY(-9px)' : '', transition: 'transform .3s' }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0d1b3e',
          zIndex: 99,
          padding: '80px 40px 40px',
          transform: menuAberto ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.25,.46,.45,.94)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
        className="adm-show-mobile"
      >
        <button
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu"
          style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}
        >
          ×
        </button>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 40, padding: 0 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setMenuAberto(false)}
                style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', cursor: 'pointer' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/cliente"
          onClick={() => setMenuAberto(false)}
          style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '10px 28px', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', borderRadius: 999, textDecoration: 'none', display: 'inline-flex' }}
        >
          Cliente
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .adm-hide-mobile { display: none !important; }
          .adm-show-mobile { display: flex !important; }
          .adm-nav-links   { display: none !important; }
        }
      `}</style>
    </>
  )
}
