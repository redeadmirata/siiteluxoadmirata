'use client'

import { useState, useEffect } from 'react'
import { BREAKPOINTS, type Breakpoint } from '@/lib/breakpoints'

/**
 * useMediaQuery — detecta se uma media query está ativa.
 *
 * SSR-safe: retorna false no servidor.
 *
 * @example
 * const isTouch   = useMediaQuery('(hover: none)')
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ─── Helpers de breakpoint — sincronizados com tailwind.config.ts ────────────
// Valores importados de @/lib/breakpoints para manter uma fonte única de verdade.

/**
 * Retorna true quando a largura da janela ≥ o breakpoint especificado.
 *
 * @example
 * const isTablet = useIsAbove('lg')  // ≥ 768px
 * const isDesktop = useIsAbove('xl') // ≥ 1024px
 */
export function useIsAbove(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`)
}

/**
 * Retorna true quando a largura da janela < o breakpoint especificado.
 *
 * @example
 * const isMobileOnly = useIsBelow('lg') // < 768px
 */
export function useIsBelow(bp: Breakpoint): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS[bp] - 1}px)`)
}

// ─── Aliases semânticos ───────────────────────────────────────────────────────

/** xs: ≥ 360px */
export const useIsXs  = () => useIsAbove('xs')

/** sm: ≥ 390px — iPhone 14 */
export const useIsSm  = () => useIsAbove('sm')

/** md: ≥ 430px — iPhone Plus */
export const useIsMd  = () => useIsAbove('md')

/** lg: ≥ 768px — tablet */
export const useIsLg  = () => useIsAbove('lg')

/** xl: ≥ 1024px — laptop */
export const useIsXl  = () => useIsAbove('xl')

/** 2xl: ≥ 1280px — laptop standard */
export const useIs2Xl = () => useIsAbove('2xl')

/** 3xl: ≥ 1440px — desktop padrão */
export const useIs3Xl = () => useIsAbove('3xl')

/** 4xl: ≥ 1600px — desktop large */
export const useIs4Xl = () => useIsAbove('4xl')

/** 5xl: ≥ 1920px — Full HD */
export const useIs5Xl = () => useIsAbove('5xl')

/** 6xl: ≥ 2560px — 2K / QHD */
export const useIs6Xl = () => useIsAbove('6xl')

// ─── Helpers de acessibilidade / preferência ─────────────────────────────────

/** true quando o usuário prefere movimento reduzido */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** true quando o esquema de cores preferido é escuro */
export const usePrefersColorSchemeDark = () =>
  useMediaQuery('(prefers-color-scheme: dark)')

/** true em dispositivos de toque (sem hover preciso) */
export const useIsTouch = () =>
  useMediaQuery('(hover: none) and (pointer: coarse)')

/** true em displays de alta resolução (Retina, etc.) */
export const useIsHighDpi = () =>
  useMediaQuery('(min-resolution: 2dppx)')
