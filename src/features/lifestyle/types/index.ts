/**
 * Tipos da feature Lifestyle (storytelling, conteúdo editorial).
 */

// ─── Tipos de conteúdo ────────────────────────────────────────────────────────

export type LifestyleBlockTipo =
  | 'storytelling'  // Texto descritivo do imóvel (descricaoPtBr)
  | 'diferenciais'  // Lista de diferenciais do condomínio
  | 'sobre-bairro'  // Texto editorial sobre o bairro
  | 'sobre-cidade'  // Contexto da cidade (Gramado, Rio)

// ─── Dados ────────────────────────────────────────────────────────────────────

export interface LifestyleContent {
  tipo: LifestyleBlockTipo
  titulo?: string
  conteudo: string | string[]
  /** Portable Text para conteúdo rico do Sanity */
  portableText?: unknown[]
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StorytellingProps {
  titulo?: string
  /** Texto em pt-BR */
  descricao: string
  className?: string
}

export interface DiferenciaisProps {
  itens: string[]
  titulo?: string
  className?: string
}
