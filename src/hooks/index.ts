/**
 * Hooks — Admirata
 * Barrel export para importação simplificada.
 *
 * @example
 * import { useScroll, useBreakpoint, useLenis } from '@/hooks'
 */

// ─── Scroll ───────────────────────────────────────────────────────────────────
export { useScroll } from './useScroll'
export { useScrollPosition } from './useScrollPosition'
export { useLenis, scrollTo } from './useLenis'
export type { LenisOptions } from './useLenis'

// ─── Viewport ─────────────────────────────────────────────────────────────────
export { useViewport } from './useViewport'
export { useBreakpoint } from './useBreakpoint'
export {
  useMediaQuery,
  useIsAbove,
  useIsBelow,
  useIsXs,
  useIsSm,
  useIsMd,
  useIsLg,
  useIsXl,
  useIs2Xl,
  useIs3Xl,
  useIs4Xl,
  useIs5Xl,
  useIs6Xl,
  usePrefersReducedMotion,
  usePrefersColorSchemeDark,
  useIsTouch,
  useIsHighDpi,
} from './useMediaQuery'

// ─── UI State ─────────────────────────────────────────────────────────────────
export { useDebounce } from './useDebounce'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useFavorites } from './useFavorites'

// ─── Theme (via providers) ────────────────────────────────────────────────────
// useTheme é exportado por @/providers — manter centralizado lá
// import { useTheme } from '@/providers'
