import type { ClubeData } from '@/data/clube-verdant'
import ClubeHero from './ClubeHero'
import { ClubeFechamento, ClubeIntro, ClubeRotina } from './ClubeEditorial'
import ClubeGallery from './ClubeGallery'
import ProgramacaoClube from './ProgramacaoClube'

const NAVEGACAO = [
  { href: '#rotina-clube', label: 'O clube' },
  { href: '#programacao-clube', label: 'Programação' },
  { href: '#galeria-clube', label: 'Galeria' },
]

export default function ClubeSection({
  data,
  whatsappHref,
}: {
  data: ClubeData
  whatsappHref: string
}) {
  return (
    <div id="clube" className="scroll-mt-16 bg-[#070910]">
      <ClubeHero data={data} />

      <nav aria-label="Navegação do Clube Verdant" className="border-ink/10 border-b bg-white">
        <div className="container-site flex gap-7 overflow-x-auto py-5">
          {NAVEGACAO.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#007d9f] transition-colors hover:text-[#005f79]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <ClubeIntro data={data} />
      <ClubeRotina data={data} />
      <ProgramacaoClube categorias={data.programacao} aulas={data.programacaoSemanal} />
      <div id="galeria-clube" className="scroll-mt-16">
        <ClubeGallery galeria={data.galeria} />
      </div>
      <ClubeFechamento data={data} whatsappHref={whatsappHref} />
    </div>
  )
}
