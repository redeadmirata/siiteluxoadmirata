'use client'

import { useState, useEffect } from 'react'

interface ScrollPosition {
  y: number
  /** true quando scrollou mais de `threshold` pixels */
  scrolled: boolean
  /** true quando scrollou além do fold (100vh) */
  beyondFold: boolean
  /** 'up' | 'down' | null — direção do último scroll */
  direction: 'up' | 'down' | null
}

/**
 * Rastreia posição de scroll com direção e indicadores booleanos.
 * Usado pela Navbar para alterar estilos após scroll.
 *
 * @param threshold - pixels necessários para ativar `scrolled` (default: 64)
 *
 * @example
 * const { scrolled, direction } = useScrollPosition()
 */
export function useScrollPosition(threshold = 64): ScrollPosition {
  const [pos, setPos] = useState<ScrollPosition>({
    y: 0,
    scrolled: false,
    beyondFold: false,
    direction: null,
  })

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const direction = y > lastY ? 'down' : y < lastY ? 'up' : null
      lastY = y

      setPos({
        y,
        scrolled: y > threshold,
        beyondFold: y > window.innerHeight,
        direction,
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return pos
}
