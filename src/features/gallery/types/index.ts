/**
 * Tipos da feature Gallery.
 */

import type { SanityImageFile } from '@/features/shared/types'

export type GalleryLayout = 'grid' | 'slider' | 'masonry' | 'strip'
export type GalleryAspect = '16/9' | '4/3' | '1/1' | 'auto'

export interface GalleryImage {
  src: string
  alt?: string
  lqip?: string
  width?: number
  height?: number
  principal?: boolean
  isStaging?: boolean
  tour360?: boolean
  urlMatterport?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  layout?: GalleryLayout
  aspect?: GalleryAspect
  /** Exibir botão de tour 360 se imagem tiver urlMatterport */
  showTour360?: boolean
  /** Exibir badge de staging */
  showStaging?: boolean
  className?: string
}

/** Converte SanityImageFile em GalleryImage */
export function toGalleryImage(file: SanityImageFile & {
  principal?: boolean
  tour360?: boolean
  urlMatterport?: string
  isStaging?: boolean
}): GalleryImage {
  return {
    src: file.asset?.url ?? '',
    alt: file.alt,
    lqip: file.asset?.metadata?.lqip,
    width: file.asset?.metadata?.dimensions?.width,
    height: file.asset?.metadata?.dimensions?.height,
    principal: file.principal,
    isStaging: file.isStaging,
    tour360: file.tour360,
    urlMatterport: file.urlMatterport,
  }
}
