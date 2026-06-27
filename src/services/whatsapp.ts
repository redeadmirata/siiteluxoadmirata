import { WHATSAPP } from '@/config/site'

type Praca = 'rj' | 'rs'

/**
 * Gera uma URL de WhatsApp com mensagem pré-preenchida.
 * Centraliza toda a lógica de construção de links — nunca construir na mão nos componentes.
 *
 * @example
 * whatsappUrl({ mensagem: 'Tenho interesse no apartamento X' })
 * // 'https://wa.me/5521998079459?text=Tenho%20interesse%20...'
 */
export function whatsappUrl({
  mensagem,
  praca = 'rj',
  numero,
}: {
  mensagem: string
  praca?: Praca
  numero?: string
}): string {
  const tel = numero ?? WHATSAPP[praca]
  return `https://wa.me/${tel}?text=${encodeURIComponent(mensagem)}`
}

// ─── Mensagens padronizadas ────────────────────────────────────────────────────

/**
 * Link para contato sobre um imóvel específico.
 */
export function whatsappImovel({
  titulo,
  bairroNome,
  praca = 'rj',
}: {
  titulo: string
  bairroNome?: string | null
  praca?: Praca
}): string {
  const mensagem = `Olá! Tenho interesse no imóvel: ${titulo}${bairroNome ? ` em ${bairroNome}` : ''}. Poderia me enviar mais informações?`
  return whatsappUrl({ mensagem, praca })
}

/**
 * Link para contato sobre um condomínio.
 */
export function whatsappCondominio({
  nomeCondominio,
  bairroNome,
  praca = 'rj',
}: {
  nomeCondominio: string
  bairroNome?: string | null
  praca?: Praca
}): string {
  const mensagem = `Olá, tenho interesse em imóveis no ${nomeCondominio}${bairroNome ? ` (${bairroNome})` : ''}.`
  return whatsappUrl({ mensagem, praca })
}

/**
 * Link para contato sobre um bairro.
 */
export function whatsappBairro({
  bairroNome,
  praca = 'rj',
}: {
  bairroNome: string
  praca?: Praca
}): string {
  const mensagem = `Olá, gostaria de conhecer imóveis em ${bairroNome}.`
  return whatsappUrl({ mensagem, praca })
}

/**
 * Link genérico de contato com especialista.
 */
export function whatsappContato({ praca = 'rj' }: { praca?: Praca } = {}): string {
  return whatsappUrl({
    mensagem: 'Olá! Gostaria de falar com um especialista Admirata.',
    praca,
  })
}
