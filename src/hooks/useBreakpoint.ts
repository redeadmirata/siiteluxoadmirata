'use client'

import { useState, useEffect } from 'react'
import {
  BREAKPOINTS,
  resolveBreakpoint,
  type Breakpoint,
} from '@/lib/breakpoints'

/**
 * Estado retornado por useBreakpoint.
 */
interface BreakpointState {
  /** Breakpoint atual baseado na largura da janela */
  breakpoint: Breakpoint
  /**
   * true quando a largura atual ≥ ao breakpoint especificado.
   * @example isAbove('lg') → verdade em tablet e acima
   */
  isAbove: (bp: Breakpoint) => boolean
  /**
   * true quando a largura atual < ao breakpoint especificado.
   * @example isBelow('lg') → verdade em mobile (xs, sm, md)
   */
  isBelow: (bp: Breakpoint) => boolean
  /**
   * true quando o breakpoint atual é exatamente o especificado.
   * @example is('xl') → verdade somente em 1024px–1279px
   */
  is: (bp: Breakpoint) => boolean
}

/**
 * useBreakpoint — classificação de breakpoint reativa.
 *
 * Espelha exatamente os screens do tailwind.config.ts via @/lib/breakpoints.
 * SSR-safe: inicia em 'xs' no servidor, atualiza no cliente.
 *
 * @example
 * const { breakpoint, isAbove, isBelow, is } = useBreakpoint()
 *
 * if (is('lg'))       return <TabletLayout />
 * if (isAbove('xl'))  return <DesktopLayout />
 * if (isBelow('lg'))  return <MobileLayout />
 */
export function useBreakpoint(): BreakpointState {
  // 'xs' como padrão SSR-safe — evita mismatch de hidratação
  const [bp, setBp] = useState<Breakpoint>('xs')

  useEffect(() => {
    const update = () => setBp(resolveBreakpoint(window.innerWidth))

    // Primeira medição imediata
    update()

    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  return {
    breakpoint: bp,
    isAbove: (target) => BREAKPOINTS[bp] >= BREAKPOINTS[target],
    isBelow: (target) => BREAKPOINTS[bp] < BREAKPOINTS[target],
    is: (target) => bp === target,
  }
}
