/**
 * Contato — /contato
 * Formulário WhatsApp + canais diretos
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import ContatoForm from '@/components/contato/ContatoForm'

export const revalidate = false

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Contato | Admirata Imóveis — Fale com nossos especialistas',
    description:
      'Entre em contato com a Admirata Imóveis. Atendimento online via WhatsApp e e-mail, de segunda a sexta, das 8h às 18h. CRECI RJ-008553/O.',
    alternates: { canonical: `${siteUrl}${localePrefix}/contato` },
    openGraph: {
      title: 'Contato | Admirata Imóveis',
      description: 'Fale com nossa equipe de especialistas em imóveis de alto padrão.',
      type: 'website',
    },
  }
}

const CANAIS = [
  {
    rotulo: 'WhatsApp Rio de Janeiro',
    valor: '+55 (21) 99807-9459',
    href: 'https://wa.me/5521998079459?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista%20Admirata.',
    externo: true,
  },
  {
    rotulo: 'WhatsApp Serra Gaúcha',
    valor: '+55 (54) 99264-3070',
    href: 'https://wa.me/5554992643070?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista%20Admirata.',
    externo: true,
  },
  {
    rotulo: 'E-mail',
    valor: 'atendimento@admirataimoveis.com.br',
    href: 'mailto:atendimento@admirataimoveis.com.br',
    externo: false,
  },
]

export default function ContatoPage({ params }: PageProps) {
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
          { '@type': 'ListItem', position: 2, name: 'Contato', item: `${siteUrl}${localePrefix}/contato` },
        ],
      },
      {
        '@type': 'ContactPage',
        name: 'Contato — Admirata Imóveis',
        url: `${siteUrl}${localePrefix}/contato`,
        description: 'Canal de contato com a equipe de especialistas Admirata Imóveis.',
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
            { label: 'Contato' },
          ]}
        />
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">

          {/* Coluna esquerda — info */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Fale conosco</p>
            <h1 className="text-display-lg text-ink mb-4 leading-tight">
              Fale com a Admirata Imóveis
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-10 max-w-md">
              Estamos à disposição para assessorá-lo em suas demandas imobiliárias.
              Atendimento online de segunda a sexta, das 8h às 18h.
            </p>

            {/* Canais */}
            <div className="space-y-5 mb-10">
              {CANAIS.map((c) => (
                <div key={c.rotulo} className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-wider text-muted">{c.rotulo}</span>
                  <a
                    href={c.href}
                    target={c.externo ? '_blank' : undefined}
                    rel={c.externo ? 'noopener noreferrer' : undefined}
                    className="text-ink hover:text-gold transition-colors font-medium"
                  >
                    {c.valor}
                  </a>
                </div>
              ))}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wider text-muted">Atendimento</span>
                <span className="text-ink font-medium">Segunda a sexta, das 8h às 18h</span>
                <span className="text-sm text-muted">Atendimento exclusivamente online</span>
              </div>
            </div>

            {/* Credenciais */}
            <div className="pt-6 border-t border-stone">
              <p className="text-xs text-muted mb-2">Empresa regularmente registrada:</p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs px-3 py-1.5 border border-stone rounded-full text-ink">CRECI-F 58308</span>
                <span className="text-xs px-3 py-1.5 border border-stone rounded-full text-ink">CRECI RJ-008553/O</span>
              </div>
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <div className="bg-stone/20 rounded-2xl p-8 border border-stone">
            <h2 className="text-lg font-semibold text-ink mb-1">Envie sua mensagem</h2>
            <p className="text-sm text-muted mb-6">
              Preencha o formulário e nossa equipe entra em contato.
            </p>
            <ContatoForm />
          </div>
        </div>
      </div>
    </>
  )
}
