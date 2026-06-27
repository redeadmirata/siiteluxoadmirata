/**
 * Definições estáticas de tipologias e finalidades de imóveis.
 * Usado em filtros, labels e SEO — consistente com os valores no Sanity.
 */

// ─── Tipologias (tipo de planta) ───────────────────────────────────────────────

export interface Tipologia {
  slug: string
  label: string
  labelPlural: string
  /** Descrição para SEO e filtros */
  descricao?: string
}

export const TIPOLOGIAS: Tipologia[] = [
  {
    slug: '1-quarto',
    label: '1 quarto',
    labelPlural: '1 quarto',
  },
  {
    slug: '2-quartos',
    label: '2 quartos',
    labelPlural: '2 quartos',
  },
  {
    slug: '3-quartos',
    label: '3 quartos',
    labelPlural: '3 quartos',
  },
  {
    slug: '4-quartos',
    label: '4 quartos',
    labelPlural: '4+ quartos',
  },
  {
    slug: 'cobertura',
    label: 'Cobertura',
    labelPlural: 'Coberturas',
    descricao: 'Apartamentos no último andar com terraço privativo',
  },
  {
    slug: 'garden',
    label: 'Garden',
    labelPlural: 'Gardens',
    descricao: 'Unidades no térreo com área verde privativa',
  },
  {
    slug: 'duplex',
    label: 'Duplex',
    labelPlural: 'Duplexes',
  },
  {
    slug: 'penthouse',
    label: 'Penthouse',
    labelPlural: 'Penthouses',
  },
  {
    slug: 'studio',
    label: 'Studio',
    labelPlural: 'Studios',
  },
  {
    slug: 'casa',
    label: 'Casa',
    labelPlural: 'Casas',
  },
] as const

// ─── Tipos de imóvel ──────────────────────────────────────────────────────────

export const TIPOS_IMOVEL = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Loft',
  'Studio',
  'Terreno',
  'Sala comercial',
  'Loja',
] as const

export type TipoImovel = (typeof TIPOS_IMOVEL)[number]

// ─── Finalidades ──────────────────────────────────────────────────────────────

export const FINALIDADES = {
  Venda: {
    slug: 'venda',
    label: 'À venda',
    labelCurto: 'Venda',
    href: '/imoveis/venda',
  },
  Locação: {
    slug: 'locacao',
    label: 'Para alugar',
    labelCurto: 'Locação',
    href: '/imoveis/locacao',
  },
  Temporada: {
    slug: 'temporada',
    label: 'Por temporada',
    labelCurto: 'Temporada',
    href: '/imoveis/temporada',
  },
} as const

export type Finalidade = keyof typeof FINALIDADES

// ─── Condição do imóvel ───────────────────────────────────────────────────────

export const CONDICOES = {
  pronto: {
    label: 'Pronto para morar',
    badge: 'Pronto',
  },
  lancamento: {
    label: 'Lançamento',
    badge: 'Lançamento',
  },
  'em-obras': {
    label: 'Em obras',
    badge: 'Em obras',
  },
  'obra-administracao': {
    label: 'Obra por administração',
    badge: 'Sem banco · Sem juros',
  },
} as const

export type Condicao = keyof typeof CONDICOES

/** Retorna tipologia pelo slug */
export function getTipologia(slug: string): Tipologia | undefined {
  return TIPOLOGIAS.find((t) => t.slug === slug)
}
