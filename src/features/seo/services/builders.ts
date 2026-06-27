/**
 * Builders de metadata para Next.js generateMetadata().
 * Tipados com a API do Next.js 14.
 */

import type { Metadata } from 'next'
import type { MetaFull } from '../types'
import { SEO_SITE_NAME, SEO_SITE_URL, SEO_DEFAULT_OG_IMAGE, SEO_TITLE_SUFFIX, SEO_LOCALE_PT } from '../constants'

/** Builder genérico — todos os outros chamam este */
export function buildMeta(meta: MetaFull): Metadata {
  const title = meta.title.includes('Admirata')
    ? meta.title
    : `${meta.title} ${SEO_TITLE_SUFFIX}`

  const ogImage = meta.ogImage ?? SEO_DEFAULT_OG_IMAGE

  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: meta.canonical ?? SEO_SITE_URL,
    },
    openGraph: {
      title: meta.ogTitle ?? title,
      description: meta.ogDescription ?? meta.description,
      url: meta.canonical ?? SEO_SITE_URL,
      siteName: SEO_SITE_NAME,
      locale: meta.locale ?? SEO_LOCALE_PT,
      type: (meta.ogType as 'website' | 'article') ?? 'website',
      images: [{ url: ogImage, alt: meta.ogImageAlt ?? title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle ?? title,
      description: meta.ogDescription ?? meta.description,
      images: [ogImage],
    },
  }
}

/** Builder para PDI de imóvel */
export function buildImovelMeta(params: {
  titulo: string
  bairroNome?: string
  tipo?: string
  preco?: number
  area?: number
  slug: string
  imagemUrl?: string
  descricao?: string
  noindex?: boolean
}): Metadata {
  const { titulo, bairroNome, slug, imagemUrl, descricao, noindex } = params

  const description = descricao
    ?? `${titulo}${bairroNome ? ` em ${bairroNome}` : ''}. Imóvel de alto padrão na Admirata Imóveis.`

  return buildMeta({
    title: titulo,
    description,
    canonical: `${SEO_SITE_URL}/imovel/${slug}`,
    noindex,
    ogImage: imagemUrl,
    ogType: 'website',
  })
}

/** Builder para PDI de condomínio */
export function buildCondominioMeta(params: {
  nome: string
  bairroNome?: string
  slug: string
  imagemUrl?: string
  descricao?: string
  noindex?: boolean
}): Metadata {
  const { nome, bairroNome, slug, imagemUrl, descricao, noindex } = params

  const description = descricao
    ?? `${nome}${bairroNome ? ` — ${bairroNome}` : ''}. Condomínio de alto padrão na Admirata Imóveis.`

  return buildMeta({
    title: nome,
    description,
    canonical: `${SEO_SITE_URL}/imoveis/${slug}`,
    noindex,
    ogImage: imagemUrl,
  })
}

/** Builder para landing de bairro */
export function buildBairroMeta(params: {
  nome: string
  cidadeNome?: string
  slug: string
  imagemUrl?: string
  metaTitle?: string
  metaDescription?: string
}): Metadata {
  const { nome, cidadeNome, slug, imagemUrl, metaTitle, metaDescription } = params

  return buildMeta({
    title: metaTitle ?? `Imóveis em ${nome}${cidadeNome ? `, ${cidadeNome}` : ''}`,
    description: metaDescription ?? `Encontre imóveis de alto padrão em ${nome} com a Admirata Imóveis.`,
    canonical: `${SEO_SITE_URL}/bairro/${slug}`,
    ogImage: imagemUrl,
  })
}
