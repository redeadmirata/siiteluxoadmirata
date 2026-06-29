/**
 * /bairros-planejados/[slug]
 * Landing individual de um bairro planejado — ex: /bairros-planejados/ilha-pura
 * Hierarquia: Início → Rio de Janeiro → Bairros Planejados → Ilha Pura
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  BAIRRO_PLANEJADO_QUERY,
  BAIRROS_PLANEJADOS_SLUGS_QUERY,
  IMOVEIS_FILTRADOS_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import ShimmerText from '@/components/ui/ShimmerText'
import HeroMediaVideo from '@/components/ui/HeroMediaVideo'
import { routing } from '@/i18n/routing'

export const revalidate = 60

interface BairroData {
  _id: string
  nome: string
  slug: { current: string }
  cidade?: string
  estado?: string
  mercado?: string
  regiao?: string
  incorporadora?: string
  areaTotal?: number
  anoInauguracao?: number
  introTexto?: string
  porQueMorar?: unknown[]
  descricao?: string
  caracteristicas?: string[]
  faixaPreco?: { min?: number; max?: number; tipoPredominante?: string }
  amenidades?: Array<{ titulo: string; descricao?: string; icone?: string }>
  faqs?: Array<{ pergunta: string; resposta: string }>
  fotoCapa?: { asset?: { url: string; metadata?: { lqip?: string } } }
  fotoAerea?: { asset?: { url: string; metadata?: { lqip?: string } } }
  ogImage?: { asset?: { url: string } }
  heroVideoUrl?: string
  condominios?: Array<{
    _id: string
    nome: string
    slug: { current: string }
    status?: string
    construtora?: string
    precoMinimo?: number
    precoMaximo?: number
    areaPrivativaMin?: number
    areaPrivativaMax?: number
    prazoEntrega?: string
    tipologiasDisponiveis?: string[]
    videoTour?: string
    comissao?: number
    vgv?: number
    whatsappCorretor?: string
    mensagemCorretorWhatsapp?: string
    visibilidadeCorretor?: boolean
    imagemCapa?: { url: string; metadata?: { lqip?: string } }
    plantasBaixas?: Array<{
      nome: string
      quartos?: string
      area?: number
      imagem?: { asset?: { url: string; metadata?: { lqip?: string } } }
    }>
    tabelaPreco?: { asset?: { url: string } }
    materialMarketing?: Array<{
      titulo: string
      tipo?: string
      url?: string
      arquivo?: { asset?: { url: string } }
    }>
  }>
  totalImoveis: number
  geo?: { lat: number; lng: number }
  metaTitle?: string
  metaDescription?: string
}

interface PageProps {
  params: { locale: string; slug: string }
  searchParams: { finalidade?: string }
}


// ── Fallback estático para bairros sem documento no Sanity ainda ──────────
const STATIC_BAIRROS: Record<string, BairroData> = {
  'cidade-arte-barra': {
    _id: 'static-cidade-arte-barra',
    nome: 'Cidade Arte',
    slug: { current: 'cidade-arte-barra' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    incorporadora: 'Calper',
    introTexto: 'O primeiro bairro planejado da Barra Olímpica — onde arquitetura contemporânea, 1.800 árvores nativas e infraestrutura completa se unem em uma nova forma de viver.',
    descricao: 'O Cidade Arte é o primeiro bairro planejado da Barra Olímpica concebido com o conceito de arte, design e qualidade de vida. Desenvolvido pela Calper, o projeto propõe uma nova forma de viver, integrando arquitetura contemporânea, paisagismo, mobilidade, segurança e espaços públicos planejados.',
    caracteristicas: [
      'Bairro planejado',
      'Conceito de arte e design',
      'Urbanismo inteligente',
      'Arquitetura contemporânea',
      'Paisagismo integrado',
      'Mais de 1.800 árvores nativas',
      'Vista para o Maciço da Pedra Branca',
      'Espaços públicos planejados',
      'Infraestrutura moderna',
      'Segurança integrada',
      'Alto potencial de valorização',
    ],
    amenidades: [
      { titulo: 'Piscina de Ondas', descricao: 'Piscina de ondas com design paisagístico', icone: '🌊' },
      { titulo: 'Quadras Esportivas', descricao: 'Quadras de grama e areia, futmesa e espaços polivalentes', icone: '⚽' },
      { titulo: 'Academia ao Ar Livre', descricao: 'Fitness externo integrado ao paisagismo', icone: '🏋️' },
      { titulo: 'Parque Inclusivo', descricao: 'Área de lazer inclusiva para todas as idades', icone: '🌳' },
      { titulo: 'Pet Park', descricao: 'Espaço dedicado aos animais de estimação', icone: '🐾' },
      { titulo: 'Sky Lounge', descricao: 'Lounge com vista panorâmica para o bairro', icone: '🌆' },
      { titulo: 'Praças & Alamedas', descricao: 'Caminhos arborizados e espaços de convivência', icone: '🌿' },
      { titulo: 'Mobilidade', descricao: 'Acesso à Av. Abelardo Bueno, BRT, Transolímpica e Metrô', icone: '🚇' },
    ],
    faqs: [
      {
        pergunta: 'O que é o Cidade Arte?',
        resposta: 'O Cidade Arte é o primeiro bairro planejado da Barra Olímpica, desenvolvido pela Calper. Reúne condomínios residenciais de alto padrão, áreas verdes, lazer e infraestrutura completa em um único endereço próximo à Avenida Abelardo Bueno.',
      },
      {
        pergunta: 'Quais condomínios fazem parte do Cidade Arte?',
        resposta: 'O bairro planejado inclui os empreendimentos Arte Wave Surf Residences, Arte Design, Arte Botânica, Arte Jardim Residencial e Arte Wood Residences — todos da construtora Calper.',
      },
      {
        pergunta: 'Onde fica o Cidade Arte?',
        resposta: 'Localizado na Barra Olímpica, próximo à Avenida Abelardo Bueno, na Barra da Tijuca — Rio de Janeiro. Com acesso rápido à Linha Amarela, Transolímpica, BRT e ao Parque Olímpico.',
      },
      {
        pergunta: 'Qual é o potencial de valorização do Cidade Arte?',
        resposta: 'A Barra Olímpica concentra os maiores investimentos urbanos do Rio de Janeiro. A expansão da infraestrutura e novos empreendimentos tornam a região uma das áreas com maior potencial de valorização da cidade.',
      },
    ],
    heroVideoUrl: 'https://www.youtube.com/watch?v=1yRU6RWfs9g',
    fotoCapa: {
      asset: { url: '/images/cidade-arte-barra/hero-alameda-noite.jpg' },
    },
    fotoAerea: {
      asset: { url: '/images/cidade-arte-barra/aerea-02.jpg' },
    },
    condominios: [],
    totalImoveis: 0,
    metaTitle: 'Cidade Arte Barra | Bairro Planejado Calper na Barra Olímpica | Admirata',
    metaDescription: 'Condomínios de alto padrão no Cidade Arte, bairro planejado da Calper na Barra Olímpica. Arte Wave, Arte Design, Arte Botânica, Arte Jardim e Arte Wood. Curadoria exclusiva Admirata.',
  },
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(
    BAIRROS_PLANEJADOS_SLUGS_QUERY,
    {},
    { next: { revalidate: 3600 } }
  ).catch(() => [] as Array<{ slug: string }>)

  // Garantir que slugs estáticos também sejam pré-gerados
  const staticSlugs = Object.keys(STATIC_BAIRROS).map((s) => ({ slug: s }))
  const allSlugs = [...slugs, ...staticSlugs.filter((s) => !slugs.find((x) => x.slug === s.slug))]

  return routing.locales.flatMap((locale) =>
    allSlugs.map((s) => ({ locale, slug: s.slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bairroSanity = await client
    .fetch<BairroData | null>(BAIRRO_PLANEJADO_QUERY, { slug: params.slug }, { next: { revalidate: 3600 } })
    .catch(() => null)
  const bairro = bairroSanity ?? STATIC_BAIRROS[params.slug] ?? null

  if (!bairro) return { title: 'Bairro Planejado | Admirata' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const titulo = bairro.metaTitle ?? `${bairro.nome} — Bairro Planejado no Rio de Janeiro | Admirata`
  const desc =
    bairro.metaDescription ??
    `Conheça o ${bairro.nome}, bairro planejado de alto padrão${bairro.regiao ? ` na ${bairro.regiao}` : ' no Rio de Janeiro'}. Imóveis com curadoria exclusiva Admirata.`

  return {
    title: titulo,
    description: desc,
    alternates: { canonical: `${siteUrl}${localePrefix}/bairros-planejados/${params.slug}` },
    openGraph: {
      title: titulo,
      description: desc,
      type: 'website',
      url: `${siteUrl}${localePrefix}/bairros-planejados/${params.slug}`,
      ...(bairro.ogImage?.asset?.url || bairro.fotoAerea?.asset?.url || bairro.fotoCapa?.asset?.url
        ? {
            images: [{
              url: bairro.ogImage?.asset?.url ?? bairro.fotoAerea?.asset?.url ?? bairro.fotoCapa?.asset?.url ?? '',
              width: 1200,
              height: 630,
              alt: bairro.nome,
            }],
          }
        : {}),
    },
  }
}

export default async function BairroPlanejadiSlugPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)

  const [bairroSanity, imoveis] = await Promise.all([
    client
      .fetch<BairroData | null>(BAIRRO_PLANEJADO_QUERY, { slug: params.slug }, { next: { revalidate: 3600 } })
      .catch(() => null),
    client
      .fetch<ImovelCard[]>(
        IMOVEIS_FILTRADOS_QUERY,
        {
          finalidade: searchParams.finalidade ?? '',
          tipo: '',
          mercado: '',
          bairroSlug: params.slug,
          precoMin: 0,
          precoMax: 0,
          quartos: 0,
          novidade: '',
          exclusivo: '',
          offset: 0,
          end: 9,
        },
        { next: { revalidate: 60 } }
      )
      .catch(() => [] as ImovelCard[]),
  ])

  const bairro = bairroSanity ?? STATIC_BAIRROS[params.slug] ?? null

  if (!bairro) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const jsonLd: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
        { '@type': 'ListItem', position: 2, name: 'Rio de Janeiro', item: `${siteUrl}${localePrefix}/bairros` },
        { '@type': 'ListItem', position: 3, name: 'Bairros Planejados', item: `${siteUrl}${localePrefix}/bairros-planejados` },
        { '@type': 'ListItem', position: 4, name: bairro.nome, item: `${siteUrl}${localePrefix}/bairros-planejados/${params.slug}` },
      ],
    },
    {
      '@type': 'Place',
      name: bairro.nome,
      description: bairro.introTexto ?? `Bairro planejado de alto padrão no Rio de Janeiro`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: bairro.cidade ?? 'Rio de Janeiro',
        addressRegion: bairro.estado ?? 'RJ',
        addressCountry: 'BR',
      },
      ...(bairro.geo ? { geo: { '@type': 'GeoCoordinates', latitude: bairro.geo.lat, longitude: bairro.geo.lng } } : {}),
    },
  ]

  if (bairro.faqs && bairro.faqs.length > 0) {
    jsonLd.push({
      '@type': 'FAQPage',
      mainEntity: bairro.faqs.map((f) => ({
        '@type': 'Question',
        name: f.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: f.resposta },
      })),
    })
  }

  const heroImage = bairro.fotoAerea?.asset?.url ?? bairro.fotoCapa?.asset?.url
  const heroLqip  = bairro.fotoAerea?.asset?.metadata?.lqip ?? bairro.fotoCapa?.asset?.metadata?.lqip

  const FINALIDADES = [
    { label: 'Todos',     value: '' },
    { label: 'Venda',     value: 'Venda' },
    { label: 'Locação',   value: 'Locação' },
    { label: 'Temporada', value: 'Temporada' },
  ]

  const finalidade = searchParams.finalidade ?? ''

  return (
    <>
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.04) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1.5%, -1%); }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd }) }}
      />

      {/* ── Hero: vídeo imersivo sem texto ── */}
      <section
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: 520,
          background: '#0a0f1e',
          overflow: 'hidden',
        }}
      >
        {/* Breadcrumb flutuante (único texto sobre o vídeo) */}
        <div style={{ position: 'absolute', top: 88, left: 0, right: 0, zIndex: 10, padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <BreadcrumbNav
            items={[
              { label: 'Início', href: '/' },
              { label: 'Rio de Janeiro', href: '/bairros' },
              { label: 'Bairros Planejados', href: '/bairros-planejados' },
              { label: bairro.nome },
            ]}
            dark
          />
        </div>

        {/* Vídeo imersivo */}
        <HeroMediaVideo url={bairro.heroVideoUrl} />

        {/* Imagem (fallback sem vídeo) */}
        {heroImage && !bairro.heroVideoUrl && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src={heroImage}
              alt={bairro.nome}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              placeholder={heroLqip ? 'blur' : 'empty'}
              blurDataURL={heroLqip}
              style={{ animation: 'kenBurns 22s ease-in-out infinite alternate' }}
            />
          </div>
        )}

        {/* Gradiente suave apenas na base */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'linear-gradient(to top, rgba(9,11,21,0.6) 0%, transparent 40%)',
          }}
        />
      </section>

      {/* ── Strip: intro texto ── */}
      {bairro.introTexto && (
        <div
          style={{
            background: '#0d1020',
            borderBottom: '1px solid rgba(184,150,12,0.2)',
            padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(2rem, 8vw, 8rem)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              letterSpacing: '0.01em',
              maxWidth: '70rem',
              margin: '0 auto',
            }}
          >
            {bairro.introTexto}
          </p>
        </div>
      )}

      {/* ── Banner: logo + stats + CTAs ── */}
      <section
        style={{
          background: '#1c1f2e',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 8vw, 8rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
        }}
      >
        {/* Logo Cidade Arte */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              cidade
            </span>
            <span
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              arte
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
            }}
          >
            BARRA
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'clamp(2.5rem, 6vw, 5rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {bairro.incorporadora && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: 5 }}>
                {bairro.incorporadora}
              </p>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                Incorporadora
              </p>
            </div>
          )}
          {bairro.condominios && bairro.condominios.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 300, color: 'var(--color-gold, #b8960c)', lineHeight: 1, marginBottom: 5 }}>
                {bairro.condominios.length}
              </p>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                Condomínios
              </p>
            </div>
          )}
          {imoveis.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 300, color: 'var(--color-gold, #b8960c)', lineHeight: 1, marginBottom: 5 }}>
                {imoveis.length}+
              </p>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                Imóveis disponíveis
              </p>
            </div>
          )}
          {bairro.areaTotal && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 300, color: 'var(--color-gold, #b8960c)', lineHeight: 1, marginBottom: 5 }}>
                {(bairro.areaTotal / 1000).toFixed(0)}mil m²
              </p>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                Área total
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#condominios"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              background: 'var(--color-gold, #b8960c)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'opacity 0.2s',
            }}
          >
            Ver Condomínios
          </a>
          <a
            href="https://wa.me/5521999999999?text=Olá!%20Tenho%20interesse%20no%20Cidade%20Arte%20Barra"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              background: 'transparent',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 2,
              transition: 'border-color 0.2s',
            }}
          >
            Falar com Corretor
          </a>
        </div>
      </section>

      {/* ── Amenidades ── */}
      {bairro.amenidades && bairro.amenidades.length > 0 && (
        <section style={{ background: 'var(--color-stone, #F5F0E8)', padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {bairro.amenidades.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {a.icone && <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{a.icone}</span>}
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-ink, #1a1a2e)', marginBottom: 2 }}>{a.titulo}</p>
                    {a.descricao && <p style={{ fontSize: '0.8rem', color: 'var(--color-muted, #8a8a9a)', lineHeight: 1.5 }}>{a.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Condomínios ── */}
      {bairro.condominios && bairro.condominios.length > 0 && (
        <section id="condominios" style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', marginBottom: '0.75rem' }}>
              Empreendimentos
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
              Condomínios em {bairro.nome}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {bairro.condominios.map((c) => (
                <div
                  key={c._id}
                  style={{
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  {/* Header do condomínio */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 0 }}>
                    {/* Foto */}
                    <div style={{ position: 'relative', aspectRatio: '16/10', background: '#1a1a2e', overflow: 'hidden', minHeight: 220 }}>
                      {c.imagemCapa?.url && (
                        <Image
                          src={c.imagemCapa.url}
                          alt={c.nome}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder={c.imagemCapa.metadata?.lqip ? 'blur' : 'empty'}
                          blurDataURL={c.imagemCapa.metadata?.lqip}
                        />
                      )}
                      {c.status && (
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.3rem 0.8rem', background: 'rgba(9,11,21,0.85)', borderRadius: 2 }}>
                          <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>{c.status}</span>
                        </div>
                      )}
                    </div>

                    {/* Dados principais */}
                    <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fff' }}>
                      <div>
                        {c.construtora && (
                          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginBottom: '0.5rem' }}>
                            {c.construtora}
                          </p>
                        )}
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 300, color: 'var(--color-ink, #1a1a2e)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                          {c.nome}
                        </h3>

                        {/* Métricas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          {c.precoMinimo && (
                            <div>
                              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-gold, #b8960c)', lineHeight: 1 }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(c.precoMinimo)}
                              </p>
                              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>
                                A partir de
                              </p>
                            </div>
                          )}
                          {(c.areaPrivativaMin || c.areaPrivativaMax) && (
                            <div>
                              <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink, #1a1a2e)', lineHeight: 1 }}>
                                {c.areaPrivativaMin}{c.areaPrivativaMax && c.areaPrivativaMax !== c.areaPrivativaMin ? `–${c.areaPrivativaMax}` : ''} m²
                              </p>
                              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>
                                Área privativa
                              </p>
                            </div>
                          )}
                          {c.prazoEntrega && (
                            <div>
                              <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-ink, #1a1a2e)', lineHeight: 1 }}>{c.prazoEntrega}</p>
                              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>Entrega</p>
                            </div>
                          )}
                          {c.tipologiasDisponiveis && c.tipologiasDisponiveis.length > 0 && (
                            <div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink, #1a1a2e)', lineHeight: 1.3 }}>
                                {c.tipologiasDisponiveis.join(', ')}
                              </p>
                              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginTop: 3 }}>Tipologias</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                          href={`/condominios/${c.slug.current}`}
                          style={{
                            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                            padding: '0.7rem 1.4rem',
                            background: 'var(--color-ink, #1a1a2e)',
                            color: '#fff',
                            borderRadius: 2, textDecoration: 'none',
                          }}
                        >
                          Ver imóveis
                        </Link>
                        <a
                          href={`https://wa.me/${c.whatsappCorretor ?? '5521998079459'}?text=${encodeURIComponent(c.mensagemCorretorWhatsapp ?? `Olá, tenho interesse em ${c.nome} — ${bairro.nome}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                            padding: '0.7rem 1.4rem',
                            border: '1px solid rgba(0,0,0,0.15)',
                            color: 'var(--color-ink, #1a1a2e)',
                            borderRadius: 2, textDecoration: 'none',
                          }}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Plantas + Materiais do Corretor */}
                  {c.visibilidadeCorretor !== false && (
                    <div style={{ background: 'var(--color-stone, #F5F0E8)', borderTop: '1px solid rgba(0,0,0,0.06)', padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', padding: '0.2rem 0.6rem', border: '1px solid rgba(184,150,12,0.4)', borderRadius: 2 }}>
                          Área do Corretor
                        </span>
                        {c.comissao && (
                          <span style={{ fontSize: 11, color: 'var(--color-muted, #8a8a9a)' }}>
                            Comissão: <strong style={{ color: 'var(--color-ink, #1a1a2e)' }}>{c.comissao}%</strong>
                          </span>
                        )}
                        {c.vgv && (
                          <span style={{ fontSize: 11, color: 'var(--color-muted, #8a8a9a)' }}>
                            VGV: <strong style={{ color: 'var(--color-ink, #1a1a2e)' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(c.vgv)}</strong>
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: '2rem' }}>
                        {/* Plantas baixas */}
                        {c.plantasBaixas && c.plantasBaixas.length > 0 && (
                          <div>
                            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginBottom: '0.75rem' }}>
                              Plantas baixas
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              {c.plantasBaixas.map((p, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                                  {p.imagem?.asset?.url ? (
                                    <a href={p.imagem.asset.url} target="_blank" rel="noopener noreferrer">
                                      <div style={{ position: 'relative', width: 80, height: 80, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                        <Image src={p.imagem.asset.url} alt={p.nome} fill className="object-contain" sizes="80px" />
                                      </div>
                                    </a>
                                  ) : (
                                    <div style={{ width: 80, height: 80, background: '#fff', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span style={{ fontSize: 18, color: 'rgba(0,0,0,0.2)' }}>⬜</span>
                                    </div>
                                  )}
                                  <p style={{ fontSize: 9, textAlign: 'center', color: 'var(--color-muted, #8a8a9a)', lineHeight: 1.3, maxWidth: 80 }}>
                                    {p.quartos && `${p.quartos}`}{p.area && ` · ${p.area}m²`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Materiais */}
                        {c.materialMarketing && c.materialMarketing.length > 0 && (
                          <div>
                            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted, #8a8a9a)', marginBottom: '0.75rem' }}>
                              Materiais
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {c.tabelaPreco?.asset?.url && (
                                <a
                                  href={c.tabelaPreco.asset.url}
                                  target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: 11, color: 'var(--color-gold, #b8960c)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                  ↓ Tabela de preços (PDF)
                                </a>
                              )}
                              {c.materialMarketing.map((m, i) => (
                                <a
                                  key={i}
                                  href={m.tipo === 'pdf' ? (m.arquivo?.asset?.url ?? '#') : (m.url ?? '#')}
                                  target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: 11, color: 'var(--color-ink, #1a1a2e)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.75 }}
                                >
                                  {m.tipo === 'pdf' ? '↓' : '↗'} {m.titulo}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Imóveis disponíveis ── */}
      <section style={{ background: imoveis.length > 0 ? 'var(--color-stone, #F5F0E8)' : '#fff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', marginBottom: '0.5rem' }}>
                Portfólio
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: 'var(--color-ink, #1a1a2e)', lineHeight: 1.1 }}>
                Imóveis em {bairro.nome}
              </h2>
            </div>

            {/* Filtro */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {FINALIDADES.map((f) => (
                <Link
                  key={f.value}
                  href={f.value ? `/bairros-planejados/${params.slug}?finalidade=${f.value}` : `/bairros-planejados/${params.slug}`}
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    padding: '0.4rem 1rem',
                    border: finalidade === f.value ? '1px solid var(--color-gold, #b8960c)' : '1px solid rgba(0,0,0,0.12)',
                    color: finalidade === f.value ? 'var(--color-gold, #b8960c)' : 'var(--color-muted, #8a8a9a)',
                    borderRadius: 2,
                    textDecoration: 'none',
                  }}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {imoveis.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {imoveis.map((imovel, i) => (
                <ImovelCardComponent key={imovel._id} imovel={imovel} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-muted, #8a8a9a)', marginBottom: '0.75rem' }}>
                Imóveis em breve
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted, #8a8a9a)', maxWidth: '28rem', margin: '0 auto 2rem' }}>
                Estamos preparando a curadoria de imóveis em {bairro.nome}. Fale com um consultor para acesso antecipado.
              </p>
              <a
                href={`https://wa.me/5521998079459?text=Tenho%20interesse%20em%20im%C3%B3veis%20em%20${encodeURIComponent(bairro.nome)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: 2 }}
              >
                Falar com consultor →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQs ── */}
      {bairro.faqs && bairro.faqs.length > 0 && (
        <section style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', marginBottom: '0.75rem' }}>
              Dúvidas frequentes
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--color-ink, #1a1a2e)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
              FAQ — {bairro.nome}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bairro.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', paddingBottom: '1.5rem' }}>
                  <p style={{ fontWeight: 500, color: 'var(--color-ink, #1a1a2e)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {faq.pergunta}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-muted, #8a8a9a)', lineHeight: 1.7 }}>
                    {faq.resposta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #0a0f1e 0%, #090b15 100%)',
          padding: 'clamp(4rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(184,150,12,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--color-gold, #b8960c)', marginBottom: '1rem' }}>
            Admirata · Curadoria exclusiva
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Encontre o imóvel ideal<br />em {bairro.nome}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Nossa equipe conhece cada condomínio e cada unidade disponível. Atendimento
            personalizado, sem intermediários.
          </p>
          <a
            href={`https://wa.me/5521998079459?text=Ol%C3%A1%2C%20quero%20conhecer%20im%C3%B3veis%20em%20${encodeURIComponent(bairro.nome)}`}
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