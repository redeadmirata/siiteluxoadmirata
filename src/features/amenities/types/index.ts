/**
 * Tipos da feature Amenities (Características e diferenciais).
 */

// ─── Características de imóvel ────────────────────────────────────────────────

export interface Caracteristica {
  grupo: string
  nome: string
}

export type GrupoCaracteristica =
  | 'Lazer'
  | 'Segurança'
  | 'Serviços'
  | 'Infraestrutura'
  | 'Acabamento'
  | 'Diferenciais'
  | 'Vista'

/** Agrupamento de características para exibição */
export interface CaracteristicaGrupo {
  grupo: GrupoCaracteristica | string
  itens: string[]
}

// ─── Ficha técnica ────────────────────────────────────────────────────────────

export interface EspecTecnica {
  label: string
  valor: string
  /** Ocultar se valor não disponível */
  hidden?: boolean
}

export interface FichaTecnicaProps {
  especs: EspecTecnica[]
  caracteristicas: Caracteristica[]
  className?: string
}

// ─── Amenidades de condomínio ─────────────────────────────────────────────────

export interface AmenidadeCondominio {
  nome: string
  icone?: string
  categoria?: string
}

export interface AmenitiesCondominioProps {
  infraestrutura: string[]
  className?: string
}
