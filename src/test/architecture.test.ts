import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const PILOT_FILES = [
  'src/app/[locale]/condominios/[slug]/page.tsx',
  'src/components/empreendimento/EmpreendimentoLanding.tsx',
  'src/components/empreendimento/StorySections.tsx',
  'src/components/empreendimento/DetailSections.tsx',
  'src/components/empreendimento/CondominioUnits.tsx',
  'src/components/empreendimento/CondominioFaqs.tsx',
  'src/components/clube/ClubeSection.tsx',
  'src/components/clube/ClubeHero.tsx',
  'src/components/clube/ClubeEditorial.tsx',
  'src/components/clube/ClubeGallery.tsx',
  'src/components/clube/ProgramacaoClube.tsx',
  'src/components/clube/GradeProgramacao.tsx',
]

function readProjectFile(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8')
}

describe('fronteiras arquiteturais do módulo piloto', () => {
  it('mantém o acesso direto ao Sanity fora da página', () => {
    const page = readProjectFile(PILOT_FILES[0])

    expect(page).not.toContain('@/sanity/client')
    expect(page).not.toMatch(/client\.fetch/)
    expect(page).not.toContain('@/sanity/queries')
  })

  it.each(PILOT_FILES)('%s permanece abaixo de 300 linhas', (relativePath) => {
    const lineCount = readProjectFile(relativePath).split(/\r?\n/).length
    expect(lineCount).toBeLessThanOrEqual(300)
  })
})
