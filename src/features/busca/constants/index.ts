/**
 * Constantes do domínio Busca.
 */

import type { FiltrosBusca, OpcaoOrdenacao } from '../types'

export const FILTROS_PADRAO: FiltrosBusca = {
  tipo:        '',
  mercado:     '',
  finalidade:  '',
  bairroSlug:  '',
  precoMin:    0,
  precoMax:    0,
  quartos:     0,
  novidade:    false,
  exclusivo:   false,
}

export const OPCOES_ORDENACAO: OpcaoOrdenacao[] = [
  { value: 'recentes',    label: 'Mais recentes' },
  { value: 'preco-asc',   label: 'Menor preço' },
  { value: 'preco-desc',  label: 'Maior preço' },
  { value: 'area-desc',   label: 'Maior área' },
]

export const BUSCA_LIMITE_PADRAO = 24
export const BUSCA_OFFSET_PADRAO = 0

/** Faixas de preço sugeridas para filtro */
export const FAIXAS_PRECO = [
  { label: 'Até R$ 500k',         min: 0,          max: 500_000 },
  { label: 'R$ 500k – R$ 1M',     min: 500_000,    max: 1_000_000 },
  { label: 'R$ 1M – R$ 2M',       min: 1_000_000,  max: 2_000_000 },
  { label: 'R$ 2M – R$ 5M',       min: 2_000_000,  max: 5_000_000 },
  { label: 'Acima de R$ 5M',      min: 5_000_000,  max: 0 },
] as const
