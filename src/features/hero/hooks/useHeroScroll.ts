/**
 * Hook para controlar o comportamento de scroll do hero.
 * Retorna a posição de scroll normalizada [0, 1] relativa à altura do hero.
 */

'use client'

import { useState, useEffect, useRef } from 'react'

export function useHeroScroll() {
  const [progress, setProgress] = useState(0)
  const [isPastHero, setIsPastHero] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const handler = () => {
      const { top, height } = el.getBoundingClientRect()
      const raw = Math.max(0, Math.min(1, -top / height))
      setProgress(raw)
      setIsPastHero(-top >= height)
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return { heroRef, progress, isPastHero }
}
