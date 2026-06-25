'use client'

/**
 * HeroMedia — hero imersivo reutilizável
 *
 * Suporte:
 *  - Vídeo MP4 direto: <video autoplay muted loop>
 *  - YouTube / Vimeo: iframe embed sem controles, autoplay muted
 *  - Foto: Ken Burns (zoom lento) + Parallax scroll (GSAP)
 *  - Fallback: fundo sólido escuro
 *
 * Efeitos disponíveis:
 *  - Ken Burns (CSS keyframes)
 *  - Parallax scroll (GSAP ScrollTrigger)
 *  - Texto com fade+slide Framer Motion
 *  - Grain overlay SVG
 *  - Gradiente editorial de luxo
 */

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Detecta YouTube ──────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function isMp4(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

// ─── Tipos ────────────────────────────────────────────────────────

export interface HeroMediaProps {
  /** URL de vídeo: MP4 direto, YouTube ou Vimeo */
  videoUrl?: string
  /** URL da imagem (Sanity CDN) */
  imageUrl?: string
  imageLqip?: string
  imageAlt?: string

  /** Texto sobreposto */
  eyebrow?: string
  title?: string
  subtitle?: string

  /** Altura do hero */
  height?: string
  minHeight?: string

  /** Efeitos */
  kenBurns?: boolean   // default true (só fotos)
  parallax?: boolean   // default true (só fotos)
  grain?: boolean      // default true

  /** Slot para BreadcrumbNav, CTAs, badges, etc. */
  children?: React.ReactNode

  /** Alinhamento do conteúdo: bottom-left (padrão luxo) ou center */
  align?: 'bottom-left' | 'center'
}

// ─── Grain SVG (data-URI) ─────────────────────────────────────────

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`

// ─── Componente ───────────────────────────────────────────────────

export default function HeroMedia({
  videoUrl,
  imageUrl,
  imageLqip,
  imageAlt = '',
  eyebrow,
  title,
  subtitle,
  height = '82vh',
  minHeight = '520px',
  kenBurns = true,
  parallax = true,
  grain = true,
  children,
  align = 'bottom-left',
}: HeroMediaProps) {
  const sectionRef  = useRef<HTMLElement>(null)
  const mediaRef    = useRef<HTMLDivElement>(null)

  // ── Parallax GSAP (só fotos) ──────────────────────────────────
  useEffect(() => {
    if (!parallax || videoUrl || !mediaRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [parallax, videoUrl])

  // ── Variantes Framer Motion ───────────────────────────────────
  const fadeUp = {
    hidden:  { opacity: 0, y: 28 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
    }),
  }

  // ── Resolver tipo de mídia ────────────────────────────────────
  const ytId    = videoUrl ? getYouTubeId(videoUrl) : null
  const vimeoId = videoUrl ? getVimeoId(videoUrl)   : null
  const isMp4v  = videoUrl ? isMp4(videoUrl)        : false

  const hasVideo = !!(ytId || vimeoId || isMp4v)

  // ── Alinhamento ───────────────────────────────────────────────
  const isCenter = align === 'center'
  const contentAlign = isCenter
    ? 'flex items-center justify-center text-center'
    : 'flex items-end justify-start'

  return (
    <section
      ref={sectionRef}
      style={{ height, minHeight, position: 'relative', overflow: 'hidden', background: '#0a0f1e' }}
      aria-label={title ?? 'Hero'}
    >
      {/* ── CAMADA DE MÍDIA ──────────────────────────────────── */}
      <div
        ref={mediaRef}
        style={{
          position: 'absolute',
          inset: 0,
          // Parallax precisa de altura extra para o movimento
          ...(parallax && !hasVideo ? { top: '-10%', bottom: '-10%' } : {}),
        }}
      >
        {/* ── MP4 direto ── */}
        {isMp4v && videoUrl && (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* ── YouTube embed ── */}
        {ytId && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&iv_load_policy=3`}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            style={{
              position: 'absolute',
              // Oversize para cobrir letterbox
              top: '50%', left: '50%',
              width: '177.78vh',   // 16:9 based on height
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw', // 16:9 based on width
              transform: 'translate(-50%, -50%)',
              border: 'none',
              pointerEvents: 'none',
            }}
            title={title ?? 'Hero video'}
          />
        )}

        {/* ── Vimeo embed ── */}
        {vimeoId && (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1&byline=0&title=0`}
            allow="autoplay; fullscreen"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '177.78vh',
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              pointerEvents: 'none',
            }}
            title={title ?? 'Hero video'}
          />
        )}

        {/* ── Foto com Ken Burns ── */}
        {!hasVideo && imageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: kenBurns ? 'kenBurns 22s ease-in-out infinite alternate' : undefined,
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              placeholder={imageLqip ? 'blur' : 'empty'}
              blurDataURL={imageLqip}
            />
          </div>
        )}
      </div>

      {/* ── GRADIENTES ───────────────────────────────────────── */}
      {/* Base escura (garante contraste mesmo sem imagem) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: hasVideo
            ? 'linear-gradient(to top, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.25) 50%, rgba(10,15,30,0.15) 100%)'
            : 'linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.35) 45%, rgba(10,15,30,0.08) 100%)',
        }}
      />
      {/* Vinheta lateral esquerda (editorial) */}
      {!isCenter && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(10,15,30,0.55) 0%, transparent 55%)',
          }}
        />
      )}

      {/* ── GRAIN ────────────────────────────────────────────── */}
      {grain && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN_SVG,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: 0.6,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── CONTEÚDO ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: isCenter ? '0' : '0 clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 5vh, 4rem)',
        }}
        className={contentAlign}
      >
        {children ? (
          /* Slot livre — o pai controla todo o conteúdo */
          <div style={{ width: '100%' }}>
            {children}
          </div>
        ) : (
          /* Conteúdo padrão (eyebrow + title + subtitle) */
          <div style={{ maxWidth: isCenter ? '56rem' : '44rem' }}>
            {eyebrow && (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold, #b8960c)',
                  marginBottom: '0.75rem',
                }}
              >
                {eyebrow}
              </motion.p>
            )}

            {title && (
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.15}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                  lineHeight: 1.05,
                  color: '#ffffff',
                  marginBottom: subtitle ? '1rem' : 0,
                }}
              >
                {title}
              </motion.h1>
            )}

            {subtitle && (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                style={{
                  fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                  color: 'rgba(255,255,255,0.62)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  maxWidth: '36rem',
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* ── CSS KEYFRAMES ─────────────────────────────────────── */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0, 0); }
          100% { transform: scale(1.08) translate(-1.5%, -1%); }
        }
      `}</style>
    </section>
  )
}
