/**
 * Converte qualquer string em slug URL-safe.
 *
 * @example
 * slugify('Barra da Tijuca')   // 'barra-da-tijuca'
 * slugify('2 Quartos + Suíte') // '2-quartos-suite'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                     // decompõe acentos
    .replace(/[̀-ͯ]/g, '')     // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')        // remove caracteres especiais
    .replace(/[\s_]+/g, '-')             // espaços e underscores → hífen
    .replace(/-+/g, '-')                 // múltiplos hífens → um
    .replace(/^-|-$/g, '')               // remove hífens nas bordas
}

/**
 * Gera um slug de imóvel a partir dos dados principais.
 *
 * @example
 * slugifyImovel({ tipo: 'Apartamento', quartos: 3, bairro: 'Barra da Tijuca', condominio: 'Jardim Oceânico' })
 * // 'apartamento-3-quartos-jardim-oceanico-barra-da-tijuca'
 */
export function slugifyImovel({
  tipo,
  quartos,
  bairro,
  condominio,
}: {
  tipo?: string
  quartos?: number
  bairro?: string
  condominio?: string
}): string {
  const partes = [
    tipo,
    quartos ? `${quartos}-quartos` : undefined,
    condominio,
    bairro,
  ].filter(Boolean) as string[]

  return slugify(partes.join(' '))
}
