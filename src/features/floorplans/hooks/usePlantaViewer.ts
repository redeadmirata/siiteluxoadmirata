/**
 * Hook de controle do viewer de plantas.
 */

'use client'

import { useState, useCallback } from 'react'
import type { PlantaViewerState } from '../types'
import { PLANTA_ZOOM_MIN, PLANTA_ZOOM_MAX, PLANTA_ZOOM_STEP } from '../constants'

export function usePlantaViewer(totalPlantas: number): PlantaViewerState & {
  setActivePlanta: (i: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  toggleAmbientes: () => void
} {
  const [activePlanta, setActivePlanta] = useState(0)
  const [zoom, setZoom] = useState(PLANTA_ZOOM_MIN)
  const [showAmbientes, setShowAmbientes] = useState(true)

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(z + PLANTA_ZOOM_STEP, PLANTA_ZOOM_MAX)),
    [],
  )
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - PLANTA_ZOOM_STEP, PLANTA_ZOOM_MIN)),
    [],
  )
  const resetZoom = useCallback(() => setZoom(PLANTA_ZOOM_MIN), [])
  const toggleAmbientes = useCallback(() => setShowAmbientes((v) => !v), [])

  const handleSetActivePlanta = useCallback(
    (i: number) => setActivePlanta(Math.max(0, Math.min(i, totalPlantas - 1))),
    [totalPlantas],
  )

  return {
    activePlanta,
    zoom,
    showAmbientes,
    setActivePlanta: handleSetActivePlanta,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleAmbientes,
  }
}
