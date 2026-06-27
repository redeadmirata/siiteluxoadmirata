/**
 * Feature: Amenities (Características e diferenciais)
 */

export type {
  Caracteristica,
  GrupoCaracteristica,
  CaracteristicaGrupo,
  EspecTecnica,
  FichaTecnicaProps,
  AmenidadeCondominio,
  AmenitiesCondominioProps,
} from './types'

export {
  GRUPOS_ORDEM,
  GRUPO_ICONE,
  CARACTERISTICA_BULLET_CLASS,
} from './constants'

export { useCaracteristicas } from './hooks/useCaracteristicas'
