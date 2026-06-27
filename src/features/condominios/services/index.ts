/**
 * Serviços do domínio Condomínio.
 */

import { sanityFetch, sanityFetchArray } from '@/services/sanity'
import type { CondominioCard, CondominioDetalhe } from '../types'
import {
  CONDOMINIOS_DESTAQUE_QUERY,
  CONDOMINIOS_POR_BAIRRO_QUERY,
  CONDOMINIO_POR_BAIRRO_QUERY,
  CONDOMINIO_QUERY,
  CONDOMINIOS_SLUGS_HIERARQUIA_QUERY,
  TIPOLOGIAS_SLUGS_QUERY,
} from './queries'

export async function getCondominiosDestaque(): Promise<CondominioCard[]> {
  return sanityFetchArray<CondominioCard>(
    CONDOMINIOS_DESTAQUE_QUERY,
    {},
    { revalidate: 120, tags: ['condominio'] },
  )
}

export async function getCondominioPorSlug(slug: string): Promise<CondominioDetalhe | null> {
  return sanityFetch<CondominioDetalhe>(
    CONDOMINIO_QUERY,
    { slug },
    { revalidate: 60, tags: [`condominio:${slug}`] },
  )
}

export async function getCondominioPorBairro(
  bairroSlug: string,
  condSlug: string,
): Promise<CondominioDetalhe | null> {
  return sanityFetch<CondominioDetalhe>(
    CONDOMINIO_POR_BAIRRO_QUERY,
    { bairroSlug, condSlug },
    { revalidate: 60, tags: [`condominio:${condSlug}`, `bairro:${bairroSlug}`] },
  )
}

export async function getCondominiosPorBairro(bairroSlug: string): Promise<CondominioCard[]> {
  return sanityFetchArray<CondominioCard>(
    CONDOMINIOS_POR_BAIRRO_QUERY,
    { bairroSlug },
    { revalidate: 60, tags: [`bairro:${bairroSlug}`] },
  )
}

export async function getCondominiosSlugsHierarquia(): Promise<
  Array<{ bairroSlug: string; condSlug: string }>
> {
  return sanityFetchArray(CONDOMINIOS_SLUGS_HIERARQUIA_QUERY, {}, { revalidate: 3600 })
}

export async function getTipologiasSlugs(): Promise<
  Array<{ bairroSlug: string; condSlug: string; tipologias: string[] }>
> {
  return sanityFetchArray(TIPOLOGIAS_SLUGS_QUERY, {}, { revalidate: 3600 })
}
