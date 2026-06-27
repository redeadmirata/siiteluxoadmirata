/**
 * Configurações globais do site Admirata
 * Fonte única de verdade para URLs, contatos, credenciais e textos institucionais.
 * Importe daqui — nunca hardcode esses valores nos componentes.
 */

export const SITE = {
  name: 'Admirata Imóveis',
  nameCurto: 'Admirata',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br',
  email: 'atendimento@admirataimoveis.com.br',
  descricao:
    'Imóveis de alto padrão no Rio de Janeiro e Gramado. Consultoria especializada com rigor técnico e inteligência de mercado.',
} as const

/** Números WhatsApp por praça */
export const WHATSAPP = {
  /** Equipe RJ — linha principal */
  rj: '5521998079459',
  /** Equipe RS — Gramado */
  rs: '5554992643070',
} as const

/** Registro profissional CRECI */
export const CRECI = {
  rj: 'CRECI RJ-008553/O',
  rs: 'CRECI-F 58308',
  /** Texto compacto para rodapés e CTAs */
  curto: 'CRECI — RJ / RS',
} as const

/** Chave localStorage para favoritos */
export const STORAGE_KEY_FAVORITOS = 'admirata_favoritos'

/** Evento customizado disparado ao alterar favoritos */
export const EVENT_FAVORITOS = 'admirata_favoritos_change'
