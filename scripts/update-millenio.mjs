// scripts/update-millenio.mjs
// Atualiza o Millenio com dados completos do site oficial ilhapura.com.br/empreendimentos/millenio
// Rode: node scripts/update-millenio.mjs
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

// ─── MASTERPLAN COMPLETO (29 espaços conforme site oficial) ─────────────────
const masterplan = [
  'Pórtico de entrada',
  'Lobby Ed. Sydney',
  'Spa com saunas',
  'Sala de massagem',
  'Sala multiuso',
  'Fitness (by Cia Atlética)',
  'Spa externo',
  'Piscina com raia de 25m',
  'Solário',
  'Bar da piscina',
  'Piscina infantil',
  'Piscina adulto',
  'Deck molhado',
  'Hidromassagem',
  'Lobby Ed. Singapura',
  'Home office',
  'Brinquedoteca',
  'Bar',
  'Café',
  'Deck lounge',
  'Alameda das Fontes',
  'Praça das Jabuticabas',
  'Lobby Ed. Chicago',
  'Salão de festas',
  'Pergolado festas',
  'Lounge coberto',
  'Salão de jogos',
  'Praça do encontro',
  'Acesso ao parque Ilha Pura',
]

// ─── TEXTO EDITORIAL ─────────────────────────────────────────────────────────
const sobre = [
  block('Millenio: A Melhor Entrada na Ilha Pura com Alto Padrão', 'h2'),
  block(
    'O Millenio é o condomínio residencial com o melhor custo-benefício da Ilha Pura. Com apartamentos de 2 suítes (79 a 82 m²) a partir de R$ 780.248, o Millenio entrega toda a estrutura e qualidade de vida do bairro planejado mais exclusivo da Barra da Tijuca, com 29 espaços de lazer e academia by Cia Atlética.',
  ),
  block(
    'Com últimas unidades disponíveis, o Millenio é a porta de entrada ideal para o universo da Ilha Pura — com o menor preço de acesso e todo o benefício de morar em um bairro planejado com parque, segurança e infraestrutura completa.',
  ),

  block('Academia by Cia Atlética e Bem-Estar Completo', 'h3'),
  block(
    'O fitness do Millenio é operado pela Cia Atlética, referência nacional em bem-estar. O complexo de saúde inclui spa com saunas, sala de massagem, sala multiuso e spa externo — estrutura de clube dentro do condomínio para quem valoriza o cuidado com o corpo no dia a dia.',
  ),

  block('Parque Aquático com Raia de 25 Metros', 'h3'),
  block(
    'A área aquática do Millenio tem piscina adulto, piscina infantil, raia de 25 metros, deck molhado e hidromassagem. O bar da piscina e o solário completam o ambiente de lazer, criando um espaço de descanso completo para os moradores.',
  ),

  block('Home Office, Bar e Café', 'h3'),
  block(
    'O Millenio combina produtividade e convivência: home office para trabalho remoto, café para reuniões informais e bar para os momentos de relaxamento — tudo dentro do condomínio, sem precisar sair para a rotina de trabalho ou para o lazer após o expediente.',
  ),

  block('Convivência e Entretenimento', 'h3'),
  block(
    'A Alameda das Fontes e a Praça das Jabuticabas são os espaços de convivência ao ar livre do Millenio — únicos na Ilha Pura. O salão de jogos, o lounge coberto e o pergolado de festas completam as opções de entretenimento para adultos, enquanto a brinquedoteca e a praça do encontro garantem lazer para os pequenos.',
  ),

  block('Apartamentos Inteligentes e Funcionais', 'h3'),
  block(
    'As plantas do Millenio foram projetadas para aproveitar ao máximo cada metro quadrado: apartamentos de 79,05 a 82,68 m² de área privativa com 2 suítes e acabamento de alto padrão. Quatro tipologias disponíveis (101–1701, 1502–1702, 105–1705, 1506–1706) para diferentes andares e orientações.',
  ),

  block('Três Lobbies Exclusivos e Acesso ao Parque', 'h3'),
  block(
    'O Millenio tem três lobbies distintos — Sydney, Singapura e Chicago — cada um com identidade própria. O masterplan inclui acesso direto ao Parque Ilha Pura (72.000 m²), integrando natureza, lazer e moradia de alto padrão em um único endereço.',
  ),
]

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Millenio no Ilha Pura?',
    'O Millenio é o condomínio residencial com o melhor custo-benefício da Ilha Pura. Oferece apartamentos de 2 suítes (79 a 82 m²) a partir de R$ 780.248, com 29 espaços de lazer, academia by Cia Atlética, spa com saunas e acesso direto ao Parque Ilha Pura.',
  ),
  faq(
    'Quais são as plantas do Millenio?',
    'O Millenio tem quatro tipologias de apartamentos de 2 suítes: 79,23 m² (tipos 101 a 1701 / 104 a 1704), 80,78 m² (tipos 1502 a 1702 / 1503 a 1703), 79,05 m² (tipos 105 a 1705 / 108 a 1708) e 82,68 m² (tipos 1506 a 1706 / 1507 a 1707). Todos com acabamento de alto padrão.',
  ),
  faq(
    'Qual o preço do Millenio na Ilha Pura?',
    'Os apartamentos do Millenio têm preço a partir de R$ 780.248 (referência: Bl Chicago Apto 1207, maio de 2026). É o condomínio com o menor preço de entrada da Ilha Pura. São as últimas unidades disponíveis — consulte a Admirata para disponibilidade atualizada.',
  ),
  faq(
    'Quais são os 29 espaços de lazer do Millenio?',
    'O masterplan do Millenio tem 29 espaços: Pórtico de entrada, Lobby Ed. Sydney, Spa com saunas, Sala de massagem, Sala multiuso, Fitness (Cia Atlética), Spa externo, Piscina raia 25m, Solário, Bar da piscina, Piscina infantil, Piscina adulto, Deck molhado, Hidromassagem, Lobby Ed. Singapura, Home office, Brinquedoteca, Bar, Café, Deck lounge, Alameda das Fontes, Praça das Jabuticabas, Lobby Ed. Chicago, Salão de festas, Pergolado festas, Lounge coberto, Salão de jogos, Praça do encontro e Acesso ao Parque Ilha Pura.',
  ),
  faq(
    'A academia do Millenio é da Cia Atlética?',
    'Sim. O fitness do Millenio é operado pela Cia Atlética, referência nacional em bem-estar e fitness. Inclui spa com saunas, sala de massagem e sala multiuso — estrutura completa de saúde dentro do condomínio.',
  ),
  faq(
    'O Millenio tem home office?',
    'Sim. O Millenio tem home office — espaço dedicado para trabalho remoto ou reuniões, complementado por café dentro do condomínio.',
  ),
  faq(
    'O Millenio tem acesso ao Parque Ilha Pura?',
    'Sim. O masterplan inclui acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde no coração do bairro.',
  ),
  faq(
    'Qual a diferença entre Millenio e Astra na Ilha Pura?',
    'Ambos têm apartamentos de 2 quartos, mas o Millenio (79–82 m², a partir de R$ 780.248) são as últimas unidades disponíveis — menor preço da Ilha Pura. O Astra (86–93 m², a partir de R$ 870.112) é um lançamento com academia by Cia Atlética, Wine Bar, parque aquático completo e 28 espaços de lazer. O Millenio tem preço menor; o Astra tem mais área privativa e espaços como Wine Bar e Podcast Studio.',
  ),
  faq(
    'Vale a pena comprar no Millenio na Ilha Pura?',
    'O Millenio é o ponto de entrada mais acessível na Ilha Pura, com 29 espaços de lazer, academia by Cia Atlética, spa com saunas, parque aquático completo e acesso ao Parque Ilha Pura. Para quem quer ingressar no bairro planejado mais exclusivo da Barra com o menor investimento, o Millenio é a escolha natural.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-millenio',
  nome: 'Millenio',
  slug: { _type: 'slug', current: 'millenio' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Últimas unidades',
  precoMinimo: 780248,
  areaPrivativaMin: 77.30,
  areaPrivativaMax: 82.68,
  tipologiasDisponiveis: ['2-quartos'],
  numTorres: 3,
  destaque: false,
  ordem: 6,

  infraestrutura: masterplan,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Millenio com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Millenio atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Masterplan: ${doc.infraestrutura.length} espaços`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/millenio`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
