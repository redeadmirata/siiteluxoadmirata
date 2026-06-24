'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { urlForImovelImage } from '@/sanity/client'
import { formatPreco } from '@/lib/formatters'
import type { ImovelImagem } from '@/types/sanity'

interface HeroPDIProps {
  titulo: string
  preco?: number
  bairroNome?: string
  cidade?: string
  imagens: ImovelImagem[]
  onVerTodas?: () => void
}

export default function HeroPDI({
  titulo,
  preco,
  bairroNome,
  cidade,
  imagens,
}: HeroPDIProps) {
  const [imgErro, setImgErro] = useState<Record<number, boolean>>({})
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null)
  const [mobileIdx, setMobileIdx] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const touchStartX = useRef(0)

  const capa = imagens.find((i) => i.arquivo.principal) ?? imagens[0]
  const galeria = imagens.filter((i) => i !== capa).slice(0, 4)

  // ── GSAP parallax (desktop only, respects prefers-reduced-motion) ──
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

  // ── Lightbox teclado ─────────────────────────────────────────────
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

  // ── Swipe mobile ─────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) setMobileIdx((i) => Math.min(i + 1, imagens.length - 1))
    if (dx > 50)  setMobileIdx((i) => Math.max(i - 1, 0))
  }

  return (
    <>
      <section ref={heroRef} className="relative w-full" aria-label="Fotos do imóvel">

        {/* ── MOBILE: foto única fullbleed com swipe ─────────────── */}
        <div
          className="md:hidden relative w-full overflow-hidden"
          style={{ aspectRatio: '4/3' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightboxIndice(mobileIdx)}
          role="button"
          tabIndex={0}
          aria-label="Abrir galeria"
        >
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
          {/* Overlay gradiente base */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Contador */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
            <span className="text-white/80 text-xs font-mono bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {mobileIdx + 1} / {imagens.length}
            </span>
          </div>

          {/* Indicadores de swipe (pontos) */}
          {imagens.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
              {imagens.slice(0, Math.min(imagens.length, 8)).map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === mobileIdx
                      ? 'w-4 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
              {imagens.length > 8 && (
                <span className="text-white/40 text-xs leading-none self-center">…</span>
              )}
            </div>
          )}
        </div>

        {/* ── DESKTOP: grid de 5 fotos ───────────────────────────── */}
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
              {capa && !imgErro[0] ? (
                <Image
                  src={getUrl(capa, 1200)}
                  alt={capa.arquivo.alt ?? titulo}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-[1.025] transition-transform duration-700 ease-out"
                  placeholder={capa.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={capa.arquivo.asset?.metadata?.lqip}
                  onError={() => setImgErro((p) => ({ ...p, 0: true }))}
                />
              ) : (
                <div className="w-full h-full bg-stone flex items-center justify-center">
                  <span className="text-muted text-sm">Sem foto</span>
                </div>
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
                {!imgErro[i + 1] ? (
                  <Image
                    src={getUrl(img, 600)}
                    alt={img.arquivo.alt ?? `Foto ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-[1.03] transition-transform duration-500 ease-out"
                    placeholder={img.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.arquivo.asset?.metadata?.lqip}
                    onError={() => setImgErro((p) => ({ ...p, [i + 1]: true }))}
                  />
                ) : (
                  <div className="w-full h-full bg-stone" />
                )}
              </div>
            ))}
          </div>

          {/* Botão Ver todas (desktop) */}
          {imagens.length > 5 && (
            <button
              onClick={() => setLightboxIndice(0)}
              className="absolute bottom-4 right-4 btn-outline text-xs px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              Ver todas as fotos ({imagens.length})
            </button>
          )}
        </div>

        {/* ── Info overlay mobile ────────────────────────────────── */}
        <div className="md:hidden px-5 pt-5 pb-2">
          {bairroNome && (
            <p className="text-xs tracking-widest uppercase text-gold mb-1">
              {bairroNome}{cidade ? ` · ${cidade}` : ''}
            </p>
          )}
          <h1 className="text-display-lg text-ink leading-tight">{titulo}</h1>
          {preco && (
            <p className="text-price text-2xl text-ink mt-2">{formatPreco(preco)}</p>
          )}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
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
