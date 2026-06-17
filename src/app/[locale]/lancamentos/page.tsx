/**
 * SEO Landing Page: Lançamentos Imobiliários
 * URL: /lancamentos/
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { LANCAMENTOS_LISTING_QUERY } from '@/sanity/queries'
import type { LancamentoCard } from '@/types/sanity'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { formatPreco } from '@/lib/formatters'

export const revalidate = 1800

interface PageProps {
  params: { locale: string }
}

const STATUS_LABELS: Record<string, string> = {
  'na-planta': 'Na planta',
  'em-obras': 'Em obras',
  'breve': 'Breve lançamento',
  'pronto': 'Pronto para morar',
  'entregue': 'Entregue',
}

const STATUS_COLORS: Record<string, string> = {
  'na-planta': 'bg-blue-100 text-blue-800',
  'em-obras': 'bg-amber-100 text-amber-800',
  'breve': 'bg-purple-100 text-purple-800',
  'pronto': 'bg-green-100 text-green-800',
  'entregue': 'bg-stone-100 text-stone-600',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Lançamentos imobiliários de luxo no Rio de Janeiro | Admirata',
    description: 'Os melhores lançamentos imobiliários de alto padrão no Rio de Janeiro. Pré-venda, na planta e empreendimentos em obras com curadoria Admirata.',
    alternates: {
      canonical: `${siteUrl}${localePrefix}/lancamentos`,
    },
    openGraph: {
      title: 'Lançamentos de luxo | Admirata Imóveis RJ',
      description: 'Curadoria dos melhores lançamentos imobiliários de alto padrão no Rio de Janeiro.',
      type: 'website',
    },
  }
}

export default async function LancamentosPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const lancamentos = await client.fetch<LancamentoCard[]>(
    LANCAMENTOS_LISTING_QUERY,
    {},
    { next: { revalidate: 1800 } }
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Lançamentos', item: `${siteUrl}${localePrefix}/lancamentos` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Lançamentos imobiliários de luxo no Rio de Janeiro',
        description: 'Curadoria Admirata dos melhores lançamentos de alto padrão.',
        url: `${siteUrl}${localePrefix}/lancamentos`,
        numberOfItems: lancamentos.length,
      },
      ...(lancamentos.length > 0
        ? [{
            '@type': 'ItemList',
            itemListElement: lancamentos.slice(0, 10).map((l, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: l.titulo,
              url: `${siteUrl}${localePrefix}/lancamento/${l.slug.current}`,
            })),
          }]
        : []),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Lançamentos' },
          ]}
        />
      </div>

      <div className="container-site py-8">
        <header className="mb-10">
          <h1 className="text-display-lg text-ink mb-3">Lançamentos imobiliários de luxo</h1>
          <p className="text-muted text-lg max-w-2xl mb-2">
            Curadoria Admirata dos melhores empreendimentos de alto padrão em lançamento,
            pré-venda e construção no Rio de Janeiro.
          </p>
          <p className="text-sm text-muted">
            {lancamentos.length > 0
              ? `${lancamentos.length} ${lancamentos.length === 1 ? 'empreendimento disponível' : 'empreendimentos disponíveis'}`
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
                  <div className="relative h-56">
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
                <div className="p-5">
                  <h2 className="font-semibold text-ink group-hover:text-gold transition-colors mb-1">
                    {lanc.titulo}
                  </h2>
                  {lanc.bairro && (
                    <p className="text-sm text-muted">
                      {lanc.bairro.nome}
                      {lanc.bairro.cidade ? ` · ${lanc.bairro.cidade}` : ''}
                    </p>
                  )}
                  {lanc.construtora && (
                    <p className="text-xs text-muted mt-1">{lanc.construtora}</p>
                  )}
                  {lanc.precoAPartirDe && (
                    <p className="text-sm font-semibold text-ink mt-3">
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
            <Link href="/imoveis" className="btn-secondary">Ver imóveis disponíveis</Link>
          </div>
        )}

        {/* Editorial SEO */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-display-sm text-ink mb-4">
            Investir em lançamentos no Rio de Janeiro
          </h2>
          <p className="text-muted leading-relaxed">
            Lançamentos imobiliários de alto padrão no Rio de Janeiro oferecem oportunidades únicas de valorização.
            Comprar na planta permite condições de pagamento diferenciadas e personalização de acabamentos —
            com a segurança da curadoria Admirata que verifica histórico da construtora, cronograma de obra e documentação.
            Barra da Tijuca, Recreio dos Bandeirantes e Jacarepaguá concentram os principais empreendimentos de luxo em lançamento.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/imoveis/na-planta" className="btn-secondary">
            Ver imóveis na planta
          </Link>
          <Link href="/imoveis" className="btn-ghost">
            Ver todos os imóveis
          </Link>
        </div>
      </div>
    </>
  )
}
