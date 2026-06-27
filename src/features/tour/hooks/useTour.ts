/**
 * Hook de controle do tour virtual — lazy load e tracking.
 */

'use client'

import { useState, useCallback } from 'react'
import { YOUTUBE_REGEX, VIMEO_REGEX, YOUTUBE_EMBED_PARAMS, VIMEO_EMBED_PARAMS, MATTERPORT_EMBED_PARAMS } from '../constants'
import type { TourData } from '../types'

export function useTour(tour: TourData) {
  const [loaded, setLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const load = useCallback(() => setLoaded(true), [])
  const toggleFullscreen = useCallback(() => setIsFullscreen((v) => !v), [])

  const getEmbedUrl = useCallback((): string => {
    const { tipo, url } = tour

    if (tipo === 'youtube') {
      const match = url.match(YOUTUBE_REGEX)
      return match ? `https://www.youtube.com/embed/${match[1]}?${YOUTUBE_EMBED_PARAMS}` : url
    }

    if (tipo === 'vimeo') {
      const match = url.match(VIMEO_REGEX)
      return match ? `https://player.vimeo.com/video/${match[1]}?${VIMEO_EMBED_PARAMS}` : url
    }

    if (tipo === 'matterport') {
      const id = url.includes('my.matterport.com') ? url.split('/').pop()?.split('?')[0] : url
      return `https://my.matterport.com/show/?m=${id}&${MATTERPORT_EMBED_PARAMS}`
    }

    return url
  }, [tour])

  return { loaded, isFullscreen, load, toggleFullscreen, getEmbedUrl }
}
