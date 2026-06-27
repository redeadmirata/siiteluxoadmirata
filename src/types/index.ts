/**
 * Types — Admirata
 * Barrel export para tipos de domínio agnósticos de CMS.
 *
 * Para tipos Sanity (shapes das queries GROQ) → import from '@/types/sanity'
 *
 * @example
 * import type { PropertyCard, Gallery, Lead, Seo } from '@/types'
 */

// ─── Domínio ──────────────────────────────────────────────────────────────────
export type {
  // Image
  Image,
  // Gallery
  GalleryItem,
  GalleryItemType,
  Gallery,
  // Video
  Video,
  VideoProvider,
  // FloorPlan
  FloorPlan,
  FloorPlanRoom,
  // Amenity
  Amenity,
  AmenityCategory,
  // Location
  Location,
  Coordinates,
  NearbyPlace,
  // Property
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  PropertyMarket,
  PropertyBedrooms,
  PropertyFeature,
  PropertyCard,
  PropertyDetail,
} from './domain'

// ─── Lead ─────────────────────────────────────────────────────────────────────
export type {
  LeadSource,
  LeadIntent,
  LeadStatus,
  LeadFormBase,
  LeadPropertyForm,
  LeadPageForm,
  LeadValuationForm,
  Lead,
  LeadApiResponse,
} from './lead'

// ─── SEO ──────────────────────────────────────────────────────────────────────
export type {
  SeoImage,
  Seo,
  SeoListing,
  SeoArticle,
} from './seo'
