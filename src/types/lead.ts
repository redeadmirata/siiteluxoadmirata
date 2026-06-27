/**
 * Tipos de Lead — Admirata
 * Captura de interesse / formulários de contato.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeadSource =
  | 'pdi'          // Página de imóvel
  | 'listing'      // Listagem
  | 'home'         // Home
  | 'whatsapp'     // Botão flutuante
  | 'cta'          // Bloco de CTA
  | 'lancamento'   // Página de lançamento
  | 'bairro'       // Página de bairro
  | 'blog'         // Artigo de blog
  | 'outros'

export type LeadIntent =
  | 'comprar'
  | 'alugar'
  | 'avaliar'
  | 'investir'
  | 'temporada'
  | 'outros'

export type LeadStatus =
  | 'novo'
  | 'contato-feito'
  | 'em-atendimento'
  | 'proposta'
  | 'fechado'
  | 'perdido'

// ─── Formulários ──────────────────────────────────────────────────────────────

/** Campos base de qualquer formulário de lead */
export interface LeadFormBase {
  name: string
  email?: string
  phone: string
  message?: string
}

/** Lead de interesse em imóvel específico */
export interface LeadPropertyForm extends LeadFormBase {
  /** Slug do imóvel */
  propertySlug: string
  /** Título do imóvel (para contexto no CRM) */
  propertyTitle?: string
  intent?: LeadIntent
}

/** Lead genérico de página */
export interface LeadPageForm extends LeadFormBase {
  intent?: LeadIntent
  /** Bairro de interesse */
  neighborhood?: string
  /** Faixa de preço de interesse */
  budget?: string
}

/** Lead de avaliação de imóvel */
export interface LeadValuationForm extends LeadFormBase {
  /** Endereço do imóvel a ser avaliado */
  address: string
  propertyType?: string
  area?: number
}

// ─── Entidade Lead ────────────────────────────────────────────────────────────

/** Lead completo — salvo no banco/CRM */
export interface Lead extends LeadFormBase {
  id?: string
  source: LeadSource
  intent?: LeadIntent
  status?: LeadStatus
  /** URL da página onde o lead foi gerado */
  pageUrl?: string
  /** UTM params */
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
  /** Imóvel relacionado */
  propertyId?: string
  propertySlug?: string
  propertyTitle?: string
  /** Data de criação */
  createdAt?: string
  /** Notas do atendente */
  notes?: string
}

// ─── Respostas de API ─────────────────────────────────────────────────────────

export interface LeadApiResponse {
  success: boolean
  message?: string
  leadId?: string
  /** Erro legível para o usuário */
  error?: string
}
