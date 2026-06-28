/**
 * ImovelCardMobile — Server Component
 * Card compacto para carrossel de scroll snap mobile.
 *
 * Não substitui ImovelCard — usado exclusivamente em seções de destaque mobile.
 * Hover tratado via CSS group-hover (sem 'use client').
 */

import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency as formatPreco, formatArea } from '@/utils'
import { getCapaUrl, getImovelBadge } from '@/lib/imovel'
import type { ImovelCard as ImovelCardType } from '@/types/sanity'

interface ImovelCardMobileProps {
  imovel: ImovelCardType
  priority?: boolean
}

export default function ImovelCardMobile({ imovel, priority = false }: ImovelCardMobileProps) {
  const {
    titulo, slug, tipo, preco, precoSobConsulta,
    areaUtil, quartos, suites, vagas, bairro, imagemCapa,
  } = imovel

  const capaUrl = getCapaUrl(imagemCapa, 640)
  const lqip    = imagemCapa?.asset?.metadata?.lqip
  const badge   = getImovelBadge(imovel)
  const href    = `/imovel/${slug.current}`

  const specs = [
    areaUtil ? { val: formatArea(areaUtil), lbl: 'Área' }   : null,
    suites   ? { val: `${suites}`,          lbl: suites === 1 ? 'Suíte' : 'Suítes' } : null,
    quartos  ? { val: `${quartos}`,         lbl: quartos === 1 ? 'Quarto' : 'Quartos' } : null,
    vagas    ? { val: `${vagas}`,           lbl: vagas === 1 ? 'Vaga' : 'Vagas' }  : null,
  ].filter(Boolean).slice(0, 3) as { val: string; lbl: string }[]

  return (
    <article className="group rounded-xl overflow-hidden bg-white border border-stone-200 flex flex-col">
      {/* ── Imagem 16:9 com badge ────────────────────────────────── */}
      <Link href={href} className="block relative aspect-video overflow-hidden" tabIndex={-1} aria-hidden="true">
        {capaUrl ? (
          <Image
            src={capaUrl}
            alt={imagemCapa?.alt ?? titulo}
            fill
            sizes="min(82vw, 320px)"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            priority={priority}
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <span className="text-stone-400 text-[10px] uppercase tracking-widest">Sem foto</span>
          </div>
        )}

        {badge && (
          <span
            className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.12em] uppercase font-semibold px-2 py-1 rounded-sm"
            style={{ background: 'rgba(13,27,62,0.82)', color: 'var(--color-gold, #b8960c)', backdropFilter: 'blur(4px)' }}
          >
            {badge}
          </span>
        )}

        {(imovel.exclusivo || imovel.novidade) && tipo && (
          <span
            className="absolute top-2.5 right-2.5 text-[9px] tracking-[0.1em] uppercase font-medium px-2 py-1 rounded-sm"
            style={{ background: 'rgba(255,255,255,0.88)', color: '#0d1b3e', backdropFilter: 'blur(4px)' }}
          >
            {tipo}
          </span>
        )}
      </Link>

      {/* ── Conteúdo ─────────────────────────────────────────────── */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 leading-none">
          {bairro?.nome ?? ''}
          {bairro?.cidade ? ` · ${bairro.cidade}` : ''}
        </p>

        <Link href={href}>
          <h3 className="text-[13px] font-medium text-[#0d1b3e] leading-snug line-clamp-2 hover:text-gold transition-colors duration-150">
            {titulo}
          </h3>
        </Link>

        <p className="text-[12px] font-mono tracking-tight" style={{ color: 'var(--color-gold, #b8960c)' }}>
          {precoSobConsulta || !preco ? 'Sob consulta' : formatPreco(preco)}
        </p>

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

        {/* CTA — CSS hover, sem JS */}
        <div className="flex-1 flex items-end mt-0.5">
          <Link
            href={href}
            className="block w-full text-center text-[10px] tracking-[0.12em] uppercase font-semibold py-2.5 rounded-md border border-[#0d1b3e] text-[#0d1b3e] transition-all duration-200 hover:bg-[#0d1b3e] hover:text-gold"
          >
            Conhecer imóvel
          </Link>
        </div>
      </div>
    </article>
  )
}
