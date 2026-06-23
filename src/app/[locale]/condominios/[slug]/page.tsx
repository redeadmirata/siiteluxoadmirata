/**
 * PDI de Condomínio — /condominios/[slug]
 * JSON-LD: BreadcrumbList + ApartmentComplex + FAQPage (condicional)
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  CONDOMINIO_QUERY,
  IMOVEIS_POR_CONDOMINIO_QUERY,
  CONDOMINIOS_SLUGS_QUERY,
  FOTOS_CONDOMINIO_QUERY,
} from '@/sanity/queries'
import type { CondominioDetalhe, ImovelCard } from '@/types/sanity'
import { routing } from '@/i18n/routing'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { ImageAutoSlider } from '@/components/ui/ImageAutoSlider'
import type { SliderImage } from '@/components/ui/ImageAutoSlider'

export const revalidate = 3600
export const dynamicParams = true

interface PageProps {
  params: { locale: string; slug: string }
}

// ─── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(CONDOMINIOS_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, slug: s.slug }))
  )
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cond = await client.fetch<CondominioDetalhe | null>(CONDOMINIO_QUERY, {
    slug: params.slug,
  })

  if (!cond) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  // Condomínios da Ilha Pura usam a URL de marca /ilhapura como canônica
  const isIlhaPura = cond.bairro?.slug?.current === 'ilha-pura'
  const condPath = isIlhaPura
    ? `/ilhapura/condominios/${params.slug}`
    : `/condominios/${params.slug}`
  const canonicalUrl = `${siteUrl}${localePrefix}${condPath}`

  const titulo = cond.seo?.titulo ?? `${cond.nome} — Condomínio de Alto Padrão`
  const descricao =
    cond.seo?.descricao ??
    `Conheça o ${cond.nome}${cond.bairro ? ` em ${cond.bairro.nome}` : ''}. ${cond.totalImoveis} imóvel${cond.totalImoveis !== 1 ? 'is' : ''} disponível${cond.totalImoveis !== 1 ? 'is' : ''}. Admirata Imóveis.`

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      url: canonicalUrl,
      images: cond.fotoCapa?.asset?.url
        ? [{ url: cond.fotoCapa.asset.url, alt: cond.nome }]
        : [],
    },
    // forcarNoindex ou sem imóveis → noindex
    robots: cond.forcarNoindex || cond.totalImoveis === 0 ? { index: false } : undefined,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPreco(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

const TIPO_LABELS: Record<string, string> = {
  'condominio-fechado': 'Condomínio Fechado',
  'bairro-planejado': 'Bairro Planejado',
  vertical: 'Condomínio Vertical',
  resort: 'Resort Residencial',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CondominioPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const [cond, imoveis, fotosData] = await Promise.all([
    client.fetch<CondominioDetalhe | null>(CONDOMINIO_QUERY, { slug: params.slug }),
    client.fetch<ImovelCard[]>(IMOVEIS_POR_CONDOMINIO_QUERY, { condSlug: params.slug }),
    client.fetch<{ fotos: SliderImage[] } | null>(FOTOS_CONDOMINIO_QUERY, { slug: params.slug }),
  ])

  if (!cond) notFound()

  // Monta a galeria para o slider: prefere galeria do condomínio, senão usa imagens dos imóveis
  const sliderImages: SliderImage[] =
    cond.galeria && cond.galeria.length > 0
      ? cond.galeria
          .filter((img) => img.asset?.url)
          .map((img) => ({
            url: img.asset.url,
            alt: img.alt ?? null,
            lqip: img.asset.metadata?.lqip ?? null,
          }))
      : (fotosData?.fotos ?? []).filter((f) => f.url)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const pageUrl = `${siteUrl}${localePrefix}/condominios/${params.slug}`
  const capaSrc = cond.fotoCapa?.asset?.url
  const capaLqip = cond.fotoCapa?.asset?.metadata?.lqip

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
        { '@type': 'ListItem', position: 2, name: 'Condomínios', item: `${siteUrl}${localePrefix}/condominios` },
        { '@type': 'ListItem', position: 3, name: cond.nome, item: pageUrl },
      ],
    },
    {
      '@type': 'ApartmentComplex',
      name: cond.nome,
      url: pageUrl,
      description: cond.descricao ?? cond.seo?.descricao,
      ...(capaSrc && { image: capaSrc }),
      ...(cond.bairro && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: cond.bairro.nome,
          addressRegion: cond.bairro.estado,
          addressCountry: 'BR',
        },
      }),
      ...(cond.geo?.lat && cond.geo?.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: cond.geo.lat,
          longitude: cond.geo.lng,
        },
      }),
      numberOfRooms: cond.numUnidades,
      amenityFeature: cond.infraestrutura?.map((f) => ({
        '@type': 'LocationFeatureSpecification',
        name: f,
        value: true,
      })),
    },
  ]

  if (cond.faqs && cond.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: cond.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: faq.resposta },
      })),
    })
  }

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Condomínios', href: '/condominios' },
            { label: cond.nome },
          ]}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {capaSrc && (
        <div className="relative w-full h-[55vh] min-h-[400px] max-h-[640px] overflow-hidden mb-12">
          <Image
            src={capaSrc}
            alt={cond.nome}
            fill
            className="object-cover"
            placeholder={capaLqip ? 'blur' : 'empty'}
            blurDataURL={capaLqip}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-site pb-10">
            {cond.tipo && (
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                {TIPO_LABELS[cond.tipo] ?? cond.tipo}
              </span>
            )}
            <h1 className="text-display-xl text-white leading-tight">{cond.nome}</h1>
            {cond.bairro && (
              <p className="text-white/70 mt-1 text-base">
                {cond.bairro.nome}
                {cond.bairro.cidade ? `, ${cond.bairro.cidade}` : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Slider de fotos full-width ───────────────────────────────────────── */}
      {sliderImages.length > 0 && (
        <div className="mb-12">
          <div className="container-site mb-5">
            <h2 className="text-display-sm text-ink">Galeria</h2>
          </div>
          <ImageAutoSlider images={sliderImages} height={300} duracao={50} />
        </div>
      )}

      {/* ── Layout principal ─────────────────────────────────────────────────── */}
      <div className="container-site pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 items-start">

          {/* ── Coluna principal ─────────────────────────────────────────── */}
          <div>
            {/* Hero sem imagem */}
            {!capaSrc && (
              <header className="mb-8">
                {cond.tipo && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                    {TIPO_LABELS[cond.tipo] ?? cond.tipo}
                  </span>
                )}
                <h1 className="text-display-xl text-ink leading-tight">{cond.nome}</h1>
                {cond.bairro && (
                  <p className="text-muted mt-1 text-base">{cond.bairro.nome}{cond.bairro.cidade ? `, ${cond.bairro.cidade}` : ''}</p>
                )}
              </header>
            )}

            {/* ── Dados rápidos ─────────────────────────────────────────── */}
            {(cond.construtora || cond.anoEntrega || cond.numTorres || cond.numUnidades || cond.areaTotal) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 p-6 bg-stone/20 rounded-2xl border border-stone">
                {cond.construtora && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Construtora</p>
                    <p className="text-sm font-medium text-ink">{cond.construtora}</p>
                  </div>
                )}
                {cond.anoEntrega && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Entrega</p>
                    <p className="text-sm font-medium text-ink">{cond.anoEntrega}</p>
                  </div>
                )}
                {cond.numTorres && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Torres</p>
                    <p className="text-sm font-medium text-ink">{cond.numTorres}</p>
                  </div>
                )}
                {cond.numUnidades && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Unidades</p>
                    <p className="text-sm font-medium text-ink">{cond.numUnidades.toLocaleString('pt-BR')}</p>
                  </div>
                )}
                {cond.areaTotal && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Área Total</p>
                    <p className="text-sm font-medium text-ink">{cond.areaTotal.toLocaleString('pt-BR')} m²</p>
                  </div>
                )}
                {cond.totalLotes && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-0.5">Lotes</p>
                    <p className="text-sm font-medium text-ink">{cond.totalLotes.toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Descrição ─────────────────────────────────────────────── */}
            {cond.descricao && (
              <div className="mb-10">
                <h2 className="text-display-sm text-ink mb-4">Sobre o empreendimento</h2>
                <p className="text-muted leading-relaxed text-base">{cond.descricao}</p>
              </div>
            )}

            {/* ── Infraestrutura ────────────────────────────────────────── */}
            {cond.infraestrutura && cond.infraestrutura.length > 0 && (
              <div className="mb-10">
                <h2 className="text-display-sm text-ink mb-4">Infraestrutura</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
                  {cond.infraestrutura.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Imóveis disponíveis ───────────────────────────────────── */}
            <div className="mb-12">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-display-sm text-ink">
                  Imóveis disponíveis
                  {imoveis.length > 0 && (
                    <span className="ml-2 text-base text-muted font-normal">({imoveis.length})</span>
                  )}
                </h2>
              </div>

              {imoveis.length === 0 ? (
                <div className="py-12 text-center border border-stone rounded-2xl">
                  <p className="text-muted">Nenhum imóvel disponível no momento.</p>
                  <p className="text-sm text-muted/60 mt-2">
                    Entre em contato para verificar disponibilidade futura.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {imoveis.map((imovel) => (
                    <Link
                      key={imovel._id}
                      href={`/imovel/${imovel.slug.current}`}
                      className="group block border border-stone rounded-2xl overflow-hidden hover:border-gold/40 transition-colors"
                    >
                      {/* Thumb */}
                      <div className="relative aspect-[4/3] bg-stone/30 overflow-hidden">
                        {imovel.imagemCapa ? (
                          <Image
                            src={imovel.imagemCapa?.asset.url ?? ''}
                            alt={imovel.titulo}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            placeholder={imovel.imagemCapa?.asset.metadata?.lqip ? 'blur' : 'empty'}
                            blurDataURL={imovel.imagemCapa?.asset.metadata?.lqip}
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-stone/50 text-sm">Sem foto</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-ink group-hover:text-gold transition-colors line-clamp-1">
                          {imovel.titulo}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                          {imovel.areaUtil && <span>{imovel.areaUtil} m²</span>}
                          {imovel.quartos && <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>}
                          {imovel.vagas && <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>}
                        </div>
                        <div className="mt-3">
                          {imovel.preco ? (
                            <span className="text-sm font-semibold text-ink">{formatPreco(imovel.preco)}</span>
                          ) : (
                            <span className="text-sm text-muted italic">Sob consulta</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── Condomínios próximos ─────────────────────────────────── */}
            {cond.condominiosProximos && cond.condominiosProximos.length > 0 && (
              <div className="mb-10">
                <h2 className="text-display-sm text-ink mb-4">Empreendimentos relacionados</h2>
                <div className="flex flex-wrap gap-3">
                  {cond.condominiosProximos.map((c) => (
                    <Link
                      key={c.slug.current}
                      href={`/condominios/${c.slug.current}`}
                      className="px-4 py-2 border border-stone rounded-full text-sm text-ink hover:border-gold hover:text-gold transition-colors"
                    >
                      {c.nome}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQs ──────────────────────────────────────────────────── */}
            {cond.faqs && cond.faqs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-display-sm text-ink mb-6">Perguntas frequentes</h2>
                <div className="space-y-4">
                  {cond.faqs.map((faq, i) => (
                    <details key={i} className="group border border-stone rounded-xl">
                      <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-ink list-none select-none hover:text-gold transition-colors">
                        <span>{faq.pergunta}</span>
                        <span className="shrink-0 ml-3 text-gold group-open:rotate-45 transition-transform duration-200" aria-hidden="true">+</span>
                      </summary>
                      <div className="px-5 pb-5 text-sm text-muted leading-relaxed">
                        {faq.resposta}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 space-y-6">

            {/* CTA Card */}
            <div className="p-6 bg-ink rounded-2xl text-white">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                Fale com um especialista
              </p>
              <h3 className="text-lg font-semibold mb-2 leading-snug">
                Interesse no {cond.nome}?
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Nossa equipe está pronta para apresentar as melhores oportunidades neste empreendimento.
              </p>

              {/* WhatsApp RJ */}
              <a
                href={`https://wa.me/5521998079459?text=${encodeURIComponent(`Olá, tenho interesse em imóveis no ${cond.nome}${cond.bairro ? ` (${cond.bairro.nome})` : ''}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-ink text-sm font-semibold rounded-xl hover:bg-[#d4ac1a] transition-colors mb-3"
              >
                WhatsApp Rio de Janeiro
              </a>

              {/* WhatsApp Serra Gaúcha (só para imóveis RS) */}
              {cond.bairro?.mercado === 'Serra Gaúcha' && (
                <a
                  href={`https://wa.me/5554992643070?text=${encodeURIComponent(`Olá, tenho interesse em imóveis no ${cond.nome}${cond.bairro ? ` (${cond.bairro.nome})` : ''}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors mb-3"
                >
                  WhatsApp Serra Gaúcha
                </a>
              )}

              <a
                href="mailto:atendimento@admirataimoveis.com.br"
                className="block text-center text-xs text-white/40 hover:text-white/70 transition-colors mt-2"
              >
                atendimento@admirataimoveis.com.br
              </a>
            </div>

            {/* Localização */}
            {cond.bairro && (
              <div className="p-5 border border-stone rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-3">Localização</p>
                <p className="text-sm font-medium text-ink">{cond.bairro.nome}</p>
                {cond.bairro.cidade && (
                  <p className="text-xs text-muted mt-0.5">{cond.bairro.cidade}, {cond.bairro.estado === 'RJ' ? 'Rio de Janeiro' : 'Rio Grande do Sul'}</p>
                )}
                {cond.geo?.proximidades && cond.geo.proximidades.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone">
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Próximo a</p>
                    <ul className="space-y-1">
                      {cond.geo.proximidades.map((p) => (
                        <li key={p} className="text-xs text-muted">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link
                  href={`/imoveis/${cond.bairro.slug.current}`}
                  className="block mt-4 text-xs text-gold hover:underline"
                >
                  Ver todos os imóveis em {cond.bairro.nome} →
                </Link>
              </div>
            )}

            {/* Tipologias */}
            {cond.tipologiasDisponiveis && cond.tipologiasDisponiveis.length > 0 && (
              <div className="p-5 border border-stone rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-3">Tipologias disponíveis</p>
                <div className="flex flex-wrap gap-2">
                  {cond.tipologiasDisponiveis.map((tip) => (
                    <span
                      key={tip}
                      className="text-xs px-3 py-1 border border-stone rounded-full text-ink capitalize"
                    >
                      {tip.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
