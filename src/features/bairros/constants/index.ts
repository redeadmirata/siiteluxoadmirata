/**
 * Constantes do domínio Bairro.
 */

export const BAIRROS_POR_PAGINA = 20

/** Tags de cache para invalidação via webhook Sanity */
export const CACHE_TAG_BAIRROS = 'bairro'
export const CACHE_TAG_BAIRRO = (slug: string) => `bairro:${slug}`

/** Mercados disponíveis */
export const MERCADOS = {
  RJ: { label: 'Rio de Janeiro', estados: ['RJ'] },
  RS: { label: 'Serra Gaúcha',   estados: ['RS'] },
} as const

export type MercadoKey = keyof typeof MERCADOS
