/**
 * Hook de controle da galeria — índice ativo, navegação, lightbox.
 */

'use client'

import { useState, useCallback } from 'react'
import type { GalleryImage } from '../types'

export function useGallery(images: GalleryImage[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = useCallback(
    (index: number) => setActiveIndex(Math.max(0, Math.min(index, images.length - 1))),
    [images.length],
  )

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) goTo(index)
    setLightboxOpen(true)
  }, [goTo])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  return {
    activeIndex,
    activeImage: images[activeIndex],
    lightboxOpen,
    goTo,
    next,
    prev,
    openLightbox,
    closeLightbox,
    total: images.length,
    isFirst: activeIndex === 0,
    isLast: activeIndex === images.length - 1,
  }
}
