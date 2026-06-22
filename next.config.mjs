import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite imagens do CDN do Sanity
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/files/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Qualidade padrão — sobrescrita por componente via quality prop
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
  },

  // Headers de segurança e cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Cache agressivo para assets estáticos
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Rewrites de URL de marca — servem páginas existentes sob /ilhapura
  // O middleware next-intl roda ANTES dos beforeFiles rewrites e prefixa o
  // locale internamente (ex: /ilhapura → /pt-BR/ilhapura), por isso o :locale.
  async rewrites() {
    return {
      beforeFiles: [
        // Landing do empreendimento: /ilhapura → /bairros-planejados/ilha-pura
        {
          source: '/:locale(pt-BR|en|es)/ilhapura',
          destination: '/:locale/bairros-planejados/ilha-pura',
        },
        // Condomínio: /ilhapura/condominios/[slug] → /condominios/[slug]
        {
          source: '/:locale(pt-BR|en|es)/ilhapura/condominios/:slug',
          destination: '/:locale/condominios/:slug',
        },
      ],
    }
  },

  // Redirects canônicos
  async redirects() {
    // Condomínios da Ilha Pura — 301 da URL antiga para a URL de marca /ilhapura
    const ILHAPURA_CONDOS = [
      'pura-por-artefacto',
      'oro-by-ornare',
      'astra',
      'viure',
      'elos',
      'saint-michel',
    ]
    const ILHAPURA_LOCALE_PREFIXES = ['', '/en', '/es']
    const ilhapuraCondoRedirects = ILHAPURA_CONDOS.flatMap((slug) =>
      ILHAPURA_LOCALE_PREFIXES.map((prefix) => ({
        source: `${prefix}/condominios/${slug}`,
        destination: `${prefix}/ilhapura/condominios/${slug}`,
        permanent: true,
      }))
    )

    return [
      // www → apex
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.admirata.com.br' }],
        destination: 'https://admirata.com.br/:path*',
        permanent: true,
      },
      // Ilha Pura: /condominios/[slug] → /ilhapura/condominios/[slug]
      ...ilhapuraCondoRedirects,
      // /bairros/[slug] → /imoveis/[slug]  (301 — hierarquia SEO consolidada)
      {
        source: '/bairros/:slug',
        destination: '/imoveis/:slug',
        permanent: true,
      },
      // /en/bairros/[slug] → /en/imoveis/[slug]
      {
        source: '/en/bairros/:slug',
        destination: '/en/imoveis/:slug',
        permanent: true,
      },
      // /fr/bairros/[slug] → /fr/imoveis/[slug]
      {
        source: '/fr/bairros/:slug',
        destination: '/fr/imoveis/:slug',
        permanent: true,
      },
      // /bairros (listing) → /imoveis
      {
        source: '/bairros',
        destination: '/imoveis',
        permanent: true,
      },
      {
        source: '/en/bairros',
        destination: '/en/imoveis',
        permanent: true,
      },
      {
        source: '/fr/bairros',
        destination: '/fr/imoveis',
        permanent: true,
      },
      // Páginas ainda não construídas — temporário até criação das páginas reais
      {
        source: '/videos',
        destination: 'https://www.youtube.com/@admirataimoveis',
        permanent: false,
      },
      {
        source: '/anuncie',
        destination: '/contato',
        permanent: false,
      },
      {
        source: '/cliente',
        destination: '/contato',
        permanent: false,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
