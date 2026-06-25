'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { urlForImovelImage } from '@/sanity/client'
import { formatPreco } from '@/lib/formatters'
import type { ImovelImagem } from '@/types/sanity'
import HeroMediaVideo from '@/components/ui/HeroMediaVideo'

interface HeroPDIProps {
  titulo: string
  preco?: number
  bairroNome?: string
  cidade?: string
  imagens: ImovelImagem[]
  condominioNome?: string
  novidade?: boolean
  condominioAnoEntrega?: number
  tourUrl?: string
  /** URL do vídeo hero: YouTube, Vimeo ou MP4. Quando presente, exibe hero imersivo antes do grid de fotos. */
  videoUrl?: string
}

export default function HeroPDI({
  titulo,
  preco,
  bairroNome,
  cidade,
  imagens,
  condominioNome,
  novidade,
  condominioAnoEntrega,
  tourUrl,
  videoUrl,
}: HeroPDIProps) {
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null)
  const [mobileIdx, setMobileIdx] = useState(0)
  const touchStartX = useRef(0)
  const heroRef = useRef<HTMLElement>(null)

  const capa = imagens.find((i) => i.arquivo.principal) ?? imagens[0]
  const galeria = imagens.filter((i) => i !== capa).slice(0, 4)

  // Badge: Lançamento ou Pronto para morar
  const currentYear = new Date().getFullYear()
  const isLancamento = novidade === true
  const isPronto =
    !isLancamento &&
    !!condominioAnoEntrega &&
    condominioAnoEntrega <= currentYear

  // ── GSAP parallax (desktop only) ──────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !heroRef.current || window.innerWidth < 768) return
    let kill: (() => void) | null = null
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.to(heroRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
      kill = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })()
    return () => kill?.()
  }, [])

  // ── Lightbox teclado ──────────────────────────────────────────────
  useEffect(() => {
    if (lightboxIndice === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndice(null)
      if (e.key === 'ArrowLeft')
        setLightboxIndice((i) => i === null ? null : (i - 1 + imagens.length) % imagens.length)
      if (e.key === 'ArrowRight')
        setLightboxIndice((i) => i === null ? null : (i + 1) % imagens.length)
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

  // ── Swipe mobile ──────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) setMobileIdx((i) => Math.min(i + 1, imagens.length - 1))
    if (dx > 50)  setMobileIdx((i) => Math.max(i - 1, 0))
  }

  const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: (delay: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
    }),
  }

  return (
    <>
      {/* ── HERO DE VÍDEO (se disponível) ─────────────────────────── */}
      {videoUrl && (
        <section
          style={{
            position: 'relative',
            height: '82vh',
            minHeight: 520,
            overflow: 'hidden',
            background: '#0a0f1e',
          }}
          aria-label={`Vídeo — ${titulo}`}
        >
          {/* Camada de vídeo */}
          <HeroMediaVideo url={videoUrl} />

          {/* Foto capa como fallback enquanto o vídeo carrega */}
          {imagens[0] && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <Image
                src={getUrl(imagens[0], 1600)}
                alt={titulo}
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                placeholder={imagens[0].arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={imagens[0].arquivo.asset?.metadata?.lqip}
              />
            </div>
          )}

          {/* Gradiente editorial */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.3) 50%, rgba(10,15,30,0.1) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to right, rgba(10,15,30,0.5) 0%, transparent 55%)',
            }}
          />

          {/* Texto sobreposto */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 5vh, 4rem)',
            }}
          >
            {(bairroNome || cidade) && (
              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                style={{
                  fontSize: '0.65rem', letterSpacing: '0.38em', textTransform: 'uppercase',
                  color: 'var(--color-gold, #b8960c)', marginBottom: '0.75rem',
                }}
              >
                {[bairroNome, cidade].filter(Boolean).join(' · ')}
              </motion.p>
            )}
            <motion.h2
              variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 300,
                fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1.06,
                color: '#fff', marginBottom: preco ? '0.75rem' : 0,
              }}
            >
              {titulo}
            </motion.h2>
            {preco && (
              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
                style={{
                  fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', color: 'rgba(255,255,255,0.65)',
                  fontWeight: 300, letterSpacing: '0.04em',
                }}
              >
                {formatPreco(preco)}
              </motion.p>
            )}
          </div>
        </section>
      )}

      <section ref={heroRef} className="relative w-full" aria-label="Fotos do imóvel">

        {/* ── MOBILE: hero fullbleed com overlay de texto ──────────── */}
        <div
          className="md:hidden relative w-full overflow-hidden"
          style={{ aspectRatio: '4/3' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightboxIndice(mobileIdx)}
          role="button"
          tabIndex={0}
          aria-label="Abrir galeria de fotos"
        >
          {/* Foto */}
          {imagens[mobileIdx] && (
            <Image
              src={getUrl(imagens[mobileIdx], 900)}
              alt={imagens[mobileIdx].arquivo.alt ?? titulo}
              fill
              priority={mobileIdx === 0}
              sizes="100vw"
              className="object-cover"
              placeholder={imagens[mobileIdx].arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={imagens[mobileIdx].arquivo.asset?.metadata?.lqip}
            />
          )}

          {/* Gradiente topo (para badges) */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Gradiente base (para texto) */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

          {/* Badge status — topo esquerdo */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            {isLancamento && (
              <span className="bg-gold text-white text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1">
                Lançamento
              </span>
            )}
            {isPronto && (
              <span className="bg-white text-ink text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1">
                Pronto para morar
              </span>
            )}
          </div>

          {/* Contador — topo direito */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="text-white/80 text-[11px] font-mono bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {mobileIdx + 1} / {imagens.length}
            </span>
          </div>

          {/* Texto overlay — base */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 pt-16 pointer-events-none">
            {(bairroNome || cidade) && (
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-1">
                {bairroNome}{cidade ? ` · ${cidade}` : ''}
              </p>
            )}
            {condominioNome && (
              <p className="text-white/80 text-sm font-light tracking-wide mb-0.5">
                {condominioNome}
              </p>
            )}
            <h1 className="text-white text-xl font-light leading-tight">
              {titulo}
            </h1>
            {preco && (
              <p className="text-gold text-xl font-light mt-2">
                {formatPreco(preco)}
              </p>
            )}
          </div>

          {/* Pontos de swipe */}
          {imagens.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1 pointer-events-none">
              {imagens.slice(0, Math.min(imagens.length, 8)).map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === mobileIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tour virtual — card abaixo da foto no mobile */}
        {tourUrl && (
          <div className="md:hidden px-5 pt-4">
            <a
              href={tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-gold/40 bg-gold/5 px-4 py-3 rounded-lg group"
            >
              {/* Ícone 360° */}
              <span className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center flex-shrink-0 text-gold text-xs font-mono group-hover:bg-gold group-hover:text-white transition-colors">
                360°
              </span>
              <div className="min-w-0">
                <p className="text-xs tracking-widest uppercase text-gold">Tour Virtual</p>
                <p className="text-sm text-ink font-light truncate">Ver decorado completo</p>
              </div>
              <svg className="w-4 h-4 text-muted ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        {/* ── DESKTOP: grid 5 fotos ─────────────────────────────────── */}
        <div className="relative hidden md:block">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: galeria.length > 0 ? '1fr 1fr' : '1fr',
              aspectRatio: '16/7',
            }}
          >
            {/* Foto principal */}
            <div
              className="relative overflow-hidden bg-stone cursor-pointer"
              style={{ gridRow: '1 / 3' }}
              onClick={() => setLightboxIndice(imagens.indexOf(capa))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightboxIndice(imagens.indexOf(capa))}
            >
              {capa && (
                <Image
                  src={getUrl(capa, 1200)}
                  alt={capa.arquivo.alt ?? titulo}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-[1.025] transition-transform duration-700 ease-out"
                  placeholder={capa.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={capa.arquivo.asset?.metadata?.lqip}
                />
              )}

              {/* Badge status desktop — topo esquerdo da foto principal */}
              {(isLancamento || isPronto) && (
                <div className="absolute top-4 left-4 z-10">
                  {isLancamento && (
                    <span className="bg-gold text-white text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5">
                      Lançamento
                    </span>
                  )}
                  {isPronto && (
                    <span className="bg-white text-ink text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5">
                      Pronto para morar
                    </span>
                  )}
                </div>
              )}

              {/* Tour button desktop */}
              {tourUrl && (
                <a
                  href={tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs tracking-wider uppercase px-3 py-2 rounded-full hover:bg-black/80 transition-colors"
                >
                  <span className="font-mono">360°</span>
                  <span>Tour virtual</span>
                </a>
              )}
            </div>

            {/* Fotos secundárias */}
            {galeria.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden bg-stone cursor-pointer"
                onClick={() => setLightboxIndice(imagens.indexOf(img))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxIndice(imagens.indexOf(img))}
              >
                <Image
                  src={getUrl(img, 600)}
                  alt={img.arquivo.alt ?? `Foto ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover hover:scale-[1.03] transition-transform duration-500 ease-out"
                  placeholder={img.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.arquivo.asset?.metadata?.lqip}
                />
              </div>
            ))}
          </div>

          {/* Botão ver todas */}
          {imagens.length > 5 && (
            <button
              onClick={() => setLightboxIndice(0)}
              className="absolute bottom-4 right-4 btn-outline text-xs px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              Ver todas as fotos ({imagens.length})
            </button>
          )}
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────── */}
      {lightboxIndice !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/96 flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <span className="text-white/60 text-sm font-mono">
              {lightboxIndice + 1} / {imagens.length}
            </span>
            <button
              onClick={() => setLightboxIndice(null)}
              className="text-white/60 hover:text-white transition-colors text-2xl leading-none p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-12 min-h-0">
            <div className="relative w-full h-full max-w-5xl mx-auto">
              <Image
                key={lightboxIndice}
                src={getUrl(imagens[lightboxIndice], 1600)}
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
              onClick={() => setLightboxIndice((i) => i === null ? null : (i - 1 + imagens.length) % imagens.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-4xl px-4 py-6"
            >‹</button>
            <button
              onClick={() => setLightboxIndice((i) => i === null ? null : (i + 1) % imagens.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-4xl px-4 py-6"
            >›</button>
          </div>

          <div className="flex-shrink-0 px-6 py-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndice(i)}
                  className={`relative w-16 h-12 flex-shrink-0 overflow-hidden transition-opacity ${
                    i === lightboxIndice ? 'opacity-100 ring-1 ring-gold' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <Image src={getUrl(img, 120)} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
