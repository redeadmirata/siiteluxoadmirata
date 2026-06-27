/**
 * Hook de busca com URL sync — lê e escreve searchParams.
 * Client component only.
 */

'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { FiltrosBusca } from '../types'
import { FILTROS_PADRAO } from '../constants'

export function useBusca() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filtros: FiltrosBusca = useMemo(
    () => ({
      tipo:        (searchParams.get('tipo')       ?? '') as FiltrosBusca['tipo'],
      mercado:     (searchParams.get('mercado')    ?? '') as FiltrosBusca['mercado'],
      finalidade:  (searchParams.get('finalidade') ?? '') as FiltrosBusca['finalidade'],
      bairroSlug:  searchParams.get('bairro')      ?? '',
      precoMin:    Number(searchParams.get('precoMin')  ?? 0),
      precoMax:    Number(searchParams.get('precoMax')  ?? 0),
      quartos:     Number(searchParams.get('quartos')   ?? 0),
      novidade:    searchParams.get('novidade')    === 'true',
      exclusivo:   searchParams.get('exclusivo')   === 'true',
    }),
    [searchParams],
  )

  const setFiltro = useCallback(
    (campo: keyof FiltrosBusca, valor: FiltrosBusca[typeof campo]) => {
      const params = new URLSearchParams(searchParams.toString())

      const padrao = FILTROS_PADRAO[campo]
      if (valor === padrao || valor === '' || valor === 0 || valor === false) {
        params.delete(String(campo === 'bairroSlug' ? 'bairro' : campo))
      } else {
        params.set(campo === 'bairroSlug' ? 'bairro' : campo, String(valor))
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const limparFiltros = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const temFiltrosAtivos = useMemo(
    () => Object.keys(filtros).some((k) => {
      const key = k as keyof FiltrosBusca
      return filtros[key] !== FILTROS_PADRAO[key]
    }),
    [filtros],
  )

  return { filtros, setFiltro, limparFiltros, temFiltrosAtivos }
}
