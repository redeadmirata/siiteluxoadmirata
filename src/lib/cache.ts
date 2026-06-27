/**
 * Cache layer — Admirata
 *
 * Wraps React's `cache()` e Next.js `unstable_cache` para deduplicar
 * fetches dentro de um request e persistir entre requests (ISR).
 *
 * Hierarquia de cache:
 *   React cache()          → dedup por request (memória, sem TTL)
 *   unstable_cache()       → persiste entre requests (Data Cache do Next.js)
 *   revalidate na rota     → ISR — rebuild da página inteira
 *
 * Tags padrão para revalidação via Sanity webhook:
 *   'imovel'               → revalida todos os imóveis
 *   `imovel:${slug}`       → revalida um imóvel específico
 *   'condominio'           → revalida todos os condomínios
 *   `condominio:${slug}`   → revalida um condomínio específico
 *   'bairro'               → revalida todos os bairros
 *   `bairro:${slug}`       → revalida um bairro específico
 *
 * Uso:
 *   import { cachedFetch } from '@/lib/cache'
 *   const getImovel = cachedFetch(
 *     () => client.fetch(QUERY, { slug }),
 *     ['imovel', `imovel:${slug}`],
 *     60
 *   )
 */

import { cache } from 'react'
import { unstable_cache as nextCache } from 'next/cache'

// ─── TTL constants (seconds) ──────────────────────────────────────────────────

export const TTL = {
  /** Imóveis — mudam com mais frequência (preço, status) */
  IMOVEL: 60,
  /** Condomínios — mudam menos */
  CONDOMINIO: 3_600,
  /** Bairros — muito estáveis */
  BAIRRO: 3_600,
  /** Blog — publicações eventuais */
  BLOG: 3_600,
  /** Lançamentos */
  LANCAMENTO: 600,
  /** Home — destaque pode mudar diariamente */
  HOME: 120,
  /** Sitemap — rebuild frequente para novos imóveis */
  SITEMAP: 3_600,
  /** Estático — nunca muda */
  STATIC: false as const,
} as const

// ─── Cache tags ───────────────────────────────────────────────────────────────

export const TAGS = {
  imoveis: 'imovel',
  imovel: (slug: string) => `imovel:${slug}`,
  condominios: 'condominio',
  condominio: (slug: string) => `condominio:${slug}`,
  bairros: 'bairro',
  bairro: (slug: string) => `bairro:${slug}`,
  blog: 'blog',
  post: (slug: string) => `blog:${slug}`,
  lancamentos: 'lancamento',
  lancamento: (slug: string) => `lancamento:${slug}`,
  home: 'home',
} as const

// ─── cachedFetch — wrapper de conveniência ────────────────────────────────────

/**
 * Combina React `cache()` (dedup por request) + `unstable_cache` (Data Cache).
 *
 * @param fn        Função async que busca os dados
 * @param tags      Cache tags para revalidação granular via webhook
 * @param revalidate TTL em segundos (ou `false` para cache permanente)
 */
export function cachedFetch<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  tags: string[],
  revalidate: number | false = TTL.IMOVEL
): () => Promise<T> {
  // unstable_cache persiste no Data Cache entre requests
  const cached = nextCache(fn, keyParts, {
    tags,
    revalidate,
  })

  // React cache() dedup fetches dentro do mesmo request (Server Components tree)
  return cache(cached)
}

// ─── Helpers pré-configurados ─────────────────────────────────────────────────

/**
 * Cache para fetch de imóvel específico.
 * Revalidado via webhook quando o imóvel é editado no Sanity.
 */
export function cacheImovel<T>(slug: string, fn: () => Promise<T>) {
  return cachedFetch(fn, ['imovel', slug], [TAGS.imoveis, TAGS.imovel(slug)], TTL.IMOVEL)
}

/**
 * Cache para listagem de imóveis.
 */
export function cacheImoveisListing<T>(key: string, fn: () => Promise<T>) {
  return cachedFetch(fn, ['imoveis', key], [TAGS.imoveis], TTL.IMOVEL)
}

/**
 * Cache para condomínio específico.
 */
export function cacheCondominio<T>(slug: string, fn: () => Promise<T>) {
  return cachedFetch(fn, ['condominio', slug], [TAGS.condominios, TAGS.condominio(slug)], TTL.CONDOMINIO)
}

/**
 * Cache para bairro específico.
 */
export function cacheBairro<T>(slug: string, fn: () => Promise<T>) {
  return cachedFetch(fn, ['bairro', slug], [TAGS.bairros, TAGS.bairro(slug)], TTL.BAIRRO)
}
