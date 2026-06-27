/**
 * Tipos da feature Floorplans (Plantas baixas).
 */

import type { SanityImageFile } from '@/features/shared/types'

export interface Ambiente {
  nome: string
  tipo: string
  area?: number
  /** Coordenada X do label no mapa da planta (%) */
  x?: number
  /** Coordenada Y do label no mapa da planta (%) */
  y?: number
}

export interface Planta {
  arquivo: SanityImageFile
  titulo?: string
  ambientes?: Ambiente[]
}

export interface FloorplansProps {
  plantas: Planta[]
  className?: string
}

/** Estado do viewer de planta */
export interface PlantaViewerState {
  activePlanta: number
  zoom: number
  showAmbientes: boolean
}
