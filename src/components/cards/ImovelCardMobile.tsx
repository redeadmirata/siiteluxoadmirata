'use client'

/**
 * ImovelCardMobile
 * Card compacto otimizado para o carrossel de scroll snap mobile.
 * Design inspirado no padrão Cyrela: imagem 16:9, specs em pills,
 * CTA explícito "Conhecer imóvel".
 *
 * Não substitui ImovelCard — é usado exclusivamente no carrossel mobile
 * de ImoveisDestaque e seções similares.
 */

import Image from 'next/image'
import Link from 'next/link'
import { urlForImovelImage } from '@/sanity/client'
import { formatPreco, formatArea } from '@/lib/formatters'
import type { ImovelCard as ImovelCardType } from '@/types/sanity'

interface ImovelCardMobileProps {
  imovel: ImovelCardType
  priority?: boolean
}

function getCapaUrl(imagemCapa: ImovelCardType['imagemCapa']): string {
  if (!imagemCapa) return ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return urlForImovelImage(imagemCapa as any, 640)
  } catch {
    return imagemCapa.asset?.url ?? ''
  }
}

/** Badge de status: Exclusivo > Lançamento > tipo do imóvel */
function getBadge(imovel: ImovelCardType): string {
  if (imovel.exclusivo) return 'Exclusivo'
  if (imovel.novidade)  return 'Lançamento'
  return imovel.tipo ?? ''
}

export default function ImovelCardMobile({ imovel, priority = false }: ImovelCardMobileProps) {
  const {
    titulo, slug, tipo, preco, precoSobConsulta,
    areaUtil, quartos, suites, vagas, bairro, imagemCapa,
  } = imovel

  const capaUrl = getCapaUrl(imagemCapa)
  const lqip    = imagemCapa?.asset?.metadata?.lqip
  const badge   = getBadge(imovel)
  const href    = `/imoveis/${slug.current}`

  const specs = [
    areaUtil ? { val: formatArea(areaUtil), lbl: 'Área' }   : null,
    suites   ? { val: `${suites}`,          lbl: suites === 1 ? 'Suíte' : 'Suítes' } : null,
    quartos  ? { val: `${quartos}`,         lbl: quartos === 1 ? 'Quarto' : 'Quartos' } : null,
    vagas    ? { val: `${vagas}`,           lbl: vagas === 1 ? 'Vaga' : 'Vagas' }  : null,
  ].filter(Boolean).slice(0, 3) as { val: string; lbl: string }[]

  return (
    <article className="rounded-xl overflow-hidden bg-white border border-stone-200 flex flex-col">
      {/* ── Imagem 16:9 com badge ────────────────────────────────── */}
      <Link href={href} className="block relative aspect-video overflow-hidden" tabIndex={-1} aria-hidden="true">
        {capaUrl ? (
          <Image
            src={capaUrl}
            alt={imagemCapa?.alt ?? titulo}
            fill
            sizes="min(82vw, 320px)"
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
            priority={priority}
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <span className="text-stone-400 text-[10px] uppercase tracking-widest">Sem foto</span>
          </div>
        )}

        {/* Badge status — topo esquerdo */}
        {badge && (
          <span
            className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.12em] uppercase font-semibold px-2 py-1 rounded-sm"
            style={{
              background: 'rgba(13,27,62,0.82)',
              color: 'var(--color-gold, #b8960c)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {badge}
          </span>
        )}

        {/* Tipo — quando badge já é exclusivo/lançamento, mostra o tipo */}
        {(imovel.exclusivo || imovel.novidade) && tipo && (
          <span
            className="absolute top-2.5 right-2.5 text-[9px] tracking-[0.1em] uppercase font-medium px-2 py-1 rounded-sm"
            style={{
              background: 'rgba(255,255,255,0.88)',
              color: '#0d1b3e',
              backdropFilter: 'blur(4px)',
            }}
          >
            {tipo}
          </span>
        )}
      </Link>

      {/* ── Conteúdo ─────────────────────────────────────────────── */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        {/* Bairro · Cidade */}
        <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 leading-none">
          {bairro?.nome ?? ''}
          {bairro?.cidade ? ` · ${bairro.cidade}` : ''}
        </p>

        {/* Título */}
        <Link href={href}>
          <h3 className="text-[13px] font-medium text-[#0d1b3e] leading-snug line-clamp-2 hover:text-gold transition-colors duration-150">
            {titulo}
          </h3>
        </Link>

        {/* Preço */}
        <p className="text-[12px] font-mono tracking-tight" style={{ color: 'var(--color-gold, #b8960c)' }}>
          {precoSobConsulta || !preco ? 'Sob consulta' : formatPreco(preco)}
        </p>

        {/* Specs em pills */}
        {specs.length > 0 && (
          <div className="flex gap-1.5">
            {specs.map((s) => (
              <div
                key={s.lbl}
                className="flex-1 bg-stone-50 rounded-md p-1.5 text-center border border-stone-100"
              >
                <span className="block text-[11px] font-medium text-[#0d1b3e]">{s.val}</span>
                <span className="block text-[9px] text-stone-400 mt-0.5">{s.lbl}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA — expande para preencher o espaço restante verticalmente */}
        <div className="flex-1 flex items-end mt-0.5">
          <Link
            href={href}
            className="block w-full text-center text-[10px] tracking-[0.12em] uppercase font-semibold py-2.5 rounded-md transition-all duration-200"
            style={{
              border: '1px solid #0d1b3e',
              color: '#0d1b3e',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#0d1b3e'
              el.style.color = 'var(--color-gold, #b8960c)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = ''
              el.style.color = '#0d1b3e'
            }}
          >
            Conhecer imóvel
          </Link>
        </div>
      </div>
    </article>
  )
}
