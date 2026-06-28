/**
 * ProgramacaoClube — renderiza as categorias da programação como seções
 * âncora (Aquáticas, Wellness, Esportes, etc.). Server component, orientado
 * a dados. As atividades + turmas são o conteúdo indexável (SEO long-tail).
 */

import type { ClubeCategoria } from '@/data/clube-verdant'

export default function ProgramacaoClube({ categorias }: { categorias: ClubeCategoria[] }) {
  return (
    <>
      {categorias.map((cat, i) => (
        <section
          key={cat.id}
          id={cat.id}
          aria-label={cat.titulo}
          style={{
            scrollMarginTop: 80,
            background: i % 2 === 0 ? '#0c0e1a' : '#090b15',
            padding: 'clamp(4rem, 9vh, 7rem) clamp(1.5rem, 4vw, 3rem)',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                color: 'var(--color-gold, #b8960c)',
                marginBottom: 14,
              }}
            >
              {cat.label}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display, Georgia, serif)',
                fontWeight: 300,
                fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
                color: '#fff',
                lineHeight: 1.08,
                margin: 0,
                maxWidth: 760,
              }}
            >
              {cat.titulo}
            </h2>
            <p
              style={{
                marginTop: 16,
                maxWidth: 640,
                fontSize: 15,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {cat.descricao}
            </p>

            <ul
              style={{
                listStyle: 'none',
                margin: 'clamp(2rem, 4vw, 3rem) 0 0',
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 'clamp(12px, 1.5vw, 18px)',
              }}
            >
              {cat.atividades.map((a) => (
                <li
                  key={a.nome}
                  style={{
                    border: '1px solid rgba(184,150,12,0.18)',
                    borderRadius: 2,
                    padding: '20px 22px',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display, Georgia, serif)',
                      fontWeight: 400,
                      fontSize: '1.25rem',
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    {a.nome}
                  </h3>
                  {a.turmas && a.turmas.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                      {a.turmas.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 11,
                            color: 'rgba(255,255,255,0.62)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            borderRadius: 999,
                            padding: '4px 10px',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  )
}
