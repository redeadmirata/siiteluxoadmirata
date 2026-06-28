import Link from 'next/link'
import type { CondominioDetalhe } from '@/types/sanity'

type CondominioFaqsProps = Pick<CondominioDetalhe, 'faqs' | 'condominiosProximos'>

export default function CondominioFaqs({ faqs, condominiosProximos }: CondominioFaqsProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-site max-w-3xl">
        <h2 className="text-display-sm mb-8 text-ink">Perguntas frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.pergunta} className="group rounded-xl border border-stone">
              <summary className="flex cursor-pointer select-none list-none items-center justify-between p-5 text-sm font-medium text-ink transition-colors hover:text-gold">
                <span>{faq.pergunta}</span>
                <span
                  className="ml-3 shrink-0 text-gold transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.resposta}</div>
            </details>
          ))}
        </div>

        {condominiosProximos && condominiosProximos.length > 0 && (
          <div className="mt-16">
            <h2 className="text-display-sm mb-4 text-ink">Empreendimentos relacionados</h2>
            <div className="flex flex-wrap gap-3">
              {condominiosProximos.map((condominio) => (
                <Link
                  key={condominio.slug.current}
                  href={`/condominios/${condominio.slug.current}`}
                  className="rounded-full border border-stone px-4 py-2 text-sm text-ink transition-colors hover:border-gold hover:text-gold"
                >
                  {condominio.nome}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
