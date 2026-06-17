/**
 * NÍVEL 3 da hierarquia SEO: Página de Tipologia
 * URL: /imoveis/[bairro]/[condominio]/[tipologia]/
 *
 * Anti-thin-content (servidor):
 *   index se: ≥ 1 imóvel ativo dessa tipologia neste condomínio
 *   noindex se: nenhum imóvel ativo (mas mantém a página para preservar backlinks)
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  TIPOLOGIAS_SLUGS_QUERY,
  IMOVEIS_POR_TIPOLOGIA_QUERY,
  CONDOMINIO_NOME_BAIRRO_QUERY,
} from '@/sanity/queries'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { routing } from '@/i18n/routing'

export const revalidate = 60

interface PageProps {
  params: { locale: string; slug: string; condominio: string; tipologia: string }
}

interface CondNomeBairro {
  nome: string
  bairroNome: string
  tipologiasDisponiveis?: string[]
}

const TIPOLOGIA_LABELS: Record<string, string> = {
  '1-quarto': '1 quarto',
  '2-quartos': '2 quartos',
  '3-quartos': '3 quartos',
  '4-quartos': '4 quartos',
  'cobertura': 'Coberturas',
  'penthouse': 'Penthouses',
  'casa': 'Casas',
  'terreno': 'Terrenos',
}

export async function generateStaticParams() {
  const condominios = await client.fetch<
    Array<{ bairroSlug: string; condSlug: string; tipologias: string[] }>
  >(TIPOLOGIAS_SLUGS_QUERY)

  return routing.locales.flatMap((locale) =>
    condominios.flatMap((c) =>
      (c.tipologias ?? []).map((tipologia) => ({
        locale,
        slug: c.bairroSlug,
        condominio: c.condSlug,
        tipologia,
      }))
    )
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [cond, imoveis] = await Promise.all([
    client.fetch<CondNomeBairro | null>(
      CONDOMINIO_NOME_BAIRRO_QUERY,
      { condSlug: params.condominio }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_POR_TIPOLOGIA_QUERY,
      { condSlug: params.condominio, tipologia: params.tipologia }
    ),
  ])

  if (!cond) return { title: 'Tipologia não encontrada' }

  const tipLabel = TIPOLOGIA_LABELS[params.tipologia] ?? params.tipologia
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const titulo = `${tipLabel} à venda no ${cond.nome}, ${cond.bairroNome} | Admirata`
  const descricao = `Confira os ${tipLabel.toLowerCase()} disponíveis no ${cond.nome} em ${cond.bairroNome}. Curadoria Admirata.`

  // Anti-thin-content
  const devIndexar = imoveis.length >= 1

  return {
    title: titulo,
    description: descricao,
    robots: devIndexar ? 'index, follow' : 'noindex, follow',
    alternates: {
      canonical: `${siteUrl}${localePrefix}/imoveis/${params.slug}/${params.condominio}/${params.tipologia}`,
    },
  }
}

export default async function TipologiaPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const [cond, imoveis] = await Promise.all([
    client.fetch<CondNomeBairro | null>(
      CONDOMINIO_NOME_BAIRRO_QUERY,
      { condSlug: params.condominio },
      { next: { revalidate: 3600 } }
    ),
    client.fetch<ImovelCard[]>(
      IMOVEIS_POR_TIPOLOGIA_QUERY,
      { condSlug: params.condominio, tipologia: params.tipologia },
      { next: { revalidate: 60 } }
    ),
  ])

  if (!cond) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const tipLabel = TIPOLOGIA_LABELS[params.tipologia] ?? params.tipologia

  // JSON-LD — BreadcrumbList 4 níveis + ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${siteUrl}${localePrefix}/imoveis` },
          { '@type': 'ListItem', position: 3, name: cond.bairroNome, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}` },
          { '@type': 'ListItem', position: 4, name: cond.nome, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}/${params.condominio}` },
          { '@type': 'ListItem', position: 5, name: tipLabel, item: `${siteUrl}${localePrefix}/imoveis/${params.slug}/${params.condominio}/${params.tipologia}` },
        ],
      },
      ...(imoveis.length > 0
        ? [{
            '@type': 'ItemList',
            name: `${tipLabel} no ${cond.nome}`,
            numberOfItems: imoveis.length,
            itemListElement: imoveis.map((im, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: im.titulo,
              url: `${siteUrl}${localePrefix}/imovel/${im.slug.current}`,
            })),
          }]
        : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Imóveis', href: '/imoveis' },
            { label: cond.bairroNome, href: `/imoveis/${params.slug}` },
            { label: cond.nome, href: `/imoveis/${params.slug}/${params.condominio}` },
            { label: tipLabel },
          ]}
        />
      </div>

      <div className="container-site py-8">

        <h1 className="text-display-lg text-ink mb-2">
          {tipLabel} à venda no {cond.nome}
        </h1>
        <p className="text-muted mb-8">
          {cond.bairroNome} · {imoveis.length} {imoveis.length === 1 ? 'unidade' : 'unidades'} disponíveis
        </p>

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {imoveis.map((imovel) => (
              <ImovelCardComponent key={imovel._id} imovel={imovel} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted text-lg mb-4">
              Nenhuma unidade disponível no momento.
            </p>
            <Link
              href={`/imoveis/${params.slug}/${params.condominio}`}
              className="btn-secondary"
            >
              Ver todas as tipologias do {cond.nome}
            </Link>
          </div>
        )}

        {/* Links para outras tipologias do mesmo condomínio */}
        {cond.tipologiasDisponiveis && cond.tipologiasDisponiveis.length > 1 && (
          <section>
            <h2 className="text-display-sm text-ink mb-4">
              Outras tipologias no {cond.nome}
            </h2>
            <div className="flex flex-wrap gap-3">
              {cond.tipologiasDisponiveis
                .filter((t) => t !== params.tipologia)
                .map((tip) => (
                  <Link
                    key={tip}
                    href={`/imoveis/${params.slug}/${params.condominio}/${tip}`}
                    className="px-4 py-2 border border-stone text-ink rounded-full text-sm hover:border-gold hover:text-gold transition-colors"
                  >
                    {TIPOLOGIA_LABELS[tip] ?? tip}
                  </Link>
                ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
