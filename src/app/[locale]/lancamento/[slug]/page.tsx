/**
 * PDI de Lançamento
 * URL: /lancamento/[slug]
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { LANCAMENTO_DETALHE_QUERY, LANCAMENTOS_SLUGS_QUERY } from '@/sanity/queries'
import type { LancamentoDetalhe } from '@/types/sanity'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { formatPreco } from '@/lib/formatters'
import { routing } from '@/i18n/routing'

export const revalidate = 3600
export const dynamicParams = true

interface PageProps {
  params: { locale: string; slug: string }
}

const STATUS_LABELS: Record<string, string> = {
  'na-planta': 'Na planta',
  'em-obras': 'Em obras',
  'breve': 'Breve lançamento',
  'pronto': 'Pronto para morar',
  'entregue': 'Entregue',
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(LANCAMENTOS_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const lanc = await client.fetch<LancamentoDetalhe | null>(
    LANCAMENTO_DETALHE_QUERY,
    { slug: params.slug },
    { next: { revalidate: 3600 } }
  )

  if (!lanc) {
    return { title: 'Lançamento não encontrado | Admirata' }
  }

  const title = lanc.metaTitle ?? `${lanc.titulo} | Lançamento Admirata`
  const description = lanc.metaDescription ?? `${lanc.titulo} — lançamento imobiliário de alto padrão${lanc.bairro ? ` em ${lanc.bairro.nome}` : ''}. Curadoria Admirata.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/lancamento/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: lanc.imagemCapa?.asset?.url
        ? [{ url: lanc.imagemCapa.asset.url, width: 1200, height: 630, alt: lanc.titulo }]
        : [],
    },
  }
}

export default async function LancamentoDetalhePage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const lanc = await client.fetch<LancamentoDetalhe | null>(
    LANCAMENTO_DETALHE_QUERY,
    { slug: params.slug },
    { next: { revalidate: 3600 } }
  )

  if (!lanc) notFound()

  const statusLabel = STATUS_LABELS[lanc.statusObra ?? ''] ?? lanc.statusObra ?? ''

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
        { '@type': 'ListItem', position: 2, name: 'Lançamentos', item: `${siteUrl}${localePrefix}/lancamentos` },
        { '@type': 'ListItem', position: 3, name: lanc.titulo, item: `${siteUrl}${localePrefix}/lancamento/${params.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: lanc.titulo,
      description: typeof lanc.descricao === 'string' ? lanc.descricao : '',
      url: `${siteUrl}${localePrefix}/lancamento/${params.slug}`,
      ...(lanc.imagemCapa?.asset?.url && { image: lanc.imagemCapa.asset.url }),
      ...(lanc.precoAPartirDe && {
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: lanc.precoAPartirDe,
          availability: 'https://schema.org/InStock',
        },
      }),
      ...(lanc.bairro && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: lanc.bairro.nome,
          addressRegion: 'RJ',
          addressCountry: 'BR',
        },
      }),
    },
  ]

  if (lanc.faqs && lanc.faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: lanc.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: faq.resposta },
      })),
    })
  }

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Lançamentos', href: '/lancamentos' },
            { label: lanc.titulo },
          ]}
        />
      </div>

      {/* Hero */}
      {lanc.imagemCapa?.asset?.url && (
        <div className="relative h-[50vh] min-h-[360px] max-h-[600px] mb-10">
          <Image
            src={lanc.imagemCapa.asset.url}
            alt={lanc.titulo}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" />
          <div className="absolute bottom-0 left-0 container-site pb-8">
            {statusLabel && (
              <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-gold text-white mb-3">
                {statusLabel}
              </span>
            )}
            <h1 className="text-display-lg text-white">{lanc.titulo}</h1>
            {lanc.bairro && (
              <p className="text-white/70 mt-1">{lanc.bairro.nome}{lanc.bairro.cidade ? `, ${lanc.bairro.cidade}` : ''}</p>
            )}
          </div>
        </div>
      )}

      <div className="container-site pb-16">
        {!lanc.imagemCapa?.asset?.url && (
          <header className="mb-8">
            <h1 className="text-display-lg text-ink mb-2">{lanc.titulo}</h1>
            {lanc.bairro && <p className="text-muted">{lanc.bairro.nome}</p>}
          </header>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
          {/* Conteúdo principal */}
          <div>
            {/* Preço */}
            {(lanc.precoAPartirDe || lanc.precoAte) && (
              <div className="flex flex-wrap gap-6 mb-8 p-6 bg-stone/30 rounded-xl">
                {lanc.precoAPartirDe && (
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">A partir de</p>
                    <p className="text-2xl font-semibold text-ink">{formatPreco(lanc.precoAPartirDe)}</p>
                  </div>
                )}
                {lanc.precoAte && (
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Até</p>
                    <p className="text-2xl font-semibold text-ink">{formatPreco(lanc.precoAte)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Descrição */}
            {lanc.descricao && (
              <section className="mb-8">
                <h2 className="text-display-sm text-ink mb-3">Sobre o empreendimento</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">{typeof lanc.descricao === 'string' ? lanc.descricao : ''}</p>
              </section>
            )}

            {/* Diferenciais */}
            {lanc.diferenciais && lanc.diferenciais.length > 0 && (
              <section className="mb-8">
                <h2 className="text-display-sm text-ink mb-4">Diferenciais</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lanc.diferenciais.map((d: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Plantas */}
            {lanc.plantas && lanc.plantas.length > 0 && (
              <section className="mb-8">
                <h2 className="text-display-sm text-ink mb-4">Plantas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lanc.plantas.map((planta: { asset?: { url: string }; titulo?: string; alt?: string }, i: number) => planta.asset?.url && (
                    <figure key={i} className="border border-stone rounded-xl overflow-hidden">
                      <Image
                        src={planta.asset.url}
                        alt={planta.titulo ?? planta.alt ?? `Planta ${i + 1}`}
                        width={600}
                        height={400}
                        className="object-contain w-full"
                      />
                      {planta.titulo && (
                        <figcaption className="text-xs text-muted text-center py-2 px-3">
                          {planta.titulo}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Galeria */}
            {lanc.galeria && lanc.galeria.length > 0 && (
              <section className="mb-8">
                <h2 className="text-display-sm text-ink mb-4">Galeria</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lanc.galeria.slice(0, 9).map((img: { asset?: { url: string }; alt?: string }, i: number) => img.asset?.url && (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={img.asset.url}
                        alt={img.alt ?? `Foto ${i + 1} — ${lanc.titulo}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {lanc.faqs && lanc.faqs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-display-sm text-ink mb-4">Perguntas frequentes</h2>
                <dl className="space-y-5">
                  {lanc.faqs.map((faq: { pergunta: string; resposta: string }, i: number) => (
                    <div key={i}>
                      <dt className="font-medium text-ink mb-1">{faq.pergunta}</dt>
                      <dd className="text-muted text-sm leading-relaxed">{faq.resposta}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="border border-stone rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-ink mb-1">Tenho interesse</h3>
              <p className="text-sm text-muted mb-5">
                Fale com um especialista Admirata sobre este lançamento.
              </p>
              <a
                href={`https://wa.me/5521998079459?text=${encodeURIComponent(`Olá! Tenho interesse no lançamento ${lanc.titulo}. Poderia me enviar mais informações?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold/90 transition-colors mb-3"
              >
                WhatsApp Rio de Janeiro
              </a>
              <a
                href={`https://wa.me/5554992643070?text=${encodeURIComponent(`Olá! Tenho interesse no lançamento ${lanc.titulo}. Poderia me enviar mais informações?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold text-gold font-medium hover:bg-gold/5 transition-colors"
              >
                WhatsApp Serra Gaúcha
              </a>

              {/* Detalhes rápidos */}
              <div className="mt-6 pt-6 border-t border-stone space-y-3">
                {lanc.construtora && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Construtora</span>
                    <span className="text-ink font-medium">{lanc.construtora}</span>
                  </div>
                )}
                {statusLabel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Status</span>
                    <span className="text-ink font-medium">{statusLabel}</span>
                  </div>
                )}
                {lanc.dataEntregaPrevista && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Entrega prevista</span>
                    <span className="text-ink font-medium">
                      {new Date(lanc.dataEntregaPrevista).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {lanc.bairro && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Bairro</span>
                    <Link href={`/imoveis/${lanc.bairro.slug.current}`} className="text-gold hover:underline font-medium">
                      {lanc.bairro.nome}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
