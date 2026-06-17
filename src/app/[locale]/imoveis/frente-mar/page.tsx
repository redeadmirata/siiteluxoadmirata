/**
 * SEO Landing Page: Imóveis Frente Mar
 * URL: /imoveis/frente-mar/
 * Rota estática → precede /imoveis/[slug]/
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  IMOVEIS_FRENTE_MAR_QUERY,
  IMOVEIS_FRENTE_MAR_TOTAL_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import CaracteristicaGrid from '@/components/pages/CaracteristicaGrid'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

const TITULO = 'Imóveis frente mar à venda'
const SUBTITULO = 'Apartamentos, coberturas e casas com posição frente ao mar no Rio de Janeiro. Curadoria exclusiva Admirata.'
const DESCRICAO = 'Imóveis frente ao mar são os mais exclusivos e valorizados do mercado imobiliário carioca. Com acesso direto à praia, vista desobstruída para o oceano e valorização constante, essas propriedades representam o ápice do mercado de alto padrão. A Admirata cuida da seleção de cada imóvel frente ao mar, garantindo autenticidade, documentação e localização privilegiada na Barra da Tijuca, Recreio e Zona Sul.'

const BAIRROS = [
  { label: 'Frente mar Barra da Tijuca', href: '/imoveis/barra-da-tijuca' },
  { label: 'Frente mar Recreio', href: '/imoveis/recreio-dos-bandeirantes' },
  { label: 'Frente mar Ipanema', href: '/imoveis/ipanema' },
  { label: 'Frente mar Leblon', href: '/imoveis/leblon' },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: `${TITULO} | Admirata Imóveis RJ`,
    description: SUBTITULO,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/frente-mar`,
    },
    openGraph: {
      title: `${TITULO} | Admirata`,
      description: SUBTITULO,
      type: 'website',
    },
  }
}

export default async function FrenteMarPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const [imoveis, total] = await Promise.all([
    client.fetch<ImovelCard[]>(IMOVEIS_FRENTE_MAR_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<number>(IMOVEIS_FRENTE_MAR_TOTAL_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: 'Frente mar', item: `${siteUrl}${localePrefix}/imoveis/frente-mar` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: TITULO,
        description: SUBTITULO,
        url: `${siteUrl}${localePrefix}/imoveis/frente-mar`,
        numberOfItems: total,
        keywords: 'imóvel frente mar, apartamento frente ao mar rio de janeiro, cobertura frente mar',
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
        canonicalSlug="frente-mar"
        bairrosRelacionados={BAIRROS}
      />
    </>
  )
}
