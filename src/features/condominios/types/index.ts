/**
 * Tipos do domínio Condomínio.
 */

import type { SanityImageAsset, SanityImageFile, GaleriaItem, BairroRef, FAQ } from '@/features/shared/types'
import type { ImovelTipologia } from '@/features/imoveis/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type CondominioTipo = 'condominio-fechado' | 'bairro-planejado' | 'vertical' | 'resort'

// ─── Modelos ──────────────────────────────────────────────────────────────────

/** Card resumido — listagem e destaque na home */
export interface CondominioCard {
  _id: string
  nome: string
  slug: { current: string }
  tipo?: CondominioTipo
  destaque?: boolean
  descricao?: string
  infraestrutura?: string[]
  areaTotal?: number
  totalLotes?: number
  bairro?: BairroRef
  fotoCapa?: SanityImageAsset
  totalImoveis: number
}

/** Detalhe completo do condomínio — PDI de condomínio */
export interface CondominioDetalhe extends Omit<CondominioCard, 'fotoCapa'> {
  construtora?: string
  anoEntrega?: number
  numTorres?: number
  numUnidades?: number
  sobre?: unknown[]
  tipologiasDisponiveis?: ImovelTipologia[]
  forcarNoindex?: boolean
  faqs?: FAQ[]
  geo?: { lat?: number; lng?: number; proximidades?: string[] }
  fotoCapa?: SanityImageFile
  galeria?: GaleriaItem[]
  condominiosProximos?: Array<{ nome: string; slug: { current: string } }>
  seo?: { titulo?: string; descricao?: string }
}

/** Resumo inline usado dentro de bairro planejado */
export interface CondominioResumido {
  _id: string
  nome: string
  slug: { current: string }
  status?: string
  construtora?: string
  precoMinimo?: number
  precoMaximo?: number
  areaPrivativaMin?: number
  areaPrivativaMax?: number
  prazoEntrega?: string
  tipologiasDisponiveis?: string[]
  videoTour?: string
  comissao?: number
  vgv?: number
  whatsappCorretor?: string
  mensagemCorretorWhatsapp?: string
  visibilidadeCorretor?: boolean
  imagemCapa?: { url: string; metadata?: { lqip?: string } }
  plantasBaixas?: Array<{
    nome?: string
    quartos?: number
    area?: number
    imagem?: { asset?: { url: string; metadata?: { lqip?: string } } }
  }>
  tabelaPreco?: { asset?: { url: string } }
  materialMarketing?: Array<{
    titulo?: string
    tipo?: string
    url?: string
    arquivo?: { asset?: { url: string } }
  }>
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface CondominioCardProps {
  condominio: CondominioCard
  className?: string
  priority?: boolean
}
