/**
 * Utils — Admirata
 * Barrel export para importação simplificada.
 *
 * @example
 * import { cn, formatCurrency, debounce, scrollTo } from '@/utils'
 */

// ─── Classes CSS ──────────────────────────────────────────────────────────────
export { cn } from './cn'

// ─── Formatação ───────────────────────────────────────────────────────────────
export {
  formatCurrency,
  formatPreco,   // alias imóveis
  formatArea,
  formatDate,
  formatNumber,
  formatPhone,
  whatsappUrl,
  pluralize,
} from './format'

// ─── Slug ─────────────────────────────────────────────────────────────────────
export { slugify, slugifyImovel } from './slugify'

// ─── Funções ──────────────────────────────────────────────────────────────────
export {
  debounce,
  throttle,
  memoize,
  sleep,
  clamp,
  mapRange,
  uid,
} from './function'

// ─── Scroll ───────────────────────────────────────────────────────────────────
export {
  scrollTo,
  scrollToTop,
  getScrollY,
  getScrollProgress,
  lockScroll,
  unlockScroll,
} from './scroll'

// ─── SEO ─────────────────────────────────────────────────────────────────────
export * from './seo'
