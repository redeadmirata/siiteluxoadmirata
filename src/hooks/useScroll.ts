'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ScrollState {
  /** Posição Y em pixels */
  scrollY: number
  /** Progresso 0–1 da página inteira (0 = topo, 1 = rodapé) */
  scrollYProgress: number
  /** Velocidade do scroll (pixels/frame). Positivo = descendo */
  scrollVelocity: number
  /** Direção do último scroll */
  direction: 'up' | 'down' | null
  /** true enquanto o usuário está scrollando ativamente */
  isScrolling: boolean
  /** true após passar o threshold (default 64px) */
  scrolled: boolean
  /** true após passar 100vh */
  beyondFold: boolean
}

/**
 * useScroll — rastreamento avançado de scroll para animações.
 *
 * Diferente de useScrollPosition (que é para UI state), este hook
 * expõe `scrollYProgress` (0–1) e `scrollVelocity` para uso com
 * Framer Motion, GSAP ScrollTrigger e animações driven por scroll.
 *
 * @example
 * const { scrollYProgress, direction, isScrolling } = useScroll()
 *
 * // Com GSAP
 * gsap.to(ref.current, { y: scrollYProgress * -100 })
 *
 * // Com Framer Motion
 * const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
 */
export function useScroll(threshold = 64): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollYProgress: 0,
    scrollVelocity: 0,
    direction: null,
    isScrolling: false,
    scrolled: false,
    beyondFold: false,
  })

  const lastY = useRef(0)
  const lastTime = useRef(performance.now())
  const scrollingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  const update = useCallback(() => {
    const y = window.scrollY
    const now = performance.now()
    const dt = now - lastTime.current || 1

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0
    const velocity = (y - lastY.current) / dt * 16 // normalizado a ~60fps

    const direction = y > lastY.current ? 'down' : y < lastY.current ? 'up' : null

    lastY.current = y
    lastTime.current = now

    setState({
      scrollY: y,
      scrollYProgress: progress,
      scrollVelocity: velocity,
      direction: direction ?? (state.direction),
      isScrolling: true,
      scrolled: y > threshold,
      beyondFold: y > window.innerHeight,
    })

    // Para o flag isScrolling após 150ms sem scroll
    if (scrollingTimer.current) clearTimeout(scrollingTimer.current)
    scrollingTimer.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isScrolling: false, scrollVelocity: 0 }))
    }, 150)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scrollingTimer.current) clearTimeout(scrollingTimer.current)
    }
  }, [update])

  return state
}
