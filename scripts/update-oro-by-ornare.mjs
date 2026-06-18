// scripts/update-oro-by-ornare.mjs
// Atualiza Oro by Ornare com dados completos (site + 35 renders Drive + fotos decorado)
// Rode: node scripts/update-oro-by-ornare.mjs
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

// ─── INFRAESTRUTURA COMPLETA (35 espaços dos renders Drive, numerados) ────────
// Fonte: pasta Drive com renders EF numerados 01–35
const infraestrutura = [
  // Infantil & Família
  'Brinquedoteca',
  'Espaço baby',
  'Salão de festas infantil',
  'Varanda de festas infantil',
  'Oficina kids',
  'Playground',

  // Teen
  'Salão de festas teen',
  'Sala de jogos teen',

  // Adulto / Social
  'Salão de festas adulto',
  'Espaço gourmet',
  'Beverage bar',
  'Cinema',
  'Sala de jogos adulto',
  'Ateliê de cerâmica e artes',

  // Bem-estar & Saúde
  'Academia completa',
  'Spinning',
  'Pilates',
  'Espaço recovery',
  'Spa',
  'Salão de beleza',

  // Produtividade
  'Coworking',
  'Sala de estudos',
  'Podcast studio',

  // Aquático (Deck Sunset + Piscinas)
  'Deck Sunset',
  'Pool House com piscina privativa',
  'Pool bar',
  'Piscina adulto',
  'Piscina de raia',
  'Piscina aérea (coberturas)',

  // Serviços e Acesso
  'Lobby de design Ornare',
  'Acesso ao parque Ilha Pura',
]

// ─── TIPOLOGIAS COM ÁREAS EXATAS (do site oficial) ───────────────────────────
// Apartamento 3 suítes: 171,37m²
// Apartamento 4 suítes: 227,12m² e 178,49m²
// Cobertura Duplex 4 suítes: 351m²
// Cobertura Duplex 5 suítes: 461,28m² e 363,47m²

// ─── DRIVE: IDs das fotos para referência editorial ──────────────────────────
// Renders das amenidades (pasta: 1o7CA-bSsUdf2xxEjaS6jMpjQbXD1S3nq):
const driveRenders = {
  brinquedoteca:         '1MyYdKJLkypfH5FBQNCPAHuzBEoa20Eym',
  espacoBaby:            '12yyFkhI08Z6pPecfYiH5nTBswpd-JIQS',
  salaoFestaTeen:        '1ckkOqH0tKn99HrMTAFswk-ZqvwiaRgRo',
  oficinakids:           '123CgK6B0C8reyURNBLSi-Cfy3APgajZs',
  lobby:                 '1VCk9DuiA0UrEiMoShqq445wvTS7AwbsV',
  academia:              '1gm9h7BaemRdvBJQ4Eu0m7X28Q2EKRxy7',
  spinning:              '1AQNrJG6bofcRiXzuQQ8i9HmgkOZhhhfz',
  pilates:               '1F1qAK5FSBaZEPpEb44I8xML3K8NYpFcg',
  espacoRecovery:        '1bWK8m6csWVbwGqXty-aaH6r1tn6-lqQ_',
  espacoGamer:           '1h2knzwaqs0vJBrNgca04rJNi84-2bQUV',
  salaoFestaInfantil:    '1hc1Wp0DNhcrv_I0djIS4-Hs_G-Sy3Uhk',
  jogosTeen:             '1gbxdJHjR61pn8FyYy1RP_BvF21CnO2BJ',
  podcast:               '1XJMTdA_1ifP2lFYUWTJzI5PgDv46psl0',
  salaEstudos:           '11TtwU0krptUwYFfhFVdz8Wm4QAMQ5xz7',
  coworking:             '14VXfqlqaYlo9ctqbvrFBztkmsYlETkrR',
  salaoFestasAdulto:     '1ND19j98wjH5X8A9T4rFVGA7YxMYINkqK',
  beverageBar:           '1e5C86Onhy9kftciAenwX10FFx5klCbW3',
  atelieCeramica:        '1MW09YWAudkbkq3UgkfMx4vNCFQDVcEUn',
  cinema:                '1Bf5lvYTlyqg9tBUX6U0NYyxdzFSHvvzv',
  espacoGourmet:         '1NRO6py-nKWfVthP5Jip_ttTJD87lkfXZ',
  jogosAdulto:           '1dr4XjlHpwSN1nuZg6-3Oxm8fghMtqATP',
  spa:                   '1-hin7WLXhI-WlfQeJRuCUSqJDEcUHzyr',
  salaobeleza:           '1bUzQI6GuOYSldzBA3z9oEns5CERs3hPB',
  deckSunset1:           '1J1Eno4buSZVG-8LBySNdH53Ab1ns06lZ',
  deckSunset2:           '1-UTZRZ7XwqMqebjtaJx36J43_TBw8FXP',
  varandaFestasInfantil: '1oEivq2HwTyxd6OTmqhtlgN27_3__cH0a',
  playground:            '1w67JRfSBKbCEpmQRZtYUJooQIZeAh5RE',
  piscinaAdulto:         '16TU8zAs5cUBf4WpQTk9j5KG4oSVbeTXv',
  poolBar:               '1nqm3H9EVDikqDJPwFW81LKhRgvkHrdyk',
  poolHouse:             '1CgaF4NnFu6zpngE73U0Ig6X_AszaCac7',
  piscinaRaia:           '1nVxkM2jWvtodv5rgRMxjHkIB2t1nnJGI',
  piscinaAerea:          '1Md1aqHzBGEik4peOEQeqdcHvDHkwZ5_O',
}

// Decorado 227m² (pasta: 1OR_ysHwmyDw9Vo9ZVdXtFBRMU4_-vDpN):
const driveDecorado = {
  cozinhaAmpla:     '1ieA-Uvbwg2w_WShJTwvPZe17Ul2awKbk',
  salaJantar:       '1d7Ti8fk-J27nX4mpZrBSOi2PTgqEImVo',
  varandaGourmet:   '1O4BikMHEHrXvYQ5oXCwoaLsshfa9W3BB',
  salaComJantar:    '1QGHMRYvpioXipb44sx6tfWM4JB7RFF96',
  salaComGourmet:   '1iPXUdh000bI2EHOkrHkBJ-ewb_TgHYGh',
  suiteECloset:     '19ZIhBscYlh00wAWBRrmgif6jTPN1j6pI',
  salaProfundidade: '1MPPHpiwe-_SxsFH-Ssux15nNDd-L5c3Z',
  suiteEVaranda:    '1h_1_0pHhGE8kNBkW0K6Gwk1o-CUnzfGD',
  salaIntegrada:    '1c3DwUO3ZrdOaTrB4y0_SCDn-VczBThMI',
  suiteMenino:      '1yQ_YCqk8shrrk2ea3IgEiuGoX8bhCmPm',
  jantarHall:       '1L_sz8vGeBChsE4JD3v8yIl66QoNSdle8',
}

// Lobby (pasta: 1bnFBjOxsaHcC4yrNaEca2ld3V4D2LJP1):
const driveLobby = {
  lobby1: '1tMuGSZTZynPP-t2FTeD91HzwrBtkHZrE',
  lobby2: '1Vkd6udEvXHtZ_wyXNVfoNaMkjADWSpRi',
  lobby3: '1ME-lOxNsa84nhmlWQ9xwjEsIjAGy71g2',
  lobby4: '1RzVR1ljL0VHx8ANcm79CuRbFwjlWZWkB',
}

// ─── EDITORIAL: SOBRE ────────────────────────────────────────────────────────
const sobre = [
  block('Oro by Ornare: O Ápice do Luxo na Ilha Pura', 'h2'),
  block(
    'O Oro by Ornare é o produto mais exclusivo da Ilha Pura — e um dos endereços mais sofisticados do Rio de Janeiro. Com design de móveis e acabamentos assinado pela Ornare, referência mundial em marcenaria e interiores de alto padrão, o Oro foi concebido para quem não aceita compromissos com a excelência.',
  ),
  block(
    'Lançamento com apartamentos de 3 e 4 suítes (171,37 m² a 227,12 m²) e coberturas duplex com até 5 suítes (de 363,47 m² a 461,28 m²), o Oro entrega o maior pé-direito, as maiores varandas e as tipologias mais exclusivas do bairro planejado olímpico. O preço a partir de R$ 1.784.900 posiciona o empreendimento no topo do segmento ultra premium da Barra da Tijuca.',
  ),

  block('Design Ornare: 50 Anos de Excelência no Seu Condomínio', 'h3'),
  block(
    'A Ornare é parceira de arquitetos e designers de todo o mundo há décadas. No Oro, a marca assina não apenas o mobiliário das unidades, mas toda a identidade visual e o design das áreas comuns — do lobby premium ao Deck Sunset. O resultado é uma consistência estética raramente alcançada em condomínios residenciais.',
  ),

  block('31 Espaços de Lazer: Do Ateliê ao Deck Sunset', 'h3'),
  block(
    'Os 31 espaços de lazer do Oro foram projetados para cada faixa etária e cada momento do dia. Para as crianças: brinquedoteca, espaço baby, oficina kids, salão de festas infantil com varanda exclusiva e playground. Para os jovens: salão teen, sala de jogos teen. Para adultos: salão de festas adulto, espaço gourmet, beverage bar, cinema, sala de jogos adulto e o exclusivo Ateliê de Cerâmica e Artes.',
  ),
  block(
    'Para bem-estar: academia, spinning, pilates, espaço recovery, spa e salão de beleza. Para produtividade: coworking, sala de estudos e podcast studio. Para o lazer aquático: Deck Sunset (o grande diferencial do Oro), Pool House com piscina privativa, pool bar, piscina adulto e piscina de raia. E para os moradores das coberturas: a inédita Piscina Aérea — um recurso ultra exclusivo raramente encontrado em condomínios residenciais no Brasil.',
  ),

  block('Tipologias: Das 3 Suítes às Coberturas Duplex', 'h3'),
  block(
    'O mix de produtos do Oro atende desde compradores de primeira viagem no segmento premium até colecionadores de coberturas: Apartamento 3 suítes (171,37 m²), Apartamento 4 suítes (178,49 m² e 227,12 m²), Cobertura Duplex 4 suítes (351 m²) e Cobertura Duplex 5 suítes (363,47 m² e 461,28 m²). Todas as tipologias têm varanda gourmet e suíte master com closet.',
  ),

  block('Decorado 227m² Disponível para Visita', 'h3'),
  block(
    'O decorado do Oro by Ornare — um apartamento 4 suítes de 227 m² — está aberto para visitas presenciais. Cada ambiente traduz a filosofia Ornare: sala integrada com pé-direito duplo, sala de jantar com hall, varanda gourmet ampla, cozinha completa, suíte master com closet e varanda privativa, suíte menino e acabamentos de altíssimo padrão. Também disponível em tour virtual 360° pelo Kuula.',
  ),
  block(
    'Tour 360°: https://kuula.co/share/collection/7D1Mn',
  ),

  block('Masterplan do Bairro: 28 Espaços Além do Condomínio', 'h3'),
  block(
    'O Oro by Ornare fica dentro do bairro planejado Ilha Pura, que oferece 28 espaços adicionais de uso compartilhado por todos os moradores: Fonte da Inspiração, quadras de tênis, lago, jardim sensorial, Kids Mountain, pista de skate, campo de futebol, quadras poliesportivas e de saibro, ciclovia, pista de cooper, Splash Kids, Espetáculo das Águas, mirante do lago, lago das plantas aquáticas, passarelas, deck piquenique, pergolados, pet place, ecoponto e estação de tratamento de águas cinzas.',
  ),
]

// ─── FAQs COMPLETOS ──────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Oro by Ornare?',
    'O Oro by Ornare é o produto mais exclusivo da Ilha Pura, com design assinado pela Ornare. Oferece apartamentos de 3 e 4 suítes (171 a 461 m²) e coberturas duplex com até 5 suítes, a partir de R$ 1.784.900. É o empreendimento de maior valor por m² da Ilha Pura, na Barra da Tijuca.',
  ),
  faq(
    'Quais são as plantas e tipologias do Oro by Ornare?',
    'O Oro oferece: Apartamento 3 suítes (171,37 m²), Apartamento 4 suítes — tipo A (178,49 m²) e tipo B (227,12 m²), Cobertura Duplex 4 suítes (351 m²), Cobertura Duplex 5 suítes — tipo A (363,47 m²) e tipo B (461,28 m²). Todas as unidades têm varanda gourmet. O decorado disponível para visita é o apartamento 4 suítes de 227 m².',
  ),
  faq(
    'O Oro by Ornare tem Piscina Aérea?',
    'Sim. A Piscina Aérea é um dos grandes exclusivos do Oro by Ornare — disponível para os moradores das coberturas duplex. É uma piscina suspensa de uso privativo das coberturas, um recurso ultra premium raramente encontrado em condomínios residenciais no Brasil.',
  ),
  faq(
    'Quantos espaços de lazer tem o Oro by Ornare?',
    'O Oro by Ornare conta com 31 espaços de lazer próprios, incluindo: Deck Sunset, Pool House com piscina privativa, Pool bar, Piscina adulto, Piscina de raia, Piscina Aérea (coberturas), Academia, Spinning, Pilates, Espaço Recovery, Spa, Salão de beleza, Cinema, Beverage bar, Espaço gourmet, Sala de jogos adulto, Ateliê de cerâmica e artes, Coworking, Sala de estudos, Podcast studio, Brinquedoteca, Espaço baby, Oficina kids, Salão de festas infantil, Varanda de festas infantil, Playground, Salão de festas teen, Sala de jogos teen, Salão de festas adulto, Lobby de design Ornare e acesso ao Parque Ilha Pura.',
  ),
  faq(
    'O que é o Ateliê de Cerâmica e Artes do Oro?',
    'O Ateliê de Cerâmica e Artes é um espaço exclusivo do Oro by Ornare para atividades criativas como cerâmica, pintura e artesanato. É um dos diferenciais que não aparece na maioria dos condomínios de alto padrão e que reflete o posicionamento cultural do empreendimento.',
  ),
  faq(
    'O que é o Deck Sunset do Oro?',
    'O Deck Sunset é o principal diferencial de lazer externo do Oro by Ornare — uma área com vista para o pôr do sol, integrada ao pool bar e às piscinas. É o ponto de encontro social do condomínio, com design Ornare em todos os mobiliários e acabamentos.',
  ),
  faq(
    'Qual a diferença entre o Espaço Recovery e o Spa do Oro?',
    'O Spa é o espaço tradicional de relaxamento com sauna, massagem e tratamentos. O Espaço Recovery é um ambiente específico para recuperação muscular e física após treinos intensos — com equipamentos e protocolos distintos. Juntos com a academia, pilates e spinning, formam um dos complexos de bem-estar mais completos da Ilha Pura.',
  ),
  faq(
    'O Oro by Ornare tem tour virtual?',
    'Sim. O decorado de 227 m² do Oro by Ornare tem tour 360° disponível em: https://kuula.co/share/collection/7D1Mn. Também é possível agendar visita presencial ao decorado físico.',
  ),
  faq(
    'O Oro tem lobby de design?',
    'Sim. O lobby do Oro by Ornare é assinado pela Ornare, com design de móveis e materiais de altíssimo padrão. São 4 ângulos distintos que compõem um espaço de chegada único na Ilha Pura — um lobby que reflete a identidade do empreendimento antes mesmo de o morador entrar em seu apartamento.',
  ),
  faq(
    'Qual o preço do Oro by Ornare?',
    'O Oro by Ornare tem preço a partir de R$ 1.784.900 (referência: Bl Collar, Apartamento 104, fevereiro). Os valores variam por tipologia, andar e orientação solar. Para tabela de preços atualizada e disponibilidade, consulte a equipe da Admirata Imóveis.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
  _type: 'condominio',
  _id: 'condominio-oro-by-ornare',
  nome: 'Oro by Ornare',
  slug: { _type: 'slug', current: 'oro-by-ornare' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Lançamento',
  precoMinimo: 1784900,
  areaPrivativaMin: 171,
  areaPrivativaMax: 461,
  tipologiasDisponiveis: ['3-quartos', '4-quartos', 'cobertura', 'penthouse'],
  destaque: true,
  ordem: 2,
  infraestrutura,
  sobre,
  faqs,
}

console.log('⏳ Atualizando Oro by Ornare com dados completos...')
console.log(`   Infraestrutura: ${infraestrutura.length} espaços`)
console.log(`   Renders no Drive: ${Object.keys(driveRenders).length} imagens referenciadas`)
console.log(`   Decorado 227m² no Drive: ${Object.keys(driveDecorado).length} fotos`)
console.log(`   Lobby no Drive: ${Object.keys(driveLobby).length} fotos`)

try {
  const result = await client.createOrReplace(doc)
  console.log('\n✅ Documento atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   FAQs: ${faqs.length} perguntas`)
  console.log(`   Sobre: ${sobre.length} blocos`)
  console.log(`   URL: https://admirata.com.br/condominios/oro-by-ornare`)
  console.log('\n📁 Drive para upload das imagens no Sanity Studio:')
  console.log('   Renders amenidades: https://drive.google.com/drive/folders/1o7CA-bSsUdf2xxEjaS6jMpjQbXD1S3nq')
  console.log('   Fotos (lobby, decorado, salões): https://drive.google.com/drive/folders/1PWAWkwjIuK66uMn8F7KHISr5uRWxIEND')
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
