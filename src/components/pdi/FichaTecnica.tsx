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
    items.push({ label: 'Andar', valor: `${imovel.andar}º` })
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
    <section aria-label="Ficha técnica" className="section-padding">
      <h2 className="text-xs tracking-widest uppercase text-gold mb-8">
        Ficha técnica
      </h2>

      {/* Especificações principais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-stone">
        {especs.map((item) => (
          <div
            key={item.label}
            className="bg-white px-5 py-4 flex flex-col gap-1"
          >
            <span className="text-xs uppercase tracking-wider text-muted">
              {item.label}
            </span>
            <span className="text-price text-lg text-ink font-medium">
              {item.valor}
            </span>
          </div>
        ))}
      </div>

      {/* Características por grupo */}
      {Object.keys(grupos).length > 0 && (
        <div className="mt-12 space-y-10">
          {Object.entries(grupos).map(([grupo, nomes]) => (
            <div key={grupo}>
              {/* Separador + label do grupo */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-4 h-px bg-gold flex-shrink-0" />
                <h3 className="text-xs uppercase tracking-widest text-muted">
                  {grupo}
                </h3>
              </div>

              {/* Cards das características */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {nomes.map((nome) => (
                  <li
                    key={nome}
                    className="flex items-start gap-3 bg-stone/60 border border-stone rounded-lg px-4 py-3 text-sm text-ink leading-snug"
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"
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
