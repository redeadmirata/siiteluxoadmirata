/**
 * Data — Admirata
 * Barrel export para dados estáticos.
 *
 * @example
 * import { amenities, resolveAmenities } from '@/data'
 * import { featureGroups, groupFeatures } from '@/data'
 * import { markets, getMarket } from '@/data'
 * import siteConfig from '@/data/config.json'
 */

// ─── Amenidades ───────────────────────────────────────────────────────────────
export {
  amenities,
  getAmenity,
  getAmenitiesByCategory,
  resolveAmenities,
} from './amenities'

// ─── Características ──────────────────────────────────────────────────────────
export {
  featureGroups,
  features,
  getFeature,
  getFeatureGroup,
  groupFeatures,
} from './features'

export type { Feature, FeatureGroup } from './features'

// ─── Tipos de Imóvel ──────────────────────────────────────────────────────────
export {
  propertyTypes,
  propertyPurposes,
  getPropertyType,
  getPropertyTypeByName,
  getPropertyPurpose,
  getPropertyPurposeByName,
} from './property-types'

export type { PropertyTypeConfig, PropertyPurposeConfig } from './property-types'

// ─── Mercados ─────────────────────────────────────────────────────────────────
export {
  markets,
  getMarket,
  getMarketByName,
} from './markets'

export type { MarketConfig } from './markets'

// ─── Config (JSON — importar diretamente) ─────────────────────────────────────
// import siteConfig from '@/data/config.json'
