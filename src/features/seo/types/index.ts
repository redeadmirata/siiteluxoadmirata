/**
 * Tipos da feature SEO.
 */

// ─── Meta tags ────────────────────────────────────────────────────────────────

export interface MetaBase {
  title: string
  description: string
  canonical?: string
  noindex?: boolean
}

export interface MetaOG extends MetaBase {
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: 'website' | 'article' | 'product'
}

export interface MetaFull extends MetaOG {
  keywords?: string[]
  publishedAt?: string
  modifiedAt?: string
  author?: string
  locale?: string
  alternateLocales?: string[]
}

// ─── Schema.org / JSON-LD ─────────────────────────────────────────────────────

export interface SchemaOrganization {
  '@type': 'RealEstateAgent'
  name: string
  url: string
  telephone: string
  address?: SchemaAddress
  areaServed?: string[]
}

export interface SchemaAddress {
  '@type': 'PostalAddress'
  addressLocality: string
  addressRegion: string
  addressCountry: string
}

export interface SchemaRealEstateListing {
  '@type': 'RealEstateListing'
  name: string
  description?: string
  url: string
  image?: string[]
  address?: SchemaAddress
  floorSize?: { '@type': 'QuantitativeValue'; value: number; unitCode: 'MTK' }
  numberOfRooms?: number
  price?: string
  priceCurrency?: string
}

export interface SchemaBreadcrumb {
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}
