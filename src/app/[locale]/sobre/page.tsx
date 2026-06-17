/**
 * Quem Somos — /sobre
 * Autoridade de marca + JSON-LD Organization
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

export const revalidate = false // estático

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Quem Somos | Admirata Imóveis — Consultoria Imobiliária de Alto Padrão',
    description:
      'Conheça a Admirata Imóveis: consultoria imobiliária com rigor técnico, inteligência de mercado e transparência jurídica absoluta. CRECI RJ-008553/O.',
    alternates: { canonical: `${siteUrl}${localePrefix}/sobre` },
    openGraph: {
      title: 'Quem Somos | Admirata Imóveis',
      description: 'Consultoria imobiliária de alto padrão no Rio de Janeiro e Serra Gaúcha.',
      type: 'website',
    },
  }
}

const VALORES = [
  {
    titulo: 'Segurança Jurídica',
    descricao:
      'Negócios blindados e pautados na legislação vigente. Cada transação passa por análise documental rigorosa antes da assinatura.',
  },
  {
    titulo: 'Ética e Transparência',
    descricao:
      'Clareza irrestrita em todas as etapas — da captação ao registro em cartório. Sem surpresas, sem conflito de interesses.',
  },
  {
    titulo: 'Foco no Cliente',
    descricao:
      'Soluções personalizadas para necessidades exclusivas. Cada cliente recebe atenção dedicada de um especialista Admirata.',
  },
]

export default function SobrePage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}${localePrefix}/` },
          { '@type': 'ListItem', position: 2, name: 'Quem Somos', item: `${siteUrl}${localePrefix}/sobre` },
        ],
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Admirata Imóveis',
        url: siteUrl,
        logo: `${siteUrl}/opengraph-image.png`,
        description:
          'Consultoria imobiliária de alto padrão no Rio de Janeiro e Serra Gaúcha. Especialistas em imóveis residenciais e comerciais de luxo.',
        email: 'atendimento@admirataimoveis.com.br',
        telephone: '+55 21 99807-9459',
        areaServed: [
          { '@type': 'City', name: 'Rio de Janeiro', containedInPlace: { '@type': 'State', name: 'Rio de Janeiro' } },
          { '@type': 'City', name: 'Gramado', containedInPlace: { '@type': 'State', name: 'Rio Grande do Sul' } },
        ],
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'CRECI', name: 'CRECI-F 58308' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'CRECI', name: 'CRECI RJ-008553/O' },
        ],
        sameAs: [
          'https://www.instagram.com/admirataimoveis',
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Quem Somos' },
          ]}
        />
      </div>

      {/* Hero institucional */}
      <section className="container-site py-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Sobre a Admirata</p>
        <h1 className="text-display-xl text-ink mb-6 leading-tight">
          Onde a solidez do mercado encontra a excelência no atendimento
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          Bem-vindo à Admirata Imóveis.
        </p>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Missão */}
      <section className="container-site py-16 max-w-3xl">
        <h2 className="text-display-sm text-ink mb-6">Nossa missão</h2>
        <p className="text-muted leading-relaxed mb-5">
          Nossa missão é ir além da simples intermediação de compra, venda ou locação. Compreendemos que
          o setor imobiliário lida com o patrimônio e os projetos de vida de nossos clientes. Por isso,
          atuamos com rigor técnico, inteligência de mercado e absoluta transparência jurídica em todas
          as etapas da negociação.
        </p>
        <p className="text-muted leading-relaxed">
          Nossa equipe é formada por profissionais altamente qualificados, preparados para oferecer uma
          consultoria imobiliária completa. Seja para investimentos de alta rentabilidade, estruturação
          de negócios comerciais ou a busca pelo lar ideal, a Admirata Imóveis garante um processo
          seguro, ágil e focado na mitigação de riscos.
        </p>
      </section>

      {/* Valores */}
      <section className="bg-stone/30 py-16">
        <div className="container-site max-w-4xl">
          <h2 className="text-display-sm text-ink mb-10">Nossos valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALORES.map((v) => (
              <div key={v.titulo} className="bg-white rounded-2xl p-7 border border-stone/60">
                <div className="w-8 h-px bg-gold mb-5" />
                <h3 className="font-semibold text-ink mb-3">{v.titulo}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credenciais */}
      <section className="container-site py-16 max-w-3xl">
        <h2 className="text-display-sm text-ink mb-6">Credenciais</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="px-5 py-2.5 rounded-full border border-gold/50 text-sm text-ink font-medium">
            CRECI-F 58308
          </span>
          <span className="px-5 py-2.5 rounded-full border border-gold/50 text-sm text-ink font-medium">
            CRECI RJ-008553/O
          </span>
        </div>
        <p className="text-muted text-sm leading-relaxed">
          Atuamos no mercado imobiliário de alto padrão no Rio de Janeiro (Barra da Tijuca, Recreio dos
          Bandeirantes, Leblon, Ipanema e Jacarepaguá) e na Serra Gaúcha (Gramado e Canela), com
          foco em clientes que buscam segurança, exclusividade e rentabilidade.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16">
        <div className="container-site max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Pronto para começar?</p>
          <h2 className="text-display-sm text-white mb-6">
            Fale com um especialista Admirata
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contato"
              className="px-8 py-3.5 rounded-xl bg-gold text-white font-semibold hover:bg-gold/90 transition-colors"
            >
              Entre em contato
            </Link>
            <Link
              href="/imoveis"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white hover:border-white/50 transition-colors"
            >
              Ver imóveis
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
