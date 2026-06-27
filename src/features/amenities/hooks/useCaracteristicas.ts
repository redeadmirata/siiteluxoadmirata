/**
 * Hook para agrupar e filtrar características de um imóvel.
 */

import { useMemo } from 'react'
import type { Caracteristica, CaracteristicaGrupo } from '../types'
import { GRUPOS_ORDEM } from '../constants'

export function useCaracteristicas(caracteristicas: Caracteristica[]) {
  const grupos = useMemo<CaracteristicaGrupo[]>(() => {
    const map = new Map<string, string[]>()

    for (const c of caracteristicas) {
      const g = c.grupo || 'Outros'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(c.nome)
    }

    // Ordenar conforme GRUPOS_ORDEM; grupos desconhecidos vão ao final
    const ordenados = GRUPOS_ORDEM.filter((g) => map.has(g))
    const extras = [...map.keys()].filter((g) => !(GRUPOS_ORDEM as readonly string[]).includes(g))

    return [...ordenados, ...extras].map((grupo) => ({
      grupo,
      itens: map.get(grupo) ?? [],
    }))
  }, [caracteristicas])

  const total = useMemo(() => caracteristicas.length, [caracteristicas])

  return { grupos, total }
}
