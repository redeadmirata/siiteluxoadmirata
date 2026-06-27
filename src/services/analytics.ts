/**
 * Camada centralizada de analytics.
 * Abstrai Meta Pixel + Google Analytics — componentes chamam daqui,
 * nunca importam diretamente de window.fbq ou window.gtag.
 */

// ─── Meta Pixel ───────────────────────────────────────────────────────────────

type PixelEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Contact'
  | 'Search'
  | 'AddToWishlist'
  | 'InitiateCheckout'

interface PixelEventParams {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  content_type?: string
  value?: number
  currency?: string
  search_string?: string
}

/**
 * Dispara um evento no Meta Pixel (Facebook).
 * SSR-safe: verifica window antes de chamar.
 */
export function trackPixel(event: PixelEventName, params?: PixelEventParams): void {
  if (typeof window === 'undefined') return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).fbq?.('track', event, params)
  } catch {}
}

// ─── Google Analytics (GA4) ───────────────────────────────────────────────────

interface GA4EventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: unknown
}

/**
 * Dispara um evento no Google Analytics 4.
 */
export function trackGA(eventName: string, params?: GA4EventParams): void {
  if (typeof window === 'undefined') return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).gtag?.('event', eventName, params)
  } catch {}
}

// ─── Eventos semânticos do negócio ────────────────────────────────────────────

/** Usuário visualizou a PDI de um imóvel */
export function trackImovelView({
  titulo,
  bairroNome,
  preco,
  slug,
}: {
  titulo: string
  bairroNome?: string | null
  preco?: number | null
  slug: string
}): void {
  trackPixel('ViewContent', {
    content_name: titulo,
    content_category: bairroNome ?? undefined,
    content_ids: [slug],
    content_type: 'product',
    value: preco ?? undefined,
    currency: 'BRL',
  })

  trackGA('view_item', {
    event_category: 'Imóvel',
    event_label: titulo,
    value: preco ?? undefined,
  })
}

/** Usuário clicou em WhatsApp para entrar em contato */
export function trackLead({
  titulo,
  bairroNome,
}: {
  titulo: string
  bairroNome?: string | null
}): void {
  trackPixel('Lead', {
    content_name: titulo,
    content_category: bairroNome ?? undefined,
  })

  trackGA('generate_lead', {
    event_category: 'CTA',
    event_label: titulo,
  })
}

/** Usuário adicionou imóvel aos favoritos */
export function trackFavorite(titulo: string): void {
  trackPixel('AddToWishlist', { content_name: titulo })
  trackGA('add_to_wishlist', { event_category: 'Favoritos', event_label: titulo })
}

/** Usuário executou uma busca */
export function trackSearch(query: string): void {
  trackPixel('Search', { search_string: query })
  trackGA('search', { search_term: query })
}
