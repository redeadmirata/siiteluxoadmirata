'use client'

import { useRef, useEffect } from 'react'
import NeonButton from '@/components/ui/NeonButton'

interface Cidade {
  slug: string
  nome: string
  estado: string
  sub: string
  cor: string
  href: string
}

const CIDADES: Cidade[] = [
  {
    slug: 'rio',
    nome: 'Rio de Janeiro',
    estado: 'RJ',
    sub: 'Barra da Tijuca, Recreio, Zona Sul',
    cor: '#1a2540',
    href: '/imoveis',
  },
  {
    slug: 'gramado',
    nome: 'Gramado',
    estado: 'RS',
    sub: 'Serra Gaucha — natureza e exclusividade',
    cor: '#1a2a20',
    href: '/gramado',
  },
  {
    slug: 'canela',
    nome: 'Canela',
    estado: 'RS',
    sub: 'Serra Gaucha — sofisticacao entre pinheiros',
    cor: '#1f1a2a',
    href: '/gramado',
  },
]

function CidadeCard({ c, index }: { c: Cidade; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const inner = innerRef.current
    if (!card || !inner) return

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width  - 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5
      inner.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`
    }
    const onLeave = () => {
      inner.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)'
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        flex: '1 1 280px',
        minWidth: 0,
        cursor: 'pointer',
        animationDelay: `${index * 0.12}s`,
      }}
    >
      <div
        ref={innerRef}
        style={{
          transition: 'transform 0.25s cubic-bezier(.23,.86,.39,.96)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(184,150,12,0.22)',
          background: c.cor,
        }}
      >
        {/* visual placeholder — trocar por <Image> do Sanity */}
        <div style={{ aspectRatio: '4 / 3', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(150deg, ${c.cor} 0%, rgba(8,9,17,0.8) 100%)`,
          }} />
          {/* radial accent */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,150,12,0.10) 0%, transparent 70%)',
          }} />
          {/* city initial */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8rem',
              color: 'rgba(255,255,255,0.04)',
              userSelect: 'none',
              lineHeight: 1,
            }}>
              {c.nome[0]}
            </span>
          </div>
          {/* estado badge */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            padding: '4px 10px',
            border: '1px solid rgba(184,150,12,0.45)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.22em',
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
          }}>
            {c.estado}
          </div>
        </div>

        {/* copy */}
        <div style={{ padding: 'clamp(20px, 2.5vw, 28px)' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 10,
          }}>
            {c.nome}
          </h3>
          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            marginBottom: 22,
          }}>
            {c.sub}
          </p>
          <NeonButton variant="ghost" size="sm" tone="onDark" href={c.href}>
            Ver imoveis
          </NeonButton>
        </div>
      </div>
    </div>
  )
}

export default function CidadesDestaque() {
  return (
    <section
      style={{
        background: '#090b15',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)',
      }}
      aria-label="Cidades onde atuamos"
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(16px, 2vw, 24px)',
          perspective: '1200px',
        }}>
          {CIDADES.map((c, i) => (
            <CidadeCard key={c.slug} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
