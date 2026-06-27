/**
 * Serviços de analytics — funções SSR-safe.
 * Re-exporta de @/services/analytics com tipos da feature.
 */

import { trackPixel, trackGA, trackImovelView, trackLead, trackFavorite, trackSearch } from '@/services/analytics'
import { ANALYTICS_CURRENCY, ANALYTICS_CONTENT_TYPE } from '../constants'
import type { TrackImovelViewParams, TrackLeadParams } from '../types'

export { trackPixel, trackGA, trackImovelView, trackLead, trackFavorite, trackSearch }

/** Rastreia visualização de tour virtual */
export function trackTourVirtual(titulo: string): void {
  trackGA('select_content', {
    event_category: 'Tour Virtual',
    event_label: titulo,
    content_type: ANALYTICS_CONTENT_TYPE,
  })
}

/** Rastreia clique em botão de visita agendada */
export function trackAgendarVisita(params: TrackLeadParams): void {
  trackLead({ titulo: params.titulo, bairroNome: params.bairroNome })
  trackGA('generate_lead', {
    event_category: 'Visita',
    event_label: params.origem ?? 'direto',
  })
}
