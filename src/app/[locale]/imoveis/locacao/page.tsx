/**
 * /imoveis/locacao
 * Faceted URL — finalidade 'Locação' fixada na rota
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { IMOVEIS_FILTRADOS_QUERY } from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import FiltrosSearch from '@/components/busca/FiltrosSearch'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  return {
    title: 'Imóveis para Alugar — Barra da Tijuca, Recreio e Leblon | Admirata',
    description:
      'Alugue coberturas, apartamentos e casas de luxo no Rio de Janeiro e Serra Gaúcha. Locação de alto padrão — Admirata Imóveis.',
    alternates: { canonical: `${siteUrl}/imoveis/locacao` },
    openGraph: {
      title: 'Imóveis para Alugar | Admirata',
      description: 'Locação de alto padrão no Rio de Janeiro e Serra Gaúcha.',
      type: 'website',
    },
  }
}

interface SearchParams {
  tipo?: string
  mercado?: string
  quartos?: string
}

interface PageProps {
  params: { locale: string }
  searchParams: SearchParams
}

export default async function ImoveisLocacaoPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)

  const imoveis = await client.fetch<ImovelCard[]>(
    IMOVEIS_FILTRADOS_QUERY,
    {
      finalidade: 'Locação',
      tipo: searchParams.tipo ?? '',
      mercado: searchParams.mercado ?? '',
      bairroSlug: '',
      precoMin: 0,
      precoMax: 0,
      quartos: Number(searchParams.quartos ?? 0),
      offset: 0,
      end: 24,
    },
    { next: { revalidate: 60 } }
  )

  return (
    <main className="min-h-screen bg-white" id="main-content">
      {/* ── Header ── */}
      <div className="bg-ink pt-[72px] pb-14 sm:pb-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            Admirata Imóveis
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-white font-light leading-[1.08]">
            Imóveis para Alugar
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-4">
            {imoveis.length > 0
              ? `${imoveis.length} imóveis disponíveis`
              : 'Portfólio exclusivo Rio de Janeiro · Serra Gaúcha'}
          </p>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        <FiltrosSearch totalResultados={imoveis.length} hideFinalidade />

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {imoveis.map((imovel, i) => (
              <ImovelCardComponent key={imovel._id} imovel={imovel} priority={i < 6} />
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
            <p className="font-display text-2xl text-muted mb-3">Nenhum imóvel encontrado</p>
            <p className="text-sm text-muted max-w-sm">
              Tente ajustar os filtros ou explore todo o portfólio.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
