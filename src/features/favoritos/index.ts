/**
 * Feature: Favoritos
 */

export type { FavoritosState, FavoritosActions, FavoritosContext } from './types'

export { STORAGE_KEY, EVENTO_CHANGE, FAVORITOS_MAXIMO } from './constants'

export { useFavoritos, useFavoritosCount, useIsFavorito } from './hooks/useFavoritos'
