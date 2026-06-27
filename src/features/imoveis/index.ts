/**
 * Feature: Imóveis
 * Ponto de entrada único — importar de '@/features/imoveis'
 *
 * UI:        import { ImovelCard } from '@/features/imoveis'
 * Services:  import { getImovelPDI } from '@/features/imoveis'
 * Types:     import type { ImovelPDI } from '@/features/imoveis'
 * Constants: import { TIPOLOGIAS } from '@/features/imoveis'
 */

// Types
export type {
  ImovelCard,
  ImovelPDI,
  ImovelTipo,
  ImovelFinalidade,
  ImovelMercado,
  ImovelStatus,
  ImovelCondicao,
  ImovelTipologia,
  ImovelImagem,
  ImovelPlanta,
  ImovelCaracteristica,
  ImovelCardProps,
  ImovelPDIProps,
} from './types'

// Constants
export {
  IMOVEL_STATUS,
  IMOVEL_CONDICAO,
  IMOVEL_TIPOS,
  IMOVEL_FINALIDADES,
  TIPOLOGIAS,
  getTipologia,
  IMOVEIS_POR_PAGINA,
  IMOVEIS_DESTAQUE_LIMITE,
} from './constants'

// Services (server-only)
export {
  getImovelPDI,
  getImoveisCard,
  getImoveisDestaque,
  getImoveisPorBairro,
  getImoveisPorCondominio,
  getImoveisPorTipologia,
  getImoveisSlugs,
} from './services'

// Queries (para casos que precisam da string GROQ diretamente)
export {
  IMOVEL_PDI_QUERY,
  IMOVEIS_CARD_QUERY,
  IMOVEIS_DESTAQUE_QUERY,
  IMOVEIS_POR_BAIRRO_QUERY,
  IMOVEIS_POR_CONDOMINIO_QUERY,
  IMOVEIS_SLUGS_QUERY,
} from './services/queries'
