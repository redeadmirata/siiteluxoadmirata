'use client'

import { useState, useEffect } from 'react'
import NeonButton from '@/components/ui/NeonButton'
import type { Mercado } from '@/components/home/MarketSwitcher'

// Unsplash photos for letter hover reveal
const REVEAL_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1400&q=80',
]

interface RevealLetterProps {
  ch: string
  img: string
  index: number
  sweep: boolean
}

function RevealLetter({ ch, img, index, sweep }: RevealLetterProps) {
  const [hover, setHover] = useState(false)

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'clamp(2.75rem, 11vw, 9rem)',
        lineHeight: 1.02,
        letterSpacing: '-0.03em',
      }}
    >
      {/* base white text */}
      <span style={{ color: hover ? 'transparent' : '#fff', transition: 'color .12s' }}>
        {ch}
      </span>

      {/* photo fill on hover */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${img}')`,
          backgroundSize: 'cover',
          backgroundPosition: hover ? '12% center' : '0% center',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          opacity: hover ? 1 : 0,
          transition: 'opacity .15s, background-position 3s ease-in-out',
        }}
      >
        {ch}
      </span>

      {/* golden sweep (plays once on mount) */}
      {sweep && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            color: 'var(--color-gold)',
            pointerEvents: 'none',
            animation: `adm-sweep .5s ease-in-out ${index * 0.05}s both`,
          }}
        >
          {ch}
        </span>
      )}
    </span>
  )
}

interface RevealTextProps {
  text: string
}

function RevealText({ text }: RevealTextProps) {
  const [sweep, setSweep] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSweep(true), 400)
    return () => clearTimeout(t)
  }, [])

  let gi = 0
  let imgIdx = 0

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.32em' }}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
          {word.split('').map((ch) => {
            const i = gi++
            const img = REVEAL_IMGS[imgIdx++ % REVEAL_IMGS.length]
            return <RevealLetter key={i} ch={ch} img={img} index={i} sweep={sweep} />
          })}
        </span>
      ))}
    </div>
  )
}

interface BarraDestaqueProps {
  mercado?: Mercado
}

const CONFIG: Record<string, { text: string; copy: string; btn: string; href: string }> = {
  'Serra Gaucha': {
    text: 'GRAMADO',
    copy: 'O destino de serra mais charmoso do Brasil — arquitetura em pedra e madeira, ruas arborizadas e gastronomia premiada. Casas em condominio e coberturas para morar ou para a temporada de inverno.',
    btn: 'Ver imoveis em Gramado',
    href: '/gramado',
  },
  default: {
    text: 'BARRA DA TIJUCA',
    copy: 'Orla de 18 km, condominios planejados e a maior concentracao de imoveis de alto padrao do Rio. Da praia a lagoa, a Barra reune seguranca, lazer completo e arquitetura contemporanea.',
    btn: 'Ver imoveis na Barra',
    href: '/imoveis',
  },
}

export default function BarraDestaque({ mercado }: BarraDestaqueProps) {
  const cfg = mercado === 'Serra Gaúcha' ? CONFIG['Serra Gaucha'] : CONFIG.default

  return (
    <section
      style={{
        background: 'var(--color-ink, #1a1a2e)',
        padding: 'clamp(4rem, 10vw, 8rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle gold gradient accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(184,150,12,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 2.5rem)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            color: 'var(--color-gold, #b8960c)',
            marginBottom: 8,
          }}
        >
          Bairro em destaque
        </p>
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 36,
            letterSpacing: '0.1em',
          }}
        >
          Passe o mouse sobre o nome
        </p>

        <RevealText text={cfg.text} />

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 620,
            margin: '40px auto 32px',
          }}
        >
          {cfg.copy}
        </p>

        <NeonButton variant="solid" size="lg" href={cfg.href}>
          {cfg.btn}
        </NeonButton>
      </div>
    </section>
  )
}
