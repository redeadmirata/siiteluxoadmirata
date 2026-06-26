'use client'

/**
 * HeroCinematico
 * Hero full-screen para PDI da Admirata.
 *
 * Prioridade de mídia:
 *   1. videoUrl  → vídeo imersivo de fundo (YouTube / Vimeo / MP4)
 *   2. imagens[0] → foto de destaque com parallax GSAP
 *
 * Layout:
 *   - 100dvh, overflow hidden
 *   - Duplo gradiente (base escura p/ texto + lateral esquerda)
 *   - Sobreposição de texto: eyebrow → condomínio → H1 → preço / stats / tour
 *   - Badge (Lançamento / Pronto / Locação) — topo esquerdo
 *   - Botão galeria — topo direito
 *   - Scroll indicator — base centro
 *   - Lightbox interno para todas as fotos
 */

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { urlForImovelImage } from '@/sanity/client'
import { formatPreco, formatArea } from '@/lib/formatters'
import type { ImovelImagem } from '@/types/sanity'
import HeroMediaVideo from '@/components/ui/HeroMediaVideo'

export interface HeroCinematicoProps {
  titulo: string
  preco?: number
  precoSobConsulta?: boolean
  bairroNome?: string
  cidade?: string
  quartos?: number
  areaUtil?: number
  imagens: ImovelImagem[]
  condominioNome?: string
  novidade?: boolean
  finalidade?: string
  condominioAnoEntrega?: number
  tourUrl?: string
  videoUrl?: string
}

export default function HeroCinematico({
  titulo,
  preco,
  precoSobConsulta,
  bairroNome,
  cidade,
  quartos,
  areaUtil,
  imagens,
  condominioNome,
  novidade,
  finalidade,
  condominioAnoEntrega,
  tourUrl,
  videoUrl,
}: HeroCinematicoProps) {
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null)
  const heroRef  = useRef<HTMLElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const hasVideo = !!videoUrl

  const capa   = imagens.find((i) => i.arquivo.principal) ?? imagens[0]

  // Badges
  const currentYear   = new Date().getFullYear()
  const isLancamento  = novidade === true
  const isPronto      = !isLancamento && !!condominioAnoEntrega && condominioAnoEntrega <= currentYear
  const isLocacao     = finalidade === 'Locação'
  const isTemporada   = finalidade === 'Temporada'

  // ── GSAP parallax (apenas para foto, não vídeo) ───────────────────
  useEffect(() => {
    if (hasVideo) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !heroRef.current || !imgRef.current) return
    let kill: (() => void) | null = null
    ;(async () => {
      const { default: gsap }   = await import('gsap')
      const { ScrollTrigger }   = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.to(imgRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.6,
        },
      })
      kill = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })()
    return () => kill?.()
  }, [hasVideo])

  // ── Lightbox: teclado ──────────────────────────────────────────────
  useEffect(() => {
    if (lightboxIndice === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      setLightboxIndice(null)
      if (e.key === 'ArrowLeft')   setLightboxIndice((i) => i === null ? null : (i - 1 + imagens.length) % imagens.length)
      if (e.key === 'ArrowRight')  setLightboxIndice((i) => i === null ? null : (i + 1) % imagens.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndice, imagens.length])

  function getUrl(img: ImovelImagem, w: number) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return urlForImovelImage(img.arquivo as any, w)
    } catch {
      return img.arquivo.asset?.url ?? ''
    }
  }

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100dvh', minHeight: 600, maxHeight: 1080 }}
        aria-label={`${hasVideo ? 'Vídeo' : 'Foto de destaque'} — ${titulo}`}
      >
        {/* ── Mídia de fundo ──────────────────────────────────────── */}

        {/* Foto (parallax, sob o vídeo quando há vídeo) */}
        <div
          ref={imgRef}
          className="absolute inset-0"
          style={{ transform: 'scale(1.12)', transformOrigin: 'center top' }}
        >
          {capa && (
            <Image
              src={getUrl(capa, 1920)}
              alt={capa.arquivo.alt ?? titulo}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              placeholder={capa.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={capa.arquivo.asset?.metadata?.lqip}
            />
          )}
        </div>

        {/* Vídeo imersivo (sobrepõe a foto; foto é o fallback/poster) */}
        {hasVideo && <HeroMediaVideo url={videoUrl} />}

        {/* ── Grain cinematográfico ────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />

        {/* ── Gradientes editoriais ────────────────────────────────── */}
        {/* Base: escurece para o texto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              'linear-gradient(to top, rgba(10,15,30,0.97) 0%, rgba(10,15,30,0.65) 30%, rgba(10,15,30,0.15) 60%, transparent 85%)',
          }}
        />
        {/* Lateral: melhora legibilidade do texto à esquerda */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              'linear-gradient(to right, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.15) 50%, transparent 75%)',
          }}
        />

        {/* ── Topo esquerdo: badges ───────────────────────────────── */}
        <div className="absolute left-6 top-6 z-10 flex items-center gap-2 md:left-10 md:top-8">
          {isLancamento && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Lançamento
            </motion.span>
          )}
          {isPronto && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur-sm"
            >
              Pronto para morar
            </motion.span>
          )}
          {isLocacao && !isLancamento && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="border border-white/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
            >
              Locação
            </motion.span>
          )}
          {isTemporada && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="border border-white/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
            >
              Temporada
            </motion.span>
          )}
        </div>

        {/* ── Topo direito: botão galeria ─────────────────────────── */}
        {imagens.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="absolute right-6 top-6 z-10 md:right-10 md:top-8"
          >
            <button
              onClick={() => setLightboxIndice(0)}
              className="flex items-center gap-2.5 border border-white/15 bg-black/50 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-black/70 hover:text-white"
              aria-label={`Ver galeria completa — ${imagens.length} fotos`}
            >
              {/* Grid icon */}
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="6" height="6" rx="0.5" />
                <rect x="9" y="1" width="6" height="6" rx="0.5" />
                <rect x="1" y="9" width="6" height="6" rx="0.5" />
                <rect x="9" y="9" width="6" height="6" rx="0.5" />
              </svg>
              <span>{imagens.length} fotos</span>
            </button>
          </motion.div>
        )}

        {/* ── Texto overlay — base esquerda ───────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-14 pt-24 md:px-10 md:pb-16 lg:px-16 lg:pb-20">

          {/* Localização */}
          {(bairroNome || cidade) && (
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold md:mb-4"
            >
              {[bairroNome, cidade].filter(Boolean).join(' · ')}
            </motion.p>
          )}

          {/* Condomínio */}
          {condominioNome && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
              className="mb-1.5 text-sm font-light tracking-wide text-white/60 md:text-base"
            >
              {condominioNome}
            </motion.p>
          )}

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
            className="mb-5 font-light leading-[1.04] text-white md:mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5.5vw, 5.2rem)',
            }}
          >
            {titulo}
          </motion.h1>

          {/* Preço + stats + tour */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.52 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {/* Preço */}
            {preco && !precoSobConsulta && (
              <span
                className="text-xl text-white md:text-2xl"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              >
                {formatPreco(preco)}
              </span>
            )}
            {precoSobConsulta && (
              <span className="text-sm font-light tracking-wide text-white/55">
                Valor sob consulta
              </span>
            )}

            {/* Divisor */}
            {(preco || precoSobConsulta) && (quartos || areaUtil) && (
              <span aria-hidden="true" className="h-3.5 w-px bg-white/20" />
            )}

            {/* Quartos */}
            {quartos && (
              <span className="text-sm font-light text-white/50">
                {quartos}&nbsp;{quartos === 1 ? 'quarto' : 'quartos'}
              </span>
            )}

            {/* Área */}
            {areaUtil && (
              <span className="text-sm font-light text-white/50">
                {formatArea(areaUtil)}
              </span>
            )}

            {/* Tour virtual */}
            {tourUrl && (
              <a
                href={tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/55 transition-colors duration-300 hover:text-gold"
                aria-label="Abrir tour virtual 360°"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current font-mono text-[10px]">
                  360°
                </span>
                <span className="hidden sm:inline">Tour virtual</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* ── Scroll indicator ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">scroll</span>
            <svg
              className="h-7 w-5 text-white/25"
              viewBox="0 0 20 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="1" y="1" width="18" height="30" rx="9" strokeOpacity="0.5" />
              <circle cx="10" cy="8" r="2.5" fill="currentColor" fillOpacity="0.7">
                <animate attributeName="cy" values="8;20;8" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════════════════════════════════ */}
      {lightboxIndice !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/96"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between px-6 py-4">
            <span className="font-mono text-sm text-white/40">
              {lightboxIndice + 1} / {imagens.length}
            </span>
            <button
              onClick={() => setLightboxIndice(null)}
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
                key={lightboxIndice}
                src={getUrl(imagens[lightboxIndice], 1800)}
                alt={imagens[lightboxIndice].arquivo.alt ?? `Foto ${lightboxIndice + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                placeholder={imagens[lightboxIndice].arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={imagens[lightboxIndice].arquivo.asset?.metadata?.lqip}
                priority
              />
            </div>
            <button
              onClick={() =>
                setLightboxIndice((i) => i === null ? null : (i - 1 + imagens.length) % imagens.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-6 text-4xl text-white/40 transition-colors hover:text-white"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setLightboxIndice((i) => i === null ? null : (i + 1) % imagens.length)
              }
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
                  onClick={() => setLightboxIndice(i)}
                  className={`relative h-12 w-16 flex-shrink-0 overflow-hidden transition-opacity ${
                    i === lightboxIndice
                      ? 'opacity-100 ring-1 ring-gold'
                      : 'opacity-35 hover:opacity-70'
                  }`}
                  aria-label={`Ir para foto ${i + 1}`}
                  aria-current={i === lightboxIndice}
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
      )}
    </>
  )
}
