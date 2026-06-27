/**
 * Constantes da feature Location.
 */

import type { CategoriaPOI } from '../types'

export const CATEGORIA_POI_LABELS: Record<CategoriaPOI, string> = {
  escola:       'Educação',
  saude:        'Saúde',
  comercio:     'Comércio',
  transporte:   'Transporte',
  lazer:        'Lazer',
  gastronomia:  'Gastronomia',
  praia:        'Praia',
  outro:        'Outro',
} as const

export const CATEGORIA_POI_ICONE: Record<CategoriaPOI, string> = {
  escola:       '🎓',
  saude:        '🏥',
  comercio:     '🛍️',
  transporte:   '🚇',
  lazer:        '🌳',
  gastronomia:  '🍽️',
  praia:        '🏖️',
  outro:        '📍',
} as const

export const MAP_DEFAULT_ZOOM = 15
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
