import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import { BAIRROS_QUERY } from '@/sanity/queries'
import type { Bairro } from '@/types/sanity'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'bairros' })
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: { title: `${t('title')} | Admirata`, description: t('subtitle') },
  }
}

const ORDEM_REGIAO: Record<string, number> = {
  Centro: 1,
  'Zona Sul': 2,
  Sudoeste: 3,
  Gramado: 1,
  Canela: 2,
}

type RegioesAgrupadas = Record<string, Bairro[]>
type MercadosAgrupados = Record<string, RegioesAgrupadas>

export default async function BairrosPage({
  params,
}: {
  params: { locale: string }
}) {
  setRequestLocale(params.locale)

  const t = await getTranslations({ locale: params.locale, namespace: 'bairros' })

  const bairros = await client.fetch<Bairro[]>(
    BAIRROS_QUERY,
    {},
    { next: { revalidate: 3600 } }
  )

  const agrupado = bairros.reduce<MercadosAgrupados>((acc, b) => {
    const mercado = b.mercado ?? 'Outros'
    const regiao = b.regiao ?? '_sem_regiao'
    if (!acc[mercado]) acc[mercado] = {}
    if (!acc[mercado][regiao]) acc[mercado][regiao] = []
    acc[mercado][regiao].push(b)
    return acc
  }, {})

  const mercadosOrdenados = Object.entries(agrupado).sort(([a], [b]) => {
    if (a === 'Rio de Janeiro') return -1
    if (b === 'Rio de Janeiro') return 1
    return a.localeCompare(b, 'pt-BR')
  })

  const localePrefix = params.locale === 'pt-BR' ? '' : `/${params.locale}`

  return (
    <main className="min-h-screen bg-white" id="main-content">
      <div className="bg-ink pt-[72px] pb-16 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            {t('label')}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-white font-light leading-[1.08]">
            {t('title')}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-4 max-w-lg">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        {bairros.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-muted">{t('empty')}</p>
          </div>
        ) : (
          mercadosOrdenados.map(([mercado, regioes]) => {
            const regioesOrdenadas = Object.entries(regioes).sort(([a], [b]) => {
              const oa = ORDEM_REGIAO[a] ?? 99
              const ob = ORDEM_REGIAO[b] ?? 99
              return oa - ob
            })

            return (
              <section
                key={mercado}
                className="mb-24"
                aria-labelledby={`mercado-${mercado.replace(/\s/g, '-')}`}
              >
                <div className="flex items-center gap-4 mb-12">
                  <div className="divider-gold flex-shrink-0" aria-hidden="true" />
                  <h2
                    id={`mercado-${mercado.replace(/\s/g, '-')}`}
                    className="font-display text-4xl sm:text-5xl text-ink font-light"
                  >
                    {mercado}
                  </h2>
                </div>

                <div className="space-y-16">
                  {regioesOrdenadas.map(([regiao, lista]) => (
                    <div key={regiao}>
                      {regiao !== '_sem_regiao' && (
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-[11px] uppercase tracking-[0.35em] text-gold">
                            {regiao}
                          </h3>
                          <div className="flex-1 h-px bg-stone/50" aria-hidden="true" />
                          <span className="text-[11px] text-muted">
                            {lista.length}{' '}
                            {lista.length === 1 ? t('neighborhood') : t('neighborhoods')}
                          </span>
                        </div>
                      )}

                      <div
                        className={`grid gap-4 ${
                          lista.length === 1
                            ? 'grid-cols-1 max-w-lg mx-auto'
                            : lista.length === 2
                            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                            : lista.length <= 4
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}
                      >
                        {lista.map((bairro) => {
                          const capaUrl = bairro.fotoCapa?.asset?.url
                            ? `${bairro.fotoCapa.asset.url}?w=700&q=75&auto=format`
                            : null
                          const lqip = bairro.fotoCapa?.asset?.metadata?.lqip

                          return (
                            <Link
                              key={bairro._id}
                              href={`${localePrefix}/bairros/${bairro.slug.current}`}
                              className="group relative block aspect-[4/3] overflow-hidden bg-ink"
                            >
                              {capaUrl ? (
                                <Image
                                  src={capaUrl}
                                  alt={bairro.nome}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                                  placeholder={lqip ? 'blur' : 'empty'}
                                  blurDataURL={lqip}
                                />
                              ) : (
                                <div className="w-full h-full bg-stone/20 flex items-center justify-center">
                                  <span className="font-display text-4xl text-white/20">
                                    {bairro.nome.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="font-display text-lg text-white leading-snug">
                                  {bairro.nome}
                                </p>
                                {bairro.totalImoveis > 0 && (
                                  <p className="text-[10px] text-white/50 mt-0.5">
                                    {bairro.totalImoveis === 1
                                      ? t('availableProperty')
                                      : t('availableProperties', { count: bairro.totalImoveis })}
                                  </p>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>
    </main>
  )
}
