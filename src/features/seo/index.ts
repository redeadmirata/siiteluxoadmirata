/**
 * Feature: SEO
 */

export type {
  MetaBase,
  MetaOG,
  MetaFull,
  SchemaOrganization,
  SchemaAddress,
  SchemaRealEstateListing,
  SchemaBreadcrumb,
} from './types'

export {
  SEO_SITE_NAME,
  SEO_SITE_URL,
  SEO_DEFAULT_OG_IMAGE,
  SEO_TITLE_SUFFIX,
  SEO_LOCALE_PT,
  SEO_ROBOTS_DEFAULT,
} from './constants'

export { buildMeta, buildImovelMeta, buildCondominioMeta, buildBairroMeta } from './services/builders'

export {
  buildImovelJsonLd,
  buildCondominioJsonLd,
  buildBairroJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildGraphJsonLd,
} from './services/jsonld'
