import { SITE } from '@/config/site'
import { formatArea, formatPreco } from '@/lib/formatters'

/**
 * Gera title e description de SEO para páginas de imóvel.
 * Fallback automático se os campos de SEO não estiverem preenchidos no Sanity.
 */
export function buildImovelMeta({
  titulo,
  tipo,
  quartos,
  areaUtil,
  bairroNome,
  cidade,
  condominioNome,
  preco,
  precoSobConsulta,
  seoTitulo,
  seoDescricao,
}: {
  titulo: string
  tipo?: string | null
  quartos?: number | null
  areaUtil?: number | null
  bairroNome?: string | null
  cidade?: string | null
  condominioNome?: string | null
  preco?: number | null
  precoSobConsulta?: boolean | null
  seoTitulo?: string | null
  seoDescricao?: string | null
}): { title: string; description: string } {
  const title = seoTitulo ?? `${titulo} | ${SITE.name}`

  if (seoDescricao) return { title, description: seoDescricao }

  const partes: string[] = []
  if (tipo) partes.push(tipo)
  if (quartos) partes.push(`${quartos} quartos`)
  if (areaUtil) partes.push(formatArea(areaUtil))
  if (bairroNome) partes.push(`em ${bairroNome}${cidade ? `, ${cidade}` : ''}`)
  if (condominioNome) partes.push(`· ${condominioNome}`)

  const base = partes.join(' ')
  const precoStr = precoSobConsulta
    ? 'Valor sob consulta'
    : preco
      ? formatPreco(preco)
      : ''

  const description = [base, precoStr, SITE.name].filter(Boolean).join('. ')

  return { title, description }
}

/**
 * Gera title e description de SEO para páginas de bairro.
 */
export function buildBairroMeta({
  nome,
  cidade,
  seoTitulo,
  seoDescricao,
}: {
  nome: string
  cidade?: string | null
  seoTitulo?: string | null
  seoDescricao?: string | null
}): { title: string; description: string } {
  const title = seoTitulo ?? `${nome}${cidade ? `, ${cidade}` : ''} — Imóveis de Alto Padrão | ${SITE.name}`
  const description =
    seoDescricao ??
    `Descubra imóveis exclusivos em ${nome}${cidade ? `, ${cidade}` : ''}. Apartamentos, coberturas e casas selecionados pela ${SITE.name}.`

  return { title, description }
}

/**
 * Gera title e description de SEO para páginas de condomínio.
 */
export function buildCondominioMeta({
  nome,
  bairroNome,
  seoTitulo,
  seoDescricao,
}: {
  nome: string
  bairroNome?: string | null
  seoTitulo?: string | null
  seoDescricao?: string | null
}): { title: string; description: string } {
  const title = seoTitulo ?? `${nome}${bairroNome ? ` — ${bairroNome}` : ''} | ${SITE.name}`
  const description =
    seoDescricao ??
    `Conheça o ${nome}${bairroNome ? ` em ${bairroNome}` : ''}. Unidades disponíveis, infraestrutura e condições de compra na ${SITE.name}.`

  return { title, description }
}
