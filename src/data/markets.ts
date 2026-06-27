/**
 * Mercados imobiliários — Admirata
 * Configurações estáticas por mercado.
 */

import type { PropertyMarket } from '@/types'

export interface MarketConfig {
  slug: string
  name: PropertyMarket
  shortName: string
  /** Estado(s) cobertos */
  states: string[]
  /** Cidades principais */
  cities: string[]
  /** WhatsApp da equipe local */
  whatsapp?: string
  /** Slug da página de listagem */
  listingPath: string
  /** URL canônica de mercado */
  canonicalPath: string
}

export const markets: MarketConfig[] = [
  {
    slug: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    shortName: 'Rio',
    states: ['RJ'],
    cities: ['Rio de Janeiro'],
    whatsapp: '21998079459',
    listingPath: '/imoveis',
    canonicalPath: '/rio-de-janeiro',
  },
  {
    slug: 'serra-gaucha',
    name: 'Serra Gaúcha',
    shortName: 'Serra Gaúcha',
    states: ['RS'],
    cities: ['Gramado', 'Canela', 'Nova Petrópolis', 'Caxias do Sul'],
    whatsapp: '54999999999',
    listingPath: '/imoveis',
    canonicalPath: '/serra-gaucha',
  },
]

export function getMarket(slug: string): MarketConfig | undefined {
  return markets.find((m) => m.slug === slug)
}

export function getMarketByName(name: PropertyMarket): MarketConfig | undefined {
  return markets.find((m) => m.name === name)
}
