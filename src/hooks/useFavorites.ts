'use client'

import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEY_FAVORITOS, EVENT_FAVORITOS } from '@/config/site'

/** Lê favoritos do localStorage de forma segura (sem SSR crash) */
function readStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITOS)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

/** Persiste favoritos e notifica outros componentes via evento customizado */
function writeStorage(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify([...set]))
    window.dispatchEvent(new Event(EVENT_FAVORITOS))
  } catch {}
}

// ─── Hook principal ────────────────────────────────────────────────────────────

interface UseFavoritesReturn {
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  ids: string[]
  count: number
  clear: () => void
}

/**
 * Hook completo para gerenciar favoritos.
 * Sincroniza entre múltiplos componentes via evento customizado.
 *
 * @example
 * const { isFavorite, toggle, count } = useFavorites()
 */
export function useFavorites(): UseFavoritesReturn {
  const [set, setSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    setSet(readStorage())

    const onExternalChange = () => setSet(readStorage())
    window.addEventListener(EVENT_FAVORITOS, onExternalChange)
    return () => window.removeEventListener(EVENT_FAVORITOS, onExternalChange)
  }, [])

  const isFavorite = useCallback((id: string) => set.has(id), [set])

  const toggle = useCallback((id: string) => {
    const next = new Set(readStorage())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    writeStorage(next)
    setSet(new Set(next))
  }, [])

  const add = useCallback((id: string) => {
    const next = new Set(readStorage())
    next.add(id)
    writeStorage(next)
    setSet(new Set(next))
  }, [])

  const remove = useCallback((id: string) => {
    const next = new Set(readStorage())
    next.delete(id)
    writeStorage(next)
    setSet(new Set(next))
  }, [])

  const clear = useCallback(() => {
    writeStorage(new Set())
    setSet(new Set())
  }, [])

  return {
    isFavorite,
    toggle,
    add,
    remove,
    ids: [...set],
    count: set.size,
    clear,
  }
}

// ─── Hook simplificado — só o contador (para o ícone da navbar) ────────────────

/**
 * Retorna apenas o total de favoritos salvos.
 * Mais leve que useFavorites() quando só o número importa.
 */
export function useFavoritesCount(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(readStorage().size)
    const onChange = () => setCount(readStorage().size)
    window.addEventListener(EVENT_FAVORITOS, onChange)
    return () => window.removeEventListener(EVENT_FAVORITOS, onChange)
  }, [])

  return count
}

// ─── Hook single-item — verifica se UM imóvel específico é favorito ───────────

/**
 * Verifica e alterna o estado de favorito de UM imóvel específico.
 * Ideal para o botão de coração nos cards.
 */
export function useIsFavorite(imovelId: string): {
  ativo: boolean
  toggle: () => void
} {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    setAtivo(readStorage().has(imovelId))
    const onExternalChange = () => setAtivo(readStorage().has(imovelId))
    window.addEventListener(EVENT_FAVORITOS, onExternalChange)
    return () => window.removeEventListener(EVENT_FAVORITOS, onExternalChange)
  }, [imovelId])

  const toggle = useCallback(() => {
    const next = new Set(readStorage())
    if (next.has(imovelId)) next.delete(imovelId)
    else next.add(imovelId)
    writeStorage(next)
    setAtivo(next.has(imovelId))
  }, [imovelId])

  return { ativo, toggle }
}
