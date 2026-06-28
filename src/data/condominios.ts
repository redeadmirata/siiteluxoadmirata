import { clubeVerdant, type ClubeData } from './clube-verdant'

export interface CondominioPresentationOverride {
  heroImageSrc?: string
  arquiteturaLogoSrc?: string
  geo?: { lat: number; lng: number }
  mapsHref?: string
  proximidades?: readonly string[]
  plantas?: ReadonlyArray<{
    nome: string
    quartos?: string
    area?: number
    src: string
  }>
  textReplacements?: ReadonlyArray<{ from: string; to: string }>
}

const CLUBES_POR_CONDOMINIO: Readonly<Record<string, ClubeData>> = {
  'verdant-valley': clubeVerdant,
}

const PRESENTATION_OVERRIDES: Readonly<Record<string, CondominioPresentationOverride>> = {
  'verdant-valley': {
    heroImageSrc: '/images/verdant-valley/hero-residence.jpg',
    arquiteturaLogoSrc: '/images/verdant-valley/logo-verdant-valley.png',
    geo: { lat: -22.9703479, lng: -43.4229203 },
    mapsHref: 'https://www.google.com/maps/search/?api=1&query=-22.9703479,-43.4229203',
    proximidades: [
      'Estrada de Camorim, 1003',
      'Jacarepaguá, Rio de Janeiro',
      'Acesso ao Grand Club Verdant',
    ],
    plantas: [
      {
        nome: 'Planta tipo — finais 04 e 05',
        quartos: '2 quartos, sendo 1 suíte',
        src: '/images/verdant-valley/plantas/planta-2-quartos-variante-a.jpg',
      },
      {
        nome: 'Planta tipo — finais 03, 06 e 09',
        quartos: '2 quartos, sendo 1 suíte',
        src: '/images/verdant-valley/plantas/planta-2-quartos-variante-b.jpg',
      },
      {
        nome: 'Planta tipo — finais 01, 02, 07 e 08',
        quartos: '3 quartos, sendo 1 suíte',
        area: 60.86,
        src: '/images/verdant-valley/plantas/planta-3-quartos.jpg',
      },
    ],
    textReplacements: [
      { from: 'condomínio de alto padrão', to: 'condomínio residencial' },
      { from: 'acabamento de alto padrão', to: 'acabamentos funcionais e contemporâneos' },
    ],
  },
}

export function getClubePorCondominio(slug: string) {
  return CLUBES_POR_CONDOMINIO[slug]
}

export function getCondominioPresentationOverride(slug: string) {
  return PRESENTATION_OVERRIDES[slug]
}
