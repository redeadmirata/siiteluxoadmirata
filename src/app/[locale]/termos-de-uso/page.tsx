/**
 * Termos de Uso — /termos-de-uso
 * Fundamentação: Marco Civil da Internet (Lei nº 12.965/2014) e Código Civil
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
    title: 'Termos de Uso | Admirata Imóveis',
    description:
      'Termos de Uso do portal Admirata Imóveis, fundamentados no Marco Civil da Internet (Lei nº 12.965/2014) e no Código Civil brasileiro.',
    alternates: { canonical: `${siteUrl}${localePrefix}/termos-de-uso` },
    robots: { index: false },   // página legal — sem indexação
  }
}

const ULTIMA_ATUALIZACAO = '16 de junho de 2025'
const CIDADE_SEDE = 'Rio de Janeiro'
const ESTADO_SEDE = 'Rio de Janeiro'

export default function TermosDeUsoPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  return (
    <>
      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Termos de Uso' },
          ]}
        />
      </div>

      <div className="container-site py-12 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-display-lg text-ink mb-3">Termos de Uso</h1>
          <p className="text-sm text-muted">
            Última atualização: {ULTIMA_ATUALIZACAO} &nbsp;·&nbsp; Fundamentação: Lei nº 12.965/2014 e Código Civil
          </p>
        </header>

        <div className="prose prose-stone max-w-none text-muted leading-relaxed space-y-8">

          <p>
            Ao acessar o portal da <strong className="text-ink">Admirata Imóveis</strong>, o usuário
            concorda expressamente com os presentes Termos de Uso. Recomendamos a leitura atenta das
            condições abaixo.
          </p>

          <section>
            <h2 className="text-display-xs text-ink mb-3">1. Natureza das Informações</h2>
            <p>
              As informações contidas neste site — valores, metragens, disponibilidade de imóveis e
              descrições — têm caráter <strong className="text-ink">informativo</strong>. A Admirata
              Imóveis envida os melhores esforços para manter a precisão dos dados; contudo, alterações
              podem ocorrer sem aviso prévio por parte dos proprietários ou incorporadoras. Nenhuma
              informação aqui presente substitui a análise da documentação oficial (matrícula
              atualizada, certidões negativas, etc.) no momento da concretização do negócio.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">2. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponibilizado neste site — incluindo textos, logotipos, fotografias e
              identidade visual — é de propriedade exclusiva da Admirata Imóveis ou licenciado a ela,
              sendo protegido pela Lei de Direitos Autorais (Lei nº 9.610/1998). É terminantemente
              proibida a reprodução, cópia ou distribuição sem autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">3. Responsabilidades do Usuário</h2>
            <p>
              O usuário compromete-se a utilizar o site de forma lícita, abstendo-se de inserir dados
              falsos nos formulários ou tentar burlar os sistemas de segurança da plataforma. O uso
              indevido pode implicar responsabilidade civil e criminal nos termos da legislação vigente.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">4. Links para Terceiros</h2>
            <p>
              Este portal pode conter links para sites externos (ex.: WhatsApp, portais imobiliários
              parceiros). A Admirata Imóveis não se responsabiliza pelo conteúdo ou pelas práticas
              de privacidade dessas plataformas.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">5. Limitação de Responsabilidade</h2>
            <p>
              A Admirata Imóveis não se responsabiliza por falhas técnicas temporárias, indisponibilidade
              do site ou por decisões tomadas pelo usuário com base exclusiva nas informações aqui
              apresentadas sem consulta prévia a um profissional habilitado.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">6. Foro Específico</h2>
            <p>
              Fica eleito o foro da Comarca de{' '}
              <strong className="text-ink">{CIDADE_SEDE}</strong>, Estado de{' '}
              <strong className="text-ink">{ESTADO_SEDE}</strong>, para dirimir quaisquer litígios
              oriundos do uso deste portal, renunciando-se a qualquer outro, por mais privilegiado
              que seja.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-ink mb-3">7. Alterações destes Termos</h2>
            <p>
              Estes Termos de Uso podem ser modificados a qualquer tempo. O uso continuado do site
              após a publicação de alterações constitui aceite das novas condições.
            </p>
          </section>

          <div className="pt-6 border-t border-stone">
            <p className="text-sm">
              Dúvidas sobre estes termos:{' '}
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
