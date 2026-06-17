/**
 * NÍVEL 2 da hierarquia SEO: Página de Condomínio
 * URL: /imoveis/[bairro]/[condominio]/
 *
 * Anti-thin-content (servidor):
 *   index se: campo `sobre` preenchido OU ≥ 2 imóveis ativos
 *   noindex se: forcarNoindex === true
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  CONDOMINIO_POR_BAIRRO_QUERY,
  CONDOMINIOS_SLUGS_HIERARQUIA_QUERY,
  IMOVEIS_POR_CONDOMINIO_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { routing } from '@/i18n/routing'
import { PortableText } from '@portabletext/react'

export const revalidate = 3600

interface PageProps {
  params: { locale: string; slug: string; condominio: string }
}

interface CondominioDetalhe {
  _id: string
  nome: string
  slug: { current: string }
  tipo?: string
  sobre?: unknown[]
  descricao?: string
  infraestrutura?: string[]
  construtora?: string
  anoEntrega?: number
  numTorres?: number
  numUnidades?: number
  areaTotal?: number
  tipologiasDisponiveis?: string[]
  faqs?: Array<{ pergunta: string; resposta: string }>
  forcarNoindex?: boolean
  condominiosProximos?: Array<{ nome: string; slug: { current: string } }>
  fotoCapa?: { asset?: { url: string } }
  geo?: { lat?: number; lng?: number; proximidades?: string[] }
  seo?: { titulo?: string; descricao?: string }
  bairro: { nome: string; slug: { current: string } }
  totalImoveis: number
}

export async function generateStaticParams() {
  const pares = await client.fetch<Array<{ bairroSlug: string; condSlug: string }>>(
    CONDOMINIOS_SLUGS_HIERARQUIA_QUERY
  )
  return routing.locales.flatMap((locale) =>
    pares.map((p) => ({ locale, slug: p.bairroSlug, condominio: p.condSlug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cond = await client.fetch<CondominioDetalhe | null>(
    CONDOMINIO_POR_BAIRRO_QUERY,
    { bairroSlug: params.slug, condSlug: params.condominio }
  )

  if (!cond) return { title: 'Condomínio não encontrado' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const titulo = cond.seo?.titulo ?? `${cond.nome} — Imóveis à venda em ${cond.bairro.nome} | Admirata`
  const descricao = cond.seo?.descricao ?? `Apartamentos e coberturas no ${cond.nome}, ${cond.bairro.nome}. Curadoria Admirata.`
  const capaUrl = cond.fotoCapa?.asset?.url

  // Anti-thin-content
  const devIndexar = !cond.forcarNoindex && (
    (Array.isArray(cond.sobre) && cond.sobre.length > 0) || cond.totalImoveis >= 2
  )

  return {
    title: titulo,
    description: descricao,
    robots: devIndexar ? 'index, follow' : 'noindex, follow',
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      ...(capaUrl && {
        images: [{ url: capaUrl, width: 1200, height: 630, alt: cond.nome }],
      }),
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/${params.slug}/${params.condominio}`,
    },
  }
}

const TIPOLOGIA_LABELS: Record<string, string> = {
  '1-quarto': '1 quarto',
  '2-quartos': '2 quartos',
  '3-quartos': '3 quartos',
  '4-quartos': '4 quartos',
  'cobertura': 'Coberturas',
  'penthouse': 'Penthouses',
  'casa': 'Casas',
  'terreno': 'Terrenos',
}

export default async function CondominioPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const [cond, imoveis] = await Promise.all([
    client.fetch<CondominioDetalhe | null>(
      CONDOMINIO_POR_BAIRRO_QUERY,
      { bairroSlug: params.slug, condSlug: params.condominio },
      { next: { revalidate: 3600 } }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_POR_CONDOMINIO_QUERY,
      { condSlug: params.condominio },
      { next: { revalidate: 60 } }
    ),
  ])

  if (!cond) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  // JSON-LD — BreadcrumbList + ApartmentComplex + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: cond.bairro.nome, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}` },
          { '@type': 'ListItem', position: 4, name: cond.nome, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}/${params.condominio}` },
        ],
      },
      {
        '@type': 'ApartmentComplex',
        name: cond.nome,
        address: {
          '@type': 'PostalAddress',
          addressLocality: cond.bairro.nome,
          addressRegion: 'RJ',
          addressCountry: 'BR',
        },
        numberOfAvailableAccommodationUnits: cond.totalImoveis,
        ...(cond.infraestrutura && {
          amenityFeature: cond.infraestrutura.map((item) => ({
            '@type': 'LocationFeatureSpecification',
            name: item,
            value: true,
          })),
        }),
        ...(cond.fotoCapa?.asset?.url && { image: cond.fotoCapa.asset.url }),
      },
      ...(cond.faqs && cond.faqs.length > 0
        ? [{
            '@type': 'FAQPage',
            mainEntity: cond.faqs.map((f) => ({
              '@type': 'Question',
              name: f.pergunta,
              acceptedAnswer: { '@type': 'Answer', text: f.resposta },
            })),
          }]
        : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end">
        {cond.fotoCapa?.asset?.url && (
          <Image
            src={cond.fotoCapa.asset.url}
            alt={`${cond.nome} — ${cond.bairro.nome}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        <div className="relative container-site pb-10 z-10">
          <BreadcrumbNav
            items={[
              { label: 'Início', href: '/' },
              { label: 'Imóveis', href: '/imoveis' },
              { label: cond.bairro.nome, href: `/imoveis/${params.slug}` },
              { label: cond.nome },
            ]}
            dark
          />
          <h1 className="text-display-lg text-white mt-4">
            {cond.nome}
          </h1>
          <p className="text-white/70 mt-1">
            {cond.bairro.nome}
            {cond.construtora && ` · ${cond.construtora}`}
            {cond.anoEntrega && ` · Entregue em ${cond.anoEntrega}`}
          </p>
        </div>
      </section>

      <div className="container-site py-12">

        {/* Sobre o condomínio */}
        {cond.sobre && Array.isArray(cond.sobre) && cond.sobre.length > 0 && (
          <section className="mb-12 max-w-3xl">
            <h2 className="text-display-sm text-ink mb-4">Sobre o {cond.nome}</h2>
            <div className="prose prose-lg text-muted">
              <PortableText value={cond.sobre as Parameters<typeof PortableText>[0]['value']} />
            </div>
          </section>
        )}

        {/* Infraestrutura */}
        {cond.infraestrutura && cond.infraestrutura.length > 0 && (
          <section className="mb-12">
            <h2 className="text-display-sm text-ink mb-4">
              Infraestrutura e lazer do {cond.nome}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {cond.infraestrutura.map((item) => (
                <li key={item} className="px-4 py-2 bg-stone rounded-full text-sm text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tipologias — links para NÍVEL 3 */}
        {cond.tipologiasDisponiveis && cond.tipologiasDisponiveis.length > 0 && (
          <section className="mb-12">
            <h2 className="text-display-sm text-ink mb-4">
              Tipologias disponíveis no {cond.nome}
            </h2>
            <div className="flex flex-wrap gap-3">
              {cond.tipologiasDisponiveis.map((tip) => (
                <Link
                  key={tip}
                  href={`/imoveis/${params.slug}/${params.condominio}/${tip}`}
                  className="px-5 py-3 border border-gold text-gold rounded-xl text-sm hover:bg-gold hover:text-white transition-colors"
                >
                  {TIPOLOGIA_LABELS[tip] ?? tip}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Grid de imóveis */}
        {imoveis.length > 0 && (
          <section className="mb-12">
            <h2 className="text-display-sm text-ink mb-6">
              Imóveis à venda no {cond.nome}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imoveis.map((imovel) => (
                <ImovelCardComponent key={imovel._id} imovel={imovel} />
              ))}
            </div>
          </section>
        )}

        {/* Localização */}
        {cond.geo?.proximidades && cond.geo.proximidades.length > 0 && (
          <section className="mb-12">
            <h2 className="text-display-sm text-ink mb-4">
              Localização do {cond.nome}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {cond.geo.proximidades.map((p) => (
                <li key={p} className="text-sm text-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs */}
        {cond.faqs && cond.faqs.length > 0 && (
          <section className="mb-12 max-w-3xl">
            <h2 className="text-display-sm text-ink mb-6">
              Perguntas frequentes sobre o {cond.nome}
            </h2>
            <div className="space-y-4">
              {cond.faqs.map((faq, i) => (
                <details key={i} className="group border-b border-stone pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-ink font-medium list-none">
                    {faq.pergunta}
                    <span className="text-gold group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <p className="mt-3 text-muted leading-relaxed">{faq.resposta}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Condomínios próximos */}
        {cond.condominiosProximos && cond.condominiosProximos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-display-sm text-ink mb-4">
              Outros condomínios em {cond.bairro.nome}
            </h2>
            <div className="flex flex-wrap gap-3">
              {cond.condominiosProximos.map((c) => (
                <Link
                  key={c.slug.current}
                  href={`/imoveis/${params.slug}/${c.slug.current}`}
                  className="px-4 py-2 rounded-full border border-stone text-ink text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  {c.nome}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
