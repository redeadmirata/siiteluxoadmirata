import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { sanityFetch } from '@/sanity/client'
import { CONDOMINIOS_QUERY } from '@/sanity/queries'
import type { CondominioCard } from '@/types/sanity'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'condominios' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${siteUrl}${localePrefix}/condominios`,
      languages: {
        'pt-BR': `${siteUrl}/condominios`,
        'en-US': `${siteUrl}/en/condominios`,
        'fr-FR': `${siteUrl}/fr/condominios`,
      },
    },
    openGraph: {
      title: `${t('title')} | Admirata`,
      description: t('subtitle'),
      url: `${siteUrl}${localePrefix}/condominios`,
    },
  }
}

const TIPO_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': {
    'condominio-fechado': 'Condomínio Fechado',
    'bairro-planejado': 'Bairro Planejado',
    vertical: 'Vertical',
    resort: 'Resort / Club',
  },
  en: {
    'condominio-fechado': 'Gated Community',
    'bairro-planejado': 'Planned Neighbourhood',
    vertical: 'Vertical',
    resort: 'Resort / Club',
  },
  fr: {
    'condominio-fechado': 'Résidence Fermée',
    'bairro-planejado': 'Quartier Planifié',
    vertical: 'Vertical',
    resort: 'Resort / Club',
  },
}

export default async function CondominiosPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'condominios' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const tipoLabels = TIPO_LABELS[params.locale] ?? TIPO_LABELS['pt-BR']

  const condominios = await sanityFetch<CondominioCard[]>({
    query: CONDOMINIOS_QUERY,
    tags: ['condominio'],
  })

  const pageUrl = `${siteUrl}${localePrefix}/condominios`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Condomínios', item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `${t('title')} | Admirata Imóveis`,
        url: pageUrl,
        description: t('subtitle'),
        numberOfItems: condominios.length,
      },
    ],
  }

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Condomínios' },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <section className="pt-10 pb-16 px-6 max-w-screen-xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
          {t('label')}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight max-w-2xl">
          {t('title')}
        </h1>
        <div className="mt-4 w-12 h-px bg-gold" />
        <p className="mt-6 text-base text-muted max-w-xl leading-relaxed">
          {t('subtitle')}
        </p>
      </section>

      {/* ── Grid ── */}
      <section className="px-6 pb-24 max-w-screen-xl mx-auto">
        {condominios.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted text-sm">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {condominios.map((c) => (
              <CondominioCardItem
                key={c._id}
                cond={c}
                localePrefix={localePrefix}
                tipoLabels={tipoLabels}
                propertyLabel={t('property')}
                propertiesLabel={t('properties')}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function CondominioCardItem({
  cond,
  localePrefix,
  tipoLabels,
  propertyLabel,
  propertiesLabel,
}: {
  cond: CondominioCard
  localePrefix: string
  tipoLabels: Record<string, string>
  propertyLabel: string
  propertiesLabel: string
}) {
  const { nome, slug, tipo, descricao, bairro, fotoCapa, totalImoveis, infraestrutura } = cond

  return (
    <Link href={`${localePrefix}/condominios/${slug.current}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        {fotoCapa?.url ? (
          <Image
            src={fotoCapa.url}
            alt={nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-smooth"
            placeholder={fotoCapa.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={fotoCapa.metadata?.lqip}
          />
        ) : (
          <div className="w-full h-full bg-stone flex items-center justify-center">
            <span className="font-display text-4xl text-muted/30">{nome.charAt(0)}</span>
          </div>
        )}

        {tipo && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.14em] bg-white/92 backdrop-blur-sm text-ink px-2.5 py-1">
              {tipoLabels[tipo] ?? tipo}
            </span>
          </div>
        )}

        {totalImoveis > 0 && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.12em] bg-gold text-white px-2.5 py-1">
              {totalImoveis} {totalImoveis === 1 ? propertyLabel : propertiesLabel}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4">
        {bairro && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-1.5">
            {bairro.nome} · {bairro.cidade}
          </p>
        )}
        <h2 className="font-display text-xl text-ink leading-snug group-hover:text-gold transition-colors duration-200">
          {nome}
        </h2>
        {descricao && (
          <p className="mt-2 text-[13px] text-muted leading-relaxed line-clamp-2">
            {descricao}
          </p>
        )}
        {infraestrutura && infraestrutura.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {infraestrutura.slice(0, 3).map((item) => (
              <span
                key={item}
                className="text-[9px] uppercase tracking-wider border border-stone text-muted px-2 py-0.5"
              >
                {item}
              </span>
            ))}
            {infraestrutura.length > 3 && (
              <span className="text-[9px] uppercase tracking-wider text-gold px-2 py-0.5">
                +{infraestrutura.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
