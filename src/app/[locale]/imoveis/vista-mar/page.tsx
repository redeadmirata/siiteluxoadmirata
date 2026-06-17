/**
 * SEO Landing Page: Imóveis com Vista Mar
 * URL: /imoveis/vista-mar/
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  IMOVEIS_VISTA_MAR_QUERY,
  IMOVEIS_VISTA_MAR_TOTAL_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import CaracteristicaGrid from '@/components/pages/CaracteristicaGrid'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

const TITULO = 'Imóveis com vista mar à venda'
const SUBTITULO = 'Apartamentos e coberturas com vista para o mar no Rio de Janeiro. Alto padrão, posições privilegiadas e paisagens deslumbrantes.'
const DESCRICAO = 'A vista para o mar é um dos atributos mais valorizados no mercado imobiliário de alto padrão carioca. Seja uma vista panorâmica do Atlântico a partir de uma cobertura na Barra da Tijuca, ou a visão da Lagoa Rodrigo de Freitas do alto do Leblon — esses imóveis oferecem qualidade de vida única e valorização consistente. A Admirata seleciona apenas os melhores posicionamentos com vista mar genuína e desobstruída.'

const BAIRROS = [
  { label: 'Vista mar Barra da Tijuca', href: '/imoveis/barra-da-tijuca' },
  { label: 'Vista mar Recreio', href: '/imoveis/recreio-dos-bandeirantes' },
  { label: 'Vista mar Leblon', href: '/imoveis/leblon' },
  { label: 'Vista mar Ipanema', href: '/imoveis/ipanema' },
  { label: 'Vista mar Jacarepaguá', href: '/imoveis/jacarepagua' },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: `${TITULO} | Admirata Imóveis RJ`,
    description: SUBTITULO,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/vista-mar`,
    },
    openGraph: {
      title: `${TITULO} | Admirata`,
      description: SUBTITULO,
      type: 'website',
    },
  }
}

export default async function VistaMarPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const [imoveis, total] = await Promise.all([
    client.fetch<ImovelCard[]>(IMOVEIS_VISTA_MAR_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<number>(IMOVEIS_VISTA_MAR_TOTAL_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: 'Vista mar', item: `${siteUrl}${localePrefix}/imoveis/vista-mar` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: TITULO,
        description: SUBTITULO,
        url: `${siteUrl}${localePrefix}/imoveis/vista-mar`,
        numberOfItems: total,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaracteristicaGrid
        titulo={TITULO}
        subtitulo={SUBTITULO}
        descricao={DESCRICAO}
        imoveis={imoveis}
        total={total}
        canonicalSlug="vista-mar"
        bairrosRelacionados={BAIRROS}
      />
    </>
  )
}
