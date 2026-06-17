/**
 * Helper type-safe para disparar eventos Meta Pixel (fbq).
 * Só executa no client-side e só se o fbq tiver sido carregado
 * (depende de consentimento LGPD via MetaPixel.tsx).
 */

export type PixelStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Contact'
  | 'Search'
  | 'Schedule'
  | 'CompleteRegistration'

export interface PixelEventParams {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  content_type?: string
  value?: number
  currency?: string
  [key: string]: unknown
}

/**
 * Dispara um evento padrão do Meta Pixel.
 * Safe para usar em Client Components — não vai lançar no SSR.
 */
export function trackPixelEvent(
  event: PixelStandardEvent,
  params?: PixelEventParams
): void {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}

/**
 * Dispara um evento customizado do Meta Pixel.
 */
export function trackPixelCustom(
  event: string,
  params?: PixelEventParams
): void {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  window.fbq('trackCustom', event, params)
}
