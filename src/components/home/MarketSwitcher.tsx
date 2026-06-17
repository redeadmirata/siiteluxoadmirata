'use client'

export type Mercado = 'Rio de Janeiro' | 'Serra Gaúcha' | ''

interface MarketSwitcherProps {
  value: Mercado
  onChange: (v: Mercado) => void
}

const opts: { v: Mercado; label: string }[] = [
  { v: 'Rio de Janeiro', label: 'Rio de Janeiro' },
  { v: 'Serra Gaúcha',   label: 'Serra Gaúcha' },
  { v: '',               label: 'Ver tudo' },
]

export default function MarketSwitcher({ value, onChange }: MarketSwitcherProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(13,13,24,0.35)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {opts.map((o, idx) => {
        const active = value === o.v
        return (
          <button
            key={o.v || 'all'}
            onClick={() => onChange(o.v)}
            className={active ? '' : 'adm-mkt-btn'}
            style={{
              backgroundColor: active ? '#b8960c' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderLeft: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.14)',
              padding: '9px 16px',
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color .2s, color .2s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
