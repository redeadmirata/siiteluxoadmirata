'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

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

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const pathname = usePathname()
  const isHome = pathname === '/'

  // NAV_LINKS built with translated labels (the href is locale-aware via next-intl Link)
  const NAV_LINKS = [
    { href: '/imoveis' as const, label: t('imoveis') },
    { href: '/condominios' as const, label: t('condominios') },
    { href: '/bairros' as const, label: t('bairros') },
    { href: '/blog' as const, label: t('blog') },
  ]

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
    if (menuAberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuAberto])

  const transparente = isHome && !scrolled

  const whatsappText =
    locale === 'en'
      ? 'Hello, I am interested in Admirata properties.'
      : locale === 'es'
      ? 'Hola, me interesan los inmuebles de Admirata.'
      : 'Olá, tenho interesse em imóveis da Admirata.'

  const whatsappUrl = `https://wa.me/5521998079459?text=${encodeURIComponent(whatsappText)}`

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-navbar transition-all duration-400 ${
          transparente
            ? 'h-20 bg-transparent'
            : 'h-[72px] bg-white/96 backdrop-blur-md border-b border-stone shadow-[0_1px_0_0_rgba(184,150,12,0.12)]'
        }`}
      >
        <nav
          className="max-w-screen-xl mx-auto h-full px-6 lg:px-10 flex items-center justify-between gap-8"
          aria-label={t('mainNav')}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="Admirata Imóveis — início"
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border font-display text-sm font-medium tracking-widest transition-colors duration-300 ${
                transparente
                  ? 'border-white/60 text-white'
                  : 'border-gold text-gold'
              }`}
              aria-hidden="true"
            >
              A
            </span>
            <span
              className={`text-[11px] tracking-[0.22em] uppercase font-body font-medium transition-colors duration-300 ${
                transparente ? 'text-white/90' : 'text-ink'
              }`}
            >
              Admirata
            </span>
          </Link>

          {/* Links desktop */}
          <ul
            className="hidden md:flex items-center gap-8 flex-1 justify-center"
            role="list"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const ativo = pathname?.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-[11px] tracking-[0.16em] uppercase transition-colors duration-200 pb-0.5 ${
                      ativo
                        ? transparente
                          ? 'text-white border-b border-white/60'
                          : 'text-gold border-b border-gold'
                        : transparente
                        ? 'text-white/70 hover:text-white'
                        : 'text-ink hover:text-gold'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* CTA + favoritos + idioma + hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Seletor de idioma - desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher variant="desktop" />
            </div>

            {/* Favoritos - desktop */}
            <Link
              href="/favoritos"
              aria-label={favCount > 0 ? `${t('favoritos')} (${favCount})` : t('favoritos')}
              className={`hidden md:flex relative items-center justify-center w-8 h-8 transition-colors duration-200 ${
                transparente ? 'text-white/70 hover:text-white' : 'text-ink/60 hover:text-gold'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={pathname === '/favoritos' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-gold text-white text-[9px] font-medium leading-none rounded-full"
                  aria-hidden="true"
                >
                  {favCount > 99 ? '99+' : favCount}
                </span>
              )}
            </Link>

            {/* WhatsApp - desktop */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase px-5 py-2.5 border transition-all duration-200 ${
                transparente
                  ? 'border-white/50 text-white hover:bg-white/10 hover:border-white/80'
                  : 'border-gold text-gold hover:bg-gold hover:text-white'
              }`}
            >
              WhatsApp
            </a>

            {/* Hamburger - mobile */}
            <button
              className={`md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-[5px] transition-colors ${
                transparente ? 'text-white' : 'text-ink'
              }`}
              onClick={() => setMenuAberto((v) => !v)}
              aria-label={menuAberto ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuAberto}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-6 h-px bg-current origin-center transition-transform duration-300 ${
                  menuAberto ? 'rotate-45 translate-y-[9px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-current transition-opacity duration-300 ${
                  menuAberto ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-current origin-center transition-transform duration-300 ${
                  menuAberto ? '-rotate-45 -translate-y-[9px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 top-0 z-[99] bg-ink transition-transform duration-400 ease-out-expo ${
          menuAberto ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('mobileMenu')}
      >
        <button
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-2xl leading-none"
          onClick={() => setMenuAberto(false)}
          aria-label={t('closeMenu')}
        >
          ×
        </button>

        <div className="flex flex-col justify-center h-full px-10 pb-10">
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] font-display text-white/[0.03] leading-none select-none pointer-events-none"
            aria-hidden="true"
          >
            A
          </div>

          <nav aria-label={t('mobileMenu')}>
            <ul className="flex flex-col gap-6 mb-12" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-display text-4xl text-white/80 hover:text-white transition-colors leading-tight"
                    onClick={() => setMenuAberto(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/favoritos"
                  className="inline-flex items-center gap-3 font-display text-4xl text-white/80 hover:text-white transition-colors leading-tight"
                  onClick={() => setMenuAberto(false)}
                >
                  {t('favoritos')}
                  {favCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gold text-ink text-base font-sans font-medium rounded-full">
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>

            {/* Language switcher mobile */}
            <div className="mb-8">
              <LanguageSwitcher variant="mobile" />
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-gold/60 text-gold text-xs uppercase tracking-widest px-6 py-3 hover:bg-gold hover:text-white transition-colors"
              onClick={() => setMenuAberto(false)}
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </>
  )
}
