'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import type { EmpreendimentoData } from './types'
import { formatNumero } from './formatters'
import { revealUp, staggerContainer, VIEWPORT_ONCE } from './anim'
import { Eyebrow, ParallaxImage, Reveal, SectionShell, SectionTitle } from './SectionPrimitives'

export function ManifestoSection({ texto, nome }: { texto: string; nome: string }) {
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
          className="font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-light leading-[1.35] text-white/90"
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

export function ArquiteturaSection({ data }: { data: EmpreendimentoData }) {
  const specs = [
    data.construtora && { label: 'Assinatura', value: data.construtora },
    data.numTorres && { label: 'Torres', value: formatNumero(data.numTorres) },
    data.anoEntrega && { label: 'Entrega', value: String(data.anoEntrega) },
    data.areaTotal && { label: 'Área total', value: `${formatNumero(data.areaTotal)} m²` },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const paragrafo = data.sobreParagrafos?.[0]
  const imagem = data.galeria?.[0]

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
              {specs.map((spec) => (
                <m.div key={spec.label} variants={revealUp}>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-lg font-medium text-ink">{spec.value}</dd>
                </m.div>
              ))}
            </m.dl>
          )}
        </div>
        {data.arquiteturaLogoSrc && (
          <Reveal>
            <div className="border-ink/10 flex min-h-[420px] items-center justify-center rounded-2xl border bg-white p-10 shadow-sm sm:p-16">
              <Image
                src={data.arquiteturaLogoSrc}
                alt={`Logo ${data.nome}`}
                width={720}
                height={720}
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="h-auto w-full max-w-md object-contain"
              />
            </div>
          </Reveal>
        )}
        {!data.arquiteturaLogoSrc && imagem && (
          <Reveal>
            <ParallaxImage src={imagem.src} alt={imagem.alt} lqip={imagem.lqip} />
          </Reveal>
        )}
      </div>
    </SectionShell>
  )
}

export function LifestyleSection({ data }: { data: EmpreendimentoData }) {
  const paragrafos = (data.sobreParagrafos ?? []).slice(1)
  const imagem = data.galeria?.[1] ?? data.galeria?.[0]

  return (
    <SectionShell id="lifestyle" dark>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {imagem && (
          <Reveal className="order-2 lg:order-1">
            <ParallaxImage src={imagem.src} alt={imagem.alt} lqip={imagem.lqip} />
          </Reveal>
        )}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Lifestyle</Eyebrow>
          </Reveal>
          <SectionTitle light>Uma rotina extraordinária</SectionTitle>
          <div className="mt-6 space-y-5">
            {paragrafos.map((paragrafo, index) => (
              <Reveal key={paragrafo} delay={index * 0.05}>
                <p className="text-base leading-relaxed text-white/70 sm:text-lg">{paragrafo}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

export function LocalizacaoSection({ data }: { data: EmpreendimentoData }) {
  let estadoLabel = data.estado
  if (data.estado === 'RJ') estadoLabel = 'Rio de Janeiro'
  else if (data.estado === 'RS') estadoLabel = 'Rio Grande do Sul'
  const mapsHref =
    data.mapsHref ??
    (data.geo?.lat && data.geo?.lng
      ? `https://www.google.com/maps/search/?api=1&query=${data.geo.lat},${data.geo.lng}`
      : undefined)
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  let mapEmbedSrc: string | undefined
  if (data.geo?.lat && data.geo?.lng) {
    mapEmbedSrc = googleMapsApiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${data.geo.lat},${data.geo.lng}&zoom=17&maptype=satellite`
      : `https://www.google.com/maps?q=${data.geo.lat},${data.geo.lng}&z=17&output=embed`
  }

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
          {data.proximidades.map((proximidade) => (
            <m.li
              key={proximidade}
              variants={revealUp}
              className="border-ink/10 flex items-start gap-3 border-t pt-4 text-base text-ink"
            >
              <span className="mt-1 text-gold" aria-hidden="true">
                →
              </span>
              {proximidade}
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

      {mapEmbedSrc && (
        <Reveal delay={0.15} className="mt-12">
          <div className="border-ink/10 aspect-[16/9] overflow-hidden rounded-2xl border bg-stone shadow-sm">
            <iframe
              src={mapEmbedSrc}
              title={`Mapa de localização do ${data.nome}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </Reveal>
      )}
    </SectionShell>
  )
}
