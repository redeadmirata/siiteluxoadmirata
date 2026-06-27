'use client'

/**
 * SmoothScrollProvider — ativa o scroll suave (Lenis) em toda a aplicação.
 *
 * - Inicializa o Lenis UMA ÚNICA VEZ (singleton via useLenis).
 * - Respeita `prefers-reduced-motion`: se o usuário pede menos movimento,
 *   o Lenis NÃO é inicializado e o scroll nativo é mantido.
 * - Sincroniza o Lenis com o GSAP ScrollTrigger (parallax cinematográfico):
 *   a cada frame de scroll do Lenis, dispara `ScrollTrigger.update()`.
 *
 * Deve ficar dentro do MotionProvider (para `useReducedMotion`) e envolver
 * o conteúdo da aplicação. Ver composição em `providers/index.tsx`.
 */

import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLenis } from '@/hooks/useLenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const prefersReduced = useReducedMotion()
  const lenisRef = useLenis({ enabled: !prefersReduced })

  useEffect(() => {
    if (prefersReduced) return

    let cancelled = false
    let raf = 0
    let detach: (() => void) | undefined

    // GSAP ScrollTrigger fica em sincronia com o scroll virtual do Lenis.
    // Import dinâmico evita custo no bundle inicial e crash em SSR.
    import('gsap')
      .then(({ gsap }) =>
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          if (cancelled) return
          gsap.registerPlugin(ScrollTrigger)

          // O Lenis é criado de forma assíncrona — aguarda a instância existir.
          const tryAttach = () => {
            const lenis = lenisRef.current
            if (lenis) {
              const onScroll = () => ScrollTrigger.update()
              lenis.on('scroll', onScroll)
              detach = () => lenis.off('scroll', onScroll)
            } else {
              raf = requestAnimationFrame(tryAttach)
            }
          }
          tryAttach()
        }),
      )
      .catch(() => {
        /* GSAP ausente → Lenis segue funcionando sozinho com scroll nativo */
      })

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      detach?.()
    }
  }, [prefersReduced, lenisRef])

  return <>{children}</>
}
