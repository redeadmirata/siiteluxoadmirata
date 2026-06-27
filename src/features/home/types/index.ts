/**
 * Tipos do domínio Home.
 */

import type { ImovelCard } from '@/features/imoveis/types'
import type { CondominioCard } from '@/features/condominios/types'
import type { Bairro } from '@/features/bairros/types'

// ─── Props de seções da Home ──────────────────────────────────────────────────

export interface HomeData {
  imoveisDestaque: ImovelCard[]
  condominiosDestaque: CondominioCard[]
  bairros: Bairro[]
}

export interface HomeSectionProps {
  className?: string
  mercado?: 'Rio de Janeiro' | 'Serra Gaúcha'
}
