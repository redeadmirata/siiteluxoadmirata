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
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-14">
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

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {imoveis.map((imovel, i) => (
            <ImovelCard
              key={imovel._id}
              imovel={imovel}
              priority={i < 3}
            />
          ))}
        </div>

        {/* ── Link mobile ── */}
        <div className="sm:hidden mt-12 flex justify-center">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold"
          >
            {t('featured.viewAllMobile')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
