/**
 * Tipos da feature Analytics.
 */

// ─── Meta Pixel ───────────────────────────────────────────────────────────────

export type PixelEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Contact'
  | 'Search'
  | 'AddToWishlist'
  | 'InitiateCheckout'

export interface PixelEventParams {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  content_type?: string
  value?: number
  currency?: string
  search_string?: string
}

// ─── Google Analytics 4 ───────────────────────────────────────────────────────

export type GA4EventName =
  | 'view_item'
  | 'generate_lead'
  | 'add_to_wishlist'
  | 'search'
  | 'select_content'
  | 'share'

export interface GA4EventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: unknown
}

// ─── Eventos semânticos do domínio ────────────────────────────────────────────

export interface TrackImovelViewParams {
  titulo: string
  bairroNome?: string | null
  preco?: number | null
  slug: string
}

export interface TrackLeadParams {
  titulo: string
  bairroNome?: string | null
  origem?: string
}
