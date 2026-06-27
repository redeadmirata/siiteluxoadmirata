/**
 * /gramado — Landing page mercado Serra Gaúcha
 * Filtra imóveis por mercado "Serra Gaúcha" e bairros do mesmo mercado
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  IMOVEIS_FILTRADOS_QUERY,
  BAIRROS_QUERY,
} from '@/sanity/queries'
import type { ImovelCard, Bairro } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Imóveis em Gramado | Alto Padrão na Serra Gaúcha — Admirata',
    description:
      'Casas, chalés e apartamentos de alto padrão em Gramado e Serra Gaúcha. Curadoria exclusiva de imóveis para compra, locação e temporada. Admirata Imóveis.',
    alternates: {
      canonical: `${siteUrl}${localePrefix}/gramado`,
    },
    openGraph: {
      title: 'Imóveis em Gramado | Alto Padrão na Serra Gaúcha — Admirata',
      description:
        'Casas, chalés e apartamentos de alto padrão em Gramado e Serra Gaúcha. Curadoria exclusiva de imóveis.',
      type: 'website',
      url: `${siteUrl}${localePrefix}/gramado`,
    },
  }
}

interface PageProps {
  params: { locale: string }
  searchParams: { finalidade?: string; tipo?: string }
}

const MERCADO = 'Serra Gaúcha'

// Dados editoriais dos bairros de Gramado (fallback visual enquanto não há fotos no Sanity)
const BAIRROS_EDITORIAL = [
  { slug: 'aspen-mountain',   nome: 'Aspen Mountain',    descricao: 'Condomínios de altitude, bruma e arquitetura suíça' },
  { slug: 'mato-queimado',    nome: 'Mato Queimado',     descricao: 'Campo aberto, araucárias e tranquilidade premium' },
  { slug: 'centro-gramado',   nome: 'Centro de Gramado', descricao: 'Charme europeu, gastronomia e vida urbana serrana' },
  { slug: 'golf-club',        nome: 'Golf Club',         descricao: 'Lifestyle esportivo em meio a fairways perfeitos' },
  { slug: 'lago-negro',       nome: 'Lago Negro',        descricao: 'Espelhos d\'água, araucárias e misticismo natural' },
  { slug: 'jardim-dos-ipes',  nome: 'Jardim dos Ipês',   descricao: 'Lançamentos modernos entre ipês em flor' },
]

export default async function GramadoPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)

  const finalidade = searchParams.finalidade ?? ''
  const tipo       = searchParams.tipo ?? ''

  const [imoveisRaw, bairrosRaw] = await Promise.all([
    client.fetch<ImovelCard[]>(
      IMOVEIS_FILTRADOS_QUERY,
      {
        finalidade,
        tipo,
        mercado: MERCADO,
        bairroSlug: '',
        precoMin: 0,
        precoMax: 0,
        quartos: 0,
        offset: 0,
        end: 12,
      },
      { next: { revalidate: 60 } }
    ),
    client.fetch<Bairro[]>(BAIRROS_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  const bairrosGramado = bairrosRaw.filter(
    (b) => b.mercado === MERCADO || b.cidade === 'Gramado' || b.cidade === 'Canela'
  )

  const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Gramado', item: `${siteUrl}${localePrefix}/gramado` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Imóveis em Gramado e Serra Gaúcha — Admirata',
        description: 'Curadoria de imóveis de alto padrão em Gramado, Canela e Serra Gaúcha',
        url: `${siteUrl}${localePrefix}/gramado`,
        numberOfItems: imoveisRaw.length,
      },
      {
        '@type': 'Place',
        name: 'Gramado',
        description: 'Município da Serra Gaúcha, Rio Grande do Sul, Brasil',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Gramado',
          addressRegion: 'RS',
          addressCountry: 'BR',
        },
      },
    ],
  }

  const FINALIDADES = [
    { label: 'Todos',     value: '' },
    { label: 'Venda',     value: 'Venda' },
    { label: 'Locação',   value: 'Locação' },
    { label: 'Temporada', value: 'Temporada' },
  ]

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
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'flex-end',
          background: 'linear-gradient(160deg, #0e1a14 0%, #1a2e22 50%, #090b15 100%)',
          overflow: 'hidden',
          paddingTop: 72,
        }}
      >
        {/* Camada de textura/grain */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
          }}
        />

        {/* Glow verde-musgo */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 60% 30%, rgba(45,74,62,0.45) 0%, transparent 65%),' +
              'radial-gradient(ellipse 50% 40% at 20% 70%, rgba(184,150,12,0.08) 0%, transparent 60%)',
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
            background: 'linear-gradient(to bottom, transparent, rgba(184,150,12,0.5) 30%, rgba(184,150,12,0.5) 70%, transparent)',
          }}
        />

        {/* Conteúdo */}
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
              { label: 'Gramado' },
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
            Serra Gaúcha · Rio Grande do Sul
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: '#fff',
              lineHeight: 1.04,
              letterSpacing: '0.02em',
              marginBottom: '1.5rem',
            }}
          >
            Gramado
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: '42rem',
              marginBottom: '3rem',
            }}
          >
            Imóveis de alto padrão em meio às araucárias e brumas da Serra Gaúcha.
            Chalés, casas contemporâneas e condomínios exclusivos para quem escolhe
            viver com sofisticação e contato com a natureza.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 4rem)', flexWrap: 'wrap' }}>
            {[
              { valor: imoveisRaw.length > 0 ? `${imoveisRaw.length}+` : '—', label: 'Imóveis disponíveis' },
              { valor: bairrosGramado.length > 0 ? `${bairrosGramado.length}` : '6', label: 'Bairros exclusivos' },
              { valor: '1.700m', label: 'Altitude média' },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                    fontWeight: 300,
                    color: 'var(--color-gold, #b8960c)',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.valor}
                </p>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Imóveis ── */}
      <section style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Filtro rápido de finalidade */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginRight: 4 }}>
              Filtrar:
            </span>
            {FINALIDADES.map((f) => (
              <Link
                key={f.value}
                href={f.value ? `/gramado?finalidade=${f.value}` : '/gramado'}
                style={{
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1.25rem',
                  border: finalidade === f.value ? '1px solid var(--color-gold, #b8960c)' : '1px solid rgba(0,0,0,0.12)',
                  color: finalidade === f.value ? 'var(--color-gold, #b8960c)' : 'var(--color-muted, #8a8a9a)',
                  borderRadius: 2,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </Link>
            ))}
          </div>

          {/* Grid de imóveis */}
          {imoveisRaw.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {imoveisRaw.map((imovel, i) => (
                <ImovelCardComponent key={imovel._id} imovel={imovel} priority={i < 6} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 2rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-muted, #8a8a9a)',
                  marginBottom: '0.75rem',
                }}
              >
                Em breve — portfólio Serra Gaúcha
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted, #8a8a9a)', maxWidth: '30rem', marginBottom: '2rem' }}>
                Estamos curadorizando os melhores imóveis de Gramado e região.
                Entre em contato para acesso antecipado ao portfólio exclusivo.
              </p>
              <a
                href="https://wa.me/5521998079459?text=Quero%20conhecer%20im%C3%B3veis%20em%20Gramado"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold, #b8960c)',
                  textDecoration: 'none',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: 2,
                }}
              >
                Falar com um consultor →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Bairros ── */}
      <section
        style={{
          background: 'var(--color-stone, #F5F0E8)',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        }}
      >
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
            Localização
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
            Bairros de Gramado
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {(bairrosGramado.length > 0 ? bairrosGramado : BAIRROS_EDITORIAL).map((b) => {
              const slug    = 'slug' in b ? (b as Bairro).slug?.current : (b as typeof BAIRROS_EDITORIAL[0]).slug
              const nome    = b.nome
              const desc    = 'descricao' in b ? (b as typeof BAIRROS_EDITORIAL[0]).descricao : undefined
              const fotoCapa = 'fotoCapa' in b ? (b as Bairro & { fotoCapa?: { asset?: { url: string } } }).fotoCapa : undefined

              return (
                <Link
                  key={slug}
                  href={`/bairros/${slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      background: 'linear-gradient(135deg, #1a2e22 0%, #0e1a14 100%)',
                      cursor: 'pointer',
                    }}
                  >
                    {fotoCapa?.asset?.url && (
                      <Image
                        src={fotoCapa.asset.url}
                        alt={nome}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ transition: 'transform 0.5s ease', }}
                      />
                    )}

                    {/* Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(9,11,21,0.85) 0%, rgba(9,11,21,0.2) 60%, transparent 100%)',
                      }}
                    />

                    {/* Borda dourada sutil */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid rgba(184,150,12,0.18)',
                        borderRadius: 4,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Texto */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.5rem',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 300,
                          fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                          color: '#fff',
                          marginBottom: '0.3rem',
                          lineHeight: 1.2,
                        }}
                      >
                        {nome}
                      </p>
                      {desc && (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                          {desc}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #0e1a14 0%, #090b15 100%)',
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
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
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,74,62,0.3) 0%, transparent 70%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'var(--color-gold, #b8960c)',
              marginBottom: '1rem',
            }}
          >
            Curadoria exclusiva
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Encontre seu imóvel<br />em Gramado
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.95rem',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
            }}
          >
            Nossa equipe seleciona os melhores imóveis da Serra Gaúcha com
            discrição e precisão. Fale com um consultor.
          </p>
          <a
            href="https://wa.me/5521998079459?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20im%C3%B3veis%20em%20Gramado"
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
              transition: 'all 0.2s',
            }}
          >
            Falar com consultor
          </a>
        </div>
      </section>
    </>
  )
}
