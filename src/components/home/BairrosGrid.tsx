import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Bairro } from '@/types/sanity'

interface BairrosGridProps {
  bairros: Bairro[]
}

function getCapaUrl(bairro: Bairro): string {
  const url = bairro.fotoCapa?.asset?.url
  if (!url) return ''
  // Adiciona parâmetros de otimização via Sanity CDN
  return `${url}?w=900&q=75&auto=format`
}

export default async function BairrosGrid({ bairros }: BairrosGridProps) {
  if (!bairros.length) return null

  const tHome = await getTranslations('home')
  const tCommon = await getTranslations('common')

  // Layout adaptativo ao número de bairros
  const gridClass =
    bairros.length === 1
      ? 'grid-cols-1 max-w-lg mx-auto'
      : bairros.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : bairros.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section
      className="section-padding bg-stone"
      aria-labelledby="bairros-titulo"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        {/* ── Header ── */}
        <div className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">
            {tHome('neighborhoods.label')}
          </p>
          <h2
            id="bairros-titulo"
            className="font-display text-4xl sm:text-5xl text-ink font-light"
          >
            {tHome('neighborhoods.title')}
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className={`grid gap-4 ${gridClass}`}>
          {bairros.map((bairro) => {
            const capaUrl = getCapaUrl(bairro)
            const lqip = bairro.fotoCapa?.asset?.metadata?.lqip
            const countLabel =
              bairro.totalImoveis === 1 ? tCommon('property') : tCommon('properties')

            return (
              <Link
                key={bairro._id}
                href={`/bairros/${bairro.slug.current}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-ink"
                aria-label={`${bairro.nome}, ${bairro.cidade} · ${bairro.totalImoveis} ${countLabel}`}
              >
                {/* Foto */}
                {capaUrl ? (
                  <Image
                    src={capaUrl}
                    alt={`${bairro.nome}, ${bairro.cidade}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-65 group-hover:opacity-80 group-hover:scale-[1.04] transition-all duration-700 ease-smooth"
                    placeholder={lqip ? 'blur' : 'empty'}
                    blurDataURL={lqip}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-ink" />
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
                  aria-hidden="true"
                />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">
                    {bairro.mercado}
                  </p>
                  <h3 className="font-display text-2xl text-white font-light leading-tight">
                    {bairro.nome}
                  </h3>
                  <p className="text-[11px] text-white/50 mt-1">
                    {bairro.cidade} · {bairro.estado}
                    {bairro.totalImoveis > 0 && (
                      <>
                        {' · '}
                        {bairro.totalImoveis} {countLabel}
                      </>
                    )}
                  </p>
                </div>

                {/* Seta hover */}
                <div
                  className="absolute top-5 right-5 text-white/0 group-hover:text-white/60 transition-colors duration-300 text-xl"
                  aria-hidden="true"
                >
                  →
                </div>

                {/* Borda gold no hover */}
                <div
                  className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors duration-300 pointer-events-none"
                  aria-hidden="true"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
