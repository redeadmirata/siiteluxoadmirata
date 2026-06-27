'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { STORAGE_KEY_FAVORITOS, EVENT_FAVORITOS } from '@/config/site'

// ─── Storage helpers (SSR-safe) ────────────────────────────────────────────────

function readStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITOS)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeStorage(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify([...set]))
    window.dispatchEvent(new Event(EVENT_FAVORITOS))
  } catch {}
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface FavoritesContextValue {
  ids: string[]
  count: number
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────────

export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  const clear = useCallback(() => {
    writeStorage(new Set())
    setSet(new Set())
  }, [])

  return (
    <FavoritesContext.Provider
      value={{ ids: [...set], count: set.size, isFavorite, toggle, clear }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// ─── Hook de consumo ───────────────────────────────────────────────────────────

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavoritesContext deve ser usado dentro de <FavoritesProvider>')
  }
  return ctx
}
