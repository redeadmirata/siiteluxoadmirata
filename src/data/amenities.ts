/**
 * Amenidades / Comodidades — Admirata
 * Dados estáticos com slugs estáveis para uso nos componentes e filtros.
 * Ícones: nomes do Lucide React.
 */

import type { Amenity } from '@/types'

export const amenities: Amenity[] = [
  // ─── Lazer ────────────────────────────────────────────────────────────────
  { slug: 'piscina',             name: 'Piscina',               category: 'lazer',            icon: 'Waves' },
  { slug: 'piscina-aquecida',    name: 'Piscina Aquecida',      category: 'lazer',            icon: 'Waves' },
  { slug: 'piscina-infantil',    name: 'Piscina Infantil',      category: 'lazer',            icon: 'Waves' },
  { slug: 'solarium',            name: 'Solarium / Deck',       category: 'lazer',            icon: 'Sun' },
  { slug: 'churrasqueira',       name: 'Churrasqueira',         category: 'lazer',            icon: 'Flame' },
  { slug: 'salao-festas',        name: 'Salão de Festas',       category: 'lazer',            icon: 'PartyPopper' },
  { slug: 'salao-jogos',         name: 'Salão de Jogos',        category: 'lazer',            icon: 'Gamepad2' },
  { slug: 'cinema',              name: 'Sala de Cinema',        category: 'lazer',            icon: 'Clapperboard' },
  { slug: 'rooftop',             name: 'Rooftop',               category: 'lazer',            icon: 'Building2' },
  { slug: 'sky-lounge',          name: 'Sky Lounge',            category: 'lazer',            icon: 'Sunset' },
  { slug: 'jardim',              name: 'Jardim / Área Verde',   category: 'lazer',            icon: 'Leaf' },
  { slug: 'brinquedoteca',       name: 'Brinquedoteca',         category: 'lazer',            icon: 'Blocks' },
  { slug: 'playground',          name: 'Playground',            category: 'lazer',            icon: 'Smile' },
  { slug: 'espaco-gourmet',      name: 'Espaço Gourmet',        category: 'lazer',            icon: 'ChefHat' },
  { slug: 'bar-lounge',          name: 'Bar / Lounge',          category: 'lazer',            icon: 'Wine' },
  { slug: 'spa',                 name: 'Spa',                   category: 'lazer',            icon: 'Sparkles' },
  { slug: 'sauna',               name: 'Sauna',                 category: 'lazer',            icon: 'Thermometer' },
  { slug: 'ofuro',               name: 'Ofurô / Banheira',      category: 'lazer',            icon: 'Droplets' },

  // ─── Esporte ──────────────────────────────────────────────────────────────
  { slug: 'academia',            name: 'Academia',              category: 'esporte',          icon: 'Dumbbell' },
  { slug: 'fitness-externo',     name: 'Fitness Externo',       category: 'esporte',          icon: 'Activity' },
  { slug: 'quadra-poliesportiva',name: 'Quadra Poliesportiva',  category: 'esporte',          icon: 'Trophy' },
  { slug: 'quadra-tenis',        name: 'Quadra de Tênis',       category: 'esporte',          icon: 'Circle' },
  { slug: 'quadra-squash',       name: 'Quadra de Squash',      category: 'esporte',          icon: 'Circle' },
  { slug: 'beach-tennis',        name: 'Beach Tennis',          category: 'esporte',          icon: 'Bike' },
  { slug: 'pista-corrida',       name: 'Pista de Corrida',      category: 'esporte',          icon: 'Footprints' },
  { slug: 'yoga-pilates',        name: 'Sala de Yoga / Pilates',category: 'esporte',          icon: 'PersonStanding' },
  { slug: 'campo-futebol',       name: 'Campo de Futebol',      category: 'esporte',          icon: 'Circle' },
  { slug: 'padel',               name: 'Padel',                 category: 'esporte',          icon: 'Trophy' },
  { slug: 'ciclovia',            name: 'Ciclovia',              category: 'esporte',          icon: 'Bike' },

  // ─── Serviços ─────────────────────────────────────────────────────────────
  { slug: 'concierge',           name: 'Concierge',             category: 'servicos',         icon: 'Bell' },
  { slug: 'portaria-24h',        name: 'Portaria 24h',          category: 'servicos',         icon: 'Clock' },
  { slug: 'coworking',           name: 'Coworking',             category: 'servicos',         icon: 'Laptop' },
  { slug: 'sala-reunioes',       name: 'Sala de Reuniões',      category: 'servicos',         icon: 'Presentation' },
  { slug: 'lavanderia',          name: 'Lavanderia',            category: 'servicos',         icon: 'Shirt' },
  { slug: 'delivery-hub',        name: 'Delivery Hub',          category: 'servicos',         icon: 'Package' },
  { slug: 'elevador',            name: 'Elevador',              category: 'servicos',         icon: 'ArrowUpDown' },
  { slug: 'gerador',             name: 'Gerador',               category: 'servicos',         icon: 'Zap' },
  { slug: 'deposito',            name: 'Depósito / Storage',    category: 'servicos',         icon: 'Archive' },
  { slug: 'administradora',      name: 'Administradora no local',category: 'servicos',        icon: 'Building' },

  // ─── Segurança ────────────────────────────────────────────────────────────
  { slug: 'seguranca-24h',       name: 'Segurança 24h',         category: 'seguranca',        icon: 'Shield' },
  { slug: 'controle-acesso',     name: 'Controle de Acesso',    category: 'seguranca',        icon: 'KeyRound' },
  { slug: 'cameras-cftv',        name: 'Câmeras / CFTV',        category: 'seguranca',        icon: 'Camera' },
  { slug: 'interfone',           name: 'Interfone / Videofone', category: 'seguranca',        icon: 'Smartphone' },
  { slug: 'cerca-eletrica',      name: 'Cerca Elétrica',        category: 'seguranca',        icon: 'Zap' },

  // ─── Pets ─────────────────────────────────────────────────────────────────
  { slug: 'pet-place',           name: 'Pet Place',             category: 'pets',             icon: 'PawPrint' },
  { slug: 'pet-care',            name: 'Pet Care',              category: 'pets',             icon: 'Heart' },

  // ─── Sustentabilidade ─────────────────────────────────────────────────────
  { slug: 'energia-solar',       name: 'Energia Solar',         category: 'sustentabilidade', icon: 'Sun' },
  { slug: 'reuso-agua',          name: 'Reuso de Água',         category: 'sustentabilidade', icon: 'Droplets' },
  { slug: 'coleta-seletiva',     name: 'Coleta Seletiva',       category: 'sustentabilidade', icon: 'Recycle' },
  { slug: 'carregador-eletrico', name: 'Carregador EV',         category: 'sustentabilidade', icon: 'Plug' },
]

/** Busca amenidade por slug */
export function getAmenity(slug: string): Amenity | undefined {
  return amenities.find((a) => a.slug === slug)
}

/** Filtra por categoria */
export function getAmenitiesByCategory(category: Amenity['category']): Amenity[] {
  return amenities.filter((a) => a.category === category)
}

/** Slugs → lista de Amenity (para montar o bloco de comodidades do imóvel) */
export function resolveAmenities(slugs: string[]): Amenity[] {
  return slugs
    .map((slug) => getAmenity(slug))
    .filter((a): a is Amenity => !!a)
}
