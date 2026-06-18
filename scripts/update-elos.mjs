// scripts/update-elos.mjs
// Atualiza o Elos com dados completos do site oficial ilhapura.com.br/empreendimentos/elos
// Rode: node scripts/update-elos.mjs
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

// ─── MASTERPLAN COMPLETO (24 espaços conforme site oficial) ─────────────────
const masterplan = [
  'Pórtico de Acesso',
  'Pet Place',
  'Praça Teen',
  'Play Kids',
  'Mini Cidade',
  'Espaço Piquenique',
  'Tenda Zen e Redário',
  'Fitness Externo',
  'Belvedere',
  'Acesso ao Parque Ilha Pura',
  'Bar da Piscina',
  'Raia de 25m com Deck Molhado',
  'Piscina Adulto com Deck Molhado',
  'Piscina Infantil',
  'Wet Play',
  'Solário',
  'Churrasqueira',
  'Praça de Leitura',
  'Fonte Agave',
  'Pergolado de Descanso',
  'Praça Ipê',
  'Estacionamento Descoberto',
  'Acesso ao Estacionamento de Visitantes',
  'Estacionamento de Visitantes',
]

// ─── TEXTO EDITORIAL ─────────────────────────────────────────────────────────
const sobre = [
  block('Elos: Lazer Completo e Localização Privilegiada no Ilha Pura', 'h2'),
  block(
    'O Elos é um dos condomínios mais completos da Ilha Pura, o bairro planejado mais exclusivo da Barra da Tijuca. Com apartamentos de 2 a 4 quartos — incluindo coberturas duplex de até 265 m² — o Elos combina lazer de alto nível, natureza e convivência em um ambiente projetado para todas as fases da vida.',
  ),
  block(
    'Com preços a partir de R$ 1.106.311 e últimas unidades disponíveis, o Elos é uma oportunidade rara de ingressar em um dos empreendimentos mais reconhecidos do Ilha Pura, com acesso direto ao Parque Ilha Pura e ao Parque Olímpico.',
  ),

  block('Parque Aquático e Lazer na Água', 'h3'),
  block(
    'O Elos oferece um parque aquático completo com piscina adulto, piscina infantil, raia de 25 metros com deck molhado, wet play e solário. O bar da piscina e o belvedere completam os espaços de lazer voltados para o desfrute do sol e da água.',
  ),

  block('Bem-Estar e Fitness', 'h3'),
  block(
    'Os espaços de saúde e bem-estar incluem academia completa, spinning, sala multiuso, spa, sauna e espaços de beleza — tudo dentro do condomínio. O fitness externo complementa a estrutura para quem prefere se exercitar ao ar livre.',
  ),

  block('Coworking e Produtividade', 'h3'),
  block(
    'Para quem trabalha em formato híbrido ou remoto, o Elos conta com coworking, salas de reuniões e estudo e live box — espaços projetados com tecnologia e conforto para aumentar a produtividade sem sair de casa.',
  ),

  block('Gastronomia e Convivência', 'h3'),
  block(
    'O espaço gourmet e os salões de festas para adultos, teen e infantil garantem opções para celebrações de todas as idades. A tenda zen, o redário e as praças de leitura completam os ambientes de convivência e relaxamento.',
  ),

  block('Diversidade de Plantas', 'h3'),
  block(
    'O Elos oferece tipologias de 2 a 4 quartos, com área privativa de 86 a 265 m². A cobertura tem área privativa de 252,21 m² — uma das maiores disponíveis na Ilha Pura — com acabamento de alto padrão e varanda gourmet.',
  ),

  block('Conexão com a Natureza', 'h3'),
  block(
    'O masterplan do Elos inclui acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde, além de espaços externos como a praça do piquenique, praça teen, mini cidade e playground kids — lazer para toda a família sem sair do bairro.',
  ),
]

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Elos no Ilha Pura?',
    'O Elos é um condomínio residencial de alto padrão na Ilha Pura, o bairro planejado mais exclusivo da Barra da Tijuca. Oferece apartamentos de 2 a 4 quartos (86 a 265 m²) a partir de R$ 1.106.311, com 24 espaços de lazer, parque aquático completo e acesso direto ao Parque Ilha Pura.',
  ),
  faq(
    'Quais são as plantas do Elos?',
    'O Elos tem tipologias de 2, 3 e 4 quartos, com área privativa de 86 a 265 m². A cobertura tem 252,21 m² de área privativa. Todos os apartamentos contam com varanda e acabamento de alto padrão.',
  ),
  faq(
    'Qual o preço dos apartamentos do Elos?',
    'Os apartamentos do Elos têm preço a partir de R$ 1.106.311 (referência: Bl Iris Apto 1402, maio de 2026). São as últimas unidades disponíveis — consulte a disponibilidade atualizada com a Admirata.',
  ),
  faq(
    'Quais são os 24 espaços de lazer do Elos?',
    'O masterplan do Elos tem 24 espaços: Pórtico de Acesso, Pet Place, Praça Teen, Play Kids, Mini Cidade, Espaço Piquenique, Tenda Zen e Redário, Fitness Externo, Belvedere, Acesso ao Parque Ilha Pura, Bar da Piscina, Raia de 25m com Deck Molhado, Piscina Adulto com Deck Molhado, Piscina Infantil, Wet Play, Solário, Churrasqueira, Praça de Leitura, Fonte Agave, Pergolado de Descanso, Praça Ipê, Estacionamento Descoberto, Acesso ao Estacionamento de Visitantes e Estacionamento de Visitantes.',
  ),
  faq(
    'O Elos tem cobertura disponível?',
    'Sim. O Elos tem coberturas com 252,21 m² de área privativa — entre as maiores disponíveis na Ilha Pura. São as últimas unidades. Consulte disponibilidade com a Admirata.',
  ),
  faq(
    'O Elos tem acesso ao Parque Ilha Pura?',
    'Sim. O masterplan do Elos inclui acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde no coração do bairro — natureza como extensão do condomínio.',
  ),
  faq(
    'O Elos tem coworking?',
    'Sim. O Elos tem coworking, salas de reuniões e estudo e live box — infraestrutura completa para trabalho remoto ou híbrido dentro do condomínio.',
  ),
  faq(
    'Qual a diferença entre Elos e Saint Michel no Ilha Pura?',
    'O Elos (86–265 m², a partir de R$ 1.106.311) oferece tipologias de 2 a 4 quartos com cobertura de 252 m². O Saint Michel (131–280 m², a partir de R$ 1.453.096) foca em 3 e 4 quartos com masterplan de 48 espaços — incluindo spa com piscina indoor, cinema, garage band e boulevard exclusivo. Ambos são últimas unidades.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-elos',
  nome: 'Elos',
  slug: { _type: 'slug', current: 'elos' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Últimas unidades',
  precoMinimo: 1106311,
  areaPrivativaMin: 86,
  areaPrivativaMax: 265,
  tipologiasDisponiveis: ['2-quartos', '3-quartos', '4-quartos'],
  destaque: false,
  ordem: 4,

  infraestrutura: masterplan,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Elos com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Elos atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Masterplan: ${doc.infraestrutura.length} espaços`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/elos`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
