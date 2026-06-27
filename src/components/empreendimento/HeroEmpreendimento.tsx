'use client'

/**
 * HeroEmpreendimento — Seção 1: Hero em tela cheia (100svh).
 *
 * - Mídia de fundo: vídeo MP4 (autoplay/mute/loop) quando disponível, senão
 *   imagem com parallax suave (scroll → translateY).
 * - Sobreposição editorial: eyebrow (tipo) · headline (nome) · localização ·
 *   badge de status · indicador de scroll.
 *
 * Animações (handoff):
 * - Imagem de fundo: parallax translateY 0→120px ao longo do scroll do hero.
 * - Headline: clip-path reveal 0.9s expo-out, delay 0.2s.
 * - Eyebrow/local/badge: fade+up em stagger.
 * - prefers-reduced-motion: parallax e reveals desligados.
 */

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { clipReveal, revealUp, staggerContainer, HERO_PARALLAX_Y } from './anim'
import { scrollTo } from '@/hooks/useLenis'

interface HeroEmpreendimentoProps {
  nome: string
  tipoLabel?: string
  status?: string
  bairroNome?: string
  cidade?: string
  estado?: string
  imageSrc?: string
  imageLqip?: string
  videoMp4?: string
  /** id da próxima seção para o scroll cue */
  proximaSecaoId?: string
}

export default function HeroEmpreendimento({
  nome,
  tipoLabel,
  status,
  bairroNome,
  cidade,
  estado,
  imageSrc,
  imageLqip,
  videoMp4,
  proximaSecaoId = 'manifesto',
}: HeroEmpreendimentoProps) {
  const ref = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, HERO_PARALLAX_Y])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75])

  const estadoLabel = estado === 'RJ' ? 'Rio de Janeiro' : estado === 'RS' ? 'Rio Grande do Sul' : estado
  const local = [bairroNome, cidade ?? estadoLabel].filter(Boolean).join(' · ')

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink"
      aria-label={`Empreendimento ${nome}`}
    >
      {/* ── Mídia de fundo ─────────────────────────────────────────────── */}
      <m.div className="absolute inset-0 will-change-transform" style={prefersReduced ? undefined : { y }}>
        {videoMp4 ? (
          <video
            className="h-[115%] w-full object-cover"
            src={videoMp4}
            poster={imageSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={nome}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-110"
            placeholder={imageLqip ? 'blur' : 'empty'}
            blurDataURL={imageLqip}
          />
        ) : null}
      </m.div>

      {/* ── Overlay gradiente ──────────────────────────────────────────── */}
      <m.div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20"
        style={prefersReduced ? undefined : { opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* ── Conteúdo ───────────────────────────────────────────────────── */}
      <m.div
        className="relative z-10 flex h-full flex-col justify-end container-site pb-20 sm:pb-28"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {tipoLabel && (
          <m.span
            variants={revealUp}
            className="mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            {tipoLabel}
          </m.span>
        )}

        <m.h1
          variants={clipReveal}
          style={{ fontFamily: 'var(--font-display)' }}
          className="max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.98] text-white"
        >
          {nome}
        </m.h1>

        <m.div variants={revealUp} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {local && <p className="text-base text-white/70 sm:text-lg">{local}</p>}
          {status && (
            <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold backdrop-blur-sm">
              {status}
            </span>
          )}
        </m.div>
      </m.div>

      {/* ── Scroll cue ─────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => scrollTo(`#${proximaSecaoId}`, { offset: 0 })}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-gold"
        aria-label="Rolar para a próxima seção"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Explore</span>
        <m.span
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-10 w-px bg-gradient-to-b from-gold to-transparent"
          aria-hidden="true"
        />
      </button>
    </section>
  )
}
