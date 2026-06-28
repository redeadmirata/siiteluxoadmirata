'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { Gallery } from '@/components/ui/Gallery'
import type { EmpreendimentoData } from './types'
import { formatNumero, formatPreco } from './formatters'
import { clipReveal, revealUp, staggerContainer, VIEWPORT_ONCE } from './anim'
import { Eyebrow, Reveal, SectionShell, SectionTitle } from './SectionPrimitives'

export function DiferenciaisSection({ data }: { data: EmpreendimentoData }) {
  let areaPrivativa: string | null = null
  if (
    data.areaPrivativaMin &&
    data.areaPrivativaMax &&
    data.areaPrivativaMin !== data.areaPrivativaMax
  ) {
    areaPrivativa = `${formatNumero(data.areaPrivativaMin)}–${formatNumero(data.areaPrivativaMax)} m²`
  } else if (data.areaPrivativaMin) {
    areaPrivativa = `${formatNumero(data.areaPrivativaMin)} m²`
  }

  const stats = [
    data.precoMinimo && { label: 'A partir de', value: formatPreco(data.precoMinimo) },
    areaPrivativa && { label: 'Área privativa', value: areaPrivativa },
    data.numUnidades && { label: 'Unidades', value: formatNumero(data.numUnidades) },
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
        {stats.map((stat) => (
          <m.div key={stat.label} variants={revealUp} className="bg-ink p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{stat.label}</p>
            <p className="mt-3 font-display text-2xl font-light leading-tight text-white sm:text-3xl">
              {stat.value}
            </p>
          </m.div>
        ))}
      </m.div>
    </SectionShell>
  )
}

export function GaleriaSection({
  galeria,
}: {
  galeria: NonNullable<EmpreendimentoData['galeria']>
}) {
  return (
    <SectionShell id="galeria">
      <Reveal>
        <Eyebrow>Galeria</Eyebrow>
      </Reveal>
      <SectionTitle>Cada ângulo, uma intenção</SectionTitle>
      <Reveal delay={0.1} className="mt-12">
        <Gallery
          images={galeria.map((imagem) => ({ src: imagem.src, alt: imagem.alt }))}
          layout="mosaic"
          lightbox
        />
      </Reveal>
    </SectionShell>
  )
}

export function PlantasSection({
  plantas,
}: {
  plantas: NonNullable<EmpreendimentoData['plantas']>
}) {
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
        {plantas.map((planta, index) => (
          <m.article
            key={`${planta.nome}-${index}`}
            variants={revealUp}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            {planta.src && (
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={planta.src}
                  alt={planta.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  placeholder={planta.lqip ? 'blur' : 'empty'}
                  blurDataURL={planta.lqip}
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-base font-medium text-white">{planta.nome}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                {planta.quartos && <span>{planta.quartos}</span>}
                {planta.area && <span className="font-mono">{formatNumero(planta.area)} m²</span>}
              </div>
            </div>
          </m.article>
        ))}
      </m.div>
    </SectionShell>
  )
}

export function LazerSection({ itens }: { itens: string[] }) {
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
            className="border-ink/10 flex items-center gap-3 border-b pb-4 text-base capitalize text-ink"
          >
            <span className="text-gold" aria-hidden="true">
              ✦
            </span>
            {item}
          </m.li>
        ))}
      </m.ul>
    </SectionShell>
  )
}

export function CTAFinalSection({ data }: { data: EmpreendimentoData }) {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-ink py-28 text-center text-white sm:py-40"
    >
      <div className="container-site">
        <Reveal>
          <Eyebrow>Fale com um especialista</Eyebrow>
        </Reveal>
        <m.h2
          variants={clipReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mx-auto max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.05]"
        >
          Conheça o {data.nome} de perto
        </m.h2>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
            Nossa equipe apresenta as melhores oportunidades e condições deste empreendimento, com
            atendimento sob medida.
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
