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
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.jpg',
        sizes: '1280x800',
        type: 'image/jpeg',
        // @ts-expect-error — form_factor ainda não tipado no Next.js
        form_factor: 'wide',
        label: 'Admirata Imóveis — Busca de imóveis',
      },
      {
        src: '/screenshot-mobile.jpg',
        sizes: '390x844',
        type: 'image/jpeg',
        label: 'Admirata Imóveis — Imóvel em destaque',
      },
    ],
    shortcuts: [
      {
        name: 'Buscar imóveis',
        short_name: 'Buscar',
        description: 'Encontre o imóvel ideal',
        url: '/imoveis',
        icons: [{ src: '/icon-shortcut-search.png', sizes: '96x96' }],
      },
      {
        name: 'Lançamentos',
        short_name: 'Lançamentos',
        description: 'Imóveis em lançamento',
        url: '/lancamentos',
        icons: [{ src: '/icon-shortcut-launch.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
