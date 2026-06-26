'use client'

/**
 * ImovelGallery
 * Grade fotográfica editorial para PDI.
 *
 * Desktop: grid assimétrico 3 colunas com cards de alturas variadas.
 * Mobile:  grade 2 colunas uniforme.
 * Exibe até 9 fotos na grade; botão "ver todas" abre lightbox completo.
 *
 * Aceita também props de controle externo (aberto / onFechar) para
 * compatibilidade com o uso legado em page.tsx.
 */

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { urlForImovelImage } from '@/sanity/client'
import type { ImovelImagem } from '@/types/sanity'

interface ImovelGalleryProps {
  imagens: ImovelImagem[]
  titulo: string
  /** Controlado externamente — true abre o lightbox diretamente */
  aberto?: boolean
  onFechar?: () => void
}

export default function ImovelGallery({
  imagens,
  titulo,
  aberto = false,
  onFechar,
}: ImovelGalleryProps) {
  const [indice, setIndice]   = useState(0)
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

  useEffect(() => {
    if (!visivel) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     fechar()
      if (e.key === 'ArrowLeft')  anterior()
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

  function abrirLightbox(i: number) {
    setIndice(i)
    setVisivel(true)
  }

  // ── Grid: até 9 fotos ─────────────────────────────────────────────
  // Layout assimétrico: foto 1 é grande (2 linhas), fotos 2-9 regulares
  const preview = imagens.slice(0, 9)
  const restante = imagens.length - preview.length

  if (!visivel) {
    return (
      <section aria-label="Galeria de fotos" className="section-padding">
        {/* Cabeçalho */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">
              Galeria
            </p>
            <h2 className="text-2xl font-light text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {imagens.length} fotos
            </h2>
          </div>
          {imagens.length > 9 && (
            <button
              onClick={() => abrirLightbox(0)}
              className="btn-outline text-xs px-5 py-2"
            >
              Ver todas ({imagens.length})
            </button>
          )}
        </div>

        {/* Grade fotográfica */}
        <div
          className="grid gap-1 md:gap-1.5"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto',
          }}
        >
          {preview.map((img, i) => {
            // Foto 0: ocupa 2 linhas na 1ª coluna (apenas desktop)
            const isCapa = i === 0
            return (
              <motion.button
                key={i}
                onClick={() => abrirLightbox(i)}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                className={`group relative overflow-hidden bg-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isCapa ? 'md:[grid-row:span_2]' : ''
                }`}
                style={{ aspectRatio: isCapa ? '4/5' : '4/3' }}
                aria-label={`Ver foto ${i + 1} de ${imagens.length} — ${titulo}`}
              >
                <Image
                  src={getUrl(img, isCapa ? 900 : 600)}
                  alt={img.arquivo.alt ?? `Foto ${i + 1} — ${titulo}`}
                  fill
                  sizes={isCapa ? '33vw' : '25vw'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  placeholder={img.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.arquivo.asset?.metadata?.lqip}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />

                {/* Ícone expand no hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Overlay "ver mais" na última foto */}
                {i === preview.length - 1 && restante > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/75 backdrop-blur-sm">
                    <span className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      +{restante}
                    </span>
                    <span className="mt-1 text-[11px] uppercase tracking-widest text-white/70">
                      fotos
                    </span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* CTA ver todas (mobile: sempre visível se >9, desktop: só se sem overlay) */}
        {imagens.length > 9 && (
          <div className="mt-6 flex justify-center md:hidden">
            <button
              onClick={() => abrirLightbox(0)}
              className="btn-outline text-xs px-6 py-2"
            >
              Ver todas as {imagens.length} fotos
            </button>
          </div>
        )}
      </section>
    )
  }

  // ── Lightbox ──────────────────────────────────────────────────────
  const imgAtual = imagens[indice]

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/96"
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos em tela cheia"
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between px-6 py-4">
        <span className="font-mono text-sm text-white/40">
          {indice + 1} / {imagens.length}
        </span>
        <button
          onClick={fechar}
          className="p-2 text-2xl leading-none text-white/50 transition-colors hover:text-white"
          aria-label="Fechar galeria"
        >
          ✕
        </button>
      </div>

      {/* Imagem principal */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12">
        <div className="relative mx-auto h-full w-full max-w-5xl">
          <Image
            key={indice}
            src={getUrl(imgAtual, 1800)}
            alt={imgAtual.arquivo.alt ?? `Foto ${indice + 1}`}
            fill
            sizes="90vw"
            className="object-contain"
            placeholder={imgAtual.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={imgAtual.arquivo.asset?.metadata?.lqip}
            priority
          />
        </div>
        <button
          onClick={anterior}
          className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-6 text-4xl text-white/40 transition-colors hover:text-white"
          aria-label="Foto anterior"
        >
          ‹
        </button>
        <button
          onClick={proximo}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-6 text-4xl text-white/40 transition-colors hover:text-white"
          aria-label="Próxima foto"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex-shrink-0 overflow-x-auto px-6 py-4">
        <div className="flex justify-center gap-1.5">
          {imagens.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              className={`relative h-12 w-16 flex-shrink-0 overflow-hidden transition-opacity ${
                i === indice ? 'opacity-100 ring-1 ring-gold' : 'opacity-35 hover:opacity-70'
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
