'use client'

import { useEffect, useRef, useCallback } from 'react'
import type Lenis from 'lenis'

/**
 * useLenis — inicializa o scroll suave com Lenis.
 *
 * Deve ser usado UMA ÚNICA VEZ na raiz da aplicação (layout.tsx ou providers).
 * Outros componentes que precisam acessar a instância usam o segundo overload.
 *
 * @example — inicializar (raiz)
 * const lenis = useLenis({ duration: 1.2 })
 *
 * @example — acessar instância em filho (sem re-inicializar)
 * const lenis = useLenis()
 * const scrollTo = (href: string) => lenis.current?.scrollTo(href)
 *
 * @example — scroll programático
 * const lenis = useLenis()
 * lenis.current?.scrollTo('#secao-fotos', { offset: -80, duration: 1 })
 */

export interface LenisOptions {
  /** Duração base da interpolação (default: 1.2) */
  duration?: number
  /** Easing (default: exponencial out) */
  easing?: (t: number) => number
  /** Direção do scroll (default: 'vertical') */
  orientation?: 'vertical' | 'horizontal'
  /** Suavização em gestures de touch (0–1, default: 0.1) */
  touchMultiplier?: number
  /** Suavização em wheel (default: 1) */
  wheelMultiplier?: number
  /** Se false, Lenis não inicializa (útil para desligar em mobile se quiser) */
  enabled?: boolean
}

// Referência global — singleton entre múltiplos chamadores
let globalLenis: Lenis | null = null

export function useLenis(options?: LenisOptions) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  const { enabled = true, duration = 1.2, easing, orientation, touchMultiplier, wheelMultiplier } = options ?? {}

  const raf = useCallback((time: number) => {
    globalLenis?.raf(time)
    rafRef.current = requestAnimationFrame(raf)
  }, [])

  useEffect(() => {
    // Se já existe instância global OU está desabilitado, apenas expor a ref
    if (!enabled || globalLenis) {
      lenisRef.current = globalLenis
      return
    }

    // Importação dinâmica para evitar SSR crash
    import('lenis').then(({ default: LenisClass }) => {
      const lenis = new LenisClass({
        duration,
        easing: easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
        orientation: orientation ?? 'vertical',
        touchMultiplier: touchMultiplier ?? 1.5,
        wheelMultiplier: wheelMultiplier ?? 1,
        smoothWheel: true,
      })

      globalLenis = lenis
      lenisRef.current = lenis

      // RAF loop
      rafRef.current = requestAnimationFrame(raf)
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      globalLenis?.destroy()
      globalLenis = null
      lenisRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return lenisRef
}

/**
 * scrollTo — helper para scroll programático sem acesso ao hook.
 * Usa a instância singleton global do Lenis.
 *
 * @example
 * import { scrollTo } from '@/hooks/useLenis'
 * scrollTo('#galeria', { offset: -80 })
 * scrollTo(0) // volta ao topo
 */
export function scrollTo(
  target: string | number | HTMLElement,
  options?: Parameters<Lenis['scrollTo']>[1]
) {
  globalLenis?.scrollTo(target as never, options)
}
