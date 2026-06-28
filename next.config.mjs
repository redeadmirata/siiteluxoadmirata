import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Compressão ──────────────────────────────────────────────────────────────
  compress: true,

  // ─── Imagens ─────────────────────────────────────────────────────────────────
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
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    // Cache de imagens por 30 dias no CDN da Vercel
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Qualidade padrão balanceada para imóveis
    qualities: [75, 85, 95],
    dangerouslyAllowSVG: false,
  },

  // ─── Experimental ────────────────────────────────────────────────────────────
  experimental: {
    // Tree-shaking agressivo de pacotes grandes — evita importar o lucide inteiro
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react',
      '@portabletext/react',
    ],
    // PPR (Partial Prerendering) — shell estático + conteúdo dinâmico via Suspense
    // Habilitar quando Next.js 15 for adotado. Em 14 é experimental e pode instabilizar.
    // ppr: true,
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
          // Força HTTPS por 1 ano (site é 100% HTTPS na Vercel)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Bloqueia APIs sensíveis do navegador que o site não usa
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
        // Unidade: /ilhapura/condominios/[cond]/[venda|aluguel|temporada]/[unidade] → /imovel/[unidade]
        {
          source:
            '/:locale(pt-BR|en|es)/ilhapura/condominios/:cond/:finalidade(venda|aluguel|temporada)/:unidade',
          destination: '/:locale/imovel/:unidade',
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

    // Unidades Ilha Pura — 301 da PDI antiga /imovel/[slug] para a URL de marca
    // /ilhapura/condominios/[cond]/[finalidade]/[unidade]. Todas em venda.
    const ILHAPURA_UNIDADES = [
      { unidade: 'elos-iris-1408', cond: 'elos', finalidade: 'venda' },
      { unidade: 'saint-michel-bordeaux-101', cond: 'saint-michel', finalidade: 'venda' },
      { unidade: 'millenio-chicago-1307', cond: 'millenio', finalidade: 'venda' },
      { unidade: 'viure-gaudi-1501', cond: 'viure', finalidade: 'venda' },
      { unidade: 'astra-selene-404', cond: 'astra', finalidade: 'venda' },
    ]
    const ilhapuraImovelRedirects = ILHAPURA_UNIDADES.flatMap(({ unidade, cond, finalidade }) =>
      ILHAPURA_LOCALE_PREFIXES.map((prefix) => ({
        source: `${prefix}/imovel/${unidade}`,
        destination: `${prefix}/ilhapura/condominios/${cond}/${finalidade}/${unidade}`,
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
      // Ilha Pura: /imovel/[unidade] → /ilhapura/condominios/[cond]/[finalidade]/[unidade]
      ...ilhapuraImovelRedirects,
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
      // /es/bairros/[slug] → /es/imoveis/[slug]
      {
        source: '/es/bairros/:slug',
        destination: '/es/imoveis/:slug',
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
        source: '/es/bairros',
        destination: '/es/imoveis',
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
