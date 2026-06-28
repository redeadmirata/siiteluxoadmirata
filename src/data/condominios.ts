import { clubeVerdant, type ClubeData } from './clube-verdant'

const CLUBES_POR_CONDOMINIO: Readonly<Record<string, ClubeData>> = {
  'verdant-valley': clubeVerdant,
}

export function getClubePorCondominio(slug: string) {
  return CLUBES_POR_CONDOMINIO[slug]
}
