/**
 * PDI de Condomínio — /condominios/[slug]
 *
 * Fase 3 — Home Cinematográfica de Empreendimento:
 * a experiência principal é a landing narrativa (EmpreendimentoLanding),
 * seguida pela listagem real de unidades disponíveis e FAQs (SEO + conversão).
 *
 * JSON-LD: BreadcrumbList + ApartmentComplex + FAQPage (condicional).
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
} from '@/sanity/queries'
import type { CondominioDetalhe, ImovelCard } from '@/types/sanity'
import { routing } from '@/i18n/routing'
import { EmpreendimentoLanding, type EmpreendimentoData } from '@/components/empreendimento'

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
  vertical: 'Empreendimento Vertical',
  resort: 'Resort Residencial',
}

/** Extrai parágrafos de texto puro de um Portable Text (campo `sobre`). */
function flattenPortableText(blocks: unknown[] | undefined): string[] {
  if (!blocks || !Array.isArray(blocks)) return []
  return blocks
    .filter((b): b is { _type: string; children?: Array<{ text?: string }> } =>
      typeof b === 'object' && b !== null && (b as { _type?: string })._type === 'block',
    )
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
    .filter((t) => t.length > 0)
}

/** Detecta arquivo de vídeo MP4 (para hero com <video>). */
function asMp4(url?: string): string | undefined {
  if (!url) return undefined
  return /\.mp4($|\?)/i.test(url) ? url : undefined
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CondominioPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const [cond, imoveis] = await Promise.all([
    client.fetch<CondominioDetalhe | null>(CONDOMINIO_QUERY, { slug: params.slug }),
    client.fetch<ImovelCard[]>(IMOVEIS_POR_CONDOMINIO_QUERY, { condSlug: params.slug }),
  ])

  if (!cond) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const pageUrl = `${siteUrl}${localePrefix}/condominios/${params.slug}`
  const capaSrc = cond.fotoCapa?.asset?.url

  // ── Monta os dados da landing cinematográfica ────────────────────────────
  const paragrafos = flattenPortableText(cond.sobre)
  const fallbackTexto = cond.descricao ? [cond.descricao] : []
  const textos = paragrafos.length > 0 ? paragrafos : fallbackTexto

  const galeria = (cond.galeria ?? [])
    .filter((g) => g.asset?.url)
    .map((g) => ({
      src: g.asset.url,
      alt: g.alt ?? cond.nome,
      legenda: g.legenda,
      lqip: g.asset.metadata?.lqip ?? undefined,
    }))

  const heroImageSrc = capaSrc ?? galeria[0]?.src
  const heroImageLqip = cond.fotoCapa?.asset?.metadata?.lqip ?? galeria[0]?.lqip
  const heroVideoMp4 = asMp4(cond.heroVideoUrl) ?? asMp4(cond.videoTour)

  const isRS = cond.bairro?.mercado === 'Serra Gaúcha'
  const waText = encodeURIComponent(
    `Olá, tenho interesse em imóveis no ${cond.nome}${cond.bairro ? ` (${cond.bairro.nome})` : ''}.`,
  )

  const landingData: EmpreendimentoData = {
    nome: cond.nome,
    tipoLabel: cond.tipo ? TIPO_LABELS[cond.tipo] ?? cond.tipo : undefined,
    status: cond.status,
    bairroNome: cond.bairro?.nome,
    cidade: cond.bairro?.cidade,
    estado: cond.bairro?.estado,
    heroImageSrc,
    heroImageLqip,
    heroVideoMp4,
    manifesto: textos[0],
    sobreParagrafos: textos.slice(1),
    construtora: cond.construtora,
    anoEntrega: cond.anoEntrega,
    numTorres: cond.numTorres,
    numUnidades: cond.numUnidades,
    areaTotal: cond.areaTotal,
    prazoEntrega: cond.prazoEntrega,
    precoMinimo: cond.precoMinimo,
    areaPrivativaMin: cond.areaPrivativaMin,
    areaPrivativaMax: cond.areaPrivativaMax,
    infraestrutura: cond.infraestrutura,
    galeria,
    plantas: (cond.plantasBaixas ?? []).map((p) => ({
      nome: p.nome,
      quartos: p.quartos,
      area: p.area,
      src: p.imagem?.url,
      lqip: p.imagem?.metadata?.lqip,
    })),
    proximidades: cond.geo?.proximidades,
    geo: cond.geo,
    whatsappHref: `https://wa.me/5521998079459?text=${waText}`,
    whatsappHrefRS: isRS ? `https://wa.me/5554992643070?text=${waText}` : undefined,
    imoveisHref: cond.bairro ? `${localePrefix}/imoveis/${cond.bairro.slug.current}` : undefined,
  }

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

  // ── Unidades (Venda / Locação) ───────────────────────────────────────────
  const venda = imoveis.filter((i) => i.finalidade === 'Venda')
  const locacao = imoveis.filter((i) => i.finalidade === 'Locação' || i.finalidade === 'Temporada')

  const CardGrid = ({ list }: { list: ImovelCard[] }) =>
    list.length === 0 ? (
      <div className="rounded-2xl border border-stone py-10 text-center">
        <p className="text-sm text-muted">Nenhuma unidade disponível no momento.</p>
        <p className="mt-1 text-xs text-muted/60">Entre em contato — novas unidades surgem com frequência.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((imovel) => (
          <Link
            key={imovel._id}
            href={`/imovel/${imovel.slug.current}`}
            className="group block overflow-hidden rounded-2xl border border-stone transition-colors hover:border-gold/40"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone/30">
              {imovel.imagemCapa ? (
                <Image
                  src={imovel.imagemCapa?.asset.url ?? ''}
                  alt={imovel.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder={imovel.imagemCapa?.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={imovel.imagemCapa?.asset.metadata?.lqip}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-stone/50">Sem foto</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 text-sm font-semibold text-ink transition-colors group-hover:text-gold">
                {imovel.titulo}
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                {imovel.areaUtil && <span>{imovel.areaUtil} m²</span>}
                {imovel.quartos && <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>}
                {imovel.vagas && <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>}
              </div>
              <div className="mt-3">
                {imovel.preco ? (
                  <span className="text-sm font-semibold text-ink">{formatPreco(imovel.preco)}</span>
                ) : (
                  <span className="text-sm italic text-muted">Sob consulta</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Experiência cinematográfica (Hero → CTA) ──────────────────────── */}
      <EmpreendimentoLanding data={landingData} />

      {/* ── Unidades disponíveis ──────────────────────────────────────────── */}
      {imoveis.length > 0 && (
        <section id="unidades" className="bg-stone/30 py-24 sm:py-32">
          <div className="container-site space-y-12">
            <div>
              <div className="mb-5 flex items-baseline gap-3">
                <h2 className="text-display-sm text-ink">À Venda</h2>
                {venda.length > 0 && (
                  <span className="text-sm font-normal text-muted">{venda.length} {venda.length === 1 ? 'unidade' : 'unidades'}</span>
                )}
              </div>
              <CardGrid list={venda} />
            </div>

            {locacao.length > 0 && (
              <div>
                <div className="mb-5 flex items-baseline gap-3">
                  <h2 className="text-display-sm text-ink">Para Locação</h2>
                  <span className="text-sm font-normal text-muted">{locacao.length} {locacao.length === 1 ? 'unidade' : 'unidades'}</span>
                </div>
                <CardGrid list={locacao} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FAQs ───────────────────────────────────────────────────────────── */}
      {cond.faqs && cond.faqs.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-site max-w-3xl">
            <h2 className="mb-8 text-display-sm text-ink">Perguntas frequentes</h2>
            <div className="space-y-4">
              {cond.faqs.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-stone">
                  <summary className="flex cursor-pointer list-none select-none items-center justify-between p-5 text-sm font-medium text-ink transition-colors hover:text-gold">
                    <span>{faq.pergunta}</span>
                    <span className="ml-3 shrink-0 text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.resposta}</div>
                </details>
              ))}
            </div>

            {/* Condomínios relacionados */}
            {cond.condominiosProximos && cond.condominiosProximos.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-4 text-display-sm text-ink">Empreendimentos relacionados</h2>
                <div className="flex flex-wrap gap-3">
                  {cond.condominiosProximos.map((c) => (
                    <Link
                      key={c.slug.current}
                      href={`/condominios/${c.slug.current}`}
                      className="rounded-full border border-stone px-4 py-2 text-sm text-ink transition-colors hover:border-gold hover:text-gold"
                    >
                      {c.nome}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
