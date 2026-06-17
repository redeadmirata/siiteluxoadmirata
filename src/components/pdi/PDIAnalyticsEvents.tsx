'use client'

import { useEffect } from 'react'
import { trackPixelEvent } from '@/lib/pixel'

interface PDIAnalyticsEventsProps {
  titulo: string
  tipo?: string
  preco?: number
  slug: string
  bairroNome?: string
}

/**
 * Componente invisível que dispara eventos de analytics quando a PDI é aberta.
 * Deve ser incluído na página /imoveis/[slug] como filho do layout.
 *
 * Evento: ViewContent — sinaliza interesse qualificado em um imóvel específico.
 * Usado pelo Meta Ads para otimizar campanhas de remarketing e lookalike.
 */
export default function PDIAnalyticsEvents({
  titulo,
  tipo,
  preco,
  slug,
  bairroNome,
}: PDIAnalyticsEventsProps) {
  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_name: titulo,
      content_category: [tipo, bairroNome].filter(Boolean).join(' · ') || 'Imóvel',
      content_ids: [slug],
      content_type: 'product',
      ...(preco && {
        value: preco,
        currency: 'BRL',
      }),
    })
  }, [titulo, tipo, preco, slug, bairroNome])

  // Componente invisível — só dispara evento
  return null
}
