/**
 * TabsFiltro
 * Barra de tabs horizontais com scroll sem scrollbar visível — padrão Cyrela.
 * Sticky abaixo do header mobile (top-14 = 56px).
 * Controla: finalidade (Venda / Locação) + novidade + exclusivo.
 *
 * Visível apenas em mobile (lg:hidden).
 * No desktop (≥768px), a linha de finalidade do FiltrosSearch cuida disso.
 */
'use client'

import { useQueryStates, parseAsString } from 'nuqs'

const TABS = [
  {
    id: 'todos',
    label: 'Todos',
    params: { finalidade: null, novidade: null, exclusivo: null },
  },
  {
    id: 'venda',
    label: 'Venda',
    params: { finalidade: 'Venda', novidade: null, exclusivo: null },
  },
  {
    id: 'locacao',
    label: 'Locação',
    params: { finalidade: 'Locação', novidade: null, exclusivo: null },
  },
  {
    id: 'lancamentos',
    label: 'Lançamentos',
    params: { finalidade: null, novidade: 'true', exclusivo: null },
  },
  {
    id: 'exclusivos',
    label: 'Exclusivos',
    params: { finalidade: null, novidade: null, exclusivo: 'true' },
  },
] as const

type TabId = (typeof TABS)[number]['id']

function getActiveTab(
  finalidade: string,
  novidade: string,
  exclusivo: string,
): TabId {
  if (novidade === 'true') return 'lancamentos'
  if (exclusivo === 'true') return 'exclusivos'
  if (finalidade === 'Venda') return 'venda'
  if (finalidade === 'Locação') return 'locacao'
  return 'todos'
}

export default function TabsFiltro() {
  const [filters, setFilters] = useQueryStates({
    finalidade: parseAsString.withDefault(''),
    novidade:   parseAsString.withDefault(''),
    exclusivo:  parseAsString.withDefault(''),
  })

  const active = getActiveTab(filters.finalidade, filters.novidade, filters.exclusivo)

  return (
    <>
      {/* Oculta scrollbar no webkit sem plugin extra */}
      <style>{`.tabs-filtro::-webkit-scrollbar{display:none}`}</style>
      <nav
        className="tabs-filtro lg:hidden flex gap-5 overflow-x-auto bg-white border-b border-stone-100 sticky top-14 z-40"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft:  'clamp(1rem, 4vw, 1.5rem)',
          paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
        }}
        aria-label="Filtrar imóveis por categoria"
      >
        {TABS.map(({ id, label, params }) => (
          <button
            key={id}
            onClick={() => setFilters(params)}
            aria-pressed={active === id}
            className={`
              py-3 text-xs whitespace-nowrap flex-shrink-0
              border-b-2 transition-all duration-200
              ${active === id
                ? 'border-[#B8933E] text-[#0D1B3E] font-medium'
                : 'border-transparent text-stone-400 hover:text-stone-600'}
            `}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}
