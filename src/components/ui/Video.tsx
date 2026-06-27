'use client'

import { useState, useRef } from 'react'
import { cn } from '@/utils/cn'

interface VideoProps {
  /** URL do vídeo — YouTube, Vimeo, ou MP4 direto */
  src: string
  /** Poster (thumbnail) exibida antes de play */
  poster?: string
  title?: string
  /** Auto-play sem controles (loop, muted — para backgrounds) */
  ambient?: boolean
  /** Aspecto do container */
  aspect?: '16/9' | '4/3' | '1/1' | '21/9'
  className?: string
}

function getEmbedUrl(src: string): { type: 'youtube' | 'vimeo' | 'mp4'; url: string } {
  const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  if (yt) return { type: 'youtube', url: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1` }

  const vimeo = src.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` }

  return { type: 'mp4', url: src }
}

const aspectClasses = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
  '21/9': 'aspect-[21/9]',
}

/**
 * Video — player de vídeo editorial com suporte a YouTube/Vimeo/MP4.
 * Lazy load: exibe poster até click (economiza bandwidth).
 *
 * @example
 * <Video src="https://youtu.be/abc123" title="Tour Imóvel" poster={coverUrl} />
 * <Video src="/video/tour.mp4" ambient aspect="21/9" />
 */
export function Video({ src, poster, title, ambient = false, aspect = '16/9', className }: VideoProps) {
  const [playing, setPlaying] = useState(ambient)
  const { type, url } = getEmbedUrl(src)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (ambient && type === 'mp4') {
    return (
      <div className={cn('relative overflow-hidden', aspectClasses[aspect], className)}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-ink', aspectClasses[aspect], className)}>
      {!playing ? (
        // Thumbnail + play button
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Reproduzir vídeo${title ? `: ${title}` : ''}`}
        >
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt={title ?? 'Video thumbnail'} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30 group-hover:bg-ink/40 transition-colors duration-200">
            <div className="flex h-16 w-16 items-center justify-center border border-white/60 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-200">
              <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : type === 'mp4' ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          controls
          className="absolute inset-0 h-full w-full object-cover"
          title={title}
        />
      ) : (
        <iframe
          src={url}
          title={title ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  )
}

export default Video
