/**
 * scroll.ts — utilitários de scroll nativo (sem Lenis).
 *
 * Para scroll suave com Lenis: import { scrollTo } from '@/hooks/useLenis'
 * Para scroll nativo programático: import { scrollTo } from '@/utils/scroll'
 */

export interface ScrollToOptions {
  /** Offset vertical em pixels (negativo = acima do elemento) */
  offset?: number
  /** Comportamento de scroll */
  behavior?: ScrollBehavior
  /** Aguarda N ms antes de executar (útil após transições de página) */
  delay?: number
}

/**
 * Scroll suave até um elemento ou posição.
 *
 * @example
 * scrollTo('#galeria')
 * scrollTo('#galeria', { offset: -80 })
 * scrollTo(0)                          // topo da página
 * scrollTo(document.getElementById('fotos'))
 */
export function scrollTo(
  target: string | number | Element | null,
  options: ScrollToOptions = {}
): void {
  const { offset = 0, behavior = 'smooth', delay = 0 } = options

  const execute = () => {
    if (target === null) return

    // Número → posição Y absoluta
    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior })
      return
    }

    // String → seletor CSS ou hash
    const el =
      typeof target === 'string'
        ? document.querySelector(target) ?? document.getElementById(target.replace('#', ''))
        : target

    if (!el) return

    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY + offset

    window.scrollTo({ top, behavior })
  }

  if (delay > 0) {
    setTimeout(execute, delay)
  } else {
    execute()
  }
}

/**
 * Scroll até o topo da página.
 * @example scrollToTop()
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ top: 0, behavior })
}

/**
 * Retorna a posição Y atual do scroll.
 */
export function getScrollY(): number {
  return typeof window !== 'undefined' ? window.scrollY : 0
}

/**
 * Progresso do scroll como valor 0–1.
 */
export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(window.scrollY / max, 1) : 0
}

/**
 * Trava o scroll do body (para modais/drawers).
 * Preserva a posição atual para evitar layout shift.
 */
export function lockScroll(): void {
  if (typeof document === 'undefined') return
  const y = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${y}px`
  document.body.style.width = '100%'
}

/**
 * Restaura o scroll após lockScroll().
 */
export function unlockScroll(): void {
  if (typeof document === 'undefined') return
  const top = Math.abs(parseInt(document.body.style.top || '0', 10))
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo({ top, behavior: 'instant' })
}
