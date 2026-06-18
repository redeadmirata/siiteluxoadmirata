// scripts/update-saint-michel.mjs
// Atualiza o Saint Michel com dados completos do site oficial ilhapura.com.br/empreendimentos/saint-michel
// Rode: node scripts/update-saint-michel.mjs
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

// ─── MASTERPLAN COMPLETO (48 espaços conforme site oficial) ─────────────────
const masterplan = [
  'Pórtico de acesso',
  'Lobby Ed. Bordeaux',
  'Espaço beleza',
  'Spa com piscina indoor',
  'Espaço massagem',
  'Tenda de massagem',
  'Fitness externo',
  'Lobby Ed. Bourgogne',
  'Espaço fitness',
  'Espaço multiuso',
  'Bar da piscina',
  'Jogos/estar adulto',
  'Deck molhado',
  'Hidromassagem',
  'Piscina adulto com bar',
  'Bar',
  'Piscina com raia 25m',
  'Piscina infantil',
  'Lobby Ed. Provence',
  'Espaço office',
  'Espaço jogos adulto',
  'Espaço degustação',
  'Espaço gourmet/estar',
  'Boulevard Saint Michel',
  'Redário',
  'Pomar',
  'Lobby Ed. Alsace',
  'Espaço baby',
  'Cinema',
  'Brinquedoteca',
  'Espaço festas infantil',
  'Gourmet externo',
  'Playground',
  'Praça teen',
  'Parque infantil',
  'Praça das crianças',
  'Lobby Ed. Champagne',
  'Espaço games',
  'Espaço de estudos',
  'Garage band',
  'Espaço festas teen',
  'Trilha esportiva',
  'Acesso ao parque Ilha Pura',
  'Belvedere',
  'Pet play',
  'Estacionamento de visitantes',
  'Rampa acesso subsolo',
  'Rampa acesso térreo',
]

// ─── TEXTO EDITORIAL ─────────────────────────────────────────────────────────
const sobre = [
  block('Saint Michel: Sofisticação Francesa no Coração da Ilha Pura', 'h2'),
  block(
    'O Saint Michel é um dos condomínios mais completos e sofisticados da Ilha Pura, com 48 espaços de lazer distribuídos em um masterplan pensado para cada geração. Apartamentos de 3 e 4 quartos (131 a 280 m²) e coberturas de até 325 m² compõem um portfólio de alto padrão para quem exige o melhor da vida.',
  ),
  block(
    'Com preços a partir de R$ 1.453.096 e últimas unidades disponíveis, o Saint Michel é uma das últimas oportunidades de adquirir um apartamento neste condomínio referência da Ilha Pura. O boulevard interno, os 5 lobbies exclusivos e o spa com piscina indoor são apenas alguns dos diferenciais únicos.',
  ),

  block('Spa com Piscina Indoor e Bem-Estar de Referência', 'h3'),
  block(
    'O Saint Michel tem um dos mais completos complexos de bem-estar da Ilha Pura: spa com piscina indoor, espaço fitness por Cia Atlética, sala multiuso, espaço beleza, tenda de massagem, espaço de massagem e fitness externo. Cuidar da saúde e do corpo faz parte da rotina dos moradores sem sair de casa.',
  ),

  block('Parque Aquático Completo', 'h3'),
  block(
    'A área aquática do Saint Michel conta com piscina adulto com bar integrado, piscina com raia de 25 metros, piscina infantil, deck molhado e hidromassagem. O bar da piscina e o deck molhado garantem o conforto durante os momentos de lazer na água.',
  ),

  block('Gastronomia, Cultura e Entretenimento', 'h3'),
  block(
    'O Saint Michel é único por reunir espaços gastronômicos, culturais e de entretenimento raramente vistos em condomínios residenciais: espaço degustação, gourmet externo, bar, cinema, garage band e espaço games. O Boulevard Saint Michel é o coração social do condomínio — um espaço de convivência exclusivo dos moradores.',
  ),

  block('Espaços para Todas as Idades', 'h3'),
  block(
    'Do espaço baby ao garage band, o Saint Michel tem lazer pensado para cada fase. Os menores têm playground, parque infantil, brinquedoteca, espaço festas infantil e praça das crianças. Os teen têm praça teen e espaço festas teen. Os adultos têm jogos/estar adulto, espaço jogos adulto, cinema, garage band e redário.',
  ),

  block('Amplas Tipologias com Coberturas Exclusivas', 'h3'),
  block(
    'O Saint Michel oferece apartamentos de 160,20 m² de área privativa (tipos 101 a 1601 e 102 a 1602) e coberturas exclusivas de 325,26 m² (tipos 1701 a 1704). São 3 e 4 quartos com acabamento de alto padrão e varanda — apartamentos para quem não abre mão do espaço.',
  ),

  block('Cinco Lobbies Exclusivos e Acesso ao Parque', 'h3'),
  block(
    'O Saint Michel tem 5 lobbies distintos — Bordeaux, Bourgogne, Provence, Alsace e Champagne — cada um com identidade própria. O masterplan inclui acesso direto ao Parque Ilha Pura (72.000 m²) e trilha esportiva que integra natureza e atividade física à rotina dos moradores.',
  ),
]

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Saint Michel no Ilha Pura?',
    'O Saint Michel é um condomínio residencial de alto padrão na Ilha Pura, com 48 espaços de lazer, apartamentos de 3 e 4 quartos (131 a 280 m²) e coberturas de 325 m². Preços a partir de R$ 1.453.096, últimas unidades disponíveis.',
  ),
  faq(
    'Quais são as plantas do Saint Michel?',
    'O Saint Michel tem apartamentos de 160,20 m² de área privativa (tipos 101 a 1601 e 102 a 1602) com 3 e 4 quartos, e coberturas de 325,26 m² (tipos 1701 a 1704). Todos com varanda e acabamento de alto padrão.',
  ),
  faq(
    'Qual o preço do Saint Michel?',
    'Os apartamentos do Saint Michel têm preço a partir de R$ 1.453.096 (referência: Bl Champagne Apto 106, maio de 2026). São as últimas unidades disponíveis. Consulte disponibilidade com a Admirata.',
  ),
  faq(
    'Quantos espaços de lazer tem o Saint Michel?',
    'O Saint Michel tem 48 espaços de lazer no masterplan — um dos maiores da Ilha Pura. Os principais são: spa com piscina indoor, cinema, garage band, espaço degustação, boulevard exclusivo, piscinas (adulto, infantil, raia 25m), academia by Cia Atlética, espaços para bebês, crianças, teens e adultos, redário, pomar, belvedere e acesso ao Parque Ilha Pura.',
  ),
  faq(
    'O Saint Michel tem spa com piscina indoor?',
    'Sim. O Saint Michel tem spa com piscina indoor — um diferencial exclusivo entre os condomínios da Ilha Pura. Inclui também tenda de massagem, espaço de massagem, espaço fitness, espaço beleza e fitness externo, tudo operado pela Cia Atlética.',
  ),
  faq(
    'O Saint Michel tem cinema?',
    'Sim. O Saint Michel tem cinema — um diferencial único entre os condomínios residenciais da Ilha Pura.',
  ),
  faq(
    'O Saint Michel tem Boulevard exclusivo?',
    'Sim. O Boulevard Saint Michel é um espaço de convivência exclusivo dos moradores — uma avenida interna com identidade própria que conecta os lobbies e os espaços de lazer do condomínio.',
  ),
  faq(
    'O Saint Michel tem cobertura disponível?',
    'Sim. As coberturas do Saint Michel (tipos 1701 a 1704) têm 325,26 m² de área privativa — entre as maiores da Ilha Pura. São as últimas unidades. Consulte disponibilidade com a Admirata.',
  ),
  faq(
    'Qual a diferença entre Saint Michel e Elos na Ilha Pura?',
    'O Saint Michel (131–280 m², a partir de R$ 1.453.096) foca em 3 e 4 quartos com 48 espaços de lazer — incluindo spa com piscina indoor, cinema, garage band e boulevard exclusivo. O Elos (86–265 m², a partir de R$ 1.106.311) oferece tipologias de 2 a 4 quartos com 24 espaços de lazer e cobertura de 252 m². Ambos são últimas unidades.',
  ),
  faq(
    'O Saint Michel tem acesso ao Parque Ilha Pura?',
    'Sim. O masterplan inclui acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde, além de trilha esportiva integrada ao condomínio.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-saint-michel',
  nome: 'Saint Michel',
  slug: { _type: 'slug', current: 'saint-michel' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Últimas unidades',
  precoMinimo: 1453096,
  areaPrivativaMin: 131,
  areaPrivativaMax: 280,
  tipologiasDisponiveis: ['3-quartos', '4-quartos'],
  numTorres: 5,
  destaque: false,
  ordem: 5,

  infraestrutura: masterplan,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Saint Michel com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Saint Michel atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Masterplan: ${doc.infraestrutura.length} espaços`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/saint-michel`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
