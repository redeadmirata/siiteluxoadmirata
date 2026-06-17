import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { IMOVEIS_FILTRADOS_QUERY } from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import FiltrosSearch from '@/components/busca/FiltrosSearch'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'imoveis' })
  return {
    title: t('title'),
    description: 'Imóveis de alto padrão no Rio de Janeiro e Serra Gaúcha. Coberturas, apartamentos, casas e penthouses exclusivos. Admirata Imóveis.',
    openGraph: {
      title: `${t('title')} | Admirata`,
      description: 'Explore nossa seleção exclusiva de imóveis de luxo no Rio de Janeiro e Serra Gaúcha.',
    },
  }
}

interface SearchParams {
  tipo?: string
  mercado?: string
  finalidade?: string
  bairroSlug?: string
  precoMin?: string
  precoMax?: string
  quartos?: string
}

interface PageProps {
  params: { locale: string }
  searchParams: SearchParams
}

export default async function ImoveisPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'imoveis' })

  const queryParams = {
    tipo: searchParams.tipo ?? '',
    mercado: searchParams.mercado ?? '',
    finalidade: searchParams.finalidade ?? '',
    bairroSlug: searchParams.bairroSlug ?? '',
    precoMin: Number(searchParams.precoMin ?? 0),
    precoMax: Number(searchParams.precoMax ?? 0),
    quartos: Number(searchParams.quartos ?? 0),
    offset: 0,
    end: 24,
  }

  const imoveis = await client.fetch<ImovelCard[]>(
    IMOVEIS_FILTRADOS_QUERY,
    queryParams,
    { next: { revalidate: 60 } }
  )

  const temFiltros =
    queryParams.tipo !== '' ||
    queryParams.mercado !== '' ||
    queryParams.quartos !== 0

  return (
    <main className="min-h-screen bg-white" id="main-content">
      {/* ── Header da página ── */}
      <div className="bg-ink pt-[72px] pb-14 sm:pb-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            Admirata Imóveis
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-white font-light leading-[1.08]">
            {t('title')}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-4">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        <FiltrosSearch totalResultados={imoveis.length} />

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {imoveis.map((imovel, i) => (
              <ImovelCardComponent
                key={imovel._id}
                imovel={imovel}
                priority={i < 6}
              />
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
              {temFiltros ? t('noMatch') : t('noFilters')}
            </p>
            <p className="text-sm text-muted max-w-sm">
              {temFiltros ? t('noMatchDesc') : t('noFiltersDesc')}
            </p>
            {temFiltros && (
              <a
                href={`${params.locale === 'pt-BR' ? '' : `/${params.locale}`}/imoveis`}
                className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all"
              >
                {t('viewAll')}
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
