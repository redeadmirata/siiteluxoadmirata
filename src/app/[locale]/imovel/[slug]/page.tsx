import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { IMOVEL_PDI_QUERY, IMOVEIS_SLUGS_QUERY } from '@/sanity/queries'
import type { ImovelPDI } from '@/types/sanity'
import { formatPreco, formatArea } from '@/lib/formatters'
import { routing } from '@/i18n/routing'
import dynamic from 'next/dynamic'
import PDITitulo from '@/components/pdi/PDITitulo'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import HeroCinematico from '@/components/pdi/HeroCinematico'
import ObraAdminBanner from '@/components/pdi/ObraAdminBanner'
import FichaTecnica from '@/components/pdi/FichaTecnica'
import StorytellingBlock from '@/components/pdi/StorytellingBlock'
import CTACard from '@/components/pdi/CTACard'
import SchemaJSONLD from '@/components/SchemaJSONLD'
import PDIAnalyticsEvents from '@/components/pdi/PDIAnalyticsEvents'
import { GaleriaSkeleton, Skeleton } from '@/components/ui/Skeleton'

/**
 * Dynamic imports — componentes client pesados (code split, lazy loaded).
 * Não interferem no Time to First Byte: o servidor renderiza o shell imediatamente,
 * os bundles JS são baixados e hidratados pelo browser em paralelo.
 */
const ImovelGallery = dynamic(() => import('@/components/pdi/ImovelGallery'), {
  loading: () => <GaleriaSkeleton />,
  ssr: false,
})

const PlantaViewer = dynamic(() => import('@/components/pdi/PlantaViewer'), {
  loading: () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="aspect-video w-full" />
    </div>
  ),
  ssr: false,
})

const TourVirtual = dynamic(() => import('@/components/pdi/TourVirtual'), {
  loading: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="aspect-video w-full" />
    </div>
  ),
  ssr: false,
})

const VideoPlayer = dynamic(() => import('@/components/pdi/VideoPlayer'), {
  loading: () => <Skeleton className="aspect-video w-full" />,
  ssr: false,
})

const CTAFixo = dynamic(() => import('@/components/pdi/CTAFixo'), {
  ssr: false,
})

export const revalidate = 60

interface PageProps {
  params: { locale: string; slug: string }
}

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

/**
 * Corta um texto em até `max` caracteres sem quebrar no meio de uma palavra.
 * Recua até o último espaço antes do limite e acrescenta reticências.
 */
function truncateAtWord(texto: string, max: number): string {
  if (texto.length <= max) return texto
  const cortado = texto.slice(0, max)
  const ultimoEspaco = cortado.lastIndexOf(' ')
  const base = ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado
  return `${base.trimEnd()}…`
}

function buildMetaDescription(imovel: ImovelPDI): string {
  if (imovel.seo?.descricao) return imovel.seo.descricao
  if (imovel.descricaoPtBr) return truncateAtWord(imovel.descricaoPtBr, 155)

  const partes: string[] = []
  if (imovel.tipo) partes.push(imovel.tipo)
  if (imovel.quartos) partes.push(`${imovel.quartos} quartos`)
  if (imovel.areaUtil) partes.push(`${formatArea(imovel.areaUtil)}`)
  if (imovel.bairro) partes.push(`em ${imovel.bairro.nome}, ${imovel.bairro.cidade}`)
  if (imovel.condominioNome) partes.push(`· ${imovel.condominioNome}`)

  const base = partes.join(' ')
  if (imovel.precoSobConsulta) return `${base}. Valor sob consulta — Admirata Imoveis.`
  if (imovel.preco) return `${base}. ${formatPreco(imovel.preco)}.`
  return `${base}. Admirata Imoveis.`
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

  // Não concatenar "| Admirata Imoveis" aqui: o layout raiz já aplica o
  // template `%s | Admirata Imóveis` a todo título retornado por uma página
  // filha. Fazer isso aqui duplicava o sufixo no <title> renderizado.
  const titulo = imovel.seo?.titulo ?? imovel.titulo
  const descricao =
    params.locale === 'en'
      ? (imovel.descricaoEnUs ? truncateAtWord(imovel.descricaoEnUs, 155) : buildMetaDescription(imovel))
      : params.locale === 'es'
        ? (imovel.descricaoEsAr ? truncateAtWord(imovel.descricaoEsAr, 155) : buildMetaDescription(imovel))
        : buildMetaDescription(imovel)

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
      locale: params.locale === 'en' ? 'en_US' : params.locale === 'es' ? 'es_AR' : 'pt_BR',
      ...(imagemCapa && {
        images: [{ url: imagemCapa, width: 1200, height: 630, alt: imovel.titulo }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}${imovelPath}`,
      languages: {
        'pt-BR': `${siteUrl}${imovelPath}`,
        'en-US': `${siteUrl}/en${imovelPath}`,
        'es-AR': `${siteUrl}/es${imovelPath}`,
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

  const descricaoLocalizada =
    params.locale === 'en'
      ? imovel.descricaoEnUs ?? imovel.descricaoPtBr
      : params.locale === 'es'
        ? imovel.descricaoEsAr ?? imovel.descricaoPtBr
        : imovel.descricaoPtBr

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const url = `${siteUrl}${localePrefix}${buildImovelPath(imovel, params.slug)}`

  const imagens = imovel.imagens ?? []
  const bairroSlug = imovel.bairro?.slug?.current

  const tourUrl =
    imovel.tourVirtual ??
    imagens.find((i) => i.arquivo.urlMatterport)?.arquivo.urlMatterport

  const isObraAdmin = imovel.condicao === 'obra-administracao'

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

      {imagens.length > 0 && (
        <HeroCinematico
          titulo={imovel.titulo}
          preco={imovel.preco}
          precoSobConsulta={imovel.precoSobConsulta}
          bairroNome={imovel.bairro?.nome}
          cidade={imovel.bairro?.cidade}
          quartos={imovel.quartos}
          areaUtil={imovel.areaUtil}
          imagens={imagens}
          condominioNome={imovel.condominioNome}
          condicao={imovel.condicao}
          finalidade={imovel.finalidade}
          tourUrl={tourUrl}
          videoUrl={imovel.videoUrl}
        />
      )}

      {/* ── Título com blur-fade — aparece ao rolar abaixo do hero ── */}
      <PDITitulo
        titulo={imovel.titulo}
        condominioNome={imovel.condominioNome}
        quartos={imovel.quartos}
        areaUtil={imovel.areaUtil}
      />

      <div className="container-site">
        {/* Breadcrumb — abaixo do hero full-screen */}
        <div className="pt-3 pb-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 py-10">
          <main>
            <FichaTecnica imovel={imovel} />

            {descricaoLocalizada && (
              <StorytellingBlock
                descricao={descricaoLocalizada}
                titulo={t('about')}
              />
            )}

            {isObraAdmin && <ObraAdminBanner />}

            {tourUrl && (
              <div className="hidden lg:block">
                <TourVirtual url={tourUrl} titulo={imovel.titulo} />
              </div>
            )}

            {imovel.videoUrl && (
              <VideoPlayer url={imovel.videoUrl} titulo={imovel.titulo} />
            )}

            {imagens.length > 0 && (
              <ImovelGallery imagens={imagens} titulo={imovel.titulo} />
            )}

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
