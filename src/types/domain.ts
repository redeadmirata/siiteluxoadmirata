/**
 * Tipos de domínio — Admirata
 * Agnósticos de CMS. Mapeiam para os tipos Sanity via adaptadores em @/lib/adapters.
 *
 * Regra: componentes importam daqui, não de @/types/sanity.
 */

// ─── Image ────────────────────────────────────────────────────────────────────

/** Imagem normalizada para uso nos componentes */
export interface Image {
  url: string
  alt?: string
  width?: number
  height?: number
  /** Blur placeholder (LQIP) */
  lqip?: string
  /** Proporção width/height */
  aspectRatio?: number
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export type GalleryItemType = 'photo' | 'render' | 'video' | 'tour360'

/** Item de galeria normalizado */
export interface GalleryItem {
  id: string
  type: GalleryItemType
  image: Image
  /** Título/legenda opcional */
  caption?: string
  /** URL para vídeo ou tour 360° */
  src?: string
  /** Ordem de exibição */
  order?: number
}

/** Galeria completa */
export interface Gallery {
  items: GalleryItem[]
  /** Total de fotos (pode diferir de items.length se houver paginação) */
  total?: number
}

// ─── Video ────────────────────────────────────────────────────────────────────

export type VideoProvider = 'youtube' | 'vimeo' | 'mp4'

export interface Video {
  /** URL original (YouTube, Vimeo, ou MP4 direto) */
  url: string
  /** Provedor inferido a partir da URL */
  provider?: VideoProvider
  /** Título do vídeo */
  title?: string
  /** Poster/thumbnail */
  poster?: string
  /** Duração em segundos */
  duration?: number
}

// ─── FloorPlan (Planta Baixa) ─────────────────────────────────────────────────

export interface FloorPlanRoom {
  name: string
  type?: string
  /** Área em m² */
  area?: number
  /** Posição relativa na planta (0–1) para hotspot interativo */
  x?: number
  y?: number
}

export interface FloorPlan {
  id: string
  image: Image
  /** Nome da tipologia (ex: "Planta 3 Quartos 180m²") */
  title?: string
  /** Quartos desta tipologia */
  bedrooms?: number
  /** Área privativa total */
  area?: number
  rooms?: FloorPlanRoom[]
}

// ─── Amenity ─────────────────────────────────────────────────────────────────

export type AmenityCategory =
  | 'lazer'
  | 'esporte'
  | 'servicos'
  | 'seguranca'
  | 'pets'
  | 'sustentabilidade'
  | 'outros'

export interface Amenity {
  /** Slug único para chave (ex: "piscina", "academia") */
  slug: string
  /** Nome exibido */
  name: string
  category?: AmenityCategory
  /** Ícone — nome do Lucide React (ex: "Waves", "Dumbbell") ou URL de SVG */
  icon?: string
  /** Descrição expandida */
  description?: string
}

// ─── Location ─────────────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number
  lng: number
}

/** Ponto de interesse próximo ao imóvel */
export interface NearbyPlace {
  name: string
  category: string
  /** Distância em metros */
  distance?: number
  coordinates?: Coordinates
}

export interface Location {
  /** Endereço completo (ou parcial para imóveis off-market) */
  address?: string
  /** Bairro (texto livre) */
  neighborhood?: string
  city: string
  state: string
  /** CEP */
  zipCode?: string
  coordinates?: Coordinates
  /** Pontos de interesse próximos */
  nearby?: NearbyPlace[]
  /** Referência de localização (ex: "Próximo ao Parque do Flamengo") */
  reference?: string
}

// ─── Property ─────────────────────────────────────────────────────────────────

export type PropertyType =
  | 'Apartamento'
  | 'Cobertura'
  | 'Cobertura duplex'
  | 'Penthouse'
  | 'Casa'
  | 'Casa em condomínio'
  | 'Terreno'

export type PropertyPurpose = 'Venda' | 'Locação' | 'Temporada'

export type PropertyStatus =
  | 'Disponível'
  | 'Vendido'
  | 'Locado'
  | 'Em negociação'

export type PropertyMarket = 'Rio de Janeiro' | 'Serra Gaúcha'

export type PropertyBedrooms = 1 | 2 | 3 | 4 | 5

/** Características agrupadas (ex: { grupo: "Lazer", nome: "Piscina privativa" }) */
export interface PropertyFeature {
  group: string
  name: string
}

/** Card resumido — usado em listagens, destaques e relacionados */
export interface PropertyCard {
  id: string
  slug: string
  title: string
  type: PropertyType
  purpose: PropertyPurpose
  market: PropertyMarket
  status: PropertyStatus
  featured?: boolean
  /** Preço em BRL */
  price?: number
  /** Área privativa em m² */
  area?: number
  bedrooms?: number
  suites?: number
  parkingSpaces?: number
  /** Imagem de capa para cards */
  coverImage?: Image
  /** Bairro resumido */
  neighborhood?: {
    id: string
    name: string
    slug: string
    city: string
  }
  /** Condomínio ao qual pertence */
  condominium?: {
    id: string
    name: string
    slug: string
  }
}

/** Detalhe completo do imóvel — PDI */
export interface PropertyDetail extends PropertyCard {
  /** Preço de locação (para modalidade Locação) */
  rentalPrice?: number
  /** IPTU anual */
  iptu?: number
  /** Condomínio mensal */
  condoFee?: number
  /** Área total (com varanda/área de serviço) */
  totalArea?: number
  /** Área do terreno (para casas/terrenos) */
  landArea?: number
  /** Quartos reversíveis */
  reversibleRooms?: number
  bathrooms?: number
  description?: string
  /** Código de referência interno */
  refCode?: string
  location?: Location
  gallery?: Gallery
  floorPlans?: FloorPlan[]
  amenities?: Amenity[]
  features?: PropertyFeature[]
  videos?: Video[]
  /** URL do tour virtual (Matterport ou similar) */
  virtualTourUrl?: string
  /** Corretor responsável */
  broker?: {
    name: string
    phone?: string
    email?: string
    photo?: Image
    creci?: string
  }
  /** WhatsApp de contato direto */
  whatsapp?: string
  /** Imóveis semelhantes */
  related?: PropertyCard[]
}
