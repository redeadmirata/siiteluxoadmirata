/**
 * Constantes do domínio Lançamentos.
 */

import type { StatusObra } from '../types'

export const STATUS_OBRA: Record<StatusObra, { label: string; cor: string }> = {
  'na-planta': { label: 'Na planta',    cor: 'violet' },
  'em-obras':  { label: 'Em obras',     cor: 'amber' },
  'pronto':    { label: 'Pronto',       cor: 'emerald' },
  'breve':     { label: 'Em breve',     cor: 'blue' },
  'entregue':  { label: 'Entregue',     cor: 'stone' },
} as const

export const LANCAMENTOS_POR_PAGINA = 24
export const CACHE_TAG_LANCAMENTOS = 'lancamento'
