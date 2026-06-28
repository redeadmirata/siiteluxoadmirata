'use client'

import { useMemo, useState } from 'react'
import type { ClubeCategoria } from '@/data/clube-verdant'
import {
  CLUBE_DIAS,
  CLUBE_PUBLICOS,
  type ClubeAula,
  type ClubeCategoriaId,
  type ClubeDia,
  type ClubePublico,
} from '@/data/clube-verdant-programacao'

type FiltroCategoria = ClubeCategoriaId | 'todas'
type FiltroPublico = ClubePublico | 'todos'
type FiltroDia = ClubeDia | 'todos'

const BOTAO_BASE =
  'rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors'

function filtroClassName(ativo: boolean) {
  return `${BOTAO_BASE} ${ativo ? 'border-gold bg-gold text-ink' : 'border-white/15 text-white/65 hover:border-gold/50 hover:text-white'}`
}

export default function ProgramacaoClube({
  categorias,
  aulas = [],
}: {
  categorias: ClubeCategoria[]
  aulas?: ClubeAula[]
}) {
  const [categoria, setCategoria] = useState<FiltroCategoria>('todas')
  const [publico, setPublico] = useState<FiltroPublico>('todos')
  const [dia, setDia] = useState<FiltroDia>('todos')

  const categoriaLabels = useMemo(
    () => new Map(categorias.map((item) => [item.id, item.label])),
    [categorias]
  )
  const aulasFiltradas = useMemo(
    () =>
      aulas.filter((aula) => {
        const categoriaValida = categoria === 'todas' || aula.categoria === categoria
        const publicoValido = publico === 'todos' || aula.publicos.includes(publico)
        const diaValido = dia === 'todos' || aula.dias.includes(dia)
        return categoriaValida && publicoValido && diaValido
      }),
    [aulas, categoria, dia, publico]
  )

  return (
    <section id="programacao-clube" className="bg-[#0b0d16] py-24 text-white sm:py-32">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-gold">
              Programação Wellness
            </p>
            <h3 className="mt-5 font-display text-5xl font-light leading-[0.95] sm:text-6xl">
              Uma agenda para viver melhor
            </h3>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
              Filtre a grade por categoria, público ou dia da semana. Horários sujeitos a ajustes
              operacionais do clube.
            </p>
          </div>

          <div className="space-y-7 rounded-sm border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <fieldset>
              <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Categoria
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={filtroClassName(categoria === 'todas')}
                  onClick={() => setCategoria('todas')}
                  aria-pressed={categoria === 'todas'}
                >
                  Todas
                </button>
                {categorias.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={filtroClassName(categoria === item.id)}
                    onClick={() => setCategoria(item.id as ClubeCategoriaId)}
                    aria-pressed={categoria === item.id}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Público
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={filtroClassName(publico === 'todos')}
                  onClick={() => setPublico('todos')}
                  aria-pressed={publico === 'todos'}
                >
                  Todos
                </button>
                {CLUBE_PUBLICOS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={filtroClassName(publico === item)}
                    onClick={() => setPublico(item)}
                    aria-pressed={publico === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Dia
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={filtroClassName(dia === 'todos')}
                  onClick={() => setDia('todos')}
                  aria-pressed={dia === 'todos'}
                >
                  Todos
                </button>
                {CLUBE_DIAS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={filtroClassName(dia === item)}
                    onClick={() => setDia(item)}
                    aria-pressed={dia === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-white/40" aria-live="polite">
          {aulasFiltradas.length}{' '}
          {aulasFiltradas.length === 1 ? 'horário encontrado' : 'horários encontrados'}
        </p>

        {aulasFiltradas.length > 0 ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aulasFiltradas.map((aula) => (
              <li
                key={`${aula.nome}-${aula.horario}-${aula.dias.join('-')}`}
                className="hover:border-gold/30 border border-white/10 bg-white/[0.025] p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.24em] text-gold">
                      {categoriaLabels.get(aula.categoria) ?? aula.categoria}
                    </p>
                    <h4 className="mt-2 font-display text-2xl font-light text-white">
                      {aula.nome}
                    </h4>
                    {aula.turma && <p className="mt-1 text-xs text-white/50">{aula.turma}</p>}
                  </div>
                  <time className="font-mono text-sm text-white/70">{aula.horario}</time>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {aula.dias.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] capitalize text-white/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 border border-white/10 px-6 py-12 text-center text-sm text-white/50">
            Nenhuma atividade combina com os filtros selecionados.
          </div>
        )}
      </div>
    </section>
  )
}
