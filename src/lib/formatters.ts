/**
 * Formatadores para exibição de dados de imóveis
 */

/** Formata preço em BRL — ex: R$ 1.850.000 */
export function formatPreco(valor?: number | null): string {
  if (!valor) return 'Consulte'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor)
}

/** Formata área — ex: 187 m² */
export function formatArea(m2?: number | null): string {
  if (!m2) return '—'
  return `${new Intl.NumberFormat('pt-BR').format(m2)} m²`
}

/** Formata data — ex: 13 de junho de 2026 */
export function formatData(iso?: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/** Pluraliza label de quarto/quartos */
export function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}
