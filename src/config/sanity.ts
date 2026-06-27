/**
 * Configuração centralizada do Sanity CMS.
 * Importe daqui — nunca espalhe projectId/dataset nos componentes.
 */

export const SANITY_CONFIG = {
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
} as const

/** Tempo de revalidação padrão para páginas estáticas (segundos) */
export const REVALIDATE_PADRAO = 60

/** Tempo de revalidação para páginas de alto tráfego */
export const REVALIDATE_CURTO = 30

/** Tempo de revalidação para dados raramente alterados (bairros, condomínios) */
export const REVALIDATE_LONGO = 3600
