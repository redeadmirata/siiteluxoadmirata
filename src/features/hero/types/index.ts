/**
 * Tipos da feature Hero.
 * Usada em PDI de imóvel, PDI de condomínio e Home.
 */

import type { SanityImageFile } from '@/features/shared/types'

// ─── Variantes ────────────────────────────────────────────────────────────────

export type HeroVariant =
  | 'cinematico'   // Full-screen com GSAP scroll — PDI
  | 'condominio'   // Banner com galeria inline — PDI condomínio
  | 'bairro'       // Hero com vídeo de fundo — landing bairro
  | 'home'         // Hero com busca embutida — homepage

export type HeroMediaType = 'image' | 'video' | 'slider'

// ─── Dados ────────────────────────────────────────────────────────────────────

export interface HeroMedia {
  type: HeroMediaType
  imagem?: SanityImageFile
  videoUrl?: string
  /** Fallback quando vídeo não carrega */
  imagemFallback?: SanityImageFile
}

export interface HeroData {
  titulo: string
  subtitulo?: string
  media: HeroMedia | HeroMedia[]
  badge?: string
  /** Scroll automático para a próxima seção */
  scrollTarget?: string
}

// ─── Props de componente ──────────────────────────────────────────────────────

export interface HeroProps {
  data: HeroData
  variant?: HeroVariant
  priority?: boolean
  className?: string
}

/** Props específicas do HeroCinematico — GSAP full-screen */
export interface HeroCinematicoProps {
  titulo: string
  imagens: SanityImageFile[]
  badge?: string
  className?: string
}
