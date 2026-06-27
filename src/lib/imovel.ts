/**
 * Utilitários de domínio para imóveis.
 * Funções puras — sem side effects, sem imports de client.
 */

import { urlForImovelImage } from '@/sanity/client'
import { whatsappUrl } from '@/utils'
import type { ImovelCard } from '@/types/sanity'

// ─── Imagem ───────────────────────────────────────────────────────────────────

/**
 * Resolve a URL da imagem de capa de um imóvel.
 * Usa `urlForImovelImage` com fallback para `asset.url`.
 */
export function getCapaUrl(
  imagemCapa: ImovelCard['imagemCapa'] | undefined | null,
  width = 800,
): string {
  if (!imagemCapa) return ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return urlForImovelImage(imagemCapa as any, width)
  } catch {
    return imagemCapa.asset?.url ?? ''
  }
}

// ─── Badge ────────────────────────────────────────────────────────────────────

/**
 * Retorna o badge de status do imóvel.
 * Prioridade: Exclusivo > Novidade/Lançamento > tipo
 */
export function getImovelBadge(imovel: Pick<ImovelCard, 'exclusivo' | 'novidade' | 'tipo'>): string {
  if (imovel.exclusivo) return 'Exclusivo'
  if (imovel.novidade) return 'Lançamento'
  return imovel.tipo ?? ''
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

/** Mensagem padrão de interesse em imóvel */
export function imovelWhatsappMsg(titulo: string, bairroNome?: string): string {
  return `Olá! Tenho interesse no imóvel: ${titulo}${bairroNome ? ` em ${bairroNome}` : ''}. Poderia me enviar mais informações?`
}

/**
 * URL de WhatsApp pré-preenchida para um imóvel específico.
 *
 * @example
 * buildImovelWhatsappUrl({ titulo: 'Apto 410', bairroNome: 'Recreio' })
 * // → 'https://wa.me/5521998079459?text=Ol%C3%A1!...'
 */
export function buildImovelWhatsappUrl({
  titulo,
  bairroNome,
  numero = '5521998079459',
}: {
  titulo: string
  bairroNome?: string
  numero?: string
}): string {
  return whatsappUrl(numero, imovelWhatsappMsg(titulo, bairroNome))
}
