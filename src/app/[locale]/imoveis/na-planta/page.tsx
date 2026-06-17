/**
 * SEO Landing Page: Imóveis na Planta
 * URL: /imoveis/na-planta/
 * Mostra lançamentos em pré-venda, na planta e em obras.
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { LANCAMENTOS_NA_PLANTA_QUERY } from '@/sanity/queries'
import type { LancamentoCard } from '@/types/sanity'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { formatPreco } from '@/lib/formatters'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

const STATUS_LABELS: Record<string, string> = {
  'na-planta': 'Na planta',
  'em-obras': 'Em obras',
  'breve': 'Breve lançamento',
  'pronto': 'Pronto para morar',
}

const STATUS_COLORS: Record<string, string> = {
  'na-planta': 'bg-blue-100 text-blue-800',
  'em-obras': 'bg-amber-100 text-amber-800',
  'breve': 'bg-purple-100 text-purple-800',
  'pronto': 'bg-green-100 text-green-800',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Imóveis na planta à venda no Rio de Janeiro | Admirata',
    description: 'Lançamentos imobiliários e imóveis na planta no Rio de Janeiro. Pré-venda com condições especiais, plantas exclusivas e entrega futura garantida. Curadoria Admirata.',
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/na-planta`,
    },
    openGraph: {
      title: 'Imóveis na planta | Admirata',
      description: 'Lançamentos e pré-vendas no Rio de Janeiro. Condições especiais para compra na planta.',
      type: 'website',
    },
  }
}

export default async function NaPlantaPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const lancamentos = await client.fetch<LancamentoCard[]>(
    LANCAMENTOS_NA_PLANTA_QUERY,
    {},
    { next: { revalidate: 3600 } }
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: 'Na planta', item: `${siteUrl}${localePrefix}/imoveis/na-planta` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Imóveis na planta no Rio de Janeiro',
        description: 'Lançamentos imobiliários e imóveis na planta com curadoria Admirata.',
        url: `${siteUrl}${localePrefix}/imoveis/na-planta`,
        numberOfItems: lancamentos.length,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Imóveis', href: '/imoveis' },
            { label: 'Na planta' },
          ]}
        />
      </div>

      <div className="container-site py-8">
        <header className="mb-10">
          <h1 className="text-display-lg text-ink mb-3">Imóveis na planta à venda</h1>
          <p className="text-muted text-lg max-w-2xl mb-2">
            Lançamentos imobiliários e pré-vendas com curadoria Admirata no Rio de Janeiro.
            Condições especiais, plantas exclusivas e valorização garantida.
          </p>
          <p className="text-sm text-muted">
            {lancamentos.length > 0
              ? `${lancamentos.length} ${lancamentos.length === 1 ? 'lançamento disponível' : 'lançamentos disponíveis'}`
              : 'Nenhum lançamento no momento'}
          </p>
        </header>

        {lancamentos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {lancamentos.map((lanc) => (
              <Link
                key={lanc._id}
                href={`/lancamento/${lanc.slug.current}`}
                className="group block rounded-xl overflow-hidden border border-stone hover:shadow-lg transition-shadow"
              >
                {lanc.imagemCapa?.asset?.url && (
                  <div className="relative h-52">
                    <Image
                      src={lanc.imagemCapa.asset.url}
                      alt={lanc.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {lanc.statusObra && (
                      <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[lanc.statusObra] ?? 'bg-stone text-ink'}`}>
                        {STATUS_LABELS[lanc.statusObra] ?? lanc.statusObra}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-ink group-hover:text-gold transition-colors mb-1">
                    {lanc.titulo}
                  </h2>
                  {lanc.bairro && (
                    <p className="text-sm text-muted">{lanc.bairro.nome} · {lanc.bairro.cidade}</p>
                  )}
                  {lanc.construtora && (
                    <p className="text-xs text-muted mt-1">{lanc.construtora}</p>
                  )}
                  {lanc.precoAPartirDe && (
                    <p className="text-sm font-semibold text-ink mt-2">
                      A partir de {formatPreco(lanc.precoAPartirDe)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-stone rounded-2xl mb-12">
            <p className="text-muted text-lg mb-4">Nenhum lançamento disponível no momento.</p>
            <Link href="/imoveis" className="btn-secondary">Ver todos os imóveis</Link>
          </div>
        )}

        {/* Editorial SEO */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-display-sm text-ink mb-4">
            Por que comprar um imóvel na planta?
          </h2>
          <p className="text-muted leading-relaxed">
            Comprar um imóvel na planta oferece vantagens únicas: preço abaixo do valor de mercado no lançamento,
            facilidade de pagamento durante a obra e possibilidade de personalização dos acabamentos.
            No Rio de Janeiro, bairros como Barra da Tijuca, Recreio dos Bandeirantes e Jacarepaguá concentram
            os principais lançamentos de alto padrão. A Admirata acompanha cada empreendimento de perto,
            verificando construtora, plantas e perspectivas reais de entrega.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/lancamentos" className="btn-secondary">
            Ver todos os lançamentos
          </Link>
          <Link href="/imoveis" className="btn-ghost">
            Ver imóveis prontos
          </Link>
        </div>
      </div>
    </>
  )
}
