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
  /** @deprecated use condicao */
  novidade?: boolean
  condicao?: 'pronto' | 'lancamento' | 'em-obras' | 'obra-administracao'
  finalidade?: string
  condominioAnoEntrega?: number
  tourUrl?: string
  videoUrl?: string
}

export default function HeroCinematico({
  titulo,
  bairroNome,
  cidade,
  imagens,
  condicao,
  finalidade,
  tourUrl,
  videoUrl,
}: HeroCinematicoProps) {
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null)
  const heroRef  = useRef<HTMLElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const hasVideo = !!videoUrl

  const capa   = imagens.find((i) => i.arquivo.principal) ?? imagens[0]

  // Badges — derivados do campo `condicao`
  const isLancamento      = condicao === 'lancamento'
  const isPronto          = condicao === 'pronto'
  const isEmObras         = condicao === 'em-obras'
  const isObraAdmin       = condicao === 'obra-administracao'
  const isLocacao         = finalidade === 'Locação'
  const isTemporada       = finalidade === 'Temporada'

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

        {/* ── Gradiente editorial sutil — vignette cinematográfica ─── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: [
              /* inferior: ancora o eyebrow */
              'linear-gradient(to top, rgba(10,15,30,0.72) 0%, rgba(10,15,30,0.28) 18%, transparent 40%)',
              /* superior: evita superexposição do topo */
              'linear-gradient(to bottom, rgba(10,15,30,0.35) 0%, transparent 22%)',
            ].join(', '),
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
          {isEmObras && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
            >
              Em obras
            </motion.span>
          )}
          {isObraAdmin && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Sem banco · Sem juros
            </motion.span>
          )}
          {isLocacao && (
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

        {/* ── Texto overlay — só eyebrow (bairro · cidade) ───────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 md:px-10 md:pb-12 lg:px-16 lg:pb-14">

          {/* Eyebrow: localização apenas */}
          {(bairroNome || cidade) && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.42em] text-gold"
            >
              {[bairroNome, cidade].filter(Boolean).join(' · ')}
            </motion.p>
          )}

          {/* Tour virtual — discreto, canto inferior direito */}
          {tourUrl && (
            <a
              href={tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-10 right-6 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/45 transition-colors duration-300 hover:text-gold md:bottom-12 md:right-10 lg:bottom-14 lg:right-16"
              aria-label="Abrir tour virtual 360°"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current font-mono text-[10px]">
                  360°
                </span>
                <span className="hidden sm:inline">Tour virtual</span>
            </a>
          )}
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
          <div className="flex-shrink-0 overflow-x-auto px-6 