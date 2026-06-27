/**
 * Tipos primitivos do Sanity compartilhados entre todas as features.
 * Nunca importar tipos de domínio aqui — ficam em cada feature.
 */

export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    lqip: string
    dimensions: { width: number; height: number; aspectRatio: number }
  }
}

export interface SanityImageFile {
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

export interface GaleriaItem {
  asset: SanityImageAsset
  alt?: string
  legenda?: string
}

/** Referência mínima de bairro usada dentro de outros documentos */
export interface BairroRef {
  _id: string
  nome: string
  slug: { current: string }
  cidade: string
  estado: 'RJ' | 'RS'
  mercado: 'Rio de Janeiro' | 'Serra Gaúcha'
}

/** FAQ reutilizado em múltiplos tipos */
export interface FAQ {
  pergunta: string
  resposta: string
}
