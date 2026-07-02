import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client, urlForImage } from '@/sanity/client'
import { BLOG_POST_QUERY, BLOG_SLUGS_QUERY } from '@/sanity/queries'
import { routing } from '@/i18n/routing'

export const revalidate = 3600

interface BlogPost {
  _id: string
  titulo: string
  slug: { current: string }
  categoria: string
  resumo?: string
  publicadoEm: string
  autor?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conteudo?: any[]
  imagemCapa?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } }
    alt?: string
  }
  bairroRelacionado?: {
    _id: string
    nome: string
    slug: { current: string }
    cidade: string
    estado: string
    fotoCapa?: { url: string; metadata?: { lqip?: string } }
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { asset?: { url: string } }
  }
}

interface PageProps {
  params: { locale: string; slug: string }
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

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(BLOG_SLUGS_QUERY)
  return routing.locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await client.fetch<BlogPost | null>(BLOG_POST_QUERY, { slug: params.slug })
  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const title = post.seo?.metaTitle ?? `${post.titulo} | Admirata Blog`
  const description = post.seo?.metaDescription ?? post.resumo ?? ''
  const ogImageUrl = post.seo?.ogImage?.asset?.url ?? post.imagemCapa?.asset?.url ?? undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/blog/${params.slug}`,
      languages: {
        'pt-BR': `${siteUrl}/blog/${params.slug}`,
        'en-US': `${siteUrl}/en/blog/${params.slug}`,
        'es-AR': `${siteUrl}/es/blog/${params.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${localePrefix}/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.publicadoEm,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  }
}

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-6 text-[17px] text-ink/80 leading-[1.8]">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-2xl sm:text-3xl text-ink mt-12 mb-5 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl text-ink mt-8 mb-4 leading-tight">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-gold pl-6 my-8 italic text-ink/60 text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold underline underline-offset-2 hover:text-[#d4ac1a] transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref: string }; alt?: string; legenda?: string; hotspot?: { x: number; y: number } }
    }) => {
      if (!value?.asset?._ref) return null
      const url = urlForImage(value).width(1200).auto('format').quality(85).url()
      return (
        <figure className="my-10 -mx-4 sm:-mx-8 lg:-mx-16">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src={url} alt={value.alt ?? ''} fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
          </div>
          {value.legenda && (
            <figcaption className="text-center text-[11px] text-muted/60 mt-3 tracking-wide">
              {value.legenda}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-6 space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-6 space-y-2 pl-5 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-[17px] text-ink/80 leading-[1.8] before:content-['—'] before:text-gold before:mr-2">
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-[17px] text-ink/80 leading-[1.8]">{children}</li>
    ),
  },
}

export default async function BlogPostPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'blog' })
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`
  const catLabels = CATEGORIA_LABELS[params.locale] ?? CATEGORIA_LABELS['pt-BR']

  const post = await client.fetch<BlogPost | null>(
    BLOG_POST_QUERY,
    { slug: params.slug },
    { next: { revalidate: 3600 } }
  )

  if (!post) notFound()

  const dateLocale = params.locale === 'en' ? 'en-US' : params.locale === 'es' ? 'es-AR' : 'pt-BR'
  const formattedDate = new Date(post.publicadoEm).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const whatsappUrl = `https://wa.me/5521998079459?text=${encodeURIComponent(
    params.locale === 'en'
      ? 'Hello, I saw the Admirata blog and would like more information.'
      : params.locale === 'es'
      ? 'Hola, vi el blog de Admirata y quisiera recibir mas informacion.'
      : 'Olá, vi o blog da Admirata e gostaria de mais informações.'
  )}`

  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[420px] max-h-[640px] bg-ink overflow-hidden">
        {post.imagemCapa?.asset?.url && (
          <Image
            src={post.imagemCapa.asset.url}
            alt={post.imagemCapa.alt ?? post.titulo}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
            placeholder={post.imagemCapa.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={post.imagemCapa.asset.metadata?.lqip}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-screen-xl mx-auto px-6 lg:px-10 pb-10">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <li>
                <Link
                  href={`${localePrefix}/blog`}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden className="text-white/30">/</li>
              <li className="text-gold truncate max-w-[200px]">
                {catLabels[post.categoria] ?? post.categoria}
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-3xl">
            {post.titulo}
          </h1>

          <div className="flex items-center gap-3 mt-5 text-[11px] text-white/50">
            {post.autor && <span>{post.autor}</span>}
            {post.autor && <span aria-hidden>·</span>}
            <time dateTime={post.publicadoEm}>{formattedDate}</time>
          </div>
        </div>
      </section>

      {/* ── Corpo ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16 lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">
        <article>
          {post.resumo && (
            <p className="text-xl text-muted leading-relaxed mb-10 font-light border-l-2 border-gold pl-6">
              {post.resumo}
            </p>
          )}

          {post.conteudo && (
            <div className="prose-admirata">
              <PortableText
                value={post.conteudo}
                components={ptComponents as Parameters<typeof PortableText>[0]['components']}
              />
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-stone">
            <Link
              href={`${localePrefix}/blog`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-gold transition-colors"
            >
              <span aria-hidden>←</span>
              {t('backToBlog')}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="mt-12 lg:mt-0 space-y-8">
          {post.bairroRelacionado && (
            <div className="border border-stone p-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
                {t('discoverNeighborhood')}
              </p>
              {post.bairroRelacionado.fotoCapa?.url && (
                <div className="relative aspect-[4/3] overflow-hidden mb-4">
                  <Image
                    src={post.bairroRelacionado.fotoCapa.url}
                    alt={post.bairroRelacionado.nome}
                    fill
                    sizes="320px"
                    className="object-cover"
                    placeholder={post.bairroRelacionado.fotoCapa.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={post.bairroRelacionado.fotoCapa.metadata?.lqip}
                  />
                </div>
              )}
              <h3 className="font-display text-lg text-ink mb-1">
                {post.bairroRelacionado.nome}
              </h3>
              <p className="text-[11px] text-muted mb-4">
                {post.bairroRelacionado.cidade}, {post.bairroRelacionado.estado}
              </p>
              <Link
                href={`${localePrefix}/bairros/${post.bairroRelacionado.slug.current}`}
                className="block text-center text-[11px] uppercase tracking-[0.2em] border border-gold text-gold px-4 py-3 hover:bg-gold hover:text-white transition-colors duration-200"
              >
                {t('viewProperties')}
              </Link>
            </div>
          )}

          <div className="bg-ink p-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
              {t('specialist')}
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              {t('specialistDesc')}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[11px] uppercase tracking-[0.2em] bg-gold text-white px-4 py-3 hover:bg-[#d4ac1a] transition-colors duration-200"
            >
              WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </main>
  )
}
