/**
 * Metadados estáticos dos bairros da Admirata.
 * Complementa os dados dinâmicos do Sanity com informações que raramente mudam.
 */

export interface BairroMeta {
  slug: string
  nome: string
  cidade: string
  uf: 'RJ' | 'RS'
  /** Zona geográfica */
  zona?: 'Zona Sul' | 'Barra' | 'Zona Oeste' | 'Grande Tijuca' | 'Niterói' | 'Gramado' | 'Jacarepaguá'
  /** Ordem de exibição nos filtros */
  ordem?: number
  /** Coordenadas para mapa */
  geo?: { lat: number; lng: number }
}

export const BAIRROS_META: BairroMeta[] = [
  // ── Barra e Zona Oeste ─────────────────────────────────────────────────────
  {
    slug: 'barra-da-tijuca',
    nome: 'Barra da Tijuca',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Barra',
    ordem: 1,
    geo: { lat: -23.0117, lng: -43.3650 },
  },
  {
    slug: 'recreio-dos-bandeirantes',
    nome: 'Recreio dos Bandeirantes',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Zona Oeste',
    ordem: 2,
    geo: { lat: -23.0180, lng: -43.4715 },
  },
  {
    slug: 'ilha-pura',
    nome: 'Ilha Pura',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Barra',
    ordem: 3,
    geo: { lat: -23.0200, lng: -43.3900 },
  },
  {
    slug: 'camorim',
    nome: 'Camorim',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Jacarepaguá',
    ordem: 4,
    geo: { lat: -22.9872, lng: -43.4219 },
  },
  {
    slug: 'jacarepagua',
    nome: 'Jacarepaguá',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Jacarepaguá',
    ordem: 5,
    geo: { lat: -22.9642, lng: -43.3603 },
  },
  // ── Zona Sul ──────────────────────────────────────────────────────────────
  {
    slug: 'leblon',
    nome: 'Leblon',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Zona Sul',
    ordem: 10,
    geo: { lat: -22.9844, lng: -43.2250 },
  },
  {
    slug: 'ipanema',
    nome: 'Ipanema',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Zona Sul',
    ordem: 11,
    geo: { lat: -22.9837, lng: -43.2001 },
  },
  {
    slug: 'copacabana',
    nome: 'Copacabana',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Zona Sul',
    ordem: 12,
    geo: { lat: -22.9713, lng: -43.1872 },
  },
  {
    slug: 'sao-conrado',
    nome: 'São Conrado',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    zona: 'Zona Sul',
    ordem: 13,
    geo: { lat: -22.9949, lng: -43.2624 },
  },
  // ── Gramado ───────────────────────────────────────────────────────────────
  {
    slug: 'gramado',
    nome: 'Gramado',
    cidade: 'Gramado',
    uf: 'RS',
    zona: 'Gramado',
    ordem: 20,
    geo: { lat: -29.3789, lng: -50.8760 },
  },
]

/** Busca metadados de um bairro pelo slug */
export function getBairroMeta(slug: string): BairroMeta | undefined {
  return BAIRROS_META.find((b) => b.slug === slug)
}

/** Filtra bairros por cidade */
export function getBairrosPorCidade(cidade: string): BairroMeta[] {
  return BAIRROS_META.filter((b) => b.cidade === cidade)
}

/** Retorna bairros ordenados para exibição nos filtros */
export function getBairrosOrdenados(): BairroMeta[] {
  return [...BAIRROS_META].sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))
}
