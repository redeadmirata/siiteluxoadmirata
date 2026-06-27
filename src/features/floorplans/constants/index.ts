/**
 * Constantes da feature Floorplans.
 */

export const PLANTA_ZOOM_MIN = 1
export const PLANTA_ZOOM_MAX = 4
export const PLANTA_ZOOM_STEP = 0.5

/** Tamanho do label de ambiente em px */
export const AMBIENTE_LABEL_SIZE = 28

/** Cores por tipo de ambiente */
export const AMBIENTE_CORES: Record<string, string> = {
  sala:       '#b8960c',
  quarto:     '#6366f1',
  suite:      '#8b5cf6',
  banheiro:   '#0ea5e9',
  cozinha:    '#f59e0b',
  varanda:    '#10b981',
  garagem:    '#64748b',
  default:    '#1a1a2e',
} as const
