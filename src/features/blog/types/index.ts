/**
 * Tipos do domínio Blog.
 */

import type { BairroRef } from '@/features/shared/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type BlogCategoria =
  | 'mercado-imobiliario'
  | 'decoracao'
  | 'financiamento'
  | 'bairros'
  | 'lifestyle'
  | 'dicas'

// ─── Modelos ──────────────────────────────────────────────────────────────────

export interface BlogPost {
  _id: string
  titulo: string
  slug: { current: string }
  categoria?: BlogCategoria
  resumo?: string
  publicadoEm?: string
  autor?: string
  conteudo?: unknown[]
  imagemCapa?: {
    asset?: { _id?: string; url: string; metadata?: { lqip?: string } }
    alt?: string
  }
  bairroRelacionado?: BairroRef
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { asset?: { url: string } }
  }
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface BlogCardProps {
  post: Pick<BlogPost, '_id' | 'titulo' | 'slug' | 'categoria' | 'resumo' | 'publicadoEm' | 'imagemCapa'>
  className?: string
}
