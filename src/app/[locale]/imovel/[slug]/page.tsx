import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { IMOVEL_PDI_QUERY, IMOVEIS_SLUGS_QUERY } from '@/sanity/queries'
import type { ImovelPDI } from '@/types/sanity'
import { formatPreco, formatArea } from '@/lib/formatters'
import { routing } from '@/i18n/routing'

import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import HeroPDI from '@/components/pdi/HeroPDI'
import PhotoStrip from '@/components/pdi/PhotoStrip'
import ObraAdminBanner from '@/components/pdi/ObraAdminBanner'
import FichaTecnica from '@/components/pdi/FichaTecnica'
import StorytellingBlock from '@/components/pdi/StorytellingBlock'
import ImovelGallery from '@/components/pdi/ImovelGallery'
import PlantaViewer from '@/components/pdi/PlantaViewer'
import CTACard from '@/components/pdi/CTACard'
import CTAFixo from '@/components/pdi/CTAFixo'
import TourVirtual from '@/components/pdi/TourVirtual'
import VideoPlayer from '@/components/pdi/VideoPlayer'
import SchemaJSONLD from '@/components/SchemaJSONLD'
import PDIAnalyticsEvents from '@/components/pdi/PDIAnalyticsEvents'

export const revalidate = 60

interface PageProps {
  params: { locale: string; slug: string }
}

/**
 * Caminho (sem domínio/locale) da PDI do imóvel.
 * Unidades de condomínios do Ilha Pura usam a URL de marca como canônica:
 *   /ilhapura/condominios/[condominio]/[venda|aluguel|temporada]/[unidade]
 * Demais imóveis seguem em /imovel/[slug].
 */
function buildImovelPath(imovel: ImovelPDI, slug: string): string {
  const condSlug = imovel.condominioRef?.slug
  const isIlhaPura = imovel.condominioRef?.bairroSlug === 'ilha-pura' && !!condSlug
  if (!isIlhaPura) return `/imovel/${slug}`
  const finalidadeSeg =
    imovel.finalidade === 'Locação'
      ? 'aluguel'
      : imovel.finalidade === 'Temporada'
        ? 'temporada'
        : 'venda'
  return `/ilhapura/condominios/${condSlug}/${finalidadeSeg}/${slug}`
}

/** Meta description rica para SEO: inclui preço, quartos, área, bairro e condomínio */
function buildMetaDescription(imovel: ImovelPDI): string {
  if (imovel.seo?.descricao) return imovel.seo.descricao
  if (imovel.descricaoPtBr) return imovel.descricaoPtBr.slice(0, 160)

  const partes: string[] = []
  if (imovel.tipo) partes.push(imovel.tipo)
  if (imovel.quartos) partes.push(`${imovel.quartos} quartos`)
  if (imovel.areaUtil) partes.push(`${formatArea(imovel.areaUtil)}`)
  if (imovel.bairro) partes.push(`em ${imovel.bairro.nome}, ${imovel.bairro.cidade}`)
  if (imovel.condominioNome) partes.push(`· ${imovel.condominioNome}`)

  const base = partes.join(' ')
  if (imovel.precoSobConsulta) return `${base}. Valor sob consulta — Admirata Imóveis.`
  if (imovel.preco) return `${base}. ${formatPreco(imovel.preco)}.`
  return `${base}. Admirata Imóveis.`
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(IMOVEIS_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, slug: s.slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const imovel = await client.fetch<ImovelPDI | null>(IMOVEL_PDI_QUERY, {
    slug: params.slug,
  })

  const t = await getTranslations({ locale: params.locale, namespace: 'pdi' })

  if (!imovel) return { title: t('notFound') }

  const titulo = imovel.seo?.titulo ?? `${imovel.titulo} | Admirata Imóveis`
  const descricao = buildMetaDescription(imovel)

  const imagemCapa =
    imovel.imagens?.find((i) => i.arquivo.principal)?.arquivo.asset?.url ??
    imovel.imagens?.[0]?.arquivo.asset?.url

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const imovelPath = buildImovelPath(imovel, params.slug)

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      locale: params.locale === 'en' ? 'en_US' : params.locale === 'fr' ? 'fr_FR' : 'pt_BR',
      ...(imagemCapa && {
        images: [{ url: imagemCapa, width: 1200, height: 630, alt: imovel.titulo }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}${imovelPath}`,
      languages: {
        'pt-BR': `${siteUrl}${imovelPath}`,
        'en-US': `${siteUrl}/en${imovelPath}`,
        'fr-FR': `${siteUrl}/fr${imovelPath}`,
      },
    },
  }
}

export default async function ImovelPDIPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'pdi' })

  const imovel = await client.fetch<ImovelPDI | null>(IMOVEL_PDI_QUERY, {
    slug: params.slug,
  })

  if (!imovel) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const url = `${siteUrl}${localePrefix}${buildImovelPath(imovel, params.slug)}`

  const imagens = imovel.imagens ?? []
  const bairroSlug = imovel.bairro?.slug?.current

  // Tour: prefere campo top-level, fallback para urlMatterport em imagens (legado)
  const tourUrl =
    imovel.tourVirtual ??
    imagens.find((i) => i.arquivo.urlMatterport)?.arquivo.urlMatterport

  // Badge Obra por Administração: lançamento em construção direta
  const isObraAdmin = imovel.novidade === true

  return (
    <>
      <SchemaJSONLD imovel={imovel} url={url} />

      <PDIAnalyticsEvents
        titulo={imovel.titulo}
        tipo={imovel.tipo}
        preco={imovel.preco}
        slug={params.slug}
        bairroNome={imovel.bairro?.nome}
      />

      {/* Breadcrumb hierárquico */}
      <div className="container-site pt-6 pb-2">
        <BreadcrumbNav
          items={[
            { label: t('home'), href: '/' },
            { label: t('properties'), href: '/imoveis' },
            ...(imovel.bairro && bairroSlug
              ? [{ label: imovel.bairro.nome, href: `/imoveis/${bairroSlug}` }]
              : []),
            { label: imovel.titulo },
          ]}
        />
      </div>

      {/* ── Seção 1: Hero com overlay de texto + badges + tour ─────── */}
      {imagens.length > 0 && (
        <HeroPDI
          titulo={imovel.titulo}
          preco={imovel.preco}
          bairroNome={imovel.bairro?.nome}
          cidade={imovel.bairro?.cidade}
          imagens={imagens}
          condominioNome={imovel.condominioNome}
          novidade={imovel.novidade}
          condominioAnoEntrega={imovel.condominioAnoEntrega}
          tourUrl={tourUrl}
        />
      )}

      {/* ── Seção 2: Faixa de fotos em movimento (square marquee) ──── */}
      {imagens.length >= 3 && (
        <PhotoStrip
          imagens={imagens}
          size={180}
          label="Galeria de fotos do imóvel"
        />
      )}

      {/* Layout 2 colunas */}
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 py-10">
          <main>
            {/* Título desktop — mobile usa overlay no hero */}
            <div className="hidden md:block mb-8">
              {imovel.bairro && (
                <p className="text-xs tracking-widest uppercase text-gold mb-2">
                  {imovel.bairro.nome} · {imovel.bairro.cidade}
                </p>
              )}
              {imovel.condominioNome && (
                <p className="text-base font-light text-muted mb-1 tracking-wide">
                  {imovel.condominioNome}
                </p>
              )}
              <h1 className="text-display-lg text-ink leading-tight mb-3">
                {imovel.titulo}
              </h1>
              {imovel.preco && (
                <p className="text-price text-3xl text-ink">
                  {formatPreco(imovel.preco)}
                </p>
              )}
            </div>

            <FichaTecnica imovel={imovel} />

            {imovel.descricaoPtBr && (
              <StorytellingBlock
                descricao={imovel.descricaoPtBr}
                titulo={t('about')}
              />
            )}

            {/* ── Obra por Administração ────────────────────────────── */}
            {isObraAdmin && <ObraAdminBanner />}

            {/* Tour virtual embutido — só desktop (mobile: card no hero) */}
            {tourUrl && (
              <div className="hidden md:block">
                <TourVirtual url={tourUrl} titulo={imovel.titulo} />
              </div>
            )}

            {imovel.videoUrl && (
              <VideoPlayer url={imovel.videoUrl} titulo={imovel.titulo} />
            )}

            {imagens.length > 0 && (
              <ImovelGallery imagens={imagens} titulo={imovel.titulo} />
            )}

            {/* ── Seção 3: Plantas ─────────────────────────────────── */}
            {imovel.plantas && imovel.plantas.length > 0 && (
              <PlantaViewer plantas={imovel.plantas} />
            )}
          </main>

          <aside className="hidden lg:block">
            <CTACard
              preco={imovel.preco}
              titulo={imovel.titulo}
              bairroNome={imovel.bairro?.nome}
            />
          </aside>
        </div>
      </div>

      <CTAFixo
        preco={imovel.preco}
        titulo={imovel.titulo}
        bairroNome={imovel.bairro?.nome}
      />

      <div className="md:hidden h-20" aria-hidden="true" />
    </>
  )
}
