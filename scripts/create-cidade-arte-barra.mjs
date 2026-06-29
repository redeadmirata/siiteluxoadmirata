/**
 * Cria (ou atualiza) o documento do Cidade Arte Barra no Sanity.
 * Rodar: node scripts/create-cidade-arte-barra.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'gvf51tpc',
  dataset:   'production',
  apiVersion: '2024-06-01',
  token:     'sk5mjzNi82fzQ8WIXUkYwzs037VtsgIiuTHojJUJDYVDU6iodLOlpPnMqQp6SU3f86BYLMlMXcBefazqS1NvIIoxTvWGMpfzXhVIbAVx6XycSqHRsIwNryWgL168mJxyHjdK74iJfxcFIzox6y85zaDqIMXqDyeXDcPJxsoceo7SduHmjQQu',
  useCdn:    false,
})

// ── Verificar se já existe ─────────────────────────────────────────────────
const existing = await client.fetch(
  '*[_type=="bairro" && slug.current=="cidade-arte-barra"][0]{_id}'
)

const doc = {
  _type: 'bairro',
  nome: 'Cidade Arte',
  slug: { _type: 'slug', current: 'cidade-arte-barra' },
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  mercado: 'Rio de Janeiro',
  regiao: 'Sudoeste',
  zona: 'oeste',
  bairroplanejado: true,
  incorporadora: 'Calper',
  introTexto: 'O primeiro bairro planejado da Barra Olímpica — onde arquitetura contemporânea, 1.800 árvores nativas e infraestrutura completa se unem em uma nova forma de viver.',
  descricao: 'O Cidade Arte é o primeiro bairro planejado da Barra Olímpica concebido com o conceito de arte, design e qualidade de vida. Desenvolvido pela Calper, o projeto propõe uma nova forma de viver, integrando arquitetura contemporânea, paisagismo, mobilidade, segurança e espaços públicos planejados.\n\nInspirado em bairros de referência nacional e internacional, o Cidade Arte reúne empreendimentos residenciais, áreas comerciais, lazer e convivência em um ambiente que valoriza a experiência urbana.',
  heroVideoUrl: 'https://www.youtube.com/watch?v=1yRU6RWfs9g',
  caracteristicas: [
    'Bairro planejado',
    'Conceito de arte e design',
    'Urbanismo inteligente',
    'Arquitetura contemporânea',
    'Mais de 1.800 árvores nativas',
    'Vista para o Maciço da Pedra Branca',
    'Espaços públicos planejados',
    'Segurança integrada',
    'Alto potencial de valorização',
  ],
  amenidades: [
    { _key: 'a1', titulo: 'Piscina de Ondas', descricao: 'Piscina de ondas com design paisagístico', icone: '🌊' },
    { _key: 'a2', titulo: 'Quadras Esportivas', descricao: 'Quadras de grama e areia, futmesa e espaços polivalentes', icone: '⚽' },
    { _key: 'a3', titulo: 'Academia ao Ar Livre', descricao: 'Fitness externo integrado ao paisagismo', icone: '🏋️' },
    { _key: 'a4', titulo: 'Parque Inclusivo', descricao: 'Área de lazer inclusiva para todas as idades', icone: '🌳' },
    { _key: 'a5', titulo: 'Pet Park', descricao: 'Espaço dedicado aos animais de estimação', icone: '🐾' },
    { _key: 'a6', titulo: 'Sky Lounge', descricao: 'Lounge com vista panorâmica para o bairro', icone: '🌆' },
    { _key: 'a7', titulo: 'Praças & Alamedas', descricao: 'Caminhos arborizados e espaços de convivência', icone: '🌿' },
    { _key: 'a8', titulo: 'Mobilidade', descricao: 'Acesso à Av. Abelardo Bueno, BRT, Transolímpica e Metrô', icone: '🚇' },
  ],
  faqs: [
    {
      _key: 'f1',
      pergunta: 'O que é o Cidade Arte?',
      resposta: 'O Cidade Arte é o primeiro bairro planejado da Barra Olímpica, desenvolvido pela Calper. Reúne condomínios residenciais de alto padrão, áreas verdes, lazer e infraestrutura completa em um único endereço próximo à Avenida Abelardo Bueno.',
    },
    {
      _key: 'f2',
      pergunta: 'Quais condomínios fazem parte do Cidade Arte?',
      resposta: 'O bairro planejado inclui os empreendimentos Arte Wave Surf Residences, Arte Design, Arte Botânica, Arte Jardim Residencial e Arte Wood Residences — todos da construtora Calper.',
    },
    {
      _key: 'f3',
      pergunta: 'Onde fica o Cidade Arte?',
      resposta: 'Localizado na Barra Olímpica, próximo à Avenida Abelardo Bueno, na Barra da Tijuca — Rio de Janeiro. Com acesso rápido à Linha Amarela, Transolímpica, BRT e ao Parque Olímpico.',
    },
    {
      _key: 'f4',
      pergunta: 'Qual é o potencial de valorização do Cidade Arte?',
      resposta: 'A Barra Olímpica concentra os maiores investimentos urbanos do Rio de Janeiro. A expansão da infraestrutura e novos empreendimentos tornam a região uma das áreas com maior potencial de valorização da cidade.',
    },
  ],
  metaTitle: 'Cidade Arte Barra | Bairro Planejado Calper na Barra Olímpica | Admirata',
  metaDescription: 'Condomínios de alto padrão no Cidade Arte, bairro planejado da Calper na Barra Olímpica. Arte Wave, Arte Design, Arte Botânica, Arte Jardim e Arte Wood. Curadoria exclusiva Admirata.',
  destaque: true,
  ordem: 0,
}

let result
if (existing?._id) {
  console.log(`⟳ Documento encontrado (${existing._id}). Atualizando...`)
  result = await client.patch(existing._id).set(doc).commit()
  console.log(`✓ Atualizado: ${result._id}`)
} else {
  console.log('+ Criando novo documento...')
  result = await client.create(doc)
  console.log(`✓ Criado: ${result._id}`)
}

console.log('\nPróximo passo: vincular os condomínios Arte* ao bairro no Sanity Studio.')
console.log('  Em cada condomínio, setar o campo "bairro" para o documento recem criado.')
