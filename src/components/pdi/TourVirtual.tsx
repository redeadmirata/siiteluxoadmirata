'use client'

import { useState } from 'react'

interface TourVirtualProps {
  url: string
  titulo?: string
}

/**
 * Tour virtual 3D — suporta Matterport e qualquer iframe compatível.
 * Carregado com lazy click para não penalizar o LCP.
 */
export default function TourVirtual({ url, titulo }: TourVirtualProps) {
  const [ativado, setAtivado] = useState(false)

  return (
    <section className="section-padding" aria-label="Tour virtual 3D">
      <h2 className="text-xs tracking-widest uppercase text-gold mb-6">Tour Virtual 3D</h2>

      <div className="relative aspect-video overflow-hidden bg-ink group">
        {ativado ? (
          <iframe
            src={url}
            title={titulo ? `Tour virtual — ${titulo}` : 'Tour virtual 3D do imóvel'}
            allow="fullscreen; vr; xr-spatial-tracking"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setAtivado(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-ink text-white hover:bg-ink/90 transition-colors"
            aria-label="Iniciar tour virtual"
          >
            {/* Ícone 360° */}
            <div className="relative w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors duration-300">
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
            <span className="text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-white/90 transition-colors">
              Explorar em 360°
            </span>
          </button>
        )}
      </div>

      <p className="mt-2 text-[10px] text-muted/60 text-right tracking-wide">
        Powered by Matterport
      </p>
    </section>
  )
}
