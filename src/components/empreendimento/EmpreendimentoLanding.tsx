'use client'

/**
 * EmpreendimentoLanding — composição cinematográfica de empreendimento (Fase 3).
 *
 * Ordem narrativa (10 seções):
 *   1. Hero (HeroEmpreendimento, renderizado aqui)
 *   2. Manifesto · 3. Arquitetura · 4. Lifestyle · 5. Localização ·
 *   6. Diferenciais · 7. Galeria · 8. Plantas · 9. Lazer · 10. CTA Final
 *
 * Recursos: Framer Motion (reveals + parallax), scroll suave via Lenis (global),
 * GSAP/ScrollTrigger sincronizado no SmoothScrollProvider. Cada seção só renderiza
 * quando há dado correspondente (renderização condicional — sem blocos vazios).
 *
 * Regra do design system: todas as cores/tipografia vêm de tokens (ink, gold,
 * stone, muted; --font-display/body/mono). Nada hardcoded fora do sistema.
 */

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Gallery } from '@/components/ui/Gallery'
import HeroEmpreendimento from './HeroEmpreendimento'
import { revealUp, clipReveal, staggerContainer, VIEWPORT_ONCE } from './anim'

// ─── Tipos ─────────────────────────────────────────────────────────────────

export interface EmpreendimentoData {
  nome: string
  tipoLabel?: string
  status?: string
  bairroNome?: string
  cidade?: string
  estado?: string
  // Hero
  heroImageSrc?: string
  heroImageLqip?: string
  heroVideoMp4?: string
  // Narrativa
  manifesto?: string
  sobreParagrafos?: string[]
  // Specs
  construtora?: string
  anoEntrega?: number
  numTorres?: number
  numUnidades?: number
  areaTotal?: number
  prazoEntrega?: string
  precoMinimo?: number
  areaPrivativaMin?: number
  areaPrivativaMax?: number
  // Listas
  infraestrutura?: string[]
  galeria?: Array<{ src: string; alt: string; legenda?: string; lqip?: string }>
  plantas?: Array<{ nome: string; quartos?: string; area?: number; src?: string; lqip?: string }>
  proximidades?: string[]
  geo?: { lat?: number; lng?: number }
  // CTA
  whatsappHref: string
  whatsappHrefRS?: string
  imoveisHref?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatPreco(v: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(v)
}

function formatNum(v: number) {
  return v.toLocaleString('pt-BR')
}

// ─── Primitivos de seção ─────────────────────────────────────────────────────

/** Reveal — anima filhos ao entrar na viewport (fade+up+blur). */
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={{ delay }}
      className={className}
    >
      {children}
    </m.div>
  )
}

/** Eyebrow editorial — rótulo curto com filete dourado. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold">
      <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Headline de seção com clip-path reveal. */
function SectionTitle({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <m.h2
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      style={{ fontFamily: 'var(--font-display)' }}
      className={`text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] ${light ? 'text-white' : 'text-ink'}`}
    >
      {children}
    </m.h2>
  )
}

interface SectionShellProps {
  id: string
  children: ReactNode
  dark?: boolean
  className?: string
}

/** Casca de seção: id de âncora, respiro vertical generoso, fundo opcional escuro. */
function SectionShell({ id, children, dark = false, className = '' }: SectionShellProps) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 ${dark ? 'bg-ink text-white' : 'bg-stone/30'} ${className}`}
    >
      <div className="container-site">{children}</div>
    </section>
  )
}

/** Imagem com parallax suave ao scrollar (translateY). */
function ParallaxImage({ src, alt, lqip }: { src: string; alt: string; lqip?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <div ref={ref} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
      <m.div className="absolute inset-0" style={prefersReduced ? undefined : { y }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover scale-110" placeholder={lqip ? 'blur' : 'empty'} blurDataURL={lqip} />
      </m.div>
    </div>
  )
}

// ─── Seção 2 · Manifesto ──────────────────────────────────────────────────────

function ManifestoSection({ texto, nome }: { texto: string; nome: string }) {
  return (
    <SectionShell id="manifesto" dark>
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>Manifesto</Eyebrow>
        </Reveal>
        <m.p
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-[clamp(1.6rem,3.5vw,2.75rem)] font-light leading-[1.35] text-white/90"
        >
          {texto}
        </m.p>
        <Reveal delay={0.15}>
          <span className="mt-10 block text-xs uppercase tracking-[0.35em] text-gold">{nome}</span>
        </Reveal>
      </div>
    </SectionShell>
  )
}

// ─── Seção 3 · Arquitetura ────────────────────────────────────────────────────

function ArquiteturaSection({ data }: { data: EmpreendimentoData }) {
  const specs = [
    data.construtora && { label: 'Assinatura', value: data.construtora },
    data.numTorres && { label: 'Torres', value: formatNum(data.numTorres) },
    data.anoEntrega && { label: 'Entrega', value: String(data.anoEntrega) },
    data.areaTotal && { label: 'Área total', value: `${formatNum(data.areaTotal)} m²` },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const paragrafo = data.sobreParagrafos?.[0]
  const img = data.galeria?.[0]

  return (
    <SectionShell id="arquitetura">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Arquitetura</Eyebrow>
          </Reveal>
          <SectionTitle>Desenho que perdura</SectionTitle>
          {paragrafo && (
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{paragrafo}</p>
            </Reveal>
          )}
          {specs.length > 0 && (
            <m.dl
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6"
            >
              {specs.map((s) => (
                <m.div key={s.label} variants={revealUp}>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">{s.label}</dt>
                  <dd className="mt-1 text-lg font-medium text-ink">{s.value}</dd>
                </m.div>
              ))}
            </m.dl>
          )}
        </div>
        {img && (
          <Reveal>
            <ParallaxImage src={img.src} alt={img.alt} lqip={img.lqip} />
          </Reveal>
        )}
      </div>
    </SectionShell>
  )
}

// ─── Seção 4 · Lifestyle ──────────────────────────────────────────────────────

function LifestyleSection({ data }: { data: EmpreendimentoData }) {
  const paragrafos = (data.sobreParagrafos ?? []).slice(1)
  const img = data.galeria?.[1] ?? data.galeria?.[0]

  return (
    <SectionShell id="lifestyle" dark>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {img && (
          <Reveal className="order-2 lg:order-1">
            <ParallaxImage src={img.src} alt={img.alt} lqip={img.lqip} />
          </Reveal>
        )}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Lifestyle</Eyebrow>
          </Reveal>
          <SectionTitle light>Uma rotina extraordinária</SectionTitle>
          <div className="mt-6 space-y-5">
            {paragrafos.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-base leading-relaxed text-white/70 sm:text-lg">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

// ─── Seção 5 · Localização ────────────────────────────────────────────────────

function LocalizacaoSection({ data }: { data: EmpreendimentoData }) {
  const estadoLabel = data.estado === 'RJ' ? 'Rio de Janeiro' : data.estado === 'RS' ? 'Rio Grande do Sul' : data.estado
  const mapsHref =
    data.geo?.lat && data.geo?.lng
      ? `https://www.google.com/maps/search/?api=1&query=${data.geo.lat},${data.geo.lng}`
      : undefined

  return (
    <SectionShell id="localizacao">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>Localização</Eyebrow>
        </Reveal>
        <SectionTitle>
          {data.bairroNome ?? 'Endereço privilegiado'}
          {data.cidade || estadoLabel ? (
            <span className="mt-2 block text-lg font-normal tracking-normal text-muted">
              {[data.cidade, estadoLabel].filter(Boolean).join(', ')}
            </span>
          ) : null}
        </SectionTitle>
      </div>

      {data.proximidades && data.proximidades.length > 0 && (
        <m.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-12 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.proximidades.map((p) => (
            <m.li
              key={p}
              variants={revealUp}
              className="flex items-start gap-3 border-t border-ink/10 pt-4 text-base text-ink"
            >
              <span className="mt-1 text-gold" aria-hidden="true">→</span>
              {p}
            </m.li>
          ))}
        </m.ul>
      )}

      {mapsHref && (
        <Reveal delay={0.1}>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-2 border-b border-gold pb-1 text-sm font-medium uppercase tracking-wider text-gold transition-opacity hover:opacity-70"
          >
            Ver no mapa
          </a>
        </Reveal>
      )}
    </SectionShell>
  )
}

// ─── Seção 6 · Diferenciais ───────────────────────────────────────────────────

function DiferenciaisSection({ data }: { data: EmpreendimentoData }) {
  const areaPriv =
    data.areaPrivativaMin && data.areaPrivativaMax && data.areaPrivativaMin !== data.areaPrivativaMax
      ? `${formatNum(data.areaPrivativaMin)}–${formatNum(data.areaPrivativaMax)} m²`
      : data.areaPrivativaMin
        ? `${formatNum(data.areaPrivativaMin)} m²`
        : null

  const stats = [
    data.precoMinimo && { label: 'A partir de', value: formatPreco(data.precoMinimo) },
    areaPriv && { label: 'Área privativa', value: areaPriv },
    data.numUnidades && { label: 'Unidades', value: formatNum(data.numUnidades) },
    data.prazoEntrega
      ? { label: 'Entrega', value: data.prazoEntrega }
      : data.anoEntrega && { label: 'Entrega', value: String(data.anoEntrega) },
    data.status && { label: 'Status', value: data.status },
    data.construtora && { label: 'Incorporadora', value: data.construtora },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <SectionShell id="diferenciais" dark>
      <Reveal>
        <Eyebrow>Diferenciais</Eyebrow>
      </Reveal>
      <SectionTitle light>O que torna único</SectionTitle>

      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((s) => (
          <m.div key={s.label} variants={revealUp} className="bg-ink p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{s.label}</p>
            <p
              style={{ fontFamily: 'var(--font-display)' }}
              className="mt-3 text-2xl font-light leading-tight text-white sm:text-3xl"
            >
              {s.value}
            </p>
          </m.div>
        ))}
      </m.div>
    </SectionShell>
  )
}

// ─── Seção 7 · Galeria ────────────────────────────────────────────────────────

function GaleriaSection({ galeria }: { galeria: NonNullable<EmpreendimentoData['galeria']> }) {
  return (
    <SectionShell id="galeria">
      <Reveal>
        <Eyebrow>Galeria</Eyebrow>
      </Reveal>
      <SectionTitle>Cada ângulo, uma intenção</SectionTitle>
      <Reveal delay={0.1} className="mt-12">
        <Gallery
          images={galeria.map((g) => ({ src: g.src, alt: g.alt }))}
          layout="mosaic"
          lightbox
        />
      </Reveal>
    </SectionShell>
  )
}

// ─── Seção 8 · Plantas ────────────────────────────────────────────────────────

function PlantasSection({ plantas }: { plantas: NonNullable<EmpreendimentoData['plantas']> }) {
  return (
    <SectionShell id="plantas" dark>
      <Reveal>
        <Eyebrow>Plantas</Eyebrow>
      </Reveal>
      <SectionTitle light>Espaços pensados para viver</SectionTitle>

      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plantas.map((p, i) => (
          <m.article
            key={`${p.nome}-${i}`}
            variants={revealUp}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            {p.src && (
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={p.src}
                  alt={p.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  placeholder={p.lqip ? 'blur' : 'empty'}
                  blurDataURL={p.lqip}
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-base font-medium text-white">{p.nome}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                {p.quartos && <span>{p.quartos}</span>}
                {p.area && <span style={{ fontFamily: 'var(--font-mono)' }}>{formatNum(p.area)} m²</span>}
              </div>
            </div>
          </m.article>
        ))}
      </m.div>
    </SectionShell>
  )
}

// ─── Seção 9 · Lazer ──────────────────────────────────────────────────────────

function LazerSection({ itens }: { itens: string[] }) {
  return (
    <SectionShell id="lazer">
      <Reveal>
        <Eyebrow>Lazer &amp; Infraestrutura</Eyebrow>
      </Reveal>
      <SectionTitle>Tudo a poucos passos</SectionTitle>

      <m.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {itens.map((item) => (
          <m.li
            key={item}
            variants={revealUp}
            className="flex items-center gap-3 border-b border-ink/10 pb-4 text-base capitalize text-ink"
          >
            <span className="text-gold" aria-hidden="true">✦</span>
            {item}
          </m.li>
        ))}
      </m.ul>
    </SectionShell>
  )
}

// ─── Seção 10 · CTA Final ─────────────────────────────────────────────────────

function CTAFinalSection({ data }: { data: EmpreendimentoData }) {
  return (
    <section id="cta-final" className="relative overflow-hidden bg-ink py-28 text-center text-white sm:py-40">
      <div className="container-site">
        <Reveal>
          <Eyebrow>Fale com um especialista</Eyebrow>
        </Reveal>
        <m.h2
          variants={clipReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          style={{ fontFamily: 'var(--font-display)' }}
          className="mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.05]"
        >
          Conheça o {data.nome} de perto
        </m.h2>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
            Nossa equipe apresenta as melhores oportunidades e condições deste empreendimento,
            com atendimento sob medida.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={data.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-9 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-[var(--color-gold-light)]"
            >
              Falar pelo WhatsApp
            </a>
            {data.whatsappHrefRS && (
              <a
                href={data.whatsappHrefRS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-9 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
              >
                WhatsApp Serra Gaúcha
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Composer ─────────────────────────────────────────────────────────────────

export default function EmpreendimentoLanding({ data }: { data: EmpreendimentoData }) {
  const temArquitetura = data.construtora || data.numTorres || data.anoEntrega || data.areaTotal || data.sobreParagrafos?.[0]
  const temLifestyle = (data.sobreParagrafos?.length ?? 0) > 1
  const temLocalizacao = data.bairroNome || (data.proximidades?.length ?? 0) > 0
  const temDiferenciais = data.precoMinimo || data.numUnidades || data.prazoEntrega || data.status || data.areaPrivativaMin
  const temGaleria = (data.galeria?.length ?? 0) > 0
  const temPlantas = (data.plantas?.length ?? 0) > 0
  const temLazer = (data.infraestrutura?.length ?? 0) > 0

  return (
    <>
      <HeroEmpreendimento
        nome={data.nome}
        tipoLabel={data.tipoLabel}
        status={data.status}
        bairroNome={data.bairroNome}
        cidade={data.cidade}
        estado={data.estado}
        imageSrc={data.heroImageSrc}
        imageLqip={data.heroImageLqip}
        videoMp4={data.heroVideoMp4}
        proximaSecaoId={data.manifesto ? 'manifesto' : temArquitetura ? 'arquitetura' : 'galeria'}
      />

      {data.manifesto && <ManifestoSection texto={data.manifesto} nome={data.nome} />}
      {temArquitetura && <ArquiteturaSection data={data} />}
      {temLifestyle && <LifestyleSection data={data} />}
      {temLocalizacao && <LocalizacaoSection data={data} />}
      {temDiferenciais && <DiferenciaisSection data={data} />}
      {temGaleria && <GaleriaSection galeria={data.galeria!} />}
      {temPlantas && <PlantasSection plantas={data.plantas!} />}
      {temLazer && <LazerSection itens={data.infraestrutura!} />}
      <CTAFinalSection data={data} />
    </>
  )
}
