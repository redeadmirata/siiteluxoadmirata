import Image from 'next/image'
import Link from 'next/link'
import type { ImovelCard } from '@/types/sanity'
import { formatPreco } from './formatters'

function UnidadeCard({ imovel }: { imovel: ImovelCard }) {
  return (
    <Link
      href={`/imovel/${imovel.slug.current}`}
      className="hover:border-gold/40 group block overflow-hidden rounded-2xl border border-stone transition-colors"
    >
      <div className="bg-stone/30 relative aspect-[4/3] overflow-hidden">
        {imovel.imagemCapa ? (
          <Image
            src={imovel.imagemCapa.asset.url}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder={imovel.imagemCapa.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={imovel.imagemCapa.asset.metadata?.lqip}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-stone/50 text-sm">Sem foto</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-ink transition-colors group-hover:text-gold">
          {imovel.titulo}
        </h3>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
          {imovel.areaUtil && <span>{imovel.areaUtil} m²</span>}
          {imovel.quartos && (
            <span>
              {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}
            </span>
          )}
          {imovel.vagas && (
            <span>
              {imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}
            </span>
          )}
        </div>
        <div className="mt-3">
          {imovel.preco ? (
            <span className="text-sm font-semibold text-ink">{formatPreco(imovel.preco)}</span>
          ) : (
            <span className="text-sm italic text-muted">Sob consulta</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function UnidadeGrid({ imoveis }: { imoveis: ImovelCard[] }) {
  if (imoveis.length === 0) {
    return (
      <div className="rounded-2xl border border-stone py-10 text-center">
        <p className="text-sm text-muted">Nenhuma unidade disponível no momento.</p>
        <p className="text-muted/60 mt-1 text-xs">
          Entre em contato — novas unidades surgem com frequência.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {imoveis.map((imovel) => (
        <UnidadeCard key={imovel._id} imovel={imovel} />
      ))}
    </div>
  )
}

function UnidadeGrupo({ titulo, imoveis }: { titulo: string; imoveis: ImovelCard[] }) {
  return (
    <div>
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-display-sm text-ink">{titulo}</h2>
        {imoveis.length > 0 && (
          <span className="text-sm font-normal text-muted">
            {imoveis.length} {imoveis.length === 1 ? 'unidade' : 'unidades'}
          </span>
        )}
      </div>
      <UnidadeGrid imoveis={imoveis} />
    </div>
  )
}

export default function CondominioUnits({ imoveis }: { imoveis: ImovelCard[] }) {
  if (imoveis.length === 0) return null

  const venda = imoveis.filter((imovel) => imovel.finalidade === 'Venda')
  const locacao = imoveis.filter(
    (imovel) => imovel.finalidade === 'Locação' || imovel.finalidade === 'Temporada'
  )

  return (
    <section id="unidades" className="bg-stone/30 py-24 sm:py-32">
      <div className="container-site space-y-12">
        <UnidadeGrupo titulo="À Venda" imoveis={venda} />
        {locacao.length > 0 && <UnidadeGrupo titulo="Para Locação" imoveis={locacao} />}
      </div>
    </section>
  )
}
