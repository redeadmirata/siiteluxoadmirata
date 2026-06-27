'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Se true, para de observar após a primeira entrada na viewport (default: true) */
  triggerOnce?: boolean
  /** Só ativa se o elemento estiver visível por pelo menos este tempo (ms) */
  delay?: number
}

/**
 * Detecta quando um elemento entra na viewport.
 * Usado para acionar animações Framer Motion e GSAP sem configurar GSAP ScrollTrigger.
 *
 * @example
 * const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 })
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     animate={isVisible ? 'visible' : 'hidden'}
 *     variants={fadeUp}
 *   />
 * )
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): {
  ref: React.RefObject<T>
  isVisible: boolean
  entry: IntersectionObserverEntry | null
} {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timer: ReturnType<typeof setTimeout>

    const observer = new IntersectionObserver(
      ([e]) => {
        setEntry(e)

        if (e.isIntersecting) {
          if (delay > 0) {
            timer = setTimeout(() => {
              setIsVisible(true)
              if (triggerOnce) observer.disconnect()
            }, delay)
          } else {
            setIsVisible(true)
            if (triggerOnce) observer.disconnect()
          }
        } else if (!triggerOnce) {
          clearTimeout(timer)
          setIsVisible(false)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce, delay])

  return { ref, isVisible, entry }
}
