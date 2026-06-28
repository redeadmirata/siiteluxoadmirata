/**
 * ClubeSection — seção de destaque do Clube embutida na página do condomínio.
 * Banner com logo grande + nome grande, intro/SEO, "rotina", programação
 * (seções âncora), galeria e copy emocional. Server component, orientado a dados.
 * Reutilizável por qualquer condomínio com clube (recebe `data`).
 */

import Image from 'next/image'
import type { ClubeData } from '@/data/clube-verdant'
import ProgramacaoClube from '@/components/clube/ProgramacaoClube'

const GALERIA = [
  { src: '/images/clube-verdant/c1.jpg', alt: 'Piscina do Clube Verdant com palmeiras e vista para a serra' },
  { src: '/images/clube-verdant/c2.jpg', alt: 'Fachada e área de convivência do Clube Verdant' },
  { src: '/images/clube-verdant/c3.jpg', alt: 'Alameda com pergolado e paisagismo do Clube Verdant' },
  { src: '/images/clube-verdant/c4.jpg', alt: 'Jardins floridos do Clube Verdant' },
  { src: '/images/clube-verdant/c5.jpg', alt: 'Praça de entrada do Clube Verdant' },
  { src: '/images/clube-verdant/c6.jpg', alt: 'Deck e terraço do Clube Verdant com vista para as montanhas' },
  { src: '/images/clube-verdant/c7.jpg', alt: 'Salão de jogos com mesa de sinuca do Clube Verdant' },
  { src: '/images/clube-verdant/c8.jpg', alt: 'Espaço de tênis de mesa do Clube Verdant' },
]

export default function ClubeSection({
  data,
  whatsappHref,
}: {
  data: ClubeData
  whatsappHref: string
}) {
  return (
    <div id="clube" style={{ scrollMarginTop: 64, background: '#090b15' }}>
      {/* ── Banner: logo grande + nome grande ─────────────────────────── */}
      <section
        aria-label={`${data.nome} — ${data.empreendimento}`}
        style={{
          position: 'relative',
          minHeight: 'min(78vh, 760px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/images/clube-verdant/banner.jpg"
          alt={data.hero.imagemAlt}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(9,11,21,0.62) 0%, rgba(9,11,21,0.45) 45%, rgba(9,11,21,0.82) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: 'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 4vw, 3rem)',
            maxWidth: 820,
          }}
        >
          <Image
            src="/images/clube-verdant/logo-clube.png"
            alt="Logo Grand Club Verdant"
            width={150}
            height={150}
            style={{ width: 'clamp(110px, 16vw, 160px)', height: 'auto', margin: '0 auto', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4))' }}
          />
          <p
            style={{
              marginTop: 22,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            {data.empreendimento}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontWeight: 300,
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: '#fff',
              margin: '10px 0 0',
            }}
          >
            {data.nome}
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              fontWeight: 300,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: 560,
              marginInline: 'auto',
            }}
          >
            {data.hero.subtitulo}
          </p>
          <a
            href="#rotina-clube"
            style={{
              display: 'inline-block',
              marginTop: 32,
              padding: '13px 30px',
              border: '1px solid rgba(184,150,12,0.6)',
              background: 'rgba(184,150,12,0.12)',
              borderRadius: 2,
              color: '#fff',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              textDecoration: 'none',
            }}
          >
            {data.hero.ctaLabel}
          </a>
        </div>
      </section>

      {/* ── Intro / SEO ───────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 9vh, 7rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {data.intro.paragrafos.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: i === 0 ? 'clamp(1.3rem, 2.4vw, 1.7rem)' : '1.05rem',
                  fontFamily: i === 0 ? 'var(--font-display, Georgia, serif)' : undefined,
                  fontWeight: 300,
                  lineHeight: i === 0 ? 1.4 : 1.8,
                  color: i === 0 ? '#fff' : 'rgba(255,255,255,0.62)',
                }}
              >
                {p}
              </p>
            ))}
          </div>
          <p
            style={{
              marginTop: 36,
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 300,
              color: 'var(--color-gold, #b8960c)',
              lineHeight: 1,
            }}
          >
            +{data.areaLazerM2.toLocaleString('pt-BR')} m²
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                marginTop: 8,
              }}
            >
              dedicados ao lazer
            </span>
          </p>
        </div>
      </section>

      {/* ── Rotina ────────────────────────────────────────────────────── */}
      <section
        id="rotina-clube"
        style={{ scrollMarginTop: 64, background: '#0c0e1a', padding: 'clamp(4rem, 9vh, 7rem) clamp(1.5rem, 4vw, 3rem)' }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontWeight: 300,
              fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {data.rotina.titulo}
          </h3>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.rotina.paragrafos.map((p, i) => (
              <p key={i} style={{ fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programação (seções âncora) ──────────────────────────────── */}
      <ProgramacaoClube categorias={data.programacao} />

      {/* ── Galeria ───────────────────────────────────────────────────── */}
      <section aria-label="Galeria do Clube Verdant" style={{ padding: 'clamp(2.5rem, 6vh, 4rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {GALERIA.map((g, i) => (
            <div key={g.src} style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 2 }}>
              <Image
                src={g.src}
                alt={g.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Copy emocional + CTA ──────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0c0e1a 0%, #090b15 100%)',
          padding: 'clamp(4.5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontWeight: 300,
              fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
              color: '#fff',
              margin: 0,
              lineHeight: 1.12,
            }}
          >
            {data.copyEmocional.titulo}
          </h3>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.copyEmocional.paragrafos.map((p, i) => (
              <p key={i} style={{ fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.66)' }}>
                {p}
              </p>
            ))}
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: 38,
              padding: '14px 34px',
              background: 'var(--color-gold, #b8960c)',
              color: '#0c0e1a',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              borderRadius: 2,
              textDecoration: 'none',
            }}
          >
            Falar com um especialista
          </a>
          <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
            {data.observacoes.join(' · ')}
          </p>
        </div>
      </section>
    </div>
  )
}
