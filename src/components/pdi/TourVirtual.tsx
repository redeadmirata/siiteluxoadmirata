'use client'

import { useState } from 'react'

interface TourVirtualProps {
  url: string
  titulo?: string
}

/** Detecta a plataforma pelo domínio da URL */
function detectProvider(url: string): { label: string; poweredBy: string } {
  if (url.includes('kuula.co')) return { label: 'Tour Virtual 360°', poweredBy: 'Kuula' }
  if (url.includes('matterport.com')) return { label: 'Tour Virtual 3D', poweredBy: 'Matterport' }
  if (url.includes('iguide.tours')) return { label: 'Tour Virtual iGuide', poweredBy: 'iGuide' }
  if (url.includes('roundme.com')) return { label: 'Tour Virtual 360°', poweredBy: 'Roundme' }
  return { label: 'Tour Virtual 360°', poweredBy: '' }
}

/**
 * Tour virtual — suporta Kuula, Matterport, iGuide e qualquer iframe.
 * Lazy load via click para não penalizar LCP.
 * Mobile-first: aspect-[4/3] em telas pequenas, aspect-video em md+.
 */
export default function TourVirtual({ url, titulo }: TourVirtualProps) {
  const [ativado, setAtivado] = useState(false)
  const { label, poweredBy } = detectProvider(url)

  return (
    <section className="section-padding" aria-label={label}>
      <h2 className="text-xs tracking-widest uppercase text-gold mb-4">{label}</h2>

      {/* aspect-[4/3] em mobile (mais alto, toque mais fácil), 16/9 em md+ */}
      <div className="relative aspect-[4/3] md:aspect-video overflow-hidden bg-ink group rounded-sm">
        {ativado ? (
          <iframe
            src={url}
            title={titulo ? `${label} — ${titulo}` : label}
            allow="fullscreen; vr; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setAtivado(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-5 bg-ink text-white hover:bg-ink/90 active:bg-ink/80 transition-colors touch-manipulation"
            aria-label={`Iniciar ${label}`}
          >
            {/* Ícone 360° */}
            <div className="relative w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:scale-105 transition-all duration-300">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-10 h-10 text-gold"
                aria-hidden="true"
              >
                <path
                  d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 24h40M24 4c-4.418 5.523-7 11.523-7 20s2.582 14.477 7 20M24 4c4.418 5.523 7 11.523 7 20s-2.582 14.477-7 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
              </svg>
            </div>

            <div className="text-center">
              <span className="block text-sm font-medium text-white mb-1">
                Explorar em 360°
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-white/50">
                Toque para iniciar
              </span>
            </div>
          </button>
        )}
      </div>

      {poweredBy && (
        <p className="mt-2 text-[10px] text-muted/50 text-right tracking-wide">
          Powered by {poweredBy}
        </p>
      )}
    </section>
  )
}
