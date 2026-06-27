'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { cn } from '@/utils/cn'

export interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
}

interface GalleryProps {
  images: GalleryImage[]
  /**
   * 'grid'    → grid masonry editorial (padrão)
   * 'strip'   → faixa horizontal com scroll
   * 'mosaic'  → primeira imagem grande + grid lateral
   */
  layout?: 'grid' | 'strip' | 'mosaic'
  /** Ao clicar, abre lightbox */
  lightbox?: boolean
  /** Colunas no grid */
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * Gallery — galeria de imagens editorial.
 * Suporta lightbox nativo com navegação por teclado.
 *
 * @example
 * <Gallery
 *   images={imagens.map(i => ({ src: i.url, alt: i.titulo }))}
 *   layout="mosaic"
 *   lightbox
 * />
 */
export function Gallery({ images, layout = 'grid', lightbox = true, columns = 3, className }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = (i: number) => lightbox && setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null))

  const colClasses = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

  return (
    <>
      {/* Grid */}
      {layout === 'grid' && (
        <div className={cn('grid grid-cols-1 gap-2', colClasses[columns], className)}>
          {images.map((img, i) => (
            <GalleryThumb key={i} img={img} onClick={() => open(i)} />
          ))}
        </div>
      )}

      {/* Mosaic */}
      {layout === 'mosaic' && (
        <div className={cn('grid grid-cols-2 gap-2 md:grid-cols-3', className)}>
          {images.slice(0, 1).map((img, i) => (
            <div key={i} className="col-span-2 md:col-span-2">
              <GalleryThumb img={img} onClick={() => open(i)} aspect="video" />
            </div>
          ))}
          {images.slice(1, 5).map((img, i) => (
            <GalleryThumb key={i + 1} img={img} onClick={() => open(i + 1)} />
          ))}
        </div>
      )}

      {/* Strip */}
      {layout === 'strip' && (
        <div className={cn('flex gap-2 overflow-x-auto scrollbar-hide pb-2', className)}>
          {images.map((img, i) => (
            <div key={i} className="shrink-0 w-56">
              <GalleryThumb img={img} onClick={() => open(i)} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'Escape') close()
          }}
          tabIndex={0}
          role="dialog"
          aria-modal
          aria-label="Galeria de imagens"
        >
          {/* Imagem */}
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <NextImage
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              quality={90}
            />

            {/* Caption */}
            {images[lightboxIndex].alt && (
              <p className="absolute bottom-0 left-0 right-0 bg-ink/70 px-4 py-2 text-xs text-white/70 font-body">
                {images[lightboxIndex].alt}
              </p>
            )}
          </div>

          {/* Controles */}
          <button onClick={close} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Fechar">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Anterior">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Próxima">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 font-body tracking-widest">
                {lightboxIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}
    </>
  )
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function GalleryThumb({
  img,
  onClick,
  aspect = 'square',
}: {
  img: GalleryImage
  onClick: () => void
  aspect?: 'square' | 'video'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative block w-full overflow-hidden group',
        aspect === 'square' ? 'aspect-square' : 'aspect-video'
      )}
      aria-label={`Ver imagem: ${img.alt}`}
    >
      <NextImage
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        quality={80}
      />
      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300" />
    </button>
  )
}

export default Gallery
