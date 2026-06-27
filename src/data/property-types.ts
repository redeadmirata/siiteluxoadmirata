/**
 * Tipos de imóvel — Admirata
 * Metadados de exibição para cada tipo.
 */

import type { PropertyType, PropertyPurpose } from '@/types'

export interface PropertyTypeConfig {
  type: PropertyType
  slug: string
  /** Label singular */
  label: string
  /** Label plural */
  labelPlural: string
  /** Ícone Lucide */
  icon: string
  /** Indica se tem terreno (afeta campos exibidos) */
  hasTerrain?: boolean
}

export interface PropertyPurposeConfig {
  purpose: PropertyPurpose
  slug: string
  label: string
  /** Label curto (para badges) */
  labelShort: string
  /** Cor da badge: CSS class ou token */
  color: string
}

export const propertyTypes: PropertyTypeConfig[] = [
  { type: 'Apartamento',          slug: 'apartamento',        label: 'Apartamento',        labelPlural: 'Apartamentos',        icon: 'Building2' },
  { type: 'Cobertura',            slug: 'cobertura',          label: 'Cobertura',          labelPlural: 'Coberturas',          icon: 'Layers' },
  { type: 'Cobertura duplex',     slug: 'cobertura-duplex',   label: 'Cobertura Duplex',   labelPlural: 'Coberturas Duplex',   icon: 'Layers' },
  { type: 'Penthouse',            slug: 'penthouse',          label: 'Penthouse',          labelPlural: 'Penthouses',          icon: 'Star' },
  { type: 'Casa',                 slug: 'casa',               label: 'Casa',               labelPlural: 'Casas',               icon: 'Home' },
  { type: 'Casa em condomínio',   slug: 'casa-condominio',    label: 'Casa em Condomínio', labelPlural: 'Casas em Condomínio', icon: 'Home',         hasTerrain: true },
  { type: 'Terreno',              slug: 'terreno',            label: 'Terreno',            labelPlural: 'Terrenos',            icon: 'Map',          hasTerrain: true },
]

export const propertyPurposes: PropertyPurposeConfig[] = [
  { purpose: 'Venda',     slug: 'venda',     label: 'À Venda',     labelShort: 'Venda',     color: 'ink' },
  { purpose: 'Locação',   slug: 'locacao',   label: 'Para Alugar', labelShort: 'Aluguel',   color: 'gold' },
  { purpose: 'Temporada', slug: 'temporada', label: 'Temporada',   labelShort: 'Temporada', color: 'stone' },
]

export function getPropertyType(slug: string): PropertyTypeConfig | undefined {
  return propertyTypes.find((t) => t.slug === slug)
}

export function getPropertyTypeByName(type: PropertyType): PropertyTypeConfig | undefined {
  return propertyTypes.find((t) => t.type === type)
}

export function getPropertyPurpose(slug: string): PropertyPurposeConfig | undefined {
  return propertyPurposes.find((p) => p.slug === slug)
}

export function getPropertyPurposeByName(purpose: PropertyPurpose): PropertyPurposeConfig | undefined {
  return propertyPurposes.find((p) => p.purpose === purpose)
}
