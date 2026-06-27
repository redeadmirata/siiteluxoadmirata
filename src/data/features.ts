/**
 * Características de imóveis — Admirata
 * Grupos e nomes estáveis para filtros, FichaTécnica e busca.
 */

export interface Feature {
  slug: string
  name: string
  group: string
}

export interface FeatureGroup {
  slug: string
  name: string
  features: Feature[]
}

export const featureGroups: FeatureGroup[] = [
  {
    slug: 'acabamento',
    name: 'Acabamento',
    features: [
      { slug: 'piso-porcelanato',    name: 'Piso em porcelanato',       group: 'acabamento' },
      { slug: 'piso-madeira',        name: 'Piso em madeira nobre',     group: 'acabamento' },
      { slug: 'piso-marmore',        name: 'Piso em mármore',           group: 'acabamento' },
      { slug: 'pe-direito-duplo',    name: 'Pé-direito duplo',          group: 'acabamento' },
      { slug: 'pe-direito-alto',     name: 'Pé-direito elevado',        group: 'acabamento' },
      { slug: 'teto-gesso',          name: 'Forro de gesso',            group: 'acabamento' },
      { slug: 'janelas-antirruido',  name: 'Janelas antirruído',        group: 'acabamento' },
      { slug: 'janelas-piso-teto',   name: 'Janelas piso a teto',       group: 'acabamento' },
      { slug: 'porta-blindada',      name: 'Porta blindada',            group: 'acabamento' },
      { slug: 'armarios-planejados', name: 'Armários planejados',       group: 'acabamento' },
      { slug: 'cozinha-americana',   name: 'Cozinha americana',         group: 'acabamento' },
      { slug: 'closet',              name: 'Closet',                    group: 'acabamento' },
    ],
  },
  {
    slug: 'tecnologia',
    name: 'Tecnologia',
    features: [
      { slug: 'smart-home',          name: 'Smart Home',                group: 'tecnologia' },
      { slug: 'automacao',           name: 'Automação residencial',     group: 'tecnologia' },
      { slug: 'fibra-optica',        name: 'Fibra óptica',              group: 'tecnologia' },
      { slug: 'ar-central',          name: 'Ar-condicionado central',   group: 'tecnologia' },
      { slug: 'aquecimento-central', name: 'Aquecimento central',       group: 'tecnologia' },
      { slug: 'aquecedor-solar',     name: 'Aquecedor solar',           group: 'tecnologia' },
      { slug: 'cisterna',            name: 'Cisterna',                  group: 'tecnologia' },
      { slug: 'domotica',            name: 'Domótica',                  group: 'tecnologia' },
    ],
  },
  {
    slug: 'vista',
    name: 'Vista',
    features: [
      { slug: 'vista-mar',           name: 'Vista para o mar',          group: 'vista' },
      { slug: 'vista-lago',          name: 'Vista para lago',           group: 'vista' },
      { slug: 'vista-montanha',      name: 'Vista para montanha',       group: 'vista' },
      { slug: 'vista-cidade',        name: 'Vista para a cidade',       group: 'vista' },
      { slug: 'vista-panoramica',    name: 'Vista panorâmica',          group: 'vista' },
      { slug: 'vista-jardim',        name: 'Vista para jardim',         group: 'vista' },
      { slug: 'vista-piscina',       name: 'Vista para piscina',        group: 'vista' },
    ],
  },
  {
    slug: 'diferenciais',
    name: 'Diferenciais',
    features: [
      { slug: 'varanda-gourmet',     name: 'Varanda gourmet',           group: 'diferenciais' },
      { slug: 'terraço',             name: 'Terraço privativo',         group: 'diferenciais' },
      { slug: 'jardim-privativo',    name: 'Jardim privativo',          group: 'diferenciais' },
      { slug: 'piscina-privativa',   name: 'Piscina privativa',         group: 'diferenciais' },
      { slug: 'home-office',         name: 'Home Office',               group: 'diferenciais' },
      { slug: 'sala-jantar-formal',  name: 'Sala de jantar formal',     group: 'diferenciais' },
      { slug: 'roupao',              name: 'Roupeiro / Walk-in closet', group: 'diferenciais' },
      { slug: 'banheira',            name: 'Banheira',                  group: 'diferenciais' },
      { slug: 'lavabo',              name: 'Lavabo',                    group: 'diferenciais' },
      { slug: 'deposito',            name: 'Depósito privativo',        group: 'diferenciais' },
      { slug: 'hobby-box',           name: 'Hobby Box',                 group: 'diferenciais' },
    ],
  },
  {
    slug: 'localizacao',
    name: 'Localização',
    features: [
      { slug: 'frente-mar',          name: 'Frente para o mar',         group: 'localizacao' },
      { slug: 'esquina',             name: 'Apartamento de esquina',    group: 'localizacao' },
      { slug: 'andar-alto',          name: 'Andar alto',                group: 'localizacao' },
      { slug: 'cobertura',           name: 'Cobertura',                 group: 'localizacao' },
      { slug: 'terreo',              name: 'Térreo com jardim',         group: 'localizacao' },
    ],
  },
]

/** Todos os features em lista plana */
export const features: Feature[] = featureGroups.flatMap((g) => g.features)

/** Busca feature por slug */
export function getFeature(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug)
}

/** Busca grupo por slug */
export function getFeatureGroup(slug: string): FeatureGroup | undefined {
  return featureGroups.find((g) => g.slug === slug)
}

/** Agrupa slugs de features por grupo para exibição na FichaTécnica */
export function groupFeatures(slugs: string[]): FeatureGroup[] {
  const result = new Map<string, FeatureGroup>()

  for (const slug of slugs) {
    const feature = getFeature(slug)
    if (!feature) continue
    const groupSlug = feature.group
    if (!result.has(groupSlug)) {
      const group = getFeatureGroup(groupSlug)
      if (!group) continue
      result.set(groupSlug, { ...group, features: [] })
    }
    result.get(groupSlug)!.features.push(feature)
  }

  return [...result.values()]
}
