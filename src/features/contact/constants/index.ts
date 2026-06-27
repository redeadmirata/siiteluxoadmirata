/**
 * Constantes da feature Contact.
 * Fonte única de verdade — importar de @/config/site quando disponível.
 */

import type { Praca } from '../types'

export const WHATSAPP_NUMEROS: Record<Praca, string> = {
  rj: '5521998079459',
  rs: '5554992643070',
} as const

/** Mensagens padrão por contexto */
export const WHATSAPP_MENSAGENS = {
  imovel: (titulo: string) =>
    `Olá! Tenho interesse no imóvel: ${titulo}. Poderia me enviar mais informações?`,
  condominio: (nome: string) =>
    `Olá! Gostaria de informações sobre o condomínio ${nome}.`,
  bairro: (bairro: string) =>
    `Olá! Tenho interesse em imóveis no bairro ${bairro}.`,
  generico: () =>
    `Olá! Gostaria de informações sobre imóveis na Admirata.`,
  tour: (titulo: string) =>
    `Olá! Quero agendar uma visita ao imóvel: ${titulo}.`,
} as const

export const CRECI = {
  rj: 'CRECI RJ-008553/O',
  rs: 'CRECI-F 58308',
  curto: 'CRECI — RJ / RS',
} as const

/** Número de scroll em px para exibir CTAFixo */
export const CTA_FIXO_SCROLL_THRESHOLD = 600
