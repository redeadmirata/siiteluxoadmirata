// scripts/update-viure.mjs
// Atualiza o Viure com dados completos do site oficial ilhapura.com.br/empreendimentos/viure
// Rode: node scripts/update-viure.mjs
import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skqIL1rWOGnkDwVwghYYe8BjuR1wRITr9LRHsUouSG3j0qFBqfRwAZcTRpNbHVP7VBBKQTB9uvh9U3ROcKCOrwVNJ5xBf9K0xOJcEYhPH1DIEbtuxgyoDw3MIdZ7CFRpGXxORqydcKMMcIXozcm6IOhaYYBulMJiom2574rBRexH3hDBfqU0',
  useCdn: false,
})

const bairroRef = { _type: 'reference', _ref: 'bairro-ilha-pura' }

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

const faq = (pergunta, resposta) => ({
  _type: 'object',
  _key: key(),
  pergunta,
  resposta,
})

// ─── MASTERPLAN COMPLETO (39 espaços conforme site oficial) ─────────────────
const masterplan = [
  'Pórtico de entrada',
  'Vagas de visitantes',
  'Acesso parque',
  'Alongamento',
  'Piscina infantil',
  'Piscina adulto com deck molhado',
  'Hidromassagem',
  'Piscina recreativa',
  'Piscina com raia de 25m',
  'Bar da piscina',
  'Espaço gourmet externo',
  'Lounge',
  'Estar com pergolado',
  'Praça central',
  'Play infantil',
  'Lobby Ed. Dalí',
  'Varanda festas',
  'Espaço gourmet',
  'Festas adulto',
  'Lounge coberto',
  'Lobby Ed. Gaudí',
  'Garage band',
  'Festas teen',
  'Espaço jogos',
  'Espaço office',
  'Cinema',
  'Lobby Ed. Picasso',
  'Espaço kids - jardinagem',
  'Espaço kids',
  'Espaço kids - baby',
  'Festas kids',
  'Lobby Ed. Miró',
  'Spinning',
  'Academia',
  'Academia - sala multiuso',
  'Espaço massagem',
  'Spa',
  'Spa - saunas e duchas',
  'Spa externo',
]

// ─── TEXTO EDITORIAL ─────────────────────────────────────────────────────────
const sobre = [
  block('Viure: Arte, Lazer e Sofisticação no Ilha Pura', 'h2'),
  block(
    'O Viure é um condomínio residencial de alto padrão na Ilha Pura com 39 espaços de lazer e uma proposta estética única — seus 4 lobbies levam os nomes dos maiores artistas da pintura moderna: Dalí, Gaudí, Picasso e Miró. Apartamentos de 3 quartos (115 m²) a partir de R$ 1.139.221, com últimas unidades disponíveis.',
  ),
  block(
    'Com academia by Cia Atlética, cinema, garage band, spa completo com saunas e duchas, e um parque aquático com quatro piscinas — incluindo raia de 25 metros —, o Viure entrega lazer de nível premium para quem busca qualidade de vida no bairro planejado mais exclusivo da Barra da Tijuca.',
  ),

  block('Academia by Cia Atlética e Spa Completo', 'h3'),
  block(
    'O Viure conta com academia operada pela Cia Atlética — referência nacional em bem-estar —, complementada por sala de spinning, sala multiuso, espaço de massagem, spa com saunas e duchas e spa externo. Cuidar do corpo e da mente é parte da rotina diária dos moradores, sem sair de casa.',
  ),

  block('Parque Aquático com Quatro Piscinas', 'h3'),
  block(
    'A área aquática do Viure é uma das mais completas da Ilha Pura: piscina adulto com deck molhado, piscina infantil, piscina recreativa, piscina com raia de 25 metros e hidromassagem. O bar da piscina e o espaço de alongamento completam o ambiente de lazer ao ar livre.',
  ),

  block('Cinema, Garage Band e Espaço Jogos', 'h3'),
  block(
    'O Viure tem diferenciais raros em condomínios residenciais: cinema, garage band e espaço jogos — cultura e entretenimento dentro do próprio condomínio. O lounge coberto, o estar com pergolado e a varanda de festas completam os espaços de convivência para os moradores.',
  ),

  block('Lazer para Todas as Idades', 'h3'),
  block(
    'Do espaço kids (jardinagem, baby, play infantil) ao festas teen e garage band, o Viure tem programação de lazer pensada para cada fase da vida. Os adultos contam com festas adulto, espaço gourmet, lounge e espaço office — produtividade e convivência no mesmo endereço.',
  ),

  block('Gastronomia e Convivência', 'h3'),
  block(
    'O espaço gourmet, o gourmet externo, a praça central e o lounge do Viure formam um núcleo de convivência ao ar livre. A praça central é o coração do masterplan — ponto de encontro dos moradores e conexão entre os 4 lobbies do condomínio.',
  ),

  block('Quatro Lobbies e Acesso ao Parque Ilha Pura', 'h3'),
  block(
    'Os lobbies do Viure levam nomes de gênios da arte: Dalí, Gaudí, Picasso e Miró — cada um com identidade própria. O masterplan inclui acesso direto ao Parque Ilha Pura (72.000 m²) e integra natureza, lazer e morar de alto padrão em um único endereço.',
  ),
]

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Viure no Ilha Pura?',
    'O Viure é um condomínio residencial de alto padrão na Ilha Pura com 39 espaços de lazer, apartamentos de 3 quartos (115 m²) a partir de R$ 1.139.221. Seus 4 lobbies levam nomes de artistas modernos: Dalí, Gaudí, Picasso e Miró. São as últimas unidades disponíveis.',
  ),
  faq(
    'Quais são as plantas do Viure?',
    'O Viure tem apartamentos de 3 quartos com 115 m². As unidades estão distribuídas em 4 torres — Ed. Dalí, Ed. Gaudí, Ed. Picasso e Ed. Miró — com acabamento de alto padrão.',
  ),
  faq(
    'Qual o preço dos apartamentos do Viure?',
    'Os apartamentos do Viure têm preço a partir de R$ 1.139.221 (referência: Bl Gaudí Apto 1401, junho de 2026). São as últimas unidades disponíveis. Consulte disponibilidade atualizada com a Admirata.',
  ),
  faq(
    'Quais são os 39 espaços de lazer do Viure?',
    'O masterplan do Viure tem 39 espaços: Pórtico de entrada, Vagas de visitantes, Acesso parque, Alongamento, Piscina infantil, Piscina adulto com deck molhado, Hidromassagem, Piscina recreativa, Piscina raia 25m, Bar da piscina, Gourmet externo, Lounge, Estar com pergolado, Praça central, Play infantil, Lobby Ed. Dalí, Varanda festas, Espaço gourmet, Festas adulto, Lounge coberto, Lobby Ed. Gaudí, Garage band, Festas teen, Espaço jogos, Espaço office, Cinema, Lobby Ed. Picasso, Espaço kids (jardinagem, baby), Play kids, Festas kids, Lobby Ed. Miró, Spinning, Academia, Academia sala multiuso, Espaço massagem, Spa, Spa saunas e duchas, Spa externo.',
  ),
  faq(
    'O Viure tem cinema?',
    'Sim. O Viure tem cinema — um diferencial exclusivo entre os condomínios residenciais da Ilha Pura, junto com garage band e espaço de jogos.',
  ),
  faq(
    'A academia do Viure é da Cia Atlética?',
    'Sim. A academia do Viure é operada pela Cia Atlética, referência nacional em bem-estar. O complexo inclui também spinning, sala multiuso, espaço de massagem e spa completo com saunas, duchas e spa externo.',
  ),
  faq(
    'O Viure tem acesso ao Parque Ilha Pura?',
    'Sim. O masterplan do Viure inclui acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde no coração do bairro.',
  ),
  faq(
    'Qual a diferença entre Viure e Saint Michel no Ilha Pura?',
    'O Viure (115 m², a partir de R$ 1.139.221) oferece 3 quartos com 39 espaços de lazer, cinema, garage band e 4 lobbies artísticos (Dalí, Gaudí, Picasso, Miró). O Saint Michel (131–280 m², a partir de R$ 1.276.575) foca em 3 e 4 quartos com spa com piscina indoor, boulevard exclusivo, 5 lobbies franceses e coberturas de 325 m². Ambos são últimas unidades.',
  ),
  faq(
    'Vale a pena comprar no Viure no Ilha Pura?',
    'O Viure é um dos condomínios mais completos e criativos da Ilha Pura: 39 espaços de lazer, academia by Cia Atlética, cinema, garage band, parque aquático com 4 piscinas, spa completo e acesso ao Parque Ilha Pura. Para quem busca 3 quartos com lazer premium e proposta estética diferenciada na Barra, o Viure é uma das últimas oportunidades.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-viure',
  nome: 'Viure',
  slug: { _type: 'slug', current: 'viure' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Últimas unidades',
  precoMinimo: 1139221,
  areaPrivativaMin: 115,
  areaPrivativaMax: 115,
  tipologiasDisponiveis: ['3-quartos'],
  numTorres: 4,
  destaque: false,
  ordem: 7,

  infraestrutura: masterplan,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Viure com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Viure atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Masterplan: ${doc.infraestrutura.length} espaços`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/viure`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
