/**
 * Feature: Condominios
 */

export type {
  CondominioCard,
  CondominioDetalhe,
  CondominioResumido,
  CondominioTipo,
  CondominioCardProps,
} from './types'

export {
  CONDOMINIO_TIPOS,
  CONDOMINIOS_POR_PAGINA,
  CONDOMINIOS_DESTAQUE_LIMITE,
  CACHE_TAG_CONDOMINIOS,
  CACHE_TAG_CONDOMINIO,
} from './constants'

export {
  getCondominiosDestaque,
  getCondominioPorSlug,
  getCondominioPorBairro,
  getCondominiosPorBairro,
  getCondominiosSlugsHierarquia,
  getTipologiasSlugs,
} from './services'
