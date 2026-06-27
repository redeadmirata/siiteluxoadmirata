/**
 * Tipos da feature Tour (Tour Virtual 360 e Video Tour).
 */

export type TourTipo = 'matterport' | 'youtube' | 'vimeo' | 'iframe' | 'foto360'

export interface TourData {
  tipo: TourTipo
  url: string
  titulo?: string
  /** Thumbnail para o preview antes de carregar o tour */
  thumbnailUrl?: string
}

export interface TourVirtualProps {
  tour: TourData
  className?: string
  /** Modo compacto (inline) vs fullscreen */
  compact?: boolean
}

export interface VideoPlayerProps {
  videoUrl: string
  titulo?: string
  posterUrl?: string
  autoplay?: boolean
  muted?: boolean
  className?: string
}
