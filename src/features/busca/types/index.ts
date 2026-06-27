/**
 * Tipos do domínio Busca / Filtros.
 */

import type { ImovelFinalidade, ImovelMercado, ImovelTipo } from '@/features/imoveis/types'

// ─── Filtros ──────────────────────────────────────────────────────────────────

export interface FiltrosBusca {
  tipo: ImovelTipo | ''
  mercado: ImovelMercado | ''
  finalidade: ImovelFinalidade | ''
  bairroSlug: string
  precoMin: number
  precoMax: number
  quartos: number
  novidade: boolean
  exclusivo: boolean
}

/** Parâmetros de URL para a busca paginada */
export interface BuscaParams extends Partial<FiltrosBusca> {
  offset?: number
  limit?: number
}

/** Resultado de uma busca paginada */
export interface BuscaResultado<T> {
  items: T[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}

// ─── Ordenação ────────────────────────────────────────────────────────────────

export type OrdenacaoBusca =
  | 'recentes'
  | 'preco-asc'
  | 'preco-desc'
  | 'area-desc'

export interface OpcaoOrdenacao {
  value: OrdenacaoBusca
  label: string
}
