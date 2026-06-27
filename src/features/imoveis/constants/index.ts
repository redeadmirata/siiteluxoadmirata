/**
 * Constantes do domínio Imóvel.
 * Valores agnósticos de framework — podem ser usados em server e client.
 */

import type { ImovelStatus, ImovelCondicao, ImovelTipo, ImovelFinalidade } from '../types'

// ─── Status ───────────────────────────────────────────────────────────────────

export const IMOVEL_STATUS: Record<ImovelStatus, { label: string; cor: string }> = {
  'Disponível':     { label: 'Disponível',     cor: 'emerald' },
  'Vendido':        { label: 'Vendido',         cor: 'red' },
  'Locado':         { label: 'Locado',          cor: 'blue' },
  'Em negociação':  { label: 'Em negociação',   cor: 'amber' },
} as const

// ─── Condição ─────────────────────────────────────────────────────────────────

export const IMOVEL_CONDICAO: Record<ImovelCondicao, { label: string; badge: string }> = {
  'pronto':              { label: 'Pronto para morar',       badge: 'Pronto' },
  'lancamento':          { label: 'Lançamento',               badge: 'Lançamento' },
  'em-obras':            { label: 'Em obras',                 badge: 'Em obras' },
  'obra-administracao':  { label: 'Obra por administração',   badge: 'Sem banco · Sem juros' },
} as const

// ─── Tipos de imóvel ──────────────────────────────────────────────────────────

export const IMOVEL_TIPOS: ImovelTipo[] = [
  'Apartamento',
  'Cobertura',
  'Cobertura duplex',
  'Penthouse',
  'Casa',
  'Casa em condomínio',
  'Terreno',
]

// ─── Finalidades ──────────────────────────────────────────────────────────────

export const IMOVEL_FINALIDADES: Record<
  ImovelFinalidade,
  { slug: string; label: string; labelCurto: string; href: string }
> = {
  'Venda':    { slug: 'venda',    label: 'À venda',       labelCurto: 'Venda',    href: '/imoveis/venda' },
  'Locação':  { slug: 'locacao',  label: 'Para alugar',   labelCurto: 'Locação',  href: '/imoveis/locacao' },
  'Temporada':{ slug: 'temporada',label: 'Por temporada', labelCurto: 'Temporada',href: '/imoveis/temporada' },
} as const

// ─── Tipologias ───────────────────────────────────────────────────────────────

export interface Tipologia {
  slug: string
  label: string
  labelPlural: string
  descricao?: string
}

export const TIPOLOGIAS: Tipologia[] = [
  { slug: '1-quarto',  label: '1 quarto',   labelPlural: '1 quarto' },
  { slug: '2-quartos', label: '2 quartos',  labelPlural: '2 quartos' },
  { slug: '3-quartos', label: '3 quartos',  labelPlural: '3 quartos' },
  { slug: '4-quartos', label: '4 quartos',  labelPlural: '4+ quartos' },
  { slug: 'cobertura', label: 'Cobertura',  labelPlural: 'Coberturas', descricao: 'Apartamentos no último andar com terraço privativo' },
  { slug: 'garden',    label: 'Garden',     labelPlural: 'Gardens',    descricao: 'Unidades no térreo com área verde privativa' },
  { slug: 'duplex',    label: 'Duplex',     labelPlural: 'Duplexes' },
  { slug: 'penthouse', label: 'Penthouse',  labelPlural: 'Penthouses' },
  { slug: 'studio',    label: 'Studio',     labelPlural: 'Studios' },
  { slug: 'casa',      label: 'Casa',       labelPlural: 'Casas' },
]

/** Retorna tipologia pelo slug */
export function getTipologia(slug: string): Tipologia | undefined {
  return TIPOLOGIAS.find((t) => t.slug === slug)
}

// ─── Defaults de paginação ────────────────────────────────────────────────────

export const IMOVEIS_POR_PAGINA = 24
export const IMOVEIS_DESTAQUE_LIMITE = 6
