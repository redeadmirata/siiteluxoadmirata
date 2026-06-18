'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image'
  mediaSrc: string
  bgImageSrc?: string
  title?: string
  date?: string
  scrollToExpand?: string
  textBlend?: boolean
  children?: React.ReactNode
}

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  bgImageSrc,
  title = 'ADMIRATA',
  date,
  scrollToExpand = 'Deslize para descobrir',
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // ── Clip-path: card → tela cheia ───────────────────────────────────
  // inset(top right bottom left round radius)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.72],
    [
      'inset(9% 13% 9% 13% round 14px)',
      'inset(0% 0% 0% 0% round 0px)',
    ]
  )

  // ── Restantes transforms ────────────────────────────────────────────
  const bgOpacity      = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const bgScale        = useTransform(scrollYProgress, [0, 0.72], [1.06, 1])
  const borderOpacity  = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.65], [0.52, 0])
  const titleOpacity   = useTransform(scrollYProgress, [0, 0.32], [1, 0])
  const titleY         = useTransform(scrollYProgress, [0, 0.32], [0, -28])
  const hintOpacity    = useTransform(scrollYProgress, [0, 0.18], [1, 0])
  const childrenOpacity = useTransform(scrollYProgress, [0.68, 0.92], [0, 1])
  const childrenY       = useTransform(scrollYProgress, [0.68, 0.92], [32, 0])

  // ── YouTube vs vídeo local ──────────────────────────────────────────
  const isYoutube = mediaSrc.includes('youtube.com') || mediaSrc.includes('youtu.be')
  const youtubeSrc = isYoutube
    ? `${mediaSrc}${mediaSrc.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&playsinline=1&rel=0&disablekb=1`
    : mediaSrc

  return (
    <div
      ref={containerRef}
      style={{ height: '260vh', position: 'relative', background: '#090b15' }}
    >
      {/* ── Sticky viewport ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Fundo (imagem de ambiente, desaparece ao expandir) */}
        {bgImageSrc && (
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-10%',
              backgroundImage: `url(${bgImageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              scale: bgScale,
              opacity: bgOpacity,
            }}
          />
        )}

        {/* Camada base escura */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: bgImageSrc
              ? 'linear-gradient(160deg, rgba(9,11,21,0.62) 0%, rgba(9,11,21,0.78) 100%)'
              : '#090b15',
            pointerEvents: 'none',
          }}
        />

        {/* ── Mídia com clip-path expand ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath,
            overflow: 'hidden',
            willChange: 'clip-path',
          }}
        >
          {/* ── Elemento de mídia ── */}
          {mediaType === 'video' && isYoutube ? (
            <iframe
              src={youtubeSrc}
              title={title ?? 'Admirata'}
              allow="autoplay; muted; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                // Cobertura full-bleed 16:9: maior das duas dimensões vence
                width: '177.78vh',   /* 100vh × 16/9 */
                height: '56.25vw',   /* 100vw × 9/16 */
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translate(-50%, -50%)',
                border: 'none',
                pointerEvents: 'none',
              }}
            />
          ) : mediaType === 'video' ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={mediaSrc}
              autoPlay
              muted
              playsInline
              loop
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '177.78vh',
                height: '56.25vw',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'cover',
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc}
              alt={title ?? 'Admirata'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Overlay escuro (some ao expandir → vídeo fica mais vivo) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9,11,21,0.55)',
              opacity: overlayOpacity,
              pointerEvents: 'none',
            }}
          />

          {/* Borda dourada do card (some ao expandir) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              border: '1px solid rgba(184,150,12,0.32)',
              borderRadius: 14,
              opacity: borderOpacity,
              pointerEvents: 'none',
            }}
          />

          {/* Brilho ambiente dourado */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184,150,12,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* ── Título central (some enquanto expande) ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 2rem',
            opacity: titleOpacity,
            y: titleY,
            mixBlendMode: textBlend ? 'overlay' : 'normal',
            pointerEvents: 'none',
          }}
        >
          {date && (
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: 'var(--color-gold, #b8960c)',
                marginBottom: 18,
              }}
            >
              {date}
            </p>
          )}
          {title && (
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                color: '#fff',
                lineHeight: 1.08,
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </h2>
          )}
        </motion.div>

        {/* ── Hint "Deslize para descobrir" ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            style={{
              opacity: hintOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              {scrollToExpand}
            </p>
            {/* Linha dourada pulsante */}
            <div
              aria-hidden="true"
              style={{
                width: 1,
                height: 44,
                background:
                  'linear-gradient(to bottom, rgba(184,150,12,0.7), transparent)',
                animation: 'semScrollPulse 2.2s ease-in-out infinite',
              }}
            />
          </motion.div>
        </div>

        {/* ── Conteúdo filho (aparece após expansão) ── */}
        {children && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: childrenOpacity,
              y: childrenY,
              pointerEvents: 'none',
            }}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Keyframe local */}
      <style>{`
        @keyframes semScrollPulse {
          0%, 100% { opacity: 0.65; transform: scaleY(1); transform-origin: top; }
          50%       { opacity: 1;    transform: scaleY(0.68); transform-origin: top; }
        }
      `}</style>
    </div>
  )
}
