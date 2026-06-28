import { cache } from 'react'
import {
  CONDOMINIO_QUERY,
  CONDOMINIOS_SLUGS_QUERY,
  IMOVEIS_POR_CONDOMINIO_QUERY,
} from '@/sanity/queries'
import type { CondominioDetalhe, ImovelCard } from '@/types/sanity'
import { sanityFetch, sanityFetchArray } from './sanity'

const REVALIDATE_SECONDS = 3600

export const getCondominioSlugs = cache(async () =>
  sanityFetchArray<{ slug: string }>(CONDOMINIOS_SLUGS_QUERY, undefined, {
    revalidate: REVALIDATE_SECONDS,
    tags: ['condominio'],
  })
)

export const getCondominioBySlug = cache(async (slug: string) =>
  sanityFetch<CondominioDetalhe>(
    CONDOMINIO_QUERY,
    { slug },
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ['condominio', `condominio:${slug}`],
    }
  )
)

export const getImoveisByCondominioSlug = cache(async (slug: string) =>
  sanityFetchArray<ImovelCard>(
    IMOVEIS_POR_CONDOMINIO_QUERY,
    { condSlug: slug },
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ['imovel', `condominio:${slug}`],
    }
  )
)

export async function getCondominioPageData(slug: string) {
  const [condominio, imoveis] = await Promise.all([
    getCondominioBySlug(slug),
    getImoveisByCondominioSlug(slug),
  ])

  return { condominio, imoveis }
}
