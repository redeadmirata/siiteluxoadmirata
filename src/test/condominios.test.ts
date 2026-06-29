import { describe, expect, it } from 'vitest'
import {
  asMp4,
  buildCondominioJsonLd,
  buildCondominioMetadata,
  buildEmpreendimentoData,
  flattenPortableText,
} from '@/lib/condominios/presentation'
import { clubeVerdant } from '@/data/clube-verdant'
import type { CondominioDetalhe } from '@/types/sanity'

const condominio: CondominioDetalhe = {
  _id: 'condominio-1',
  nome: 'Residencial Teste',
  slug: { current: 'residencial-teste' },
  totalImoveis: 2,
  descricao: 'Descrição do condomínio.',
  bairro: {
    _id: 'bairro-1',
    nome: 'Barra da Tijuca',
    slug: { current: 'barra-da-tijuca' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
  },
}

describe('apresentação de condomínios', () => {
  it('extrai apenas parágrafos válidos do Portable Text', () => {
    const result = flattenPortableText([
      { _type: 'block', children: [{ text: 'Primeiro ' }, { text: 'parágrafo.' }] },
      { _type: 'image' },
      { _type: 'block', children: [{ text: 'Segundo parágrafo.' }] },
    ])

    expect(result).toEqual(['Primeiro parágrafo.', 'Segundo parágrafo.'])
  })

  it('aceita somente URLs MP4 como vídeo de hero', () => {
    expect(asMp4('https://cdn.example.com/hero.mp4?version=1')).toBe(
      'https://cdn.example.com/hero.mp4?version=1'
    )
    expect(asMp4('https://youtube.com/watch?v=123')).toBeUndefined()
  })

  it('gera metadata canônica e conteúdo de landing a partir dos dados', () => {
    const metadata = buildCondominioMetadata(condominio, 'pt-BR', 'residencial-teste')
    const landing = buildEmpreendimentoData(
      {
        ...condominio,
        logoEmpreendimento: {
          asset: {
            _id: 'logo-1',
            url: 'https://cdn.sanity.io/logo.png',
            metadata: {
              lqip: 'data:image/jpeg;base64,logo',
              dimensions: { width: 800, height: 800, aspectRatio: 1 },
            },
          },
        },
      },
      'pt-BR'
    )

    expect(metadata.alternates?.canonical).toBe(
      'https://admirata.com.br/condominios/residencial-teste'
    )
    expect(landing.nome).toBe('Residencial Teste')
    expect(landing.arquiteturaLogoSrc).toBe('https://cdn.sanity.io/logo.png')
    expect(landing.manifesto).toBe('Descrição do condomínio.')
    expect(landing.whatsappHref).toContain('wa.me/5521998079459')
  })

  it('aplica a apresentação local específica do Verdant Valley', () => {
    const verdant: CondominioDetalhe = {
      ...condominio,
      nome: 'Verdant Valley Residence',
      slug: { current: 'verdant-valley' },
      sobre: [
        {
          _type: 'block',
          children: [{ text: 'Um condomínio de alto padrão em Jacarepaguá.' }],
        },
        {
          _type: 'block',
          children: [{ text: 'Unidades com acabamento de alto padrão.' }],
        },
      ],
    }

    const landing = buildEmpreendimentoData(verdant, 'pt-BR')

    expect(landing.heroImageSrc).toBe('/images/verdant-valley/hero-residence.jpg')
    expect(landing.arquiteturaLogoSrc).toBe('/images/verdant-valley/logo-verdant-valley.png')
    expect(landing.geo).toEqual({ lat: -22.9703479, lng: -43.4229203 })
    expect(landing.plantas).toHaveLength(3)
    expect([landing.manifesto, ...(landing.sobreParagrafos ?? [])].join(' ')).not.toMatch(
      /alto padrão/i
    )
  })

  it('inclui a programação do clube no JSON-LD do condomínio', () => {
    const jsonLd = buildCondominioJsonLd(condominio, 'pt-BR', 'residencial-teste', clubeVerdant)

    const graph = jsonLd['@graph']
    const clube = graph.find((item) => item['@type'] === 'SportsActivityLocation')

    expect(clube).toBeDefined()
    expect(clube?.event).toHaveLength(clubeVerdant.programacaoSemanal?.length ?? 0)
  })
})
