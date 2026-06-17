import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import '../globals.css'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'

// ─── Fontes via next/font (zero penalização no LCP) ──────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
})

// ─── Static params para todos os locales ─────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// ─── Metadata base por locale ─────────────────────────────────────────────────
const META_BY_LOCALE: Record<string, { title: string; description: string; locale: string }> = {
  'pt-BR': {
    title: 'Admirata Imóveis | Imóveis de Alto Padrão no Rio de Janeiro e Serra Gaúcha',
    description: 'Imóveis de luxo e alto padrão na Barra da Tijuca, Recreio, Leblon, Ipanema, Jacarepaguá e Serra Gaúcha. Coberturas, apartamentos e casas exclusivas.',
    locale: 'pt_BR',
  },
  en: {
    title: 'Admirata Properties | Luxury Real Estate in Rio de Janeiro and Serra Gaúcha',
    description: 'Luxury and premium real estate in Barra da Tijuca, Recreio, Leblon, Ipanema, Jacarepaguá and Serra Gaúcha. Penthouses, apartments and exclusive homes.',
    locale: 'en_US',
  },
  es: {
    title: 'Admirata Propiedades | Inmuebles de Lujo en Río de Janeiro y Serra Gaúcha',
    description: 'Inmuebles de lujo y alto estándar en Barra da Tijuca, Recreio, Leblon, Ipanema, Jacarepaguá y Serra Gaúcha. Penthouses, apartamentos y casas exclusivas.',
    locale: 'es_ES',
  },
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const meta = META_BY_LOCALE[locale] ?? META_BY_LOCALE['pt-BR']
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = locale === 'pt-BR' ? '' : `/${locale}`

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: '%s | Admirata Imóveis',
    },
    description: meta.description,
    keywords: [
      'imóveis alto padrão',
      'imóveis luxo rio de janeiro',
      'cobertura barra da tijuca',
      'apartamento leblon',
      'imóveis gramado',
      'admirata imóveis',
      'luxury real estate rio de janeiro',
      'immobilier luxe rio',
    ],
    authors: [{ name: 'Admirata Negócios Imobiliários Ltda' }],
    creator: 'Admirata Imóveis',
    publisher: 'Admirata Negócios Imobiliários Ltda',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: meta.locale,
      alternateLocale: ['pt_BR', 'en_US', 'es_ES'].filter((l) => l !== meta.locale),
      url: `${siteUrl}${localePrefix}`,
      siteName: 'Admirata Imóveis',
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Admirata Imóveis — Imóveis de Alto Padrão',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Admirata Imóveis',
      description: meta.description,
      images: ['/og-default.jpg'],
    },
    alternates: {
      canonical: `${siteUrl}${localePrefix}`,
      languages: {
        'pt-BR': siteUrl,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
      },
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A2E',
}

// ─── JSON-LD global (Organisation + WebSite/SearchAction) ────────────────────
/**
 * Renderizado em todas as páginas via layout.
 * Organization = RealEstateAgent (melhor para imobiliárias no Google).
 * WebSite = habilita a SearchAction (sitelink searchbox no Google).
 * Só muda a URL canônica por locale — o resto é invariante.
 */
function GlobalJsonLd({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = locale === 'pt-BR' ? '' : `/${locale}`
  const url = `${siteUrl}${localePrefix}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${siteUrl}/#organization`,
        name: 'Admirata Negócios Imobiliários',
        alternateName: 'Admirata Imóveis',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
          width: 400,
          height: 120,
        },
        image: `${siteUrl}/og-default.jpg`,
        description:
          'Curadoria de imóveis de alto padrão no Rio de Janeiro (Barra da Tijuca, Recreio, Zona Sul) e Serra Gaúcha (Gramado, Canela).',
        telephone: '+55-21-99807-9459',
        email: 'atendimento@admirata.com.br',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '',
          addressLocality: 'Rio de Janeiro',
          addressRegion: 'RJ',
          postalCode: '22775-055',
          addressCountry: 'BR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -23.0084,
          longitude: -43.3652,
        },
        areaServed: [
          { '@type': 'City', name: 'Rio de Janeiro' },
          { '@type': 'City', name: 'Gramado' },
          { '@type': 'City', name: 'Canela' },
        ],
        sameAs: [
          'https://www.instagram.com/admirataimoveis',
          'https://www.facebook.com/admirataimoveis',
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: 'Admirata Imóveis',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${url}/imoveis?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ─── Root Layout com locale ───────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  // Habilita renderização estática para este locale
  setRequestLocale(locale)

  // Carrega mensagens do servidor para o ClientProvider
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <GlobalJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-ink focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
          >
            {locale === 'en' ? 'Skip to main content' : locale === 'es' ? 'Ir al contenido principal' : 'Pular para o conteúdo principal'}
          </a>
          <NavbarWrapper />
          {children}
          <FooterWrapper><Footer /></FooterWrapper>
          <WhatsAppButton />
          <AnalyticsProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
