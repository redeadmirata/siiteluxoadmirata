/**
 * Constantes da feature Amenities.
 */

import type { GrupoCaracteristica } from '../types'

/** Ordem de exibição dos grupos */
export const GRUPOS_ORDEM: GrupoCaracteristica[] = [
  'Diferenciais',
  'Vista',
  'Lazer',
  'Segurança',
  'Serviços',
  'Infraestrutura',
  'Acabamento',
]

/** Ícone SVG path ou emoji por grupo */
export const GRUPO_ICONE: Record<string, string> = {
  'Lazer':          '🏊',
  'Segurança':      '🔒',
  'Serviços':       '🛎️',
  'Infraestrutura': '🏗️',
  'Acabamento':     '✨',
  'Diferenciais':   '⭐',
  'Vista':          '🌅',
} as const

/** Bullet de característica no design Admirata: ponto dourado 4×4px */
export const CARACTERISTICA_BULLET_CLASS = 'w-1 h-1 rounded-full bg-gold flex-shrink-0 mt-[5px]'
