/**
 * Constantes da feature Tour.
 */

export const TOUR_ASPECT_RATIO = '16/9'

/** Parâmetros de embed por plataforma */
export const YOUTUBE_EMBED_PARAMS = 'rel=0&modestbranding=1&enablejsapi=1'
export const VIMEO_EMBED_PARAMS = 'byline=0&portrait=0&title=0'
export const MATTERPORT_EMBED_PARAMS = 'play=1&qs=1&hr=0&brand=0'

/** Regex para extrair ID do YouTube */
export const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/

/** Regex para extrair ID do Vimeo */
export const VIMEO_REGEX = /vimeo\.com\/(\d+)/
