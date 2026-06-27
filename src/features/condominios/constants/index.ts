/**
 * Constantes do domínio Condomínio.
 */

import type { CondominioTipo } from '../types'

export const CONDOMINIO_TIPOS: Record<CondominioTipo, string> = {
  'condominio-fechado': 'Condomínio fechado',
  'bairro-planejado':   'Bairro planejado',
  'vertical':           'Vertical',
  'resort':             'Resort',
} as const

export const CONDOMINIOS_POR_PAGINA = 24
export const CONDOMINIOS_DESTAQUE_LIMITE = 6

/** Tags de cache para invalidação via webhook Sanity */
export const CACHE_TAG_CONDOMINIOS = 'condominio'
export const CACHE_TAG_CONDOMINIO = (slug: string) => `condominio:${slug}`
