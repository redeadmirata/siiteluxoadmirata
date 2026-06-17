/**
 * Grid reutilizável para páginas de característica SEO.
 * Usado por /imoveis/frente-mar/, /cobertura/, /vista-mar/.
 */
import Link from 'next/link'
import type { ImovelCard } from '@/types/sanity'
import ImovelCardComponent from '@/components/cards/ImovelCard'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav'

interface CaracteristicaGridProps {
  titulo: string
  subtitulo: string
  descricao: string
  imoveis: ImovelCard[]
  total: number
  canonicalSlug: string
  bairrosRelacionados?: Array<{ label: string; href: string }>
}

export default function CaracteristicaGrid({
  titulo,
  subtitulo,
  descricao,
  imoveis,
  total,
  canonicalSlug: _canonicalSlug,
  bairrosRelacionados,
}: CaracteristicaGridProps) {
  return (
    <>
      <div className="container-site pt-8 pb-4">
        <BreadcrumbNav
          items={[
            { label: 'Início', href: '/' },
            { label: 'Imóveis', href: '/imoveis' },
            { label: titulo },
          ]}
        />
      </div>

      <div className="container-site py-8">
        <header className="mb-10">
          <h1 className="text-display-lg text-ink mb-3">{titulo}</h1>
          <p className="text-muted text-lg max-w-2xl mb-2">{subtitulo}</p>
          <p className="text-sm text-muted">
            {total > 0
              ? `${total} ${total === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}`
              : 'Nenhum imóvel disponível no momento'}
          </p>
        </header>

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {imoveis.map((imovel) => (
              <ImovelCardComponent key={imovel._id} imovel={imovel} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-stone rounded-2xl mb-12">
            <p className="text-muted text-lg mb-4">
              Nenhum imóvel com essa característica no momento.
            </p>
            <Link href="/imoveis" className="btn-secondary">
              Ver todos os imóveis
            </Link>
          </div>
        )}

        {/* Texto editorial SEO */}
        {descricao && (
          <section className="mb-12 max-w-3xl">
            <h2 className="text-display-sm text-ink mb-4">
              Sobre imóveis {titulo.toLowerCase()} no Rio de Janeiro
            </h2>
            <p className="text-muted leading-relaxed">{descricao}</p>
          </section>
        )}

        {/* Links para bairros com essa característica */}
        {bairrosRelacionados && bairrosRelacionados.length > 0 && (
          <section className="mb-8">
            <h2 className="text-display-sm text-ink mb-4">
              {titulo} por bairro
            </h2>
            <div className="flex flex-wrap gap-3">
              {bairrosRelacionados.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="px-4 py-2 rounded-full border border-gold text-gold text-sm hover:bg-gold hover:text-white transition-colors"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
