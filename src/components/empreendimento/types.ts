export interface EmpreendimentoData {
  nome: string
  tipoLabel?: string
  status?: string
  bairroNome?: string
  cidade?: string
  estado?: string
  heroImageSrc?: string
  heroImageLqip?: string
  heroVideoMp4?: string
  virtualTourUrl?: string
  arquiteturaLogoSrc?: string
  manifesto?: string
  sobreParagrafos?: string[]
  construtora?: string
  anoEntrega?: number
  numTorres?: number
  numUnidades?: number
  areaTotal?: number
  prazoEntrega?: string
  precoMinimo?: number
  areaPrivativaMin?: number
  areaPrivativaMax?: number
  infraestrutura?: string[]
  galeria?: Array<{ src: string; alt: string; legenda?: string; lqip?: string }>
  plantas?: Array<{ nome: string; quartos?: string; area?: number; src?: string; lqip?: string }>
  proximidades?: string[]
  geo?: { lat?: number; lng?: number }
  mapsHref?: string
  whatsappHref: string
  whatsappHrefRS?: string
  imoveisHref?: string
}
