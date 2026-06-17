'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'admirata_favoritos'

function getFavoritos(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveFavoritos(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
    window.dispatchEvent(new Event('admirata_favoritos_change'))
  } catch {}
}

interface FavoritoButtonProps {
  imovelId: string
  titulo?: string
  className?: string
}

export default function FavoritoButton({ imovelId, titulo, className = '' }: FavoritoButtonProps) {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    setAtivo(getFavoritos().has(imovelId))

    const onExternalChange = () => setAtivo(getFavoritos().has(imovelId))
    window.addEventListener('admirata_favoritos_change', onExternalChange)
    return () => window.removeEventListener('admirata_favoritos_change', onExternalChange)
  }, [imovelId])

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const set = getFavoritos()
      if (set.has(imovelId)) {
        set.delete(imovelId)
      } else {
        set.add(imovelId)
      }
      saveFavoritos(set)
      setAtivo(set.has(imovelId))
    },
    [imovelId],
  )

  return (
    <button
      onClick={toggle}
      aria-label={ativo ? `Remover ${titulo ?? 'imóvel'} dos favoritos` : `Salvar ${titulo ?? 'imóvel'} nos favoritos`}
      aria-pressed={ativo}
      className={`group/fav flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
        ${ativo ? 'bg-gold' : 'bg-white/90 hover:bg-white'}
        ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-4 h-4 transition-all duration-200 ${
          ativo
            ? 'fill-white stroke-gold'
            : 'fill-transparent stroke-ink/70 group-hover/fav:stroke-gold'
        }`}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

/** Hook para consumir favoritos em outros componentes */
export function useFavoritosCount(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getFavoritos().size)
    const onChange = () => setCount(getFavoritos().size)
    window.addEventListener('admirata_favoritos_change', onChange)
    return () => window.removeEventListener('admirata_favoritos_change', onChange)
  }, [])

  return count
}
