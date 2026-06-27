/**
 * Feature: Analytics
 */

export type {
  PixelEventName,
  PixelEventParams,
  GA4EventName,
  GA4EventParams,
  TrackImovelViewParams,
  TrackLeadParams,
} from './types'

export {
  ANALYTICS_CURRENCY,
  LEAD_ORIGENS,
} from './constants'

export {
  trackPixel,
  trackGA,
  trackImovelView,
  trackLead,
  trackFavorite,
  trackSearch,
  trackTourVirtual,
  trackAgendarVisita,
} from './services'
