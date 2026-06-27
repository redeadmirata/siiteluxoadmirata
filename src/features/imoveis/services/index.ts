/**
 * Serviços do domínio Imóvel — funções de fetch tipadas.
 * Usar apenas em Server Components e Route Handlers.
 */

import { sanityFetch, sanityFetchArray } from '@/services/sanity'
import type { ImovelCard, ImovelPDI } from '../types'
import {
  IMOVEL_PDI_QUERY,
  IMOVEIS_CARD_QUERY,
  IMOVEIS_DESTAQUE_QUERY,
  IMOVEIS_POR_BAIRRO_QUERY,
  IMOVEIS_POR_CONDOMINIO_QUERY,
  IMOVEIS_POR_TIPOLOGIA_QUERY,
  IMOVEIS_SLUGS_QUERY,
} from './queries'
import { IMOVEIS_POR_PAGINA, IMOVEIS_DESTAQUE_LIMITE } from '../constants'

// ─── PDI ─────────────────────────────────────────────────────────────────────

export async function getImovelPDI(slug: string): Promise<ImovelPDI | null> {
  return sanityFetch<ImovelPDI>(IMOVEL_PDI_QUERY, { slug }, { revalidate: 30, tags: [`imovel:${slug}`] })
}

// ─── Listagens ────────────────────────────────────────────────────────────────

export async function getImoveisCard(): Promise<ImovelCard[]> {
  return sanityFetchArray<ImovelCard>(IMOVEIS_CARD_QUERY, {}, { revalidate: 60, tags: ['imovel'] })
}

export async function getImoveisDestaque(): Promise<ImovelCard[]> {
  return sanityFetchArray<ImovelCard>(
    IMOVEIS_DESTAQUE_QUERY,
    {},
    { revalidate: 120, tags: ['imovel'] },
  )
}

export async function getImoveisPorBairro(
  bairroSlug: string,
  limit = IMOVEIS_POR_PAGINA,
): Promise<ImovelCard[]> {
  return sanityFetchArray<ImovelCard>(
    IMOVEIS_POR_BAIRRO_QUERY,
    { bairroSlug, limit },
    { revalidate: 60, tags: [`imovel`, `bairro:${bairroSlug}`] },
  )
}

export async function getImoveisPorCondominio(condSlug: string): Promise<ImovelCard[]> {
  return sanityFetchArray<ImovelCard>(
    IMOVEIS_POR_CONDOMINIO_QUERY,
    { condSlug },
    { revalidate: 60, tags: [`imovel`, `condominio:${condSlug}`] },
  )
}

export async function getImoveisPorTipologia(
  condSlug: string,
  tipologia: string,
): Promise<ImovelCard[]> {
  return sanityFetchArray<ImovelCard>(
    IMOVEIS_POR_TIPOLOGIA_QUERY,
    { condSlug, tipologia },
    { revalidate: 60, tags: [`imovel`, `condominio:${condSlug}`] },
  )
}

// ─── Slugs (generateStaticParams + sitemap) ───────────────────────────────────

export async function getImoveisSlugs(): Promise<Array<{ slug: string; _updatedAt: string }>> {
  return sanityFetchArray(IMOVEIS_SLUGS_QUERY, {}, { revalidate: 3600 })
}
