import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  BAIRRO_QUERY,
  BAIRROS_SLUGS_QUERY,
  IMOVEIS_POR_BAIRRO_QUERY,
} from '@/sanity/queries'
import type { Bairro, ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import { routing } from '@/i18n/routing'

export const revalidate = 60

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
  const capaUrl = bairro.fotoCapa?.asset?.url
    ? `${bairro.fotoCapa.asset.url}?w=1200&h=630&fit=crop&q=80`
    : undefined

  return {
    title: `${bairro.nome}, ${bairro.cidade}`,
    description:
      bairro.descricao ??
      `Imóveis de alto padrão em ${bairro.nome}, ${bairro.cidade}. ${bairro.totalImoveis} ${bairro.totalImoveis === 1 ? 'imóvel disponível' : 'imóveis disponíveis'} com curadoria exclusiva da Admirata.`,
    openGraph: {
      title: `${bairro.nome}, ${bairro.cidade} | Admirata Imóveis`,
      description:
        bairro.descricao ??
        `Imóveis de luxo em ${bairro.nome} — curadoria exclusiva Admirata.`,
      ...(capaUrl && {
        images: [{ url: capaUrl, width: 1200, height: 630, alt: bairro.nome }],
      }),
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}/bairros/${params.slug}`,
      languages: {
        'pt-BR': `${siteUrl}/bairros/${params.slug}`,
        'en-US': `${siteUrl}/en/bairros/${params.slug}`,
        'fr-FR': `${siteUrl}/fr/bairros/${params.slug}`,
      },
    },
  }
}

export default async function BairroPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'bairros' })

  const [bairro, imoveis] = await Promise.all([
    client.fetch<Bairro | null>(
      BAIRRO_QUERY,
      { slug: params.slug },
      { next: { revalidate: 3600 } }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_POR_BAIRRO_QUERY,
      { bairroSlug: params.slug, limit: 24 },
      { next: { revalidate: 60 } }
    ),
  ])

  if (!bairro) notFound()

  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const capaUrl = bairro.fotoCapa?.asset?.url
    ? `${bairro.fotoCapa.asset.url}?w=1600&q=80&auto=format`
    : null
  const capaLqip = bairro.fotoCapa?.asset?.metadata?.lqip

  const aereoUrl = bairro.fotoAerea?.asset?.url
    ? `${bairro.fotoAerea.asset.url}?w=1200&q=75&auto=format`
    : null

  const whatsappText =
    params.locale === 'en'
      ? `Hello, I'm interested in properties in ${bairro.nome}`
      : params.locale === 'fr'
      ? `Bonjour, je suis intéressé par des biens à ${bairro.nome}`
      : `Olá, tenho interesse em imóveis no bairro ${bairro.nome}`

  const whatsappUrl = `https://wa.me/5521998079459?text=${encodeURIComponent(whatsappText)}`

  return (
    <main className="min-h-screen bg-white" id="main-content">
      {/* ── Hero ── */}
      <div className="relative h-[65vh] min-h-[420px] bg-ink overflow-hidden">
        {capaUrl ? (
          <Image
            src={capaUrl}
            alt={`Vista de ${bairro.nome}, ${bairro.cidade}`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
            placeholder={capaLqip ? 'blur' : 'empty'}
            blurDataURL={capaLqip}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/20" />

        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          className="absolute top-[84px] left-6 lg:left-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50"
        >
          <Link href={`${localePrefix}/`} className="hover:text-white transition-colors">
            {t('home')}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`${localePrefix}/bairros`} className="hover:text-white transition-colors">
            {t('breadcrumb')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">{bairro.nome}</span>
        </nav>

        <div className="absolute bottom-10 left-6 lg:left-10 right-6 lg:right-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">
            {bairro.cidade} · {bairro.estado} · {bairro.mercado}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-[1.05]">
            {bairro.nome}
          </h1>
          {bairro.totalImoveis > 0 && (
            <p className="text-sm text-white/50 mt-3">
              {bairro.totalImoveis === 1
                ? t('availableProperty')
                : t('availableProperties', { count: bairro.totalImoveis })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        {/* ── Descrição + foto aérea ── */}
        {(bairro.descricao || aereoUrl) && (
          <section className="py-16 border-b border-stone/40" aria-labelledby="sobre-heading">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
                  {t('about')}
                </p>
                <h2
                  id="sobre-heading"
                  className="font-display text-3xl sm:text-4xl text-ink font-light leading-snug mb-6"
                >
                  {bairro.nome}, {bairro.cidade}
                </h2>
                {bairro.descricao ? (
                  <p className="text-muted leading-relaxed text-sm max-w-lg">
                    {bairro.descricao}
                  </p>
                ) : (
                  <p className="text-muted text-sm leading-relaxed max-w-lg">
                    {params.locale === 'en'
                      ? 'Premium neighborhood with exclusive property curation by Admirata.'
                      : params.locale === 'fr'
                      ? 'Quartier de standing avec une sélection exclusive de biens par Admirata.'
                      : 'Região de alto padrão com curadoria exclusiva de imóveis selecionados pela Admirata Imóveis.'}
                  </p>
                )}

                <Link
                  href={`${localePrefix}/imoveis?bairroSlug=${bairro.slug.current}`}
                  className="inline-flex items-center gap-2 mt-8 text-xs uppercase tracking-[0.2em] text-gold border border-gold/30 px-5 py-3 hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                >
                  {t('viewAllProperties')}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {aereoUrl && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={aereoUrl}
                    alt={`Vista aérea de ${bairro.nome}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Pontos de interesse ── */}
        {bairro.pontosDeInteresse && bairro.pontosDeInteresse.length > 0 && (
          <section className="py-16 border-b border-stone/40" aria-labelledby="poi-heading">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
              {t('poiLabel')}
            </p>
            <h2
              id="poi-heading"
              className="font-display text-3xl text-ink font-light mb-8"
            >
              {t('poi')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bairro.pontosDeInteresse.map((poi, i) => (
                <div
                  key={i}
                  className="border border-stone/60 p-4 hover:border-gold/30 transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">
                    {poi.categoria}
                  </p>
                  <p className="text-sm text-ink font-medium">{poi.nome}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Imóveis do bairro ── */}
        <section className="py-16" aria-labelledby="imoveis-heading">
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">
                {t('curation')}
              </p>
              <h2
                id="imoveis-heading"
                className="font-display text-3xl sm:text-4xl text-ink font-light"
              >
                {t('propertiesIn', { neighborhood: bairro.nome })}
              </h2>
            </div>
            {imoveis.length > 0 && (
              <Link
                href={`${localePrefix}/imoveis?bairroSlug=${bairro.slug.current}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-gold hover:opacity-70 transition-opacity mt-1 flex-shrink-0"
              >
                {t('viewAll')} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          {imoveis.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-stone">
              <div
                className="font-display text-7xl text-ink/5 select-none mb-4"
                aria-hidden="true"
              >
                A
              </div>
              <p className="font-display text-xl text-muted">
                {t('comingSoon', { neighborhood: bairro.nome })}
              </p>
              <p className="text-xs text-muted mt-2">{t('contactForOpportunities')}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.2em] text-gold border border-gold/30 px-5 py-3 hover:bg-gold hover:text-white transition-all duration-300"
              >
                {t('talkToAgent')}
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {imoveis.map((imovel, i) => (
                  <ImovelCardComponent
                    key={imovel._id}
                    imovel={imovel}
                    priority={i < 3}
                  />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href={`${localePrefix}/imoveis?bairroSlug=${bairro.slug.current}`}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-gold border border-gold/30 px-6 py-3 hover:bg-gold hover:text-white transition-all duration-300"
                >
                  {t('viewAllProperties')} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ── CTA strip ── */}
        <section className="border-t border-stone/40 py-16 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-display text-2xl text-ink font-light">
                {t('interested', { neighborhood: bairro.nome })}
              </p>
              <p className="text-sm text-muted mt-1">{t('teamKnows')}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] bg-gold text-white px-8 py-4 hover:bg-[#a07a0a] transition-colors duration-300"
            >
              <span aria-hidden="true" className="text-sm">↗</span>
              {t('whatsapp')}
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
