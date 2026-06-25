import Image from 'next/image'
import Link from 'next/link'
import { urlForImovelImage } from '@/sanity/client'
import { formatPreco, formatArea } from '@/lib/formatters'
import type { ImovelCard as ImovelCardType } from '@/types/sanity'
import FavoritoButton from './FavoritoButton'

interface ImovelCardProps {
  imovel: ImovelCardType
  /** LCP hint — true para os primeiros 3 cards da página */
  priority?: boolean
  className?: string
}

function getCapaUrl(imagemCapa: ImovelCardType['imagemCapa']): string {
  if (!imagemCapa) return ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return urlForImovelImage(imagemCapa as any, 800)
  } catch {
    return imagemCapa.asset?.url ?? ''
  }
}

export default function ImovelCard({ imovel, priority = false, className = '' }: ImovelCardProps) {
  const {
    _id, titulo, slug, tipo, preco, precoSobConsulta,
    areaUtil, quartos, suites, vagas, bairro,
    imagemCapa, exclusivo, permuta, novidade, condominionome,
  } = imovel

  const capaUrl = getCapaUrl(imagemCapa)
  const lqip = imagemCapa?.asset?.metadata?.lqip

  return (
    <Link
      href={`/imoveis/${slug.current}`}
      className={`group block ${className}`}
      aria-label={`${titulo} — ${bairro?.nome ?? ''}`}
    >
      {/*
       * Mobile: layout horizontal (foto 40% | info 60%)
       * Desktop (sm+): layout vertical original (foto topo, info embaixo)
       */}
      <div className="flex flex-row sm:flex-col gap-3 sm:gap-0">

        {/* ── Foto ── */}
        <div className="relative w-[42%] sm:w-auto flex-shrink-0 sm:flex-shrink aspect-[4/3] sm:aspect-card overflow-hidden bg-stone rounded-md sm:rounded-none">
          {capaUrl ? (
            <Image
              src={capaUrl}
              alt={imagemCapa?.alt ?? titulo}
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-smooth"
              priority={priority}
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip}
            />
          ) : (
            <div className="w-full h-full bg-stone flex items-center justify-center">
              <span className="text-muted text-[10px] uppercase tracking-widest">Sem foto</span>
            </div>
          )}

          {/* Overlay escuro no hover */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500 pointer-events-none" />

          {/* Badges — topo esquerdo */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
            {exclusivo && (
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.14em] bg-gold text-white px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium">
                Exclusivo
              </span>
            )}
            {novidade && !exclusivo && (
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.14em] bg-ink text-white px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium">
                Novo
              </span>
            )}
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.14em] bg-white/92 backdrop-blur-sm text-ink px-2 py-0.5 sm:px-2.5 sm:py-1">
              {tipo}
            </span>
          </div>

          {/* Permuta badge — topo direito */}
          {permuta && (
            <div className="absolute top-2 right-2 pointer-events-none">
              <span className="text-[8px] uppercase tracking-[0.12em] bg-white/92 backdrop-blur-sm text-ink px-1.5 py-0.5">
                Permuta
              </span>
            </div>
          )}

          {/* Favorito — canto inferior direito, aparece no hover */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FavoritoButton imovelId={_id} titulo={titulo} />
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex-1 sm:pt-4 flex flex-col justify-center sm:justify-start min-w-0">
          {/* Bairro · Condomínio */}
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-gold mb-1 sm:mb-1.5 truncate">
            {bairro?.nome ?? ''}
            {condominionome ? ` · ${condominionome}` : bairro?.cidade ? ` · ${bairro.cidade}` : ''}
          </p>

          {/* Título */}
          <h2 className="font-display text-sm sm:text-lg text-ink leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
            {titulo}
          </h2>

          {/* Métricas */}
          <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 mt-1.5 sm:mt-2 text-[10px] sm:text-