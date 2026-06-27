/**
 * Tipos do domínio Bairro.
 */

import type { SanityImageFile, BairroRef, FAQ } from '@/features/shared/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type BairroRegiao = 'Centro' | 'Zona Sul' | 'Sudoeste' | 'Gramado' | 'Canela'
export type BairroZona = 'oeste' | 'sul' | 'centro'

// ─── Re-export para quem só precisa de BairroRef ─────────────────────────────
export type { BairroRef }

// ─── Modelos ──────────────────────────────────────────────────────────────────

export interface Bairro extends BairroRef {
  regiao?: BairroRegiao
  ordem: number
  fotoCapa?: SanityImageFile
  fotoAerea?: SanityImageFile
  descricao?: string
  geo?: { lat: number; lng: number }
  pontosDeInteresse?: Array<{
    nome: string
    categoria: string
    lat: number
    lng: number
  }>
  totalImoveis: number
}

/** Bairro com campos SEO e marketing */
export interface BairroFull extends Bairro {
  zona?: BairroZona
  introTexto?: string
  porQueMorar?: unknown[]
  caracteristicas?: string[]
  faixaPreco?: { min?: number; max?: number; tipoPredominante?: string }
  faqs?: FAQ[]
  bairrosProximos?: Array<{ _id: string; nome: string; slug: { current: string } }>
  destaque?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset?: { url: string } }
}

/** Bairro Planejado — estende BairroFull com condominios embutidos */
export interface BairroPlaneado extends BairroFull {
  incorporadora?: string
  areaTotal?: number
  anoInauguracao?: number
  amenidades?: string[]
  // condominios importados em runtime para evitar circular dependency
  condominios?: unknown[]
  totalCondominios?: number
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface BairroCardProps {
  bairro: Pick<Bairro, '_id' | 'nome' | 'slug' | 'fotoCapa' | 'totalImoveis'>
  className?: string
}
