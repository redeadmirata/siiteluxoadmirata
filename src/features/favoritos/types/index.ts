/**
 * Tipos do domínio Favoritos.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface FavoritosState {
  ids: string[]
  count: number
}

export interface FavoritosActions {
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export type FavoritosContext = FavoritosState & FavoritosActions
