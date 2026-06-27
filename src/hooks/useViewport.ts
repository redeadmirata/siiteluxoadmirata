'use client'

import { useState, useEffect } from 'react'
import { VIEWPORT_THRESHOLDS } from '@/lib/breakpoints'

/**
 * Estado retornado por useViewport.
 */
interface ViewportState {
  /** Largura atual da janela em px (0 no servidor) */
  width: number
  /** Altura atual da janela em px (0 no servidor) */
  height: number
  /**
   * true quando largura < 768px.
   * Cobre: xs (360), sm (390), md (430).
   */
  isMobile: boolean
  /**
   * true quando 768px ≤ largura < 1024px.
   * Cobre: lg (768).
   */
  isTablet: boolean
  /**
   * true quando largura ≥ 1024px.
   * Cobre: xl (1024), 2xl (1280), 3xl (1440), 4xl (1600), 5xl (1920), 6xl (2560).
   */
  isDesktop: boolean
  /** 'portrait' quando altura > largura, 'landscape' caso contrário */
  orientation: 'portrait' | 'landscape'
  /** Device pixel ratio (1 no servidor) */
  dpr: number
}

const SSR_INITIAL: ViewportState = {
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  orientation: 'portrait',
  dpr: 1,
}

/**
 * Mede o viewport atual. Só pode ser chamada no cliente.
 */
function measureViewport(): ViewportState {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    width: w,
    height: h,
    isMobile:   w <= VIEWPORT_THRESHOLDS.mobileMax,
    isTablet:   w >= VIEWPORT_THRESHOLDS.tabletMin && w <= VIEWPORT_THRESHOLDS.tabletMax,
    isDesktop:  w >= VIEWPORT_THRESHOLDS.desktopMin,
    orientation: w >= h ? 'landscape' : 'portrait',
    dpr: window.devicePixelRatio ?? 1,
  }
}

/**
 * useViewport — dimensões da janela e helpers semânticos de breakpoint.
 *
 * SSR-safe: retorna zeros no servidor, atualiza após hidratação.
 * Debounced via requestAnimationFrame para evitar renders excessivos no resize.
 *
 * Thresholds sincronizados com tailwind.config.ts via @/lib/breakpoints:
 *   isMobile  → < 768px   (xs 360, sm 390, md 430)
 *   isTablet  → 768–1023px (lg 768)
 *   isDesktop → ≥ 1024px  (xl em diante)
 *
 * @example
 * const { isMobile, width, dpr } = useViewport()
 * if (isMobile) return <MobileNav />
 */
export function useViewport(): ViewportState {
  const [vp, setVp] = useState<ViewportState>(SSR_INITIAL)

  useEffect(() => {
    // Medição inicial (cliente)
    setVp(measureViewport())

    let rafId: number

    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setVp(measureViewport()))
    }

    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return vp
}
