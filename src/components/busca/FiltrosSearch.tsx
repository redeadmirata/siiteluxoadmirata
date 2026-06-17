'use client'

import { useTranslations } from 'next-intl'
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs'

const TIPOS_IMOVEL = [
  'Apartamento',
  'Cobertura',
  'Cobertura duplex',
  'Penthouse',
  'Casa',
  'Casa em condomínio',
] as const

const MERCADOS = ['Rio de Janeiro', 'Serra Gaúcha'] as const

const QUARTOS_OPTIONS = [1, 2, 3, 4] as const

interface FiltrosSearchProps {
  totalResultados: number
}

export default function FiltrosSearch({ totalResultados }: FiltrosSearchProps) {
  const t = useTranslations('filters')

  const [filters, setFilters] = useQueryStates({
    tipo: parseAsString.withDefault(''),
    mercado: parseAsString.withDefault(''),
    quartos: parseAsInteger.withDefault(0),
  })

  const temFiltros =
    filters.tipo !== '' || filters.mercado !== '' || filters.quartos !== 0

  return (
    <div className="mb-12">
      {/* ── Filtros por tipo ── */}
      <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label={t('byType')}>
        <button
          className={`filter-chip ${filters.tipo === '' ? 'active' : ''}`}
          onClick={() => setFilters({ tipo: null })}
          aria-pressed={filters.tipo === ''}
        >
          {t('all')}
        </button>
        {TIPOS_IMOVEL.map((tipo) => (
          <button
            key={tipo}
            className={`filter-chip ${filters.tipo === tipo ? 'active' : ''}`}
            onClick={() =>
              setFilters({ tipo: filters.tipo === tipo ? null : tipo })
            }
            aria-pressed={filters.tipo === tipo}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* ── Filtros secundários ── */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* Mercado */}
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label={t('byMarket')}
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted mr-1 flex-shrink-0">
            {t('market')}
          </span>
          {MERCADOS.map((m) => (
            <button
              key={m}
              className={`filter-chip ${filters.mercado === m ? 'active' : ''}`}
              onClick={() =>
                setFilters({ mercado: filters.mercado === m ? null : m })
              }
              aria-pressed={filters.mercado === m}
            >
              {m === 'Rio de Janeiro' ? 'Rio' : 'Serra Gaúcha'}
            </button>
          ))}
        </div>

        {/* Quartos */}
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label={t('byBedrooms')}
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted mr-1 flex-shrink-0">
            {t('bedrooms')}
          </span>
          {QUARTOS_OPTIONS.map((q) => (
            <button
              key={q}
              className={`filter-chip ${filters.quartos === q ? 'active' : ''}`}
              onClick={() =>
                setFilters({ quartos: filters.quartos === q ? null : q })
              }
              aria-pressed={filters.quartos === q}
            >
              {q}+
            </button>
          ))}
        </div>

        {/* Limpar */}
        {temFiltros && (
          <button
            className="text-[11px] text-muted hover:text-ink underline underline-offset-2 transition-colors ml-auto"
            onClick={() => setFilters({ tipo: null, mercado: null, quartos: null })}
          >
            {t('clear')}
          </button>
        )}
      </div>

      {/* ── Contador de resultados ── */}
      <p className="text-[11px] text-muted mt-6 pt-6 border-t border-stone">
        {totalResultados === 0 ? (
          <span>{t('noResults')}</span>
        ) : totalResultados === 1 ? (
          <span>{t('result')}</span>
        ) : (
          <span>{t('results', { count: totalResultados })}</span>
        )}
      </p>
    </div>
  )
}
