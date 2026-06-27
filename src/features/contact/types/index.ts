/**
 * Tipos da feature Contact (CTAs de contato via WhatsApp e formulário).
 */

// ─── Praça / Mercado ──────────────────────────────────────────────────────────

export type Praca = 'rj' | 'rs'

// ─── Contextos de CTA ─────────────────────────────────────────────────────────

export type CTAContexto =
  | 'imovel'
  | 'condominio'
  | 'bairro'
  | 'generico'
  | 'tour'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CTAWhatsAppProps {
  titulo: string
  praca?: Praca
  contexto?: CTAContexto
  mensagemCustom?: string
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
}

export interface CTACardProps {
  titulo: string
  preco?: number
  precoSobConsulta?: boolean
  condominio?: number
  iptu?: number
  praca?: Praca
  className?: string
}

export interface CTAFixoProps {
  titulo: string
  preco?: number
  praca?: Praca
  /** Mostrar apenas abaixo de um certo scroll position */
  showAfterPx?: number
}

// ─── Formulário ───────────────────────────────────────────────────────────────

export interface ContatoFormData {
  nome: string
  email: string
  telefone: string
  mensagem?: string
  imovelSlug?: string
  origem?: string
}

export interface ContatoFormProps {
  imovelSlug?: string
  tituloImovel?: string
  className?: string
}
