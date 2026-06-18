// scripts/update-astra.mjs
// Atualiza o Astra com dados completos do site oficial ilhapura.com.br/empreendimentos/astra
// Rode: node scripts/update-astra.mjs
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

// ─── MASTERPLAN COMPLETO (28 espaços conforme site oficial) ─────────────────
const masterplan = [
  'Pórtico de acesso',
  'Piscina recreativa',
  'Piscina raia semiolímpica 25m',
  'Piscina infantil',
  'Bar da piscina',
  'Belvedere',
  'Acesso ao parque Ilha Pura',
  'Churrasqueiras com forno de pizza',
  'Playground Kids',
  'Pet Place',
  'SPA',
  'Sauna a vapor',
  'Sauna seca',
  'Salas de massagem',
  'Academia (by Cia Atlética)',
  'Sala aeróbico',
  'Bistrô',
  'Home TV externo',
  'Salão de festas',
  'Streaming Lounge',
  'Salão de festas adulto',
  'Wine Bar',
  'Espaço Gourmet',
  'Coworking',
  'Podcast Studio',
  'Sala de reunião',
  'Salão de festas infantil',
  'Brinquedoteca',
]

// ─── TEXTO EDITORIAL ─────────────────────────────────────────────────────────
const sobre = [
  block('Astra: Qualidade de Vida em Cada Detalhe na Ilha Pura', 'h2'),
  block(
    'O Astra é um lançamento exclusivo no coração da Ilha Pura, o bairro planejado mais moderno da Barra da Tijuca. Com apartamentos de 2 quartos projetados para quem valoriza espaço, conforto e lazer completo, o Astra entrega uma experiência de vida que vai além das quatro paredes.',
  ),
  block(
    'Com preços a partir de R$ 870.112, o Astra representa a entrada mais acessível no universo da Ilha Pura, sem abrir mão do padrão e dos benefícios de morar em um bairro planejado com segurança, natureza e infraestrutura completa.',
  ),

  block('Parque Aquático Completo', 'h3'),
  block(
    'O Astra conta com um parque aquático invejável: piscina recreativa aquecida, piscina de raia semiolímpica de 25 metros, piscina infantil, deck molhado e bar da piscina. O belvedere garante uma vista privilegiada do bairro, tornando o momento de lazer ainda mais especial.',
  ),

  block('Academia by Cia Atlética', 'h3'),
  block(
    'A academia do Astra é operada pela Cia Atlética, referência nacional em bem-estar e fitness. Estrutura completa com área de musculação, aparelhos modernos, sala aeróbico e espaço multiuso — tudo dentro do condomínio, para você não precisar sair para cuidar da saúde.',
  ),

  block('Gastronomia e Convivência', 'h3'),
  block(
    'O Espaço Gourmet, o Wine Bar e o Bistrô transformam cada encontro em uma experiência especial. Para quem trabalha em casa, o Coworking e o Podcast Studio oferecem infraestrutura profissional. Já o Streaming Lounge é perfeito para quem quer entretenimento em grupo.',
  ),

  block('Espaços para Toda a Família', 'h3'),
  block(
    'O Astra pensa em cada geração: Playground Kids, Brinquedoteca e Salão de Festas Infantil para os pequenos; Salão de Festas Adulto, Wine Bar e Espaço Gourmet para os adultos; SPA, sauna a vapor, sauna seca e salas de massagem para quem busca bem-estar.',
  ),

  block('Plantas e Tipologias', 'h3'),
  block(
    'O Astra oferece apartamentos de 2 quartos com suíte (área privativa de 86 a 93 m²) e a tipologia Double Suítes (também 86 a 93 m²). Todos com varanda gourmet e acabamento de alto padrão. São 28 espaços de lazer no masterplan para complementar a vida dos moradores.',
  ),

  block('Acesso Direto ao Parque Ilha Pura', 'h3'),
  block(
    'O item 7 do masterplan é o acesso direto ao Parque Ilha Pura — 72.000 m² de área verde no coração do bairro. Morar no Astra é ter a natureza como extensão do seu condomínio.',
  ),
]

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Astra na Ilha Pura?',
    'O Astra é um lançamento residencial de alto padrão na Ilha Pura, o bairro planejado mais exclusivo da Barra da Tijuca. Oferece apartamentos de 2 quartos (86 a 93 m²) a partir de R$ 870.112, com 28 espaços de lazer, academia by Cia Atlética e parque aquático completo.',
  ),
  faq(
    'Quais são as plantas do Astra?',
    'O Astra tem duas tipologias: "2 quartos com suíte" e "Double Suítes", ambas com área privativa de 86 m² a 93 m². Todos os apartamentos têm varanda gourmet e acabamento de alto padrão.',
  ),
  faq(
    'Qual o preço do Astra na Ilha Pura?',
    'Os apartamentos do Astra têm preço a partir de R$ 870.112 (referência: Bl Luna Apto 101, maio de 2026). É a entrada mais acessível no universo da Ilha Pura, mantendo todo o padrão e infraestrutura do bairro.',
  ),
  faq(
    'Quais são os 28 espaços de lazer do Astra?',
    'O masterplan do Astra tem 28 espaços: Pórtico de acesso, Piscina recreativa, Piscina raia 25m, Piscina infantil, Bar da piscina, Belvedere, Acesso ao Parque Ilha Pura, Churrasqueiras com forno de pizza, Playground Kids, Pet Place, SPA, Sauna a vapor, Sauna seca, Salas de massagem, Academia (Cia Atlética), Sala aeróbico, Bistrô, Home TV externo, Salão de festas, Streaming Lounge, Salão de festas adulto, Wine Bar, Espaço Gourmet, Coworking, Podcast Studio, Sala de reunião, Salão de festas infantil e Brinquedoteca.',
  ),
  faq(
    'A academia do Astra é operada pela Cia Atlética?',
    'Sim. A academia do Astra é operada pela Cia Atlética, referência nacional em bem-estar e fitness. A estrutura inclui área de musculação, aparelhos modernos, sala aeróbico e espaço multiuso — tudo dentro do condomínio.',
  ),
  faq(
    'O Astra tem parque aquático?',
    'Sim. O Astra tem um parque aquático completo com piscina recreativa aquecida, piscina de raia semiolímpica de 25 metros, piscina infantil, deck molhado e bar da piscina. O belvedere oferece vista privilegiada do bairro.',
  ),
  faq(
    'O Astra tem coworking e espaços de trabalho?',
    'Sim. O Astra tem Coworking, Podcast Studio e Sala de reunião — infraestrutura completa para quem trabalha remotamente ou em formato híbrido.',
  ),
  faq(
    'O Astra tem acesso ao Parque Ilha Pura?',
    'Sim. O item 7 do masterplan é o acesso direto ao Parque Ilha Pura, com 72.000 m² de área verde no coração do bairro. Moradores do Astra têm a natureza como extensão do seu condomínio.',
  ),
  faq(
    'O Astra tem Wine Bar?',
    'Sim. O Wine Bar é um dos diferenciais mais exclusivos do Astra, ao lado do Espaço Gourmet e do Bistrô — três opções gastronômicas dentro do próprio condomínio para reunir amigos e família.',
  ),
  faq(
    'Qual a diferença entre Astra e Millenio na Ilha Pura?',
    'Ambos têm apartamentos de 2 quartos, mas o Astra (86–93 m², a partir de R$ 870.112) é um lançamento com academia by Cia Atlética, Wine Bar, parque aquático completo e 28 espaços de lazer. O Millenio (79–82 m², a partir de R$ 780.248) são as últimas unidades disponíveis com tipologia de 2 suítes.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-astra',
  nome: 'Astra',
  slug: { _type: 'slug', current: 'astra' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Lançamento',
  precoMinimo: 870112,
  areaPrivativaMin: 86,
  areaPrivativaMax: 93,
  tipologiasDisponiveis: ['2-quartos'],
  numTorres: 1,
  destaque: false,
  ordem: 3,

  infraestrutura: masterplan,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Astra com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Astra atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Masterplan: ${doc.infraestrutura.length} espaços`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/astra`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
