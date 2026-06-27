/**
 * Formatadores — Admirata
 * Funções puras de formatação para exibição de dados.
 * Sem dependências externas, SSR-safe.
 */

// ─── Moeda ────────────────────────────────────────────────────────────────────

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * Formata valor em BRL.
 *
 * @example
 * formatCurrency(1850000)           // 'R$ 1.850.000'
 * formatCurrency(1850000, true)     // 'R$ 1,9 mi'
 * formatCurrency(null)              // 'Sob consulta'
 */
export function formatCurrency(
  value?: number | null,
  compact = false,
  fallback = 'Sob consulta'
): string {
  if (!value) return fallback
  return compact ? BRL_COMPACT.format(value) : BRL.format(value)
}

/** Alias semântico para imóveis */
export const formatPreco = formatCurrency

/**
 * Formata área em m².
 * @example formatArea(187) → '187 m²'
 */
export function formatArea(m2?: number | null): string {
  if (!m2) return '—'
  return `${new Intl.NumberFormat('pt-BR').format(m2)} m²`
}

/**
 * Formata data por extenso em pt-BR.
 * @example formatDate('2024-06-13') → '13 de junho de 2024'
 */
export function formatDate(iso?: string | null, locale = 'pt-BR'): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/**
 * Formata número simples.
 * @example formatNumber(1500) → '1.500'
 */
export function formatNumber(n: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale).format(n)
}

/**
 * Pluraliza string.
 * @example pluralize(1, 'quarto', 'quartos') → '1 quarto'
 */
export function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}

// ─── Telefone ─────────────────────────────────────────────────────────────────

/**
 * Formata número de telefone brasileiro.
 * Aceita qualquer string com dígitos — limpa e formata.
 *
 * @example
 * formatPhone('21998079459')   → '(21) 99807-9459'
 * formatPhone('2133221100')    → '(21) 3322-1100'
 * formatPhone('+5521998079459') → '(21) 99807-9459'
 */
export function formatPhone(raw?: string | null): string {
  if (!raw) return ''

  // Remove tudo que não for dígito
  const digits = raw.replace(/\D/g, '')

  // Remove DDI 55 se presente
  const local = digits.startsWith('55') && digits.length > 11
    ? digits.slice(2)
    : digits

  if (local.length === 11) {
    // Celular: (DDD) 9XXXX-XXXX
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`
  }

  if (local.length === 10) {
    // Fixo: (DDD) XXXX-XXXX
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`
  }

  // Retorna sem formatação se não encaixar
  return raw
}

/**
 * Gera URL de WhatsApp.
 * @example whatsappUrl('21998079459', 'Olá!') → 'https://wa.me/5521998079459?text=Ol%C3%A1!'
 */
export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '')
  const number = digits.startsWith('55') ? digits : `55${digits}`
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
