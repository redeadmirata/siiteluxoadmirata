import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// ─── Constantes ───────────────────────────────────────────────────
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'gvf51tpc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-06-01',
} as const

// ─── Client público (sem token) — para Server Components ─────────
export const client = createClient({
  ...sanityConfig,
  useCdn: true, // CDN ativado em produção para leituras rápidas
  perspective: 'published',
})

// ─── Client com token — para drafts/preview ───────────────────────
// Usado apenas em Preview Mode / Draft Mode
export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})


// ─── sanityFetch — wrapper para Server Components com cache tags ──
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  return client.fetch(query, params, {
    next: { tags, revalidate: tags.length ? false : 3600 },
  }) as unknown as T
}

// ─── Image URL Builder ────────────────────────────────────────────
const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Helper: gera URL otimizada para um imóvel
 * @param source - campo image do Sanity
 * @param width  - largura desejada em px
 */
export function urlForImovelImage(source: SanityImageSource, width = 1200) {
  return builder
    .image(source)
    .width(width)
    .auto('format') // WebP/AVIF automático
    .quality(85)
    .fit('crop')
    .url()
}
