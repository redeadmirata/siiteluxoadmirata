/**
 * Tipos do domínio Imóvel.
 * Máx. 300 linhas — UI types separados dos domain types quando necessário.
 */

import type { SanityImageFile, BairroRef } from '@/features/shared/types'

// ─── Enums / union types ──────────────────────────────────────────────────────

export type ImovelTipo =
  | 'Apartamento'
  | 'Cobertura'
  | 'Cobertura duplex'
  | 'Penthouse'
  | 'Casa'
  | 'Casa em condomínio'
  | 'Terreno'

export type ImovelFinalidade = 'Venda' | 'Locação' | 'Temporada'
export type ImovelMercado = 'Rio de Janeiro' | 'Serra Gaúcha'
export type ImovelStatus = 'Disponível' | 'Vendido' | 'Locado' | 'Em negociação'
export type ImovelCondicao = 'pronto' | 'lancamento' | 'em-obras' | 'obra-administracao'

export type ImovelTipologia =
  | '1-quarto'
  | '2-quartos'
  | '3-quartos'
  | '4-quartos'
  | 'cobertura'
  | 'penthouse'
  | 'casa'
  | 'terreno'

// ─── Sub-tipos ────────────────────────────────────────────────────────────────

export interface ImovelImagem {
  arquivo: SanityImageFile & {
    principal?: boolean
    tour360?: boolean
    urlMatterport?: string
    isStaging?: boolean
    stagingPar?: string
  }
}

export interface ImovelAmbiente {
  nome: string
  tipo: string
  area?: number
  x?: number
  y?: number
}

export interface ImovelPlanta {
  arquivo: SanityImageFile
  titulo?: string
  ambientes?: ImovelAmbiente[]
}

export interface ImovelCaracteristica {
  grupo: string
  nome: string
}

// ─── Modelos principais ───────────────────────────────────────────────────────

/** Card resumido — listagem, destaque, resultados de busca */
export interface ImovelCard {
  _id: string
  titulo: string
  slug: { current: string }
  tipo: ImovelTipo
  finalidade: ImovelFinalidade
  mercado: ImovelMercado
  status: ImovelStatus
  destaque?: boolean
  exclusivo?: boolean
  permuta?: boolean
  novidade?: boolean
  condicao?: ImovelCondicao
  preco?: number
  precoSobConsulta?: boolean
  areaUtil?: number
  quartos?: number
  suites?: number
  vagas?: number
  andar?: number
  tipologia?: ImovelTipologia
  bairro?: BairroRef
  condominionome?: string
  imagemCapa?: SanityImageFile
}

/** PDI completa — todos os campos */
export interface ImovelPDI extends ImovelCard {
  condominioRef?: { slug?: string; bairroSlug?: string }
  condominioNome?: string
  condominioAnoEntrega?: number
  condominio?: number
  iptu?: number
  areaTotal?: number
  banheiros?: number
  endereco?: string
  imagens?: ImovelImagem[]
  plantas?: ImovelPlanta[]
  caracteristicas?: ImovelCaracteristica[]
  tourVirtual?: string
  videoUrl?: string
  descricaoPtBr?: string
  descricaoEnUs?: string
  descricaoFrFr?: string
  seo?: { titulo?: string; descricao?: string }
  publicadoEm?: string
}

// ─── UI types ─────────────────────────────────────────────────────────────────

/** Props base para qualquer componente que recebe um card */
export interface ImovelCardProps {
  imovel: ImovelCard
  className?: string
  priority?: boolean
}

/** Props base para qualquer componente que recebe a PDI completa */
export interface ImovelPDIProps {
  imovel: ImovelPDI
  className?: string
}
