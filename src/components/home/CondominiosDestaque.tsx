import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { CondominioCard } from '@/types/sanity'

interface Props {
  condominios: CondominioCard[]
}

export default async function CondominiosDestaque({ condominios }: Props) {
  if (!condominios || condominios.length === 0) return null

  const tHome = await getTranslations('home')
  const tCond = await getTranslations('condominios')

  return (
    <section className="py-20 px-6 bg-ink text-white" aria-label={tHome('condominios.label')}>
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
              {tHome('condominios.label')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              {tHome('condominios.title')}
            </h2>
            <div className="mt-4 w-12 h-px bg-gold" />
          </div>
          <Link
            href="/condominios"
            className="text-[11px] uppercase tracking-[0.22em] text-gold hover:text-white transition-colors duration-200 flex items-center gap-2 shrink-0"
          >
            {tHome('condominios.viewAll')}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Grid horizontal scroll em mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {condominios.map((c) => (
            <Link
              key={c._id}
              href={`/condominios/${c.slug.current}`}
              className="group relative overflow-hidden aspect-[4/3] block"
            >
              {/* Foto */}
              {c.fotoCapa?.url ? (
                <Image
                  src={c.fotoCapa.url}
                  alt={c.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-smooth"
                  placeholder={c.fotoCapa.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={c.fotoCapa.metadata?.lqip}
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="font-display text-5xl text-white/20">
                    {c.nome.charAt(0)}
                  </span>
                </div>
              )}

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {c.bairro && (
                  <p className="text-[9px] uppercase tracking-[0.22em] text-gold mb-1">
                    {c.bairro.nome}
                  </p>
                )}
                <h3 className="font-display text-xl text-white leading-snug">
                  {c.nome}
                </h3>
                {c.totalImoveis > 0 && (
                  <p className="text-[11px] text-white/60 mt-1">
                    {c.totalImoveis}{' '}
                    {c.totalImoveis === 1 ? tCond('property') : tCond('properties')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
