/**
 * Política de Privacidade — /politica-de-privacidade
 * Fundamentação: LGPD (Lei nº 13.709/2018)
 */
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

export const revalidate = false

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return {
    title: 'Política de Privacidade | Admirata Imóveis',
    description:
      'Política de Privacidade da Admirata Imóveis elaborada em conformidade com a LGPD (Lei nº 13.709/2018). Saiba como tratamos seus dados pessoais.',
    alternates: { canonical: `${siteUrl}${localePrefix}/politica-de-privacidade` },
    robots: { index: false },   // página legal — sem indexação
  }
}

const ULTIMA_ATUALIZACAO = '16 de junho de 2025'

export default function PoliticaPrivacidadePage({ params }: PageProps) {
  setRequestLocale(params.locale)

  return (
    <>
      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Política de Privacidade' },
          ]}
        />
      </div>

      <div className="container-site py-12 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-display-lg text-ink mb-3">Política de Privacidade</h1>
          <p className="text-sm text-muted">
            Última atualização: {ULTIMA_ATUALIZACAO} &nbsp;·&nbsp; Fundamentação: Lei nº 13.709/2018 (LGPD)
          </p>
        </header>

        <div className="prose prose-stone max-w-none text-muted leading-relaxed space-y-8">

          <p>
            A <strong className="text-ink">Admirata Imóveis</strong> está comprometida com a proteção da
            privacidade e dos dados pessoais de seus clientes, parceiros e usuários. Esta Política de
            Privacidade foi elaborada em estrita conformidade com a Lei Geral de Proteção de Dados
            (LGPD – Lei nº 13.709/2018) e detalha como coletamos, utilizamos e protegemos suas informações.
          </p>

          <section>
            <h2 className="text-display-xs text-ink mb-3">1. Coleta de Dados Pessoais</h2>
            <p>
              Coletamos dados fornecidos voluntariamente por você — como nome, CPF, e-mail, telefone e
              dados de renda — para viabilizar propostas de compra, venda, locação, análises de crédito
              e contato comercial.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">2. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc list-outside pl-5 mt-3 space-y-1.5">
              <li>
                Intermediação imobiliária e elaboração de contratos (arts. 481 e ss. e 565 e ss. do
                Código Civil);
              </li>
              <li>Análise de crédito e <em>background check</em> (proteção ao crédito);</li>
              <li>
                Envio de oportunidades imobiliárias compatíveis com o seu perfil (mediante consentimento);
              </li>
              <li>Cumprimento de obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">3. Compartilhamento de Dados</h2>
            <p>
              A Admirata Imóveis <strong className="text-ink">não comercializa dados pessoais</strong>.
              O compartilhamento ocorre apenas com terceiros estritamente necessários para a execução
              do negócio jurídico, tais como cartórios, instituições financeiras, seguradoras e
              prestadores de serviços de tecnologia, todos sujeitos a contratos de confidencialidade.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">4. Seus Direitos como Titular</h2>
            <p>
              Você tem o direito de solicitar o acesso, a correção, a anonimização ou a exclusão dos
              seus dados, ressalvadas as hipóteses de guarda obrigatória por lei. Para exercer seus
              direitos, contate nosso Encarregado de Dados (DPO) através do e-mail:{' '}
              <a
                href="mailto:atendimento@admirataimoveis.com.br"
                className="text-gold hover:underline"
              >
                atendimento@admirataimoveis.com.br
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">5. Segurança da Informação</h2>
            <p>
              Adotamos medidas técnicas e administrativas rigorosas para proteger seus dados contra
              acessos não autorizados ou vazamentos, incluindo criptografia em trânsito (TLS/HTTPS)
              e controle de acesso restrito às informações sensíveis.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">6. Cookies e Rastreamento</h2>
            <p>
              Utilizamos cookies analíticos (Google Analytics) e de marketing (Meta Pixel) para
              mensurar o desempenho do site e exibir conteúdo relevante. Você pode ajustar suas
              preferências de cookies a qualquer momento pelo banner exibido no primeiro acesso.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">7. Alterações desta Política</h2>
            <p>
              Esta Política pode ser atualizada periodicamente. A data de última atualização indicada
              no cabeçalho desta página reflete a versão vigente.
            </p>
          </section>

          <div className="pt-6 border-t border-stone">
            <p className="text-sm">
              Em caso de dúvidas:{' '}
              <a href="mailto:atendimento@admirataimoveis.com.br" className="text-gold hover:underline">
                atendimento@admirataimoveis.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
