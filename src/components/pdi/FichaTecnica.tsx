import { formatArea, formatPreco } from '@/lib/formatters'
import type { ImovelCaracteristica, ImovelPDI } from '@/types/sanity'

interface FichaTecnicaProps {
  imovel: Pick<
    ImovelPDI,
    | 'tipo'
    | 'areaUtil'
    | 'areaTotal'
    | 'quartos'
    | 'suites'
    | 'banheiros'
    | 'vagas'
    | 'andar'
    | 'condominio'
    | 'iptu'
    | 'finalidade'
    | 'caracteristicas'
  >
}

interface EspecItem {
  label: string
  valor: string
}

/** Normaliza o campo andar: strip de °/º existentes antes de adicionar o sufixo correto */
function formatAndar(raw: string): string {
  return raw.replace(/[°º]+$/, '').trim() + 'º'
}

function buildEspecs(imovel: FichaTecnicaProps['imovel']): EspecItem[] {
  const items: EspecItem[] = []

  if (imovel.areaUtil)
    items.push({ label: 'Área útil', valor: formatArea(imovel.areaUtil) })
  if (imovel.areaTotal)
    items.push({ label: 'Área total', valor: formatArea(imovel.areaTotal) })
  if (imovel.quartos)
    items.push({ label: 'Quartos', valor: String(imovel.quartos) })
  if (imovel.suites)
    items.push({ label: 'Suítes', valor: String(imovel.suites) })
  if (imovel.banheiros)
    items.push({ label: 'Banheiros', valor: String(imovel.banheiros) })
  if (imovel.vagas)
    items.push({ label: 'Vagas', valor: String(imovel.vagas) })
  if (imovel.andar)
    items.push({ label: 'Andar', valor: formatAndar(String(imovel.andar)) })
  if (imovel.tipo)
    items.push({ label: 'Tipo', valor: imovel.tipo })
  if (imovel.finalidade)
    items.push({ label: 'Finalidade', valor: imovel.finalidade })
  if (imovel.condominio)
    items.push({ label: 'Condomínio', valor: formatPreco(imovel.condominio) })
  if (imovel.iptu)
    items.push({ label: 'IPTU/mês', valor: formatPreco(imovel.iptu / 12) })

  return items
}

function groupCaracteristicas(
  items?: ImovelCaracteristica[],
): Record<string, string[]> {
  if (!items?.length) return {}
  return items.reduce(
    (acc, item) => {
      if (!acc[item.grupo]) acc[item.grupo] = []
      acc[item.grupo].push(item.nome)
      return acc
    },
    {} as Record<string, string[]>,
  )
}

export default function FichaTecnica({ imovel }: FichaTecnicaProps) {
  const especs = buildEspecs(imovel)
  const grupos = groupCaracteristicas(imovel.caracteristicas)

  return (
    <section aria-label="Ficha técnica" className="py-12 md:py-16">

      {/* ── Label editorial ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-10">
        <span className="block w-6 h-px bg-gold flex-shrink-0" aria-hidden="true" />
        <h2 className="text-[10px] font-medium tracking-[0.22em] uppercase text-gold">
          Ficha técnica
        </h2>
      </div>

      {/* ── Stats row — números grandes, Cormorant, dividers hairline ── */}
      <div className="flex flex-wrap border-t border-stone">
        {especs.map((item, i) => (
          <div
            key={item.label}
            className={[
              'flex flex-col justify-center py-7 pr-8',
              i === 0 ? 'pl-0' : 'pl-8 border-l border-stone',
              /* forçar quebra antes de tipo e finalidade para não misturar números e texto */
            ].join(' ')}
          >
            <span
              className="block text-[9px] font-medium tracking-[0.2em] uppercase text-muted mb-2"
              aria-label={item.label}
            >
              {item.label}
            </span>
            <span
              className="text-display-md text-ink leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {item.valor}
            </span>
          </div>
        ))}
      </div>

      {/* ── Características por grupo ─────────────────────────────── */}
      {Object.keys(grupos).length > 0 && (
        <div className="mt-14 space-y-12">
          {Object.entries(grupos).map(([grupo, nomes]) => (
            <div key={grupo}>

              {/* Grupo label */}
              <div className="flex items-center gap-4 mb-6">
                <span className="block w-6 h-px bg-stone flex-shrink-0" aria-hidden="true" />
                <h3 className="text-[9px] font-medium tracking-[0.22em] uppercase text-muted">
                  {grupo}
                </h3>
              </div>

              {/* Lista de itens — duas colunas, editorial */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
                {nomes.map((nome) => (
                  <li
                    key={nome}
                    className="flex items-start gap-3 py-3 border-b border-stone/60 text-sm text-ink leading-snug"
                  >
                    <span
                      className="mt-[5px] w-1 h-1 rounded-full bg-gold flex-shrink-0"
                      aria-hidden="true"
                    />
                    {nome}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      )}
    </section>
  )
}
