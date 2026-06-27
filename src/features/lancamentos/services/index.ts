import { sanityFetch, sanityFetchArray } from '@/services/sanity'
import type { LancamentoCard, LancamentoDetalhe } from '../types'
import { LANCAMENTOS_LISTING_QUERY, LANCAMENTO_DETALHE_QUERY, LANCAMENTOS_SLUGS_QUERY } from './queries'

export async function getLancamentos(): Promise<LancamentoCard[]> {
  return sanityFetchArray<LancamentoCard>(
    LANCAMENTOS_LISTING_QUERY,
    {},
    { revalidate: 3600, tags: ['lancamento'] },
  )
}

export async function getLancamento(slug: string): Promise<LancamentoDetalhe | null> {
  return sanityFetch<LancamentoDetalhe>(
    LANCAMENTO_DETALHE_QUERY,
    { slug },
    { revalidate: 3600, tags: [`lancamento:${slug}`] },
  )
}

export async function getLancamentosSlugs(): Promise<Array<{ slug: string }>> {
  return sanityFetchArray(LANCAMENTOS_SLUGS_QUERY, {}, { revalidate: 3600 })
}
