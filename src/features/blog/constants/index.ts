/**
 * Constantes do domínio Blog.
 */

import type { BlogCategoria } from '../types'

export const BLOG_CATEGORIAS: Record<BlogCategoria, string> = {
  'mercado-imobiliario': 'Mercado Imobiliário',
  'decoracao':           'Decoração',
  'financiamento':       'Financiamento',
  'bairros':             'Bairros',
  'lifestyle':           'Lifestyle',
  'dicas':               'Dicas',
} as const

export const BLOG_POR_PAGINA = 24
export const CACHE_TAG_BLOG = 'post'
