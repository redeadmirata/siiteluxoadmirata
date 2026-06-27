/**
 * Tipos do domínio Lançamentos.
 */

import type { BairroRef, FAQ } from '@/features/shared/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type StatusObra = 'na-planta' | 'em-obras' | 'pronto' | 'breve' | 'entregue'

// ─── Sub-tipos ────────────────────────────────────────────────────────────────

/** imagemCapa de lançamento vem flat (sem wrapper arquivo) */
export interface LancamentoImagem {
  asset?: {
    _id?: string
    url: string
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } }
  }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ─── Modelos ──────────────────────────────────────────────────────────────────

export interface LancamentoCard {
  _id: string
  titulo: string
  slug: { current: string }
  statusObra?: StatusObra
  precoAPartirDe?: number
  destaque?: boolean
  bairro?: BairroRef
  construtora?: string
  imagemCapa?: LancamentoImagem
}

export interface LancamentoDetalhe extends LancamentoCard {
  precoAte?: number
  descricao?: string
  diferenciais?: string[]
  dataEntregaPrevista?: string
  galeria?: LancamentoImagem[]
  plantas?: Array<LancamentoImagem & { titulo?: string }>
  faqs?: FAQ[]
  metaTitle?: string
  metaDescription?: string
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface LancamentoCardProps {
  lancamento: LancamentoCard
  className?: string
}
