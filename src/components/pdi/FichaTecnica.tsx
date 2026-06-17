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
  icon: string
}

function buildEspecs(imovel: FichaTecnicaProps['imovel']): EspecItem[] {
  const items: EspecItem[] = []

  if (imovel.areaUtil)
    items.push({ label: 'Área útil', valor: formatArea(imovel.areaUtil), icon: '⬜' })
  if (imovel.areaTotal)
    items.push({ label: 'Área total', valor: formatArea(imovel.areaTotal), icon: '⬛' })
  if (imovel.quartos)
    items.push({ label: 'Quartos', valor: String(imovel.quartos), icon: '🛏' })
  if (imovel.suites)
    items.push({ label: 'Suítes', valor: String(imovel.suites), icon: '🚿' })
  if (imovel.banheiros)
    items.push({ label: 'Banheiros', valor: String(imovel.banheiros), icon: '🚽' })
  if (imovel.vagas)
    items.push({ label: 'Vagas', valor: String(imovel.vagas), icon: '🚗' })
  if (imovel.andar)
    items.push({ label: 'Andar', valor: `${imovel.andar}º`, icon: '🏢' })
  if (imovel.tipo)
    items.push({ label: 'Tipo', valor: imovel.tipo, icon: '🏠' })
  if (imovel.finalidade)
    items.push({ label: 'Finalidade', valor: imovel.finalidade, icon: '📋' })
  if (imovel.condominio)
    items.push({ label: 'Condomínio', valor: formatPreco(imovel.condominio), icon: '🏗' })
  if (imovel.iptu)
    items.push({ label: 'IPTU/mês', valor: formatPreco(imovel.iptu / 12), icon: '📄' })

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
        <div className="mt-10 space-y-6">
          {Object.entries(grupos).map(([grupo, nomes]) => (
            <div key={grupo}>
              <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
                {grupo}
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                {nomes.map((nome) => (
                  <li key={nome} className="flex items-center gap-2 text-sm text-ink">
                    <span
                      className="w-1 h-1 rounded-full bg-gold flex-shrink-0"
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
