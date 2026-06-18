'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

interface PropertyShowcaseProps {
  imageSrc?: string
  location?: string
  title?: string
  eyebrow?: string
  headline?: string
}

export default function PropertyShowcase({
  imageSrc = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=85',
  location = 'Barra da Tijuca · Rio de Janeiro',
  title = 'Cobertura com vista 360°',
  eyebrow = 'Alto padrão redefinido',
  headline = 'Cada detalhe,\numa experiência.',
}: PropertyShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const rotateX       = useTransform(scrollYProgress, [0, 0.55], [18, 0])
  const scale         = useTransform(scrollYProgress, [0, 0.55], [0.82, 1.0])
  const translateY    = useTransform(scrollYProgress, [0, 0.55], [40, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])
  const headerY       = useTransform(scrollYProgress, [0, 0.45], [0, -70])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [0.45, 0])
  const shadowOpacity  = useTransform(scrollYProgress, [0, 0.55], [0.4, 0.85])

  return (
    <div
      ref={containerRef}
      style={{ height: '220vh', position: 'relative', background: '#090b15' }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090b15',
          perspective: '1200px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        {/* Brilho ambiente */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 65% 55% at 50% 65%, rgba(184,150,12,0.09) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        {/* Texto header — desaparece ao scrollar */}
        <motion.div
          style={{
            opacity: headerOpacity,
            y: headerY,
            textAlign: 'center',
            position: 'relative',
            zIndex: 3,
            marginBottom: 'clamp(28px, 4vw, 48px)',
            padding: '0 2rem',
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'var(--color-gold, #b8960c)',
              marginBottom: 14,
            }}
          >
            {eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 5.5vw, 4rem)',
              color: '#fff',
              lineHeight: 1.08,
              whiteSpace: 'pre-line',
            }}
          >
            {headline}
          </h2>
        </motion.div>

        {/* Wrapper com perspectiva 3D */}
        <motion.div
          style={{
            rotateX,
            scale,
            y: translateY,
            transformOrigin: 'top center',
            position: 'relative',
            zIndex: 2,
            width: 'min(82vw, 1120px)',
          }}
        >
          {/* Sombra dinâmica (fora do overflow:hidden) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -36,
              left: '8%',
              right: '8%',
              height: 56,
              background: 'rgba(0,0,0,0.65)',
              filter: 'blur(28px)',
              opacity: shadowOpacity,
              pointerEvents: 'none',
            }}
          />

          {/* Frame do imóvel */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(184,150,12,0.28)',
            }}
          >
            {/* Imagem da propriedade */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Overlay dourado que some ao expandir */}
            <motion.div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(140deg, rgba(184,150,12,0.18) 0%, rgba(9,11,21,0.45) 100%)',
                opacity: overlayOpacity,
                pointerEvents: 'none',
              }}
            />

            {/* Gradiente inferior */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '45%',
                background:
                  'linear-gradient(to top, rgba(9,11,21,0.88) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Label do imóvel */}
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(18px, 3vw, 32px)',
                left: 'clamp(20px, 3.5vw, 36px)',
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold, #b8960c)',
                  marginBottom: 7,
                }}
              >
                {location}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(16px, 2.2vw, 24px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.93)',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </p>
            </div>

            {/* Badge "Exclusivo" */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(14px, 2vw, 22px)',
                right: 'clamp(14px, 2vw, 22px)',
                padding: '6px 14px',
                background: 'rgba(26,26,46,0.72)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(184,150,12,0.3)',
                borderRadius: 999,
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              Exclusivo
            </div>
          </div>{/* /frame do imóvel */}
        </motion.div>{/* /wrapper 3D */}

        {/* Linha dourada base */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(184,150,12,0.3) 30%, rgba(184,150,12,0.3) 70%, transparent)',
          }}
        />
      </div>
    </div>
  )
}
