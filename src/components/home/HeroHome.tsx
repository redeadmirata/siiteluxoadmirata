'use client'

/**
 * HeroHome — hero da página principal com vídeo fullscreen
 *
 * Vídeo de fundo: configure a variável de ambiente NEXT_PUBLIC_HERO_VIDEO_SRC
 * com a URL de um arquivo .mp4 (CDN, Cloudflare Stream, Sanity CDN, etc.).
 * Se não configurada, exibe o gradiente escuro como fallback.
 *
 * Imagem poster (exibida antes do vídeo carregar):
 * Adicione /public/images/hero-poster.jpg — recomendado 1920×1080.
 */

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import NeonButton from '@/components/ui/NeonButton'
import HeroMediaVideo from '@/components/ui/HeroMediaVideo'
import MarketSwitcher, { type Mercado } from '@/components/home/MarketSwitcher'
import MarketGate, { readMercado, writeMercado } from '@/components/home/MarketGate'

// ── Mídia do hero por região ──────────────────────────────────────────
// Rio: vídeo local (env var pode sobrescrever com CDN). Serra: YouTube provisório.
// HeroMediaVideo detecta mp4 vs YouTube/Vimeo automaticamente.
const HERO_MEDIA = {
  rio: {
    url: process.env.NEXT_PUBLIC_HERO_VIDEO_SRC ?? '/videos/hero-rio-lagoa.mp4',
    local: 'Lagoa Rodrigo de Freitas',
  },
  serra: {
    url: 'https://youtu.be/fJhcMHHXCh4', // provisório — substituir por vídeo próprio depois
    local: 'Gramado',
  },
} as const

function getHeroMedia(mercado: Mercado) {
  // '' (Ver tudo) e default → Rio
  return mercado === 'Serra Gaúcha' ? HERO_MEDIA.serra : HERO_MEDIA.rio
}

const WA_RIO   = '5521998079459'
const WA_SERRA = '5554992643070'

function waUrl(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}


function getCTA(mercado: Mercado): { label: string; href: string } {
  if (mercado === 'Serra Gaúcha') return { label: 'Ver imóveis em Gramado', href: '/gramado' }
  if (mercado === 'Rio de Janeiro') return { label: 'Explorar imóveis', href: '/imoveis?mercado=Rio+de+Janeiro' }
  return { label: 'Explorar imóveis', href: '/imoveis' }
}

function getWALabel(mercado: Mercado): string {
  return mercado === 'Serra Gaúcha' ? 'Falar com Roberto' : 'Fale conosco'
}

// ─────────────────────────────────────────────────────────────────────

export default function HeroHome() {
  const locale = useLocale()

  const [mercado, setMercadoState] = useState<Mercado>('')
  const [showGate, setShowGate]   = useState(false)
  const [mounted, setMounted]     = useState(false)

  useEffect(() => {
    const v = readMercado()
    setMercadoState(v ?? '')
    setShowGate(v === null)
    setMounted(true)
  }, [])

  const setMercado = useCallback((v: Mercado) => {
    setMercadoState(v)
    writeMercado(v)
  }, [])

  const chooseMercado = useCallback((v: Mercado) => {
    setMercado(v)
    setShowGate(false)
  }, [setMercado])

  const waPhone = mercado === 'Serra Gaúcha' ? WA_SERRA : WA_RIO
  const waText  = locale === 'en'
    ? 'Hello, I would like to know more about Admirata properties.'
    : 'Olá, gostaria de conhecer imóveis da Admirata.'
  const wa = waUrl(waPhone, waText)

  const heroMedia = getHeroMedia(mercado)
  const cta = getCTA(mercado)

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })
  }

  return (
    <>
      {mounted && showGate && <MarketGate onChoose={chooseMercado} />}

      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#090b15',
        }}
        aria-label="Admirata Imóveis — imóveis de alto padrão"
      >
        {/* ── Vídeo de fundo (mp4 local p/ Rio · YouTube p/ Serra) ──── */}
        <HeroMediaVideo url={heroMedia.url} />

        {/* ── Overlay escuro: legibilidade do texto + clima editorial ─ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(180deg, rgba(9,11,21,0.78) 0%, rgba(9,11,21,0.34) 38%, rgba(9,11,21,0.36) 55%, rgba(9,11,21,0.90) 100%)',
          }}
        />

        {/* Vignette de bordas para profundidade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 120% 120% at 50% 100%, rgba(9,11,21,0.7) 0%, transparent 60%)',
          }}
        />

        {/* ── Conteúdo ────────────────────────────────────────────── */}
        <div
          className="relative z-10 w-full mx-auto"
          style={{
            maxWidth: 1440,
            padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(4.5rem, 10vh, 8rem)',
          }}
        >
          {/* Local em destaque — sobre o vídeo (caption editorial) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 22,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 32,
                height: 1,
                background: 'var(--color-gold, #b8960c)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display, Georgia, serif)',
                fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {heroMedia.local}
            </span>
          </div>

          {/* Mercado switcher */}
          {mounted && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 12,
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.38)',
                }}
              >
                Região
              </span>
              <MarketSwitcher value={mercado} onChange={setMercado} />
            </div>
          )}

          {/* CTAs — 1 botão principal + link de texto */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <NeonButton variant="solid" size="default" href={cta.href}>
              {cta.label}
            </NeonButton>

            {/* Link de texto — não compete com o CTA principal */}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: 2,
                transition: 'color .2s, border-color .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = '#fff'
                el.style.borderColor = 'rgba(255,255,255,0.6)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,255,255,0.5)'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              {getWALabel(mercado)}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          aria-label="Rolar para próxima seção"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
              animation: 'adm-scroll-pulse 2s ease-in-out 1s infinite',
            }}
          />
          <span
            style={{
              fontSize: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.28)',
            }}
          >
            Scroll
          </span>
        </button>
      </section>
    </>
  )
}
