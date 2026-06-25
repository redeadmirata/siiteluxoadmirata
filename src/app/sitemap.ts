import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import {
  IMOVEIS_SLUGS_QUERY,
  BAIRROS_SLUGS_QUERY,
  BLOG_SLUGS_QUERY,
  CONDOMINIOS_SLUGS_QUERY,
  CONDOMINIOS_SLUGS_HIERARQUIA_QUERY,
  TIPOLOGIAS_SLUGS_QUERY,
  LANCAMENTOS_SLUGS_QUERY,
  ILHAPURA_CONDOMINIOS_SLUGS_QUERY,
} from '@/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    imovelSlugs,
    bairroSlugs,
    blogSlugs,
    condominioSlugs,
    condominioHierarquia,
    tipologiaHierarquia,
    lancamentoSlugs,
    ilhapuraCondominioSlugs,
  ] = await Promise.all([
    client.fetch<Array<{ slug: string; _updatedAt: string }>>(IMOVEIS_SLUGS_QUERY),
    client.fetch<Array<{ slug: string; _updatedAt: string }>>(BAIRROS_SLUGS_QUERY),
    client.fetch<Array<{ slug: string }>>(BLOG_SLUGS_QUERY),
    client.fetch<Array<{ slug: string }>>(CONDOMINIOS_SLUGS_QUERY),
    client.fetch<Array<{ bairroSlug: string; condSlug: string }>>(CONDOMINIOS_SLUGS_HIERARQUIA_QUERY),
    client.fetch<Array<{ bairroSlug: string; condSlug: string; tipologias: string[] }>>(TIPOLOGIAS_SLUGS_QUERY),
    client.fetch<Array<{ slug: string }>>(LANCAMENTOS_SLUGS_QUERY),
    client.fetch<Array<{ slug: string }>>(ILHAPURA_CONDOMINIOS_SLUGS_QUERY),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/imoveis`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/lancamentos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/condominios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/ilhapura`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/imoveis/cobertura`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/imoveis/frente-mar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/imoveis/vista-mar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/imoveis/na-planta`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
  ]

  const condominioDetailRoutes: MetadataRoute.Sitemap = condominioSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/condominios/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const ilhapuraCondominioRoutes: MetadataRoute.Sitemap = ilhapuraCondominioSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/ilhapura/condominios/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }))

  const imovelRoutes: MetadataRoute.Sitemap = imovelSlugs.map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/imovel/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  const bairroRoutes: MetadataRoute.Sitemap = bairroSlugs.map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/imoveis/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const condominioRoutes: MetadataRoute.Sitemap = condominioHierarquia.map(({ bairroSlug, condSlug }) => ({
    url: `${BASE_URL}/imoveis/${bairroSlug}/${condSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const tipologiaRoutes: MetadataRoute.Sitemap = tipologiaHierarquia.flatMap(({ bairroSlug, condSlug, tipologias }) =>
    (tipologias ?? []).map((tipologia) => ({
      url: `${BASE_URL}/imoveis/${bairroSlug}/${condSlug}/${tipologia}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  )

  const lancamentoRoutes: MetadataRoute.Sitemap = lancamentoSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/lancamento/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.78,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.55,
  }))

  return [
    ...staticRoutes,
    ...imovelRoutes,
    ...bairroRoutes,
    ...condominioDetailRoutes,
    ...ilhapuraCondominioRoutes,
    ...condominioRoutes,
    ...tipologiaRoutes,
    ...lancamentoRoutes,
    ...blogRoutes,
  ]
}
