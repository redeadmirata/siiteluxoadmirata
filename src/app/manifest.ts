import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Admirata Imóveis',
    short_name: 'Admirata',
    description: 'Curadoria de imóveis de alto padrão no Rio de Janeiro e Serra Gaúcha.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F0EB',
    theme_color: '#1A1A2E',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['real estate', 'lifestyle', 'business'],
    shortcuts: [
      {
        name: 'Buscar imóveis',
        short_name: 'Buscar',
        description: 'Encontre o imóvel ideal',
        url: '/imoveis',
      },
      {
        name: 'Lançamentos',
        short_name: 'Lançamentos',
        description: 'Imóveis em lançamento',
        url: '/lancamentos',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
