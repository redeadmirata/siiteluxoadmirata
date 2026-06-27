/**
 * Serviços do domínio Bairro.
 */

import { sanityFetch, sanityFetchArray } from '@/services/sanity'
import type { Bairro, BairroFull, BairroPlaneado } from '../types'
import {
  BAIRROS_QUERY,
  BAIRRO_QUERY,
  BAIRRO_MINIMAL_QUERY,
  BAIRROS_PLANEJADOS_QUERY,
  BAIRRO_PLANEJADO_QUERY,
  BAIRROS_SLUGS_QUERY,
  BAIRROS_PLANEJADOS_SLUGS_QUERY,
} from './queries'

export async function getBairros(): Promise<Bairro[]> {
  return sanityFetchArray<Bairro>(BAIRROS_QUERY, {}, { revalidate: 3600, tags: ['bairro'] })
}

export async function getBairro(slug: string): Promise<BairroFull | null> {
  return sanityFetch<BairroFull>(BAIRRO_QUERY, { slug }, { revalidate: 60, tags: [`bairro:${slug}`] })
}

export async function getBairroMinimal(slug: string) {
  return sanityFetch<Pick<BairroFull, '_id' | 'nome' | 'slug' | 'cidade' | 'estado' | 'mercado' | 'totalImoveis'>>(
    BAIRRO_MINIMAL_QUERY,
    { slug },
    { revalidate: 60, tags: [`bairro:${slug}`] },
  )
}

export async function getBairrosPlanejados(): Promise<BairroPlaneado[]> {
  return sanityFetchArray<BairroPlaneado>(
    BAIRROS_PLANEJADOS_QUERY,
    {},
    { revalidate: 3600, tags: ['bairro'] },
  )
}

export async function getBairroPlaneado(slug: string): Promise<BairroPlaneado | null> {
  return sanityFetch<BairroPlaneado>(
    BAIRRO_PLANEJADO_QUERY,
    { slug },
    { revalidate: 60, tags: [`bairro:${slug}`] },
  )
}

export async function getBairrosSlugs(): Promise<Array<{ slug: string; _updatedAt: string }>> {
  return sanityFetchArray(BAIRROS_SLUGS_QUERY, {}, { revalidate: 3600 })
}

export async function getBairrosPlanejadosSlugs(): Promise<Array<{ slug: string }>> {
  return sanityFetchArray(BAIRROS_PLANEJADOS_SLUGS_QUERY, {}, { revalidate: 3600 })
}
