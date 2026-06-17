/**
 * SEO Landing Page: Coberturas e Penthouses
 * URL: /imoveis/cobertura/
 * Rota estática → precede dinamicamente /imoveis/[slug]/
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  IMOVEIS_COBERTURA_QUERY,
  IMOVEIS_COBERTURA_TOTAL_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import CaracteristicaGrid from '@/components/pages/CaracteristicaGrid'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

const TITULO = 'Coberturas e Penthouses à venda'
const SUBTITULO = 'Curadoria Admirata de coberturas duplex, penthouses e coberturas de alto padrão no Rio de Janeiro e Serra Gaúcha.'
const DESCRICAO = 'Coberturas e penthouses representam o mais alto nível de sofisticação no mercado imobiliário. Com terraços privativos, vistas panorâmicas e acabamentos exclusivos, esses imóveis oferecem o que há de melhor em qualidade de vida e exclusividade. A Admirata seleciona pessoalmente cada cobertura disponível, garantindo qualidade, localização privilegiada e valorização consistente.'

const BAIRROS = [
  { label: 'Cobertura Barra da Tijuca', href: '/imoveis/barra-da-tijuca' },
  { label: 'Cobertura Recreio', href: '/imoveis/recreio-dos-bandeirantes' },
  { label: 'Cobertura Leblon', href: '/imoveis/leblon' },
  { label: 'Cobertura Ipanema', href: '/imoveis/ipanema' },
  { label: 'Cobertura Gramado', href: '/imoveis/gramado' },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: `${TITULO} | Admirata Imóveis`,
    description: SUBTITULO,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/cobertura`,
    },
    openGraph: {
      title: `${TITULO} | Admirata`,
      description: SUBTITULO,
      type: 'website',
    },
  }
}

export default async function CoberturaPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const [imoveis, total] = await Promise.all([
    client.fetch<ImovelCard[]>(IMOVEIS_COBERTURA_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<number>(IMOVEIS_COBERTURA_TOTAL_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: 'Coberturas e Penthouses', item: `${siteUrl}${localePrefix}/imoveis/cobertura` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: TITULO,
        description: SUBTITULO,
        url: `${siteUrl}${localePrefix}/imoveis/cobertura`,
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
        canonicalSlug="cobertura"
        bairrosRelacionados={BAIRROS}
      />
    </>
  )
}
