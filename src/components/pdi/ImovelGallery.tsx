'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { urlForImovelImage } from '@/sanity/client'
import type { ImovelImagem } from '@/types/sanity'
import { CardStack, type CardStackItem } from '@/components/ui/card-stack'

interface ImovelGalleryProps {
  imagens: ImovelImagem[]
  titulo: string
  /** Controlado externamente — true abre o lightbox */
  aberto?: boolean
  onFechar?: () => void
}

export default function ImovelGallery({
  imagens,
  titulo,
  aberto = false,
  onFechar,
}: ImovelGalleryProps) {
  const [indice, setIndice] = useState(0)
  const [visivel, setVisivel] = useState(aberto)

  useEffect(() => setVisivel(aberto), [aberto])

  const fechar = useCallback(() => {
    setVisivel(false)
    onFechar?.()
  }, [onFechar])

  const anterior = useCallback(
    () => setIndice((i) => (i - 1 + imagens.length) % imagens.length),
    [imagens.length],
  )
  const proximo = useCallback(
    () => setIndice((i) => (i + 1) % imagens.length),
    [imagens.length],
  )

  // Teclado
  useEffect(() => {
    if (!visivel) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowLeft') anterior()
      if (e.key === 'ArrowRight') proximo()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visivel, fechar, anterior, proximo])

  function getUrl(img: ImovelImagem, w: number) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return urlForImovelImage(img.arquivo as any, w)
    } catch {
      return img.arquivo.asset?.url ?? ''
    }
  }

  // ── Monta items para o CardStack ─────────────────────────────────
  const stackItems: CardStackItem[] = imagens.map((img, i) => ({
    id: i,
    title: img.arquivo.alt ?? `Foto ${i + 1} de ${titulo}`,
    imageSrc: getUrl(img, 900),
    lqip: img.arquivo.asset?.metadata?.lqip,
  }))

  if (!visivel) {
    return (
      <section aria-label="Galeria de fotos" className="section-padding">
        <h2 className="text-xs tracking-widest uppercase text-gold mb-8">
          Galeria ({imagens.length} fotos)
        </h2>

        {/* CardStack — 3D fan carousel */}
        <CardStack
          items={stackItems}
          cardWidth={480}
          cardHeight={290}
          autoAdvance
          intervalMs={3500}
          pauseOnHover
          loop
          onClickCard={(_item, idx) => {
            setIndice(idx)
            setVisivel(true)
          }}
        />

        {/* Ver todas no lightbox */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => { setIndice(0); setVisivel(true) }}
            className="btn-outline text-xs px-6 py-2"
            aria-label={`Ver todas as ${imagens.length} fotos`}
          >
            Ver todas as fotos ({imagens.length})
          </button>
        </div>
      </section>
    )
  }

  // ── Lightbox ─────────────────────────────────────────────────────
  const imgAtual = imagens[indice]

  return (
    <div
      className="fixed inset-0 z-modal bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos em tela cheia"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <span className="text-white/60 text-sm">
          {indice + 1} / {imagens.length}
        </span>
        <button
          onClick={fechar}
          className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
          aria-label="Fechar galeria"
        >
          ✕
        </button>
      </div>

      {/* Imagem principal */}
      <div className="flex-1 relative flex items-center justify-center px-16 min-h-0">
        <div className="relative w-full h-full max-w-5xl mx-auto">
          <Image
            key={indice}
            src={getUrl(imgAtual, 1600)}
            alt={imgAtual.arquivo.alt ?? `Foto ${indice + 1}`}
            fill
            sizes="90vw"
            className="object-contain"
            placeholder={imgAtual.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={imgAtual.arquivo.asset?.metadata?.lqip}
            priority
          />
        </div>

        {/* Setas */}
        <button
          onClick={anterior}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl px-3 py-4 transition-colors"
          aria-label="Foto anterior"
        >
          ‹
        </button>
        <button
          onClick={proximo}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl px-3 py-4 transition-colors"
          aria-label="Próxima foto"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex-shrink-0 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 justify-center">
          {imagens.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              className={`relative w-16 h-12 flex-shrink-0 overflow-hidden transition-opacity ${
                i === indice ? 'opacity-100 ring-1 ring-gold' : 'opacity-40 hover:opacity-70'
              }`}
              aria-label={`Ir para foto ${i + 1}`}
              aria-current={i === indice}
            >
              <Image
                src={getUrl(img, 120)}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
