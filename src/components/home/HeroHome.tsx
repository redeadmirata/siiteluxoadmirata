'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function HeroHome() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const textRef = useRef<HTMLDivElement>(null)

  const whatsappText =
    locale === 'en'
      ? 'Hello, I would like to know more about Admirata properties.'
      : locale === 'fr'
      ? "Bonjour, je souhaite en savoir plus sur les biens Admirata."
      : 'Olá, gostaria de conhecer imóveis da Admirata.'

  const whatsappUrl = `https://wa.me/5521998079459?text=${encodeURIComponent(whatsappText)}`

  useEffect(() => {
    // Respeitar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // GSAP via dynamic import (zero custo no SSR)
    import('gsap').then(({ gsap }) => {
      if (!textRef.current) return
      const els = Array.from(
        textRef.current.querySelectorAll<HTMLElement>('[data-anim]')
      )
      gsap.set(els, { opacity: 0, y: 20 })
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.15,
      })
    })
  }, [])

  return (
    <section
      className="relative min-h-[94vh] flex flex-col items-center justify-center bg-ink overflow-hidden"
      aria-label="Admirata Imóveis — imóveis de alto padrão no Rio de Janeiro e Serra Gaúcha"
    >
      {/* ── Ornamentos de fundo ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[40vw] text-white/[0.025] leading-none">
          A
        </span>
      </div>

      {/* Linha superior (vertical gold rule) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      {/* Grade decorativa — desktop */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(184,150,12,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Conteúdo central ── */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Label */}
        <p
          data-anim
          className="text-[10px] uppercase tracking-[0.45em] text-gold mb-8"
        >
          {t('label')}
        </p>

        {/* Headline principal */}
        <h1
          data-anim
          className="font-display font-light text-white leading-[1.04] mb-8"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
        >
          {t('title')}<br />
          <em className="not-italic text-stone/80">{t('titleAccent')}</em>
        </h1>

        {/* Divisória dourada */}
        <div
          data-anim
          className="flex items-center justify-center gap-4 mb-8"
          aria-hidden="true"
        >
          <div className="w-16 h-px bg-gold/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
          <div className="w-16 h-px bg-gold/40" />
        </div>

        {/* Mercados */}
        <p
          data-anim
          className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-12"
        >
          {t('markets')}
        </p>

        {/* CTAs */}
        <div
          data-anim
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-3 bg-gold text-white text-[11px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#d4ac1a] transition-colors duration-200"
          >
            {t('cta1')}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/25 text-white/80 text-[11px] uppercase tracking-[0.2em] px-8 py-4 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {t('cta2')}
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-[9px] uppercase tracking-[0.35em] text-white/25">
          {t('scroll')}
        </span>
      </div>
    </section>
  )
}
