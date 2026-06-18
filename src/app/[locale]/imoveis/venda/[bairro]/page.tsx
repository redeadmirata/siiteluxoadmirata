/**
 * /imoveis/venda/[bairro]
 * Ex: /imoveis/venda/barra-da-tijuca
 * Faceted URL com finalidade + bairro — alta relevância SEO
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  BAIRRO_MINIMAL_QUERY,
  BAIRROS_SLUGS_QUERY,
  IMOVEIS_FILTRADOS_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import FiltrosSearch from '@/components/busca/FiltrosSearch'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { routing } from '@/i18n/routing'

export const revalidate = 60

interface BairroMinimal {
  _id: string
  nome: string
  slug: { current: string }
  cidade?: string
  estado?: string
  mercado?: string
  fotoCapa?: { asset?: { url: string; metadata?: { lqip?: string } } }
  metaTitle?: string
  metaDescription?: string
  totalImoveis: number
}

interface PageProps {
  params: { locale: string; bairro: string }
  searchParams: { tipo?: string; mercado?: string; quartos?: string }
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(BAIRROS_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, bairro: s.slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bairro = await client.fetch<BairroMinimal | null>(
    BAIRRO_MINIMAL_QUERY,
    { slug: params.bairro },
    { next: { revalidate: 3600 } }
  )

  if (!bairro) return { title: 'Imóveis à Venda | Admirata' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const titulo =
    bairro.metaTitle ?? `Imóveis à Venda em ${bairro.nome} | Admirata`
  const descricao =
    bairro.metaDescription ??
    `${bairro.totalImoveis > 0 ? `${bairro.totalImoveis} imóveis à venda` : 'Imóveis à venda'} em ${bairro.nome}${bairro.cidade ? `, ${bairro.cidade}` : ''}. Curadoria exclusiva de alto padrão — Admirata Imóveis.`

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/venda/${params.bairro}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      ...(bairro.fotoCapa?.asset?.url && {
        images: [{ url: bairro.fotoCapa.asset.url, width: 1200, height: 630, alt: `${bairro.nome} — Admirata` }],
      }),
    },
  }
}

export default async function ImoveisVendaBairroPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)

  const [bairro, imoveis] = await Promise.all([
    client.fetch<BairroMinimal | null>(
      BAIRRO_MINIMAL_QUERY,
      { slug: params.bairro },
      { next: { revalidate: 3600 } }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_FILTRADOS_QUERY,
      {
        finalidade: 'Venda',
        tipo: searchParams.tipo ?? '',
        mercado: '',
        bairroSlug: params.bairro,
        precoMin: 0,
        precoMax: 0,
        quartos: Number(searchParams.quartos ?? 0),
        offset: 0,
        end: 24,
      },
      { next: { revalidate: 60 } }
    ),
  ])

  if (!bairro) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis à Venda', item: `${siteUrl}${localePrefix}/imoveis/venda` },
          { '@type': 'ListItem', position: 3, name: bairro.nome, item: `${siteUrl}${localePrefix}/imoveis/venda/${params.bairro}` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `Imóveis à Venda em ${bairro.nome}`,
        description: `Curadoria de imóveis de alto padrão à venda em ${bairro.nome}`,
        url: `${siteUrl}${localePrefix}/imoveis/venda/${params.bairro}`,
        numberOfItems: imoveis.length,
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
      <section className="relative bg-ink pt-[72px]">
        {bairro.fotoCapa?.asset?.url && (
          <div className="relative h-[340px] sm:h-[420px]">
            <Image
              src={bairro.fotoCapa.asset.url}
              alt={`${bairro.nome} — imóveis à venda`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              placeholder={bairro.fotoCapa.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={bairro.fotoCapa.asset.metadata?.lqip}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          </div>
        )}
        <div
          className={`max-w-screen-xl mx-auto px-6 lg:px-10 pb-14 ${bairro.fotoCapa?.asset?.url ? 'absolute bottom-0 left-0 right-0' : 'pt-10 pb-14'}`}
        >
          <BreadcrumbNav
            items={[
              { label: 'Início', href: '/' },
              { label: 'À Venda', href: '/imoveis/venda' },
              { label: bairro.nome },
            ]}
            dark
          />
          <h1 className="font-display text-4xl sm:text-5xl text-white font-light leading-[1.08] mt-4">
            Imóveis à Venda em {bairro.nome}
          </h1>
          {bairro.cidade && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-3">
              {bairro.cidade}{bairro.estado ? ` · ${bairro.estado}` : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Conteúdo ── */}
      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 bg-white" id="main-content">
        <FiltrosSearch totalResultados={imoveis.length} hideFinalidade />

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {imoveis.map((imovel, i) => (
              <ImovelCardComponent key={imovel._id} imovel={imovel} priority={i < 6} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div
              className="font-display text-[8rem] text-stone leading-none mb-6 select-none"
              aria-hidden="true"
            >
              A
            </div>
            <p className="font-display text-2xl text-muted mb-3">
              Sem imóveis à venda em {bairro.nome}
            </p>
            <p className="text-sm text-muted max-w-sm mb-8">
              Tente outros filtros ou veja todo o portfólio de venda.
            </p>
            <a
              href="/imoveis/venda"
              className="text-[11px] uppercase tracking-[0.2em] text-gold hover:underline"
            >
              Ver todos os imóveis à venda →
            </a>
          </div>
        )}
      </main>
    </>
  )
}
