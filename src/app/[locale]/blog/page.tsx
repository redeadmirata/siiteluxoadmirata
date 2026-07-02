import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { BLOG_LISTING_QUERY } from '@/sanity/queries'

export const revalidate = 3600

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${siteUrl}${localePrefix}/blog`,
      languages: {
        'pt-BR': `${siteUrl}/blog`,
        'en-US': `${siteUrl}/en/blog`,
        'es-AR': `${siteUrl}/es/blog`,
      },
    },
    openGraph: {
      title: `${t('title')} | Admirata`,
      description: t('subtitle'),
      url: `${siteUrl}${localePrefix}/blog`,
    },
  }
}

const CATEGORIA_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': {
    'lifestyle-rj': 'Lifestyle RJ',
    'serra-gaucha': 'Serra Gaúcha',
    mercado: 'Mercado Imobiliário',
    arquitetura: 'Arquitetura & Design',
  },
  en: {
    'lifestyle-rj': 'RJ Lifestyle',
    'serra-gaucha': 'Serra Gaúcha',
    mercado: 'Real Estate Market',
    arquitetura: 'Architecture & Design',
  },
  es: {
    'lifestyle-rj': 'Estilo de vida RJ',
    'serra-gaucha': 'Serra Gaucha',
    mercado: 'Mercado inmobiliario',
    arquitetura: 'Arquitectura y dise\u00f1o',
  },
}

interface BlogCard {
  _id: string
  titulo: string
  slug: { current: string }
  categoria: string
  resumo?: string
  publicadoEm: string
  autor?: string
  destaque?: boolean
  imagemCapa?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } }
    alt?: string
  }
}

function formatData(iso: string, locale: string) {
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-AR' : 'pt-BR'
  return new Date(iso).toLocaleDateString(loc, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'blog' })
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const catLabels = CATEGORIA_LABELS[params.locale] ?? CATEGORIA_LABELS['pt-BR']

  const posts = await client.fetch<BlogCard[]>(
    BLOG_LISTING_QUERY,
    {},
    { next: { revalidate: 3600 } }
  )

  const categorias = Array.from(new Set(posts.map((p) => p.categoria))).filter(Boolean)

  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section className="bg-ink pt-[72px] pb-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            {t('label')}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-white font-light leading-[1.08] max-w-2xl">
            {t('title')}
          </h1>
          <div className="mt-5 w-12 h-px bg-gold" />
          <p className="mt-6 text-base text-white/50 max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-32 text-center">
          <p className="font-display text-2xl text-ink mb-3">{t('empty')}</p>
          <p className="text-sm text-muted">{t('emptyDesc')}</p>
        </section>
      ) : (
        <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
          {/* Filtros por categoria */}
          {categorias.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categorias.map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] uppercase tracking-[0.2em] border border-stone text-muted px-4 py-2 cursor-default"
                >
                  {catLabels[cat] ?? cat}
                </span>
              ))}
            </div>
          )}

          {/* Post destaque */}
          {posts[0] && (
            <Link
              href={`${localePrefix}/blog/${posts[0].slug.current}`}
              className="group block mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-stone mb-6 lg:mb-0">
                {posts[0].imagemCapa?.asset?.url ? (
                  <Image
                    src={posts[0].imagemCapa.asset.url}
                    alt={posts[0].imagemCapa.alt ?? posts[0].titulo}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-smooth"
                    placeholder={posts[0].imagemCapa.asset.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={posts[0].imagemCapa.asset.metadata?.lqip}
                  />
                ) : (
                  <div className="w-full h-full bg-stone" />
                )}
                {posts[0].destaque && (
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] bg-gold text-white px-3 py-1.5">
                      {t('featured')}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">
                  {catLabels[posts[0].categoria] ?? posts[0].categoria}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight group-hover:text-gold transition-colors duration-200 mb-4">
                  {posts[0].titulo}
                </h2>
                {posts[0].resumo && (
                  <p className="text-base text-muted leading-relaxed mb-6 line-clamp-3">
                    {posts[0].resumo}
                  </p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-muted">
                  {posts[0].autor && <span>{posts[0].autor}</span>}
                  {posts[0].autor && <span aria-hidden>·</span>}
                  <time dateTime={posts[0].publicadoEm}>
                    {formatData(posts[0].publicadoEm, params.locale)}
                  </time>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold group-hover:gap-3 transition-all duration-200">
                  {t('readArticle')}
                  <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          )}

          {posts.length > 1 && <div className="h-px bg-stone mb-16" aria-hidden />}

          {/* Grid dos demais posts */}
          {posts.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {posts.slice(1).map((post) => (
                <BlogPostCard
                  key={post._id}
                  post={post}
                  localePrefix={localePrefix}
                  locale={params.locale}
                  catLabels={catLabels}
                  readLabel={t('readArticle')}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

function BlogPostCard({
  post,
  localePrefix,
  locale,
  catLabels,
  readLabel: _readLabel,
}: {
  post: BlogCard
  localePrefix: string
  locale: string
  catLabels: Record<string, string>
  readLabel: string
}) {
  return (
    <Link href={`${localePrefix}/blog/${post.slug.current}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden bg-stone mb-5">
        {post.imagemCapa?.asset?.url ? (
          <Image
            src={post.imagemCapa.asset.url}
            alt={post.imagemCapa.alt ?? post.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-smooth"
            placeholder={post.imagemCapa.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={post.imagemCapa.asset.metadata?.lqip}
          />
        ) : (
          <div className="w-full h-full bg-stone" />
        )}
      </div>

      <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-2">
        {catLabels[post.categoria] ?? post.categoria}
      </p>
      <h2 className="font-display text-xl text-ink leading-snug group-hover:text-gold transition-colors duration-200 mb-3 line-clamp-2">
        {post.titulo}
      </h2>
      {post.resumo && (
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
          {post.resumo}
        </p>
      )}
      <time dateTime={post.publicadoEm} className="text-[11px] text-muted/60">
        {new Date(post.publicadoEm).toLocaleDateString(
          locale === 'en' ? 'en-US' : locale === 'es' ? 'es-AR' : 'pt-BR',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )}
      </time>
    </Link>
  )
}
