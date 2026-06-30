/**
 * /bairros-planejados
 * Editorial listing dos bairros planejados do Rio de Janeiro
 * Hierarquia SEO: Rio de Janeiro → Bairros Planejados → [Bairro]
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { BAIRROS_PLANEJADOS_QUERY } from '@/sanity/queries'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

export const revalidate = 3600

// ─── Fallback editorial enquanto não há dados no Sanity ────────────────────
const BAIRROS_FALLBACK = [
  {
    slug: 'cidade-arte-barra',
    nome: 'Cidade Arte',
    cidade: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    incorporadora: 'Calper',
    introTexto: 'O primeiro bairro planejado da Barra Olímpica — arquitetura contemporânea, 1.800 árvores nativas, parques, quadras e uma nova forma de viver na Barra da Tijuca.',
    totalCondominios: 5,
    totalImoveis: 0,
  },
  {
    slug: 'ilha-pura',
    nome: 'Ilha Pura',
    cidade: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    incorporadora: 'Carvalho Hosken',
    introTexto: 'Bairro planejado na Barra Olímpica com parque, áreas de convivência, mobilidade, segurança e soluções urbanas integradas.',
    totalCondominios: 7,
    totalImoveis: 0,
  },
  {
    slug: 'peninsula',
    nome: 'Península',
    cidade: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    incorporadora: 'Odebrecht Realizações',
    introTexto: 'Bairro planejado integrado à natureza, com parques, jardins, mobilidade e serviços às margens da Lagoa de Jacarepaguá.',
    totalCondominios: 12,
    totalImoveis: 0,
  },
  {
    slug: 'rio2',
    nome: 'Rio2',
    cidade: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    introTexto: 'Bairro planejado na Barra Olímpica com parques, áreas verdes, esporte, conveniência, segurança e transporte próprio.',
    totalCondominios: 8,
    totalImoveis: 0,
  },
  {
    slug: 'cidade-jardim',
    nome: 'Cidade Jardim',
    cidade: 'Rio de Janeiro',
    regiao: 'Barra Olímpica',
    introTexto: 'Bairro planejado cercado por áreas verdes e integrado a lazer, serviços, mobilidade e segurança.',
    totalCondominios: 0,
    totalImoveis: 0,
  },
  {
    slug: 'pontal-oceanico',
    nome: 'Pontal Oceânico',
    cidade: 'Rio de Janeiro',
    regiao: 'Recreio dos Bandeirantes',
    introTexto: 'Amplo complexo no Recreio com parque linear, quadras esportivas e fácil acesso à Praia do Recreio.',
    totalCondominios: 6,
    totalImoveis: 0,
  },
]

interface BairroCard {
  _id: string
  slug: { current: string }
  nome: string
  cidade?: string
  regiao?: string
  incorporadora?: string
  introTexto?: string
  fotoCapa?: { asset?: { url: string; metadata?: { lqip?: string } } }
  fotoAerea?: { asset?: { url: string; metadata?: { lqip?: string } } }
  totalImoveis: number
  totalCondominios: number
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Bairros Planejados no Rio | Admirata',
    description:
      'Conheça Cidade Arte, Ilha Pura, Rio2, Cidade Jardim, Península e Pontal Oceânico. Bairros planejados com imóveis selecionados pela Admirata.',
    alternates: {
      canonical: `${siteUrl}${localePrefix}/bairros-planejados`,
    },
    openGraph: {
      title: 'Bairros Planejados no Rio de Janeiro — Admirata',
      description: 'Cidade Arte, Ilha Pura, Rio2, Cidade Jardim, Península e Pontal Oceânico.',
      type: 'website',
      url: `${siteUrl}${localePrefix}/bairros-planejados`,
    },
  }
}

export default async function BairrosPlanejadosPage({
  params,
}: {
  params: { locale: string }
}) {
  setRequestLocale(params.locale)

  const bairrosSanity = await client
    .fetch<BairroCard[]>(BAIRROS_PLANEJADOS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => [] as BairroCard[])

  const useFallback = bairrosSanity.length === 0

  const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Rio de Janeiro', item: `${siteUrl}${localePrefix}/bairros` },
          { '@type': 'ListItem', position: 3, name: 'Bairros Planejados', item: `${siteUrl}${localePrefix}/bairros-planejados` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Bairros Planejados no Rio de Janeiro',
        description: 'Cidade Arte, Ilha Pura, Rio2, Cidade Jardim, Península e Pontal Oceânico.',
        url: `${siteUrl}${localePrefix}/bairros-planejados`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '72vh',
          display: 'flex',
          alignItems: 'flex-end',
          background: 'linear-gradient(160deg, #0a0f1e 0%, #1a1a2e 50%, #090b15 100%)',
          overflow: 'hidden',
          paddingTop: 72,
        }}
      >
        {/* Glow dourado */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 65% 35%, rgba(184,150,12,0.1) 0%, transparent 65%),' +
              'radial-gradient(ellipse 40% 60% at 15% 70%, rgba(45,74,62,0.15) 0%, transparent 55%)',
          }}
        />

        {/* Linha dourada vertical */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 'clamp(1.5rem, 5vw, 4rem)',
            top: '15%',
            bottom: '15%',
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(184,150,12,0.45) 30%, rgba(184,150,12,0.45) 70%, transparent)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 1280,
            margin: '0 auto',
            padding: 'clamp(3rem, 7vh, 5rem) clamp(2rem, 6vw, 5rem)',
          }}
        >
          <BreadcrumbNav
            items={[
              { label: 'Início', href: '/' },
              { label: 'Rio de Janeiro', href: '/bairros' },
              { label: 'Bairros Planejados' },
            ]}
            dark
          />

          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'var(--color-gold, #b8960c)',
              marginTop: '2rem',
              marginBottom: '1rem',
            }}
          >
            Rio de Janeiro · Curadoria exclusiva
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              marginBottom: '1.5rem',
            }}
          >
            Bairros<br />Planejados
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              fontWeight: 300,
              lineHeight: 1.78,
              maxWidth: '44rem',
              marginBottom: '3rem',
            }}
          >
            Complexos residenciais de alto padrão onde arquitetura, natureza e
            infraestrutura completa se encontram em um único endereço. Do Ilha Pura
            à Península — a Admirata representa os melhores imóveis em cada um deles.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 4rem)', flexWrap: 'wrap' }}>
            {[
              { valor: `${bairrosSanity.length > 0 ? bairrosSanity.length : BAIRROS_FALLBACK.length}`, label: 'Bairros planejados' },
              { valor: '500+', label: 'Condomínios mapeados' },
              { valor: 'Barra & Recreio', label: 'Principais regiões' },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    fontWeight: 300,
                    color: 'var(--color-gold, #b8960c)',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.valor}
                </p>
                <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O que é um Bairro Planejado — contexto editorial ── */}
      <section
        style={{
          background: 'var(--color-stone, #F5F0E8)',
          padding: 'clamp(3rem, 5vw, 4.5rem) clamp(1.5rem, 5vw, 4rem)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '3rem' }}>
          {[
            {
              icone: '🏗️',
              titulo: 'Infraestrutura completa',
              desc: 'Ruas pavimentadas, iluminação, saneamento e área verde projetados desde o início para oferecer o máximo de qualidade de vida.',
            },
            {
              icone: '🔒',
              titulo: 'Segurança integrada',
              desc: 'Controle de acesso perimetral, câmeras e equipes de segurança 24h gerenciadas pela própria administração do bairro.',
            },
            {
              icone: '🌿',
              titulo: 'Natureza preservada',
              desc: 'Parques, lagos e áreas de preservação integradas ao projeto urbanístico — convívio real com a natureza no Rio de Janeiro.',
            },
            {
              icone: '📈',
              titulo: 'Valorização constante',
              desc: 'Histórico comprovado de valorização acima da média. Imóveis em bairros planejados são ativos sólidos para investidores exigentes.',
            },
          ].map((item) => (
            <div key={item.titulo} style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icone}</span>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    color: 'var(--color-ink, #1a1a2e)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {item.titulo}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted, #8a8a9a)', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grid de Bairros Planejados ── */}
      <section style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'var(--color-gold, #b8960c)',
              marginBottom: '0.75rem',
            }}
          >
            Portfólio
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              color: 'var(--color-ink, #1a1a2e)',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
            }}
          >
            Explore cada bairro
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
              gap: '2rem',
            }}
          >
            {(useFallback ? BAIRROS_FALLBACK : bairrosSanity).map((b) => {
              const slug   = useFallback ? (b as typeof BAIRROS_FALLBACK[0]).slug : (b as BairroCard).slug.current
              const foto   = useFallback ? null : (b as BairroCard).fotoCapa
              const regiao = b.regiao ?? b.cidade ?? 'Rio de Janeiro'

              return (
                <Link
                  key={slug}
                  href={`/bairros-planejados/${slug}`}
                  style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                >
                  <article
                    style={{
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s, border-color 0.3s',
                    }}
                  >
                    {/* Imagem */}
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #090b15 100%)',
                        overflow: 'hidden',
                      }}
                    >
                      {foto?.asset?.url && (
                        <Image
                          src={foto.asset.url}
                          alt={b.nome}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          placeholder={foto.asset.metadata?.lqip ? 'blur' : 'empty'}
                          blurDataURL={foto.asset.metadata?.lqip}
                        />
                      )}

                      {/* Overlay + badge */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: foto
                            ? 'linear-gradient(to top, rgba(9,11,21,0.7) 0%, transparent 60%)'
                            : 'radial-gradient(ellipse at 60% 30%, rgba(184,150,12,0.12) 0%, transparent 70%)',
                        }}
                      />

                      {/* Badge "Bairro Planejado" */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          padding: '0.3rem 0.75rem',
                          background: 'rgba(9,11,21,0.75)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(184,150,12,0.4)',
                          borderRadius: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'var(--color-gold, #b8960c)',
                          }}
                        >
                          Bairro Planejado
                        </span>
                      </div>

                      {/* Nome sobre imagem */}
                      {foto && (
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem' }}>
                          <p
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 300,
                              fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                              color: '#fff',
                            }}
                          >
                            {b.nome}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div style={{ padding: '1.5rem' }}>
                      {!foto && (
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 300,
                            fontSize: '1.4rem',
                            color: 'var(--color-ink, #1a1a2e)',
                            marginBottom: '0.5rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {b.nome}
                        </h3>
                      )}

                      <p
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'var(--color-gold, #b8960c)',
                          marginBottom: '0.6rem',
                        }}
                      >
                        {regiao}
                        {b.incorporadora ? ` · ${b.incorporadora}` : ''}
                      </p>

                      {b.introTexto && (
                        <p
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--color-muted, #8a8a9a)',
                            lineHeight: 1.65,
                            marginBottom: '1.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {b.introTexto}
                        </p>
                      )}

                      {/* Métricas */}
                      <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink, #1a1a2e)', lineHeight: 1 }}>
                            {b.totalCondominios > 0 ? b.totalCondominios : '—'}
                          </p>
                          <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>
                            Condomínios
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink, #1a1a2e)', lineHeight: 1 }}>
                            {b.totalImoveis > 0 ? b.totalImoveis : '—'}
                          </p>
                          <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>
                            Imóveis
                          </p>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: 'var(--color-gold, #b8960c)', letterSpacing: '0.1em' }}>
                            Ver bairro →
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: '#1a1a2e',
          padding: 'clamp(4rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(184,150,12,0.07) 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', marginBottom: '1rem' }}>
            Consultoria exclusiva
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Qual bairro planejado<br />é o seu perfil?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Nossa equipe conhece cada endereço a fundo — da planta de implantação ao
            histórico de valorização. Fale com um consultor e encontre o imóvel certo.
          </p>
          <a
            href="https://wa.me/5521998079459?text=Ol%C3%A1%2C%20quero%20conhecer%20im%C3%B3veis%20em%20bairros%20planejados%20no%20Rio"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              border: '1px solid var(--color-gold, #b8960c)',
              color: 'var(--color-gold, #b8960c)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 2,
            }}
          >
            Falar com consultor
          </a>
        </div>
      </section>
    </>
  )
}
