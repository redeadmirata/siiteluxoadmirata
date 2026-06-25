import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ImovelCard from '@/components/cards/ImovelCard'
import type { ImovelCard as ImovelCardType } from '@/types/sanity'

interface ImoveisDestaqueProps {
  imoveis: ImovelCardType[]
}

export default async function ImoveisDestaque({ imoveis }: ImoveisDestaqueProps) {
  if (!imoveis.length) return null

  const t = await getTranslations('home')

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="destaque-titulo"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">
              {t('featured.label')}
            </p>
            <h2
              id="destaque-titulo"
              className="font-display text-4xl sm:text-5xl text-ink font-light"
            >
              {t('featured.title')}
            </h2>
          </div>

          <Link
            href="/imoveis"
            className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold hover:gap-3 transition-all duration-200 flex-shrink-0 ml-8"
          >
            {t('featured.viewAll')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ── MOBILE: scroll snap horizontal (padrão Cyrela) ─────────── */}
      {/*
        - overflow-x-auto + scroll-snap cria o carrossel sem JS
        - cards de 82vw deixam ~18% de peek para indicar scroll
        - scrollbar oculta via CSS para visual clean
      */}
      <div className="sm:hidden">
        <style>{`.snap-track::-webkit-scrollbar{display:none}`}</style>
        <div
          className="snap-track flex gap-3 overflow-x-auto pb-2"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingLeft:  'clamp(1.25rem, 5vw, 2rem)',
            paddingRight: 'clamp(1.25rem, 5vw, 2rem)',
          }}
        >
          {imoveis.map((imovel, i) => (
            <div
              key={imovel._id}
              style={{
                scrollSnapAlign: 'start',
                flexShrink: 0,
                width: 'min(82vw, 320px)',
              }}
            >
              <ImovelCard imovel={imovel} priority={i < 2} />
            </div>
          ))}
          {/* Spacer para o último card não colar na borda */}
          <div style={{ flexShrink: 0, width: 4 }} aria-hidden="true" />
        </div>

        {/* Hint + link "Ver todos" */}
        <div className="flex items-center justify-between mt-5 px-6">
          <p className="text-[9px] uppercase tracking-[0.28em] text-muted">
            Deslize para ver mais
          </p>
          <Link
            href="/imoveis"
            className="text-[9px] uppercase tracking-[0.22em] text-gold"
          >
            {t('featured.viewAllMobile')} →
          </Link>
        </div>
      </div>

      {/* ── DESKTOP: grid 2 / 3 colunas (inalterado) ──────────────── */}
      <div className="hidden sm:block max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {imoveis.map((imovel, i) => (
            <ImovelCard
              key={imovel._id}
              imovel={imovel}
              priority={i < 3}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold hover:gap-3 transition-all duration-200"
          >
            {t('featured.viewAll')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
