/**
 * Tipos de SEO — Admirata
 * Agnósticos de CMS. Usados por generateMetadata() e componentes.
 */

/** Dimensões de imagem para OG/Twitter */
export interface SeoImage {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: 'image/jpeg' | 'image/png' | 'image/webp'
}

/** Dados de SEO para uma página qualquer */
export interface Seo {
  /** <title> — recomendado: 50–60 chars */
  title: string
  /** <meta description> — recomendado: 120–160 chars */
  description?: string
  /** URL canônica absoluta */
  canonical?: string
  /** Imagem principal para Open Graph e Twitter Card */
  image?: SeoImage
  /** Palavras-chave (menos relevante hoje, mas preservamos) */
  keywords?: string[]
  /** Controle de indexação */
  robots?: {
    index?: boolean
    follow?: boolean
    noarchive?: boolean
    nosnippet?: boolean
    maxSnippet?: number
    maxImagePreview?: 'none' | 'standard' | 'large'
    maxVideoPreview?: number
  }
  /** Open Graph */
  og?: {
    type?: 'website' | 'article' | 'product'
    siteName?: string
    locale?: string
    title?: string
    description?: string
    images?: SeoImage[]
  }
  /** Twitter Card */
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    site?: string
    creator?: string
    title?: string
    description?: string
    image?: string
  }
  /** hreflang — internacionalização */
  alternates?: {
    canonical?: string
    languages?: Record<string, string>
  }
  /** JSON-LD estruturado (schema.org) — injetado como <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/** SEO mínimo para listagem (usado em generateMetadata de páginas de listagem) */
export type SeoListing = Pick<Seo, 'title' | 'description' | 'canonical' | 'robots'>

/** SEO para artigo/blog */
export interface SeoArticle extends Seo {
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
}
