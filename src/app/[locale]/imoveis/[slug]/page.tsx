/**
 * NÍVEL 1 da hierarquia SEO: Página de Bairro
 * URL: /imoveis/[bairro]/
 *
 * Substitui /bairros/[slug]/ (redirect 301 configurado em next.config.mjs)
 * Anti-thin-content: sempre indexável (tem conteúdo editorial único por bairro)
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  BAIRRO_QUERY,
  BAIRROS_SLUGS_QUERY,
  IMOVEIS_POR_BAIRRO_QUERY,
  CONDOMINIOS_POR_BAIRRO_QUERY,
} from '@/sanity/queries'
import type { Bairro, ImovelCard, CondominioCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { routing } from '@/i18n/routing'

export const revalidate = 3600

interface PageProps {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(BAIRROS_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, slug: s.slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bairro = await client.fetch<Bairro | null>(
    BAIRRO_QUERY,
    { slug: params.slug },
    { next: { revalidate: 3600 } }
  )

  if (!bairro) return { title: 'Bairro não encontrado' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const titulo =
    (bairro as Bairro & { metaTitle?: string }).metaTitle ??
    `Imóveis à venda em ${bairro.nome} | Admirata RJ`
  const descricao =
    (bairro as Bairro & { metaDescription?: string }).metaDescription ??
    `Apartamentos, coberturas e casas de alto padrão em ${bairro.nome}. Curadoria Admirata nos melhores condomínios. Confira.`
  const capaUrl = bairro.fotoCapa?.asset?.url

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      locale: params.locale === 'en' ? 'en_US' : params.locale === 'fr' ? 'fr_FR' : 'pt_BR',
      ...(capaUrl && {
        images: [{ url: capaUrl, width: 1200, height: 630, alt: `${bairro.nome} — Admirata` }],
      }),
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/${params.slug}`,
      languages: {
        'pt-BR': `${siteUrl}/imoveis/${params.slug}`,
        'en-US': `${siteUrl}/en/imoveis/${params.slug}`,
        'fr-FR': `${siteUrl}/fr/imoveis/${params.slug}`,
      },
    },
  }
}

export default async function BairroPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const [bairro, imoveis, condominios] = await Promise.all([
    client.fetch<Bairro | null>(
      BAIRRO_QUERY,
      { slug: params.slug },
      { next: { revalidate: 3600 } }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_POR_BAIRRO_QUERY,
      { bairroSlug: params.slug, limit: 12 },
      { next: { revalidate: 60 } }
    ),
    client.fetch<CondominioCard[]>(
      CONDOMINIOS_POR_BAIRRO_QUERY,
      { bairroSlug: params.slug },
      { next: { revalidate: 3600 } }
    ),
  ])

  if (!bairro) {
    // Slug não corresponde a nenhum bairro — pode ser um imovel no URL antigo.
    // 301 → /imovel/[slug] para preservar SEO das PDIs já indexadas.
    const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
    permanentRedirect(`${localePrefix}/imovel/${params.slug}`)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const bairroTyped = bairro as Bairro & {
    introTexto?: string
    faqs?: Array<{ pergunta: string; resposta: string }>
    bairrosProximos?: Array<{ nome: string; slug: { current: string } }>
    faixaPreco?: { min?: number; max?: number; tipoPredominante?: string }
  }

  // JSON-LD — BreadcrumbList + CollectionPage + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: bairro.nome, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `Imóveis à venda em ${bairro.nome}`,
        description: `Curadoria de imóveis de alto padrão em ${bairro.nome}, ${bairro.cidade}`,
        url: `${siteUrl}${localePrefix}/imoveis/${params.slug}`,
        numberOfItems: bairro.totalImoveis,
      },
      ...(bairroTyped.faqs && bairroTyped.faqs.length > 0
        ? [{
            '@type': 'FAQPage',
            mainEntity: bairroTyped.faqs.map((f) => ({
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
      <section className="relative h-[60vh] min-h-[400px] flex items-end bg-ink">
        {bairro.fotoCapa?.asset?.url && (
          <Image
            src={bairro.fotoCapa.asset.url}
            alt={`${bairro.nome} — vista aérea`}
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
              { label: bairro.nome },
            ]}
            dark
          />
          <h1 className="text-display-lg text-white mt-4 leading-tight">
            Imóveis à venda em {bairro.nome}
          </h1>
          {bairroTyped.introTexto && (
            <p className="text-white/80 mt-2 max-w-2xl text-lg">{bairroTyped.introTexto}</p>
          )}
          {bairro.totalImoveis > 0 && (
            <p className="text-gold mt-3 text-sm tracking-wide">
              {bairro.totalImoveis} {bairro.totalImoveis === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </p>
          )}
        </div>
      </section>

      <div className="container-site py-12">

        {/* Condomínios âncora — NÍVEL 2 */}
        {condominios.length > 0 && (
          <section className="mb-16">
            <h2 className="text-display-sm text-ink mb-6">
              Principais condomínios em {bairro.nome}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {condominios.map((cond) => (
                <Link
                  key={cond._id}
                  href={`/imoveis/${params.slug}/${cond.slug.current}`}
                  className="group block rounded-xl overflow-hidden border border-stone hover:shadow-lg transition-shadow"
                >
                  {cond.fotoCapa?.url && (
                    <div className="relative h-48">
                      <Image
                        src={cond.fotoCapa.url}
                        alt={cond.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-ink group-hover:text-gold transition-colors">
                      {cond.nome}
                    </h3>
                    {cond.totalImoveis > 0 && (
                      <p className="text-sm text-muted mt-1">
                        {cond.totalImoveis} {cond.totalImoveis === 1 ? 'unidade' : 'unidades'} disponíveis
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Grid de imóveis */}
        {imoveis.length > 0 && (
          <section className="mb-16">
            <h2 className="text-display-sm text-ink mb-6">
              Imóveis disponíveis em {bairro.nome}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imoveis.map((imovel) => (
                <ImovelCardComponent key={imovel._id} imovel={imovel} />
              ))}
            </div>
            {bairro.totalImoveis > 12 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/imoveis?bairro=${params.slug}`}
                  className="btn-secondary"
                >
                  Ver todos os {bairro.totalImoveis} imóveis
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Por que morar — H2 editorial */}
        {bairro.descricao && (
          <section className="mb-16 max-w-3xl">
            <h2 className="text-display-sm text-ink mb-4">
              Por que morar em {bairro.nome}?
            </h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{bairro.descricao}</p>
          </section>
        )}

        {/* Faixa de preço */}
        {bairroTyped.faixaPreco && (
          <section className="mb-16 bg-stone rounded-2xl p-8">
            <h2 className="text-display-sm text-ink mb-4">
              Quanto custa um imóvel em {bairro.nome}?
            </h2>
            <p className="text-muted">
              {bairroTyped.faixaPreco.tipoPredominante && (
                <span>{bairroTyped.faixaPreco.tipoPredominante}. </span>
              )}
              {bairroTyped.faixaPreco.min && bairroTyped.faixaPreco.max && (
                <span>
                  Os preços variam de{' '}
                  <strong>R$ {(bairroTyped.faixaPreco.min / 1e6).toFixed(1)} milhão</strong> a{' '}
                  <strong>R$ {(bairroTyped.faixaPreco.max / 1e6).toFixed(0)} milhões</strong>.
                </span>
              )}
            </p>
          </section>
        )}

        {/* FAQs — acordeão + FAQPage schema */}
        {bairroTyped.faqs && bairroTyped.faqs.length > 0 && (
          <section className="mb-16 max-w-3xl">
            <h2 className="text-display-sm text-ink mb-6">
              Perguntas frequentes sobre {bairro.nome}
            </h2>
            <div className="space-y-4">
              {bairroTyped.faqs.map((faq, i) => (
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

        {/* Bairros próximos — linkagem interna lateral */}
        {bairroTyped.bairrosProximos && bairroTyped.bairrosProximos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-display-sm text-ink mb-4">Bairros próximos</h2>
            <div className="flex flex-wrap gap-3">
              {bairroTyped.bairrosProximos.map((b) => (
                <Link
                  key={b.slug.current}
                  href={`/imoveis/${b.slug.current}`}
                  className="px-4 py-2 rounded-full border border-gold text-gold text-sm hover:bg-gold hover:text-white transition-colors"
                >
                  Imóveis em {b.nome}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
