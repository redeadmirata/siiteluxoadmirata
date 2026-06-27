/**
 * Constantes da feature Analytics.
 */

export const ANALYTICS_CURRENCY = 'BRL'
export const ANALYTICS_CONTENT_TYPE = 'product'

/** Origem padrão de leads para tracking */
export const LEAD_ORIGENS = {
  CTACard:      'cta_card',
  CTAFixo:      'cta_fixo',
  Formulario:   'formulario',
  WhatsApp:     'whatsapp',
  TourVirtual:  'tour_virtual',
  FavoritoAdd:  'favorito_add',
} as const

export type LeadOrigem = (typeof LEAD_ORIGENS)[keyof typeof LEAD_ORIGENS]
