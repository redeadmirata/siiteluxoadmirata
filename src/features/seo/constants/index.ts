/**
 * Constantes da feature SEO.
 */

export const SEO_SITE_NAME = 'Admirata Imóveis'
export const SEO_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
export const SEO_DEFAULT_OG_IMAGE = `${SEO_SITE_URL}/og-default.jpg`
export const SEO_LOCALE_PT = 'pt_BR'
export const SEO_LOCALE_EN = 'en_US'
export const SEO_LOCALE_FR = 'fr_FR'

/** Sufixo padrão nos títulos de página */
export const SEO_TITLE_SUFFIX = '| Admirata Imóveis'

/** Robots padrão */
export const SEO_ROBOTS_DEFAULT = 'index, follow'
export const SEO_ROBOTS_NOINDEX = 'noindex, nofollow'

/** Twitter card */
export const SEO_TWITTER_HANDLE = '@admirataimoveis'
export const SEO_TWITTER_CARD = 'summary_large_image'
