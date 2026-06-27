'use client'

import { useState, useEffect } from 'react'

/**
 * Retorna o valor debounced — só atualiza após `delay` ms sem mudanças.
 * Usado em campos de busca para evitar chamadas excessivas ao Sanity.
 *
 * @example
 * const [query, setQuery] = useState('')
 * const debouncedQuery = useDebounce(query, 400)
 *
 * useEffect(() => {
 *   // só executa 400ms depois que o usuário parou de digitar
 *   fetchResults(debouncedQuery)
 * }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
