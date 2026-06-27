/**
 * Tipos da feature Location (mapa e proximidades).
 */

export interface Coordenadas {
  lat: number
  lng: number
}

export type CategoriaPOI =
  | 'escola'
  | 'saude'
  | 'comercio'
  | 'transporte'
  | 'lazer'
  | 'gastronomia'
  | 'praia'
  | 'outro'

export interface PontoDeInteresse {
  nome: string
  categoria: CategoriaPOI
  lat: number
  lng: number
  distanciaMetros?: number
}

export interface LocationData {
  endereco?: string
  coordenadas?: Coordenadas
  pontosDeInteresse?: PontoDeInteresse[]
  bairroNome?: string
  cidadeNome?: string
}

export interface LocationProps {
  data: LocationData
  className?: string
  /** Mostrar mapa interativo ou só endereço */
  showMap?: boolean
}
