/**
 * Utilitários funcionais — debounce, throttle, memoize.
 * Funções puras, sem dependências, SSR-safe.
 */

// ─── Debounce ─────────────────────────────────────────────────────────────────

/**
 * Adia a execução de `fn` até que `wait` ms passem sem nova chamada.
 * Retorna a função debounced + método `.cancel()` para limpar o timer.
 *
 * @example
 * const onSearch = debounce((q: string) => fetch(`/api?q=${q}`), 400)
 * input.addEventListener('input', (e) => onSearch(e.target.value))
 * // Cancela ao desmontar:
 * onSearch.cancel()
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  wait: number
): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, wait)
  }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced as T & { cancel: () => void }
}

// ─── Throttle ─────────────────────────────────────────────────────────────────

/**
 * Limita `fn` a ser chamada no máximo uma vez a cada `limit` ms.
 * Chama imediatamente na primeira vez, depois aguarda o intervalo.
 * Retorna a função throttled + método `.cancel()`.
 *
 * @example
 * const onScroll = throttle(() => updateNavbar(), 100)
 * window.addEventListener('scroll', onScroll)
 * // Limpa ao desmontar:
 * window.removeEventListener('scroll', onScroll)
 * onScroll.cancel()
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): T & { cancel: () => void } {
  let lastCall = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = limit - (now - lastCall)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastCall = now
      fn(...args)
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now()
        timer = null
        fn(...args)
      }, remaining)
    }
  }

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return throttled as T & { cancel: () => void }
}

// ─── Memoize ──────────────────────────────────────────────────────────────────

/**
 * Cache simples de resultado por argumentos serializados.
 * Bom para funções puras e computações caras (ex: formatação de listas).
 *
 * @example
 * const getSlug = memoize((text: string) => slugify(text))
 */
export function memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as ReturnType<T>
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/** Aguarda N milissegundos (Promise). */
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** Clamp: garante que `value` está entre `min` e `max`. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/** Mapeia valor de um range para outro (linear interpolation). */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)

/** Gera ID único simples (não criptográfico). */
export const uid = (prefix = 'id') =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`
