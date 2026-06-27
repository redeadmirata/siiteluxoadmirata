import { client } from '@/sanity/client'

/**
 * Wrapper tipado sobre o Sanity client com tratamento de erro consistente.
 * Usar esta camada em server components — não o client diretamente.
 */

interface FetchOptions {
  /** Tempo de revalidação em segundos (padrão: 60) */
  revalidate?: number
  /** Tags de cache para invalidação granular via webhook */
  tags?: string[]
}

/**
 * Busca documentos no Sanity com revalidação configurável.
 * Retorna null em vez de lançar exceção, para evitar crash de página.
 *
 * @example
 * const imovel = await sanityFetch<ImovelPDI>(IMOVEL_PDI_QUERY, { slug }, { revalidate: 30 })
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options: FetchOptions = {},
): Promise<T | null> {
  const { revalidate = 60, tags } = options

  try {
    const result = await client.fetch<T>(query, params ?? {}, {
      next: {
        revalidate,
        ...(tags?.length ? { tags } : {}),
      },
    })
    return result ?? null
  } catch (err) {
    console.error('[Sanity] Erro ao buscar dados:', err)
    return null
  }
}

/**
 * Variante que retorna array vazio em vez de null (para listas).
 *
 * @example
 * const imoveis = await sanityFetchArray<ImovelCard[]>(IMOVEIS_QUERY)
 */
export async function sanityFetchArray<T>(
  query: string,
  params?: Record<string, unknown>,
  options: FetchOptions = {},
): Promise<T[]> {
  const result = await sanityFetch<T[]>(query, params, options)
  return result ?? []
}
