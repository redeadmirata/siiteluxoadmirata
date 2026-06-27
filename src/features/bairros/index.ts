/**
 * Feature: Bairros
 */

export type {
  Bairro,
  BairroFull,
  BairroPlaneado,
  BairroRegiao,
  BairroZona,
  BairroRef,
  BairroCardProps,
} from './types'

export {
  BAIRROS_POR_PAGINA,
  CACHE_TAG_BAIRROS,
  CACHE_TAG_BAIRRO,
  MERCADOS,
} from './constants'

export {
  getBairros,
  getBairro,
  getBairroMinimal,
  getBairrosPlanejados,
  getBairroPlaneado,
  getBairrosSlugs,
  getBairrosPlanejadosSlugs,
} from './services'
