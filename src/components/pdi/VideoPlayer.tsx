'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  url: string
  titulo?: string
}

/** Extrai o embed URL a partir de links YouTube ou Vimeo */
function resolveEmbedUrl(raw: string): { embedUrl: string; provider: 'youtube' | 'vimeo' | 'unknown' } {
  // YouTube — formatos: watch?v=, youtu.be/, /shorts/, /embed/
  const ytPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ]
  for (const pattern of ytPatterns) {
    const match = raw.match(pattern)
    if (match?.[1]) {
      return {
        embedUrl: `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&autoplay=1`,
        provider: 'youtube',
      }
    }
  }

  // Vimeo — formatos: vimeo.com/ID ou player.vimeo.com/video/ID
  const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch?.[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=c9a227`,
      provider: 'vimeo',
    }
  }

  // Fallback — tenta usar a URL diretamente (outros players compatíveis com iframe)
  return { embedUrl: raw, provider: 'unknown' }
}

/**
 * Player de vídeo para YouTube e Vimeo.
 * Lazy load via click — exibe thumbnail do YouTube antes de carregar.
 * Mobile-first: aspect-[9/16] em telas muito pequenas, aspect-video em sm+.
 */
export default function VideoPlayer({ url, titulo }: VideoPlayerProps) {
  const [ativado, setAtivado] = useState(false)
  const { embedUrl, provider } = resolveEmbedUrl(url)

  // Thumbnail do YouTube via oEmbed
  const ytId = provider === 'youtube' ? embedUrl.match(/embed\/([A-Za-z0-9_-]{11})/)?.[1] : null
  const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null

  return (
    <section className="section-padding" aria-label="Vídeo do imóvel">
      <h2 className="text-xs tracking-widest uppercase text-gold mb-4">Vídeo</h2>

      <div className="relative aspect-video overflow-hidden bg-ink group rounded-sm">
        {ativado ? (
          <iframe
            src={embedUrl}
            title={titulo ? `Vídeo — ${titulo}` : 'Vídeo do imóvel'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setAtivado(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center touch-manipulation"
            aria-label="Reproduzir vídeo"
          >
            {/* Thumbnail YouTube como background */}
            {thumbUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback para hqdefault se maxres não existir
                  ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                }}
              />
            )}

            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/40 transition-colors" />

            {/* Botão play */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 md:w-8 md:h-8 text-ink ml-1"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-white/90 transition-colors">
                Assistir vídeo
              </span>
            </div>
          </button>
        )}
      </div>

      <p className="mt-2 text-[10px] text-muted/50 text-right tracking-wide capitalize">
        {provider === 'youtube' ? 'YouTube' : provider === 'vimeo' ? 'Vimeo' : 'Vídeo'}
      </p>
    </section>
  )
}
