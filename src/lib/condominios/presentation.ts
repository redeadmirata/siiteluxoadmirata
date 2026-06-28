import type { Metadata } from 'next'
import { SITE, WHATSAPP } from '@/config/site'
import type { EmpreendimentoData } from '@/components/empreendimento/types'
import type { ClubeData } from '@/data/clube-verdant'
import type { ClubeDia } from '@/data/clube-verdant-programacao'
import type { CondominioDetalhe } from '@/types/sanity'

const TIPO_LABELS: Readonly<Record<string, string>> = {
  'condominio-fechado': 'Condomínio Fechado',
  'bairro-planejado': 'Bairro Planejado',
  vertical: 'Empreendimento Vertical',
  resort: 'Resort Residencial',
}

const SCHEMA_DAYS: Readonly<Record<ClubeDia, string>> = {
  segunda: 'https://schema.org/Monday',
  terça: 'https://schema.org/Tuesday',
  quarta: 'https://schema.org/Wednesday',
  quinta: 'https://schema.org/Thursday',
  sexta: 'https://schema.org/Friday',
  sábado: 'https://schema.org/Saturday',
}

function getLocalePrefix(locale: string) {
  return locale === 'pt-BR' ? '' : `/${locale}`
}

function getCanonicalPath(condominio: CondominioDetalhe, slug: string) {
  return condominio.bairro?.slug?.current === 'ilha-pura'
    ? `/ilhapura/condominios/${slug}`
    : `/condominios/${slug}`
}

export function flattenPortableText(blocks: unknown[] | undefined): string[] {
  if (!blocks || !Array.isArray(blocks)) return []

  return blocks
    .filter(
      (block): block is { _type: string; children?: Array<{ text?: string }> } =>
        typeof block === 'object' &&
        block !== null &&
        (block as { _type?: string })._type === 'block'
    )
    .map((block) =>
      (block.children ?? [])
        .map((child) => child.text ?? '')
        .join('')
        .trim()
    )
    .filter((text) => text.length > 0)
}

export function asMp4(url?: string) {
  if (!url) return undefined
  return /\.mp4($|\?)/i.test(url) ? url : undefined
}

export function buildCondominioMetadata(
  condominio: CondominioDetalhe,
  locale: string,
  slug: string
): Metadata {
  const localePrefix = getLocalePrefix(locale)
  const canonicalUrl = `${SITE.url}${localePrefix}${getCanonicalPath(condominio, slug)}`
  const titulo = condominio.seo?.titulo ?? `${condominio.nome} — Condomínio de Alto Padrão`
  const plural = condominio.totalImoveis !== 1
  const descricao =
    condominio.seo?.descricao ??
    `Conheça o ${condominio.nome}${condominio.bairro ? ` em ${condominio.bairro.nome}` : ''}. ${condominio.totalImoveis} imóvel${plural ? 'is' : ''} disponível${plural ? 'is' : ''}. Admirata Imóveis.`

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      url: canonicalUrl,
      images: condominio.fotoCapa?.asset?.url
        ? [{ url: condominio.fotoCapa.asset.url, alt: condominio.nome }]
        : [],
    },
    robots:
      condominio.forcarNoindex || condominio.totalImoveis === 0 ? { index: false } : undefined,
  }
}

export function buildEmpreendimentoData(
  condominio: CondominioDetalhe,
  locale: string
): EmpreendimentoData {
  const localePrefix = getLocalePrefix(locale)
  const paragrafos = flattenPortableText(condominio.sobre)
  let textos = paragrafos
  if (textos.length === 0 && condominio.descricao) textos = [condominio.descricao]
  const galeria = (condominio.galeria ?? [])
    .filter((item) => item.asset?.url)
    .map((item) => ({
      src: item.asset.url,
      alt: item.alt ?? condominio.nome,
      legenda: item.legenda,
      lqip: item.asset.metadata?.lqip ?? undefined,
    }))
  const capaSrc = condominio.fotoCapa?.asset?.url
  const heroImageSrc = capaSrc ?? galeria[0]?.src
  const heroImageLqip = condominio.fotoCapa?.asset?.metadata?.lqip ?? galeria[0]?.lqip
  const heroVideoMp4 = asMp4(condominio.heroVideoUrl) ?? asMp4(condominio.videoTour)
  const isSerraGaucha = condominio.bairro?.mercado === 'Serra Gaúcha'
  const whatsappText = encodeURIComponent(
    `Olá, tenho interesse em imóveis no ${condominio.nome}${condominio.bairro ? ` (${condominio.bairro.nome})` : ''}.`
  )

  return {
    nome: condominio.nome,
    tipoLabel: condominio.tipo ? (TIPO_LABELS[condominio.tipo] ?? condominio.tipo) : undefined,
    status: condominio.status,
    bairroNome: condominio.bairro?.nome,
    cidade: condominio.bairro?.cidade,
    estado: condominio.bairro?.estado,
    heroImageSrc,
    heroImageLqip,
    heroVideoMp4,
    manifesto: textos[0],
    sobreParagrafos: textos.slice(1),
    construtora: condominio.construtora,
    anoEntrega: condominio.anoEntrega,
    numTorres: condominio.numTorres,
    numUnidades: condominio.numUnidades,
    areaTotal: condominio.areaTotal,
    prazoEntrega: condominio.prazoEntrega,
    precoMinimo: condominio.precoMinimo,
    areaPrivativaMin: condominio.areaPrivativaMin,
    areaPrivativaMax: condominio.areaPrivativaMax,
    infraestrutura: condominio.infraestrutura,
    galeria,
    plantas: (condominio.plantasBaixas ?? []).map((planta) => ({
      nome: planta.nome,
      quartos: planta.quartos,
      area: planta.area,
      src: planta.imagem?.url,
      lqip: planta.imagem?.metadata?.lqip,
    })),
    proximidades: condominio.geo?.proximidades,
    geo: condominio.geo,
    whatsappHref: `https://wa.me/${WHATSAPP.rj}?text=${whatsappText}`,
    whatsappHrefRS: isSerraGaucha ? `https://wa.me/${WHATSAPP.rs}?text=${whatsappText}` : undefined,
    imoveisHref: condominio.bairro
      ? `${localePrefix}/imoveis/${condominio.bairro.slug.current}`
      : undefined,
  }
}

export function buildCondominioJsonLd(
  condominio: CondominioDetalhe,
  locale: string,
  slug: string,
  clube?: ClubeData
) {
  const localePrefix = getLocalePrefix(locale)
  const pageUrl = `${SITE.url}${localePrefix}/condominios/${slug}`
  const capaSrc = condominio.fotoCapa?.asset?.url
  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE.url}${localePrefix}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Condomínios',
          item: `${SITE.url}${localePrefix}/condominios`,
        },
        { '@type': 'ListItem', position: 3, name: condominio.nome, item: pageUrl },
      ],
    },
    {
      '@type': 'ApartmentComplex',
      name: condominio.nome,
      url: pageUrl,
      description: condominio.descricao ?? condominio.seo?.descricao,
      ...(capaSrc ? { image: capaSrc } : {}),
      ...(condominio.bairro
        ? {
            address: {
              '@type': 'PostalAddress',
              addressLocality: condominio.bairro.nome,
              addressRegion: condominio.bairro.estado,
              addressCountry: 'BR',
            },
          }
        : {}),
      ...(condominio.geo?.lat && condominio.geo?.lng
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: condominio.geo.lat,
              longitude: condominio.geo.lng,
            },
          }
        : {}),
      numberOfRooms: condominio.numUnidades,
      amenityFeature: [
        ...(condominio.infraestrutura ?? []).map((feature) => ({
          '@type': 'LocationFeatureSpecification',
          name: feature,
          value: true,
        })),
        ...(clube
          ? clube.programacao.flatMap((categoria) =>
              categoria.atividades.map((atividade) => ({
                '@type': 'LocationFeatureSpecification',
                name: atividade.nome,
                value: true,
              }))
            )
          : []),
      ],
    },
  ]

  const faqs = [...(condominio.faqs ?? []), ...(clube?.seo.faqs ?? [])]
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: faq.resposta },
      })),
    })
  }

  if (clube?.programacaoSemanal && clube.programacaoSemanal.length > 0) {
    graph.push({
      '@type': 'SportsActivityLocation',
      '@id': `${pageUrl}#clube`,
      name: clube.nome,
      url: `${pageUrl}#clube`,
      description: clube.seo.metaDescription,
      image: clube.hero.imagem,
      containedInPlace: { '@type': 'ApartmentComplex', name: condominio.nome },
      event: clube.programacaoSemanal.map((aula) => ({
        '@type': 'Event',
        name: `${aula.nome}${aula.turma ? ` — ${aula.turma}` : ''}`,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        audience: aula.publicos.map((publico) => ({ '@type': 'Audience', audienceType: publico })),
        eventSchedule: {
          '@type': 'Schedule',
          byDay: aula.dias.map((dia) => SCHEMA_DAYS[dia]),
          startTime: aula.horario,
          scheduleTimezone: 'America/Sao_Paulo',
        },
        location: { '@type': 'Place', name: clube.nome, url: `${pageUrl}#clube` },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
