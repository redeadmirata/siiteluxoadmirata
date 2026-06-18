// scripts/create-condominios-ilha-pura.mjs
// Rode: node scripts/create-condominios-ilha-pura.mjs
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

// ─── 1. PURA POR ARTEFACTO ───────────────────────────────────────────────────
const puraArtefacto = {
  _type: 'condominio',
  _id: 'condominio-pura-por-artefacto',
  nome: 'Pura por Artefacto',
  slug: { _type: 'slug', current: 'pura-por-artefacto' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Lançamento',
  precoMinimo: 1208780,
  areaPrivativaMin: 117,
  areaPrivativaMax: 264,
  tipologiasDisponiveis: ['3-quartos', '4-quartos'],
  ordem: 1,
  infraestrutura: [
    'Academia completa', 'Spa', 'Sauna', 'Sala de massagem', 'Salão de beleza',
    'Piscina adulto com deck molhado', 'Piscina infantil', 'Piscina de raia 25m',
    'Pool House', 'Pool bar', 'Pet care', 'Playground', 'Brinquedoteca',
    'Salão de festas adulto', 'Salão de festas teen', 'Salão de festas infantil',
    'Espaço gourmet', 'Churrasqueira com forno de pizza', 'Estúdio de música',
    'Podcast studio', 'Office', 'Sala de reunião', 'Chroma key', 'Spinning',
    'Jogos analógicos', 'Jogos virtuais', 'Acesso ao parque Ilha Pura',
    'Paisagismo Burle Marx', 'Deck mirante', 'Fire pit',
  ],
  sobre: [
    block('Pura por Artefacto: Onde o Design Encontra a Natureza', 'h2'),
    block(
      'O Pura por Artefacto é o mais recente lançamento da Ilha Pura — e talvez o mais aguardado. Com curadoria de mobiliário e design assinada pela Artefacto, paisagismo pelo lendário Escritório Burle Marx e projeto de interiores das áreas comuns pela FEU Singular, este condomínio redefine o conceito de morar bem na Barra da Tijuca.',
    ),
    block(
      'Com apartamentos de 3 e 4 quartos entre 117 e 264 m², o Pura entrega plantas generosas, varanda gourmet e acabamentos de altíssimo padrão. O masterplan conta com mais de 47 espaços de lazer distribuídos em dois lobbies distintos — Lobby Vida e Lobby Alma — garantindo ambientes para cada momento do dia e cada fase da vida.',
    ),
    block(
      'O deck mirante voltado para o Parque Ilha Pura e para as montanhas ao fundo é o ponto central do paisagismo: formas fluidas, vegetação tropical rica em texturas e espelhos d\'água criam uma experiência sensorial única. Com Fire pit, Pool House privativa, estúdio de música, podcast studio e chroma key, o Pura vai muito além do lazer convencional.',
    ),
  ],
  faqs: [
    faq(
      'O que é o Pura por Artefacto?',
      'O Pura por Artefacto é um lançamento de alto padrão dentro do bairro planejado Ilha Pura, na Barra da Tijuca. Com curadoria de mobiliário pela Artefacto, paisagismo pelo Escritório Burle Marx e design de interiores das áreas comuns pela FEU Singular, oferece apartamentos de 3 e 4 quartos (117 a 264 m²) a partir de R$ 1.208.780.',
    ),
    faq(
      'Qual a área dos apartamentos do Pura por Artefacto?',
      'Os apartamentos do Pura por Artefacto têm área privativa entre 117 m² e 264 m². As tipologias incluem apartamentos de 3 quartos (125-126 m²) e de 4 quartos. Há cobertura com área diferenciada. Todos com varanda gourmet.',
    ),
    faq(
      'Quais são as amenidades do Pura por Artefacto?',
      'O Pura por Artefacto conta com mais de 47 espaços de lazer, incluindo piscinas (adulto, infantil, raia 25m), Pool House, Spa, academia, estúdio de música, podcast studio, chroma key, Fire pit, deck mirante com vista para o Parque Ilha Pura, salões de festa para todas as idades, espaço gourmet e churrasqueira com forno de pizza.',
    ),
    faq(
      'O Pura por Artefacto tem decorado?',
      'Sim. O Pura por Artefacto possui apartamento decorado disponível para visitas, onde é possível conhecer o projeto com mobiliário Artefacto, materiais e acabamentos de alto padrão. Agendamento pelo site ou pelo telefone do empreendimento.',
    ),
    faq(
      'Qual o diferencial do paisagismo do Pura por Artefacto?',
      'O paisagismo é assinado pelo Escritório Burle Marx, o mesmo responsável pelo Parque Ilha Pura. O projeto integra caminhos, decks, piscinas, espelhos d\'água e pérgolas em formas fluidas, com vegetação tropical rica em texturas. O deck mirante oferece vista privilegiada para o parque e para as montanhas da Pedra Branca.',
    ),
  ],
}

// ─── 2. ORO BY ORNARE ────────────────────────────────────────────────────────
const oroOrnare = {
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
  ordem: 2,
  infraestrutura: [
    'Deck Sunset', 'Pool House com piscina privativa', 'Pool bar', 'Piscinas adulto e infantil',
    'Spa', 'Sauna', 'Salão de beleza', 'Academia completa', 'Spinning',
    'Espaço gourmet', 'Beverage bar', 'Churrasqueira', 'Salão de festas',
    'Cinema', 'Espaço gamer', 'Playground', 'Coworking', 'Podcast',
    'Design Ornare em todas as áreas comuns', 'Lobby de luxo',
    'Acesso ao parque Ilha Pura',
  ],
  sobre: [
    block('Oro by Ornare: O Ápice do Luxo na Ilha Pura', 'h2'),
    block(
      'O Oro by Ornare é o condomínio mais exclusivo da Ilha Pura — e um dos endereços mais sofisticados do Rio de Janeiro. Com design de móveis e acabamentos assinado pela Ornare, referência mundial em marcenaria e design de interiores de alto padrão, cada detalhe do Oro foi concebido para superar expectativas.',
    ),
    block(
      'Apartamentos de 3 e 4 suítes (171 a 461 m²) e coberturas duplex com até 5 suítes (até 461 m²) oferecem plantas generosas, pé-direito duplo nas coberturas e vistas privilegiadas. O preço a partir de R$ 1.784.900 posiciona o Oro na categoria ultra premium da Barra da Tijuca.',
    ),
    block(
      'As áreas comuns seguem o mesmo nível: Deck Sunset, Pool House com piscina privativa, cinema, espaço gamer, coworking, spa e salão de beleza. O masterplan do bairro complementa com quadras de tênis, lago, pista de skate, campo de futebol e o Parque Ilha Pura — tornando o cotidiano dos moradores verdadeiramente extraordinário.',
    ),
  ],
  faqs: [
    faq(
      'O que é o Oro by Ornare?',
      'O Oro by Ornare é o condomínio mais luxuoso da Ilha Pura, com design assinado pela Ornare. Oferece apartamentos de 3 e 4 suítes (171 a 461 m²) e coberturas duplex com até 5 suítes, a partir de R$ 1.784.900. É um lançamento de padrão ultra premium na Barra da Tijuca.',
    ),
    faq(
      'Quais são as tipologias do Oro by Ornare?',
      'O Oro by Ornare oferece: Apartamento 3 suítes (171 m²), Apartamento 4 suítes (178 m² e 227 m²), Cobertura Duplex 4 suítes (351 m²) e Cobertura Duplex 5 suítes (363 m² e 461 m²).',
    ),
    faq(
      'O Oro by Ornare tem tour virtual?',
      'Sim. O decorado do Oro by Ornare pode ser visitado presencialmente ou através de um tour 360° virtual disponível no site do empreendimento. Inclui sala integrada, varanda gourmet, suíte master com closet, cozinha integrada e demais ambientes com mobiliário Ornare.',
    ),
    faq(
      'Qual o diferencial do Oro by Ornare em relação aos outros condomínios da Ilha Pura?',
      'O Oro by Ornare se destaca pelo padrão ultra premium: design de marcenaria Ornare em todas as áreas comuns e unidades, apartamentos de maior área (171 a 461 m²), coberturas duplex exclusivas e o Deck Sunset como área social principal. É o produto de maior valor por metro quadrado da Ilha Pura.',
    ),
    faq(
      'Qual a previsão de entrega do Oro by Ornare?',
      'O Oro by Ornare está em fase de lançamento. Para informações atualizadas sobre prazo de entrega, entre em contato com a equipe de vendas da Admirata Imóveis, que atua como broker exclusivo no empreendimento.',
    ),
  ],
}

// ─── 3. ASTRA ────────────────────────────────────────────────────────────────
const astra = {
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
  ordem: 3,
  infraestrutura: [
    'Portaria 24h', 'Lobby de design', 'Parque aquático',
    'Piscina aquecida com borda infinita', 'Raia semiolímpica 25m',
    'Piscina infantil', 'Deck molhado', 'Bar da piscina', 'Belvedere',
    'Academia Cia Atlética', 'Sala aeróbico', 'Spa', 'Sauna a vapor',
    'Sauna seca', 'Salas de massagem', 'Espaço gourmet', 'Wine bar',
    'Churrasqueiras com forno de pizza', 'Salão de festas adulto',
    'Salão de festas infantil', 'Brinquedoteca', 'Playground',
    'Pet place', 'Coworking', 'Podcast studio', 'Sala de reunião',
    'Home TV externo', 'Streaming lounge', 'Bistrô',
    'Acesso ao parque Ilha Pura',
  ],
  sobre: [
    block('Astra: Alto Padrão Acessível na Ilha Pura', 'h2'),
    block(
      'O Astra é um lançamento na Ilha Pura que une alto padrão de acabamento e infraestrutura de lazer completa a um preço de entrada acessível para o bairro planejado mais exclusivo da Barra da Tijuca. Com apartamentos de 2 quartos entre 86 e 93 m², é ideal para casais, jovens profissionais e investidores.',
    ),
    block(
      'O parque aquático é o grande diferencial do Astra: piscina aquecida com borda infinita, raia semiolímpica de 25 metros, piscina infantil, deck molhado e bar da piscina compõem um complexo aquático raramente encontrado em condomínios dessa faixa de preço. A academia é gerenciada pela Cia Atlética.',
    ),
    block(
      'Com 28 espaços de lazer distribuídos no masterplan, o Astra oferece desde spa e sauna até podcast studio, streaming lounge, bistrô e wine bar. A portaria 24h e o acesso ao Parque Ilha Pura completam o pacote de qualidade de vida dentro do bairro planejado olímpico.',
    ),
  ],
  faqs: [
    faq(
      'O Astra é um bom investimento na Ilha Pura?',
      'Sim. O Astra tem o menor preço de entrada entre os lançamentos da Ilha Pura (a partir de R$ 870.112) com alto padrão de acabamento e infraestrutura completa. É ideal para investidores que buscam alta liquidez de locação — a demanda por apartamentos de 2 quartos na Ilha Pura é elevada tanto para locação de curta quanto de longa temporada.',
    ),
    faq(
      'Quais são as opções de planta do Astra?',
      'O Astra oferece duas tipologias: apartamentos de 2 quartos com suíte (86 a 93 m²) e double suítes (86 a 93 m²). Todas as unidades têm varanda e acabamentos de alto padrão.',
    ),
    faq(
      'O Astra tem academia?',
      'Sim. O Astra possui academia completa gerenciada pela Cia Atlética, com área de musculação, aparelhos e espaço multiuso. Além disso, há sala de aeróbico, fitness externo, spa com sauna a vapor e seca, e salas de massagem.',
    ),
    faq(
      'Como é o parque aquático do Astra?',
      'O parque aquático do Astra inclui piscina aquecida com borda infinita, raia semiolímpica de 25 metros, piscina infantil, deck molhado e bar da piscina. É um dos complexos aquáticos mais completos entre os condomínios da Ilha Pura.',
    ),
    faq(
      'O Astra fica perto de qual entrada da Ilha Pura?',
      'O Astra fica dentro do bairro planejado Ilha Pura, com acesso direto ao Parque Ilha Pura de 72.000 m². A Ilha Pura tem acesso principal pela Avenida Salvador Allende, no coração da Barra da Tijuca.',
    ),
  ],
}

// ─── 4. ELOS ─────────────────────────────────────────────────────────────────
const elos = {
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
  tipologiasDisponiveis: ['2-quartos', '3-quartos', '4-quartos', 'cobertura'],
  ordem: 4,
  infraestrutura: [
    'Parque aquático completo', 'Piscina adulto com deck molhado', 'Piscina infantil',
    'Raia de 25m', 'Wet play', 'Bar da piscina', 'Solário',
    'Academia', 'Spinning', 'Spa', 'Sauna', 'Espaço beleza',
    'Churrasqueira', 'Salão de festas adulto e teen', 'Espaço piquenique',
    'Tenda zen e redário', 'Coworking', 'Salas de reunião', 'Estudo',
    'Live box', 'Playground', 'Mini cidade', 'Praça teen',
    'Pet place', 'Fitness externo', 'Belvedere', 'Praça das Ipês',
    'Acesso ao parque Ilha Pura',
  ],
  sobre: [
    block('Elos: Versatilidade e Lazer Completo na Ilha Pura', 'h2'),
    block(
      'O Elos é o condomínio de maior versatilidade da Ilha Pura, com apartamentos de 2 a 4 quartos (86 a 265 m²) e coberturas de 252 m² — atendendo desde jovens casais até famílias numerosas. Com status de últimas unidades, é uma das melhores oportunidades de aquisição no bairro planejado olímpico da Barra da Tijuca.',
    ),
    block(
      'O foco do Elos está na conexão com o entorno natural: o acesso direto ao Parque Ilha Pura de 72.000 m² é facilitado por uma passarela exclusiva, e o masterplan do condomínio integra praças, tenda zen, redário e belvedere para valorizar momentos de contemplação.',
    ),
    block(
      'O parque aquático inclui piscina adulto com deck molhado, raia de 25 metros, piscina infantil e wet play. As áreas de convivência abrangem churrasqueira, salão de festas para todas as idades, praça teen, mini cidade e pet place. Para quem trabalha em home office, há coworking, salas de reunião, estudo e live box.',
    ),
  ],
  faqs: [
    faq(
      'O Elos ainda tem unidades disponíveis?',
      'O Elos está com últimas unidades disponíveis. Restam apartamentos selecionados, incluindo coberturas de 252 m² — as mais procuradas do empreendimento. Consulte a equipe da Admirata para disponibilidade atualizada.',
    ),
    faq(
      'Quais as tipologias disponíveis no Elos?',
      'O Elos oferece apartamentos de 2 a 4 quartos (86 a 265 m²) e coberturas com área privativa de 252 m². É o condomínio de maior amplitude de tipologias na Ilha Pura, atendendo diferentes perfis de compradores.',
    ),
    faq(
      'O Elos tem cobertura?',
      'Sim. O Elos possui cobertura com área privativa de 252 m². São as unidades mais exclusivas do condomínio, com plantas diferenciadas. Disponibilidade limitada — consulte a Admirata Imóveis para verificar se ainda há unidades disponíveis.',
    ),
    faq(
      'Como é o acesso ao Parque Ilha Pura pelo Elos?',
      'O Elos tem acesso direto ao Parque Ilha Pura de 72.000 m² através de uma passarela exclusiva. O parque conta com espetáculo das águas, kids mountain, pista de skate, campo de futebol, quadras, lago e muito mais.',
    ),
    faq(
      'O Elos é adequado para famílias com crianças?',
      'Sim. O Elos tem mini cidade, playground, praça teen, brinquedoteca, pet place, piscina infantil e wet play. A combinação de lazer para todas as idades e o acesso ao Parque Ilha Pura tornam o condomínio uma excelente escolha para famílias.',
    ),
  ],
}

// ─── 5. SAINT MICHEL ─────────────────────────────────────────────────────────
const saintMichel = {
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
  areaPrivativaMax: 325,
  tipologiasDisponiveis: ['3-quartos', '4-quartos', 'cobertura'],
  ordem: 5,
  infraestrutura: [
    'Academia completa Cia Atlética', 'Spa com piscina indoor', 'Espaço massagem',
    'Tenda de massagem', 'Espaço beleza', 'Sala multiuso', 'Fitness externo',
    'Piscina adulto com bar e deck molhado', 'Piscina infantil', 'Piscina raia 25m',
    'Hidromassagem', 'Salão de festas adulto', 'Salão de festas teen',
    'Salão de festas infantil', 'Espaço gourmet externo', 'Espaço degustação',
    'Churrasqueira', 'Boulevard Saint Michel', 'Cinema', 'Brinquedoteca',
    'Espaço baby', 'Playground', 'Praça das crianças', 'Praça teen',
    'Parque infantil', 'Coworking (Espaço office)', 'Sala de jogos adulto',
    'Garage band', 'Trilha esportiva', 'Espaço games', 'Espaço de estudos',
    'Belvedere', 'Pet play', 'Acesso ao parque Ilha Pura',
  ],
  sobre: [
    block('Saint Michel: Tradição Europeia e Sofisticação na Ilha Pura', 'h2'),
    block(
      'O Saint Michel é um dos maiores e mais sofisticados condomínios da Ilha Pura. Com inspiração na elegância europeia, o empreendimento entrega apartamentos de 3 e 4 quartos (131 a 280 m²) e coberturas de 325 m², pensados para famílias que exigem espaço, conforto e uma infraestrutura de lazer excepcional.',
    ),
    block(
      'Distribuído em 5 torres — Ed. Bordeaux, Ed. Bourgogne, Ed. Provence, Ed. Alsace e Ed. Champagne — o Saint Michel tem um masterplan com 48 espaços de lazer. O Boulevard Saint Michel é a espinha dorsal do condomínio: uma passarela elegante que conecta todas as torres e espaços de convivência.',
    ),
    block(
      'Para saúde e bem-estar: academia Cia Atlética, spa com piscina indoor, duas tendas de massagem, espaço beleza e sala multiuso. Para entretenimento: cinema, garage band, espaço games, trilha esportiva e salões de festa temáticos para todas as idades. O espaço gourmet externo e o de degustação de vinhos completam o repertório gastronômico.',
    ),
  ],
  faqs: [
    faq(
      'Quantos apartamentos tem o Saint Michel?',
      'O Saint Michel é composto por 5 torres: Bordeaux, Bourgogne, Provence, Alsace e Champagne. O número exato de unidades por torre varia — consulte a Admirata para informações de disponibilidade por bloco.',
    ),
    faq(
      'Quais são as plantas do Saint Michel?',
      'O Saint Michel oferece apartamentos padrão de 160 m² (3 e 4 quartos) e coberturas de 325 m² (1701 a 1704 de cada bloco). As coberturas têm área privativa generosa e plantas diferenciadas.',
    ),
    faq(
      'O Saint Michel tem spa?',
      'Sim. O Saint Michel possui um spa completo com piscina indoor, além de espaço de massagem, tenda de massagem externa e espaço beleza. É um dos poucos condomínios da Ilha Pura com spa com piscina coberta.',
    ),
    faq(
      'O Saint Michel é indicado para famílias grandes?',
      'Sim. O Saint Michel é ideal para famílias com crianças de todas as idades: tem espaço baby, brinquedoteca, praça das crianças, parque infantil, praça teen, salão de festas para cada faixa etária e piscina com raia de 25 metros. O acesso ao Parque Ilha Pura amplia ainda mais as opções de lazer.',
    ),
    faq(
      'O Saint Michel ainda tem unidades disponíveis?',
      'O Saint Michel está com últimas unidades disponíveis, incluindo alguns apartamentos padrão e coberturas. Para consultar disponibilidade e tabela de preços atualizada, entre em contato com a Admirata Imóveis.',
    ),
  ],
}

// ─── 6. MILLENIO ─────────────────────────────────────────────────────────────
const millenio = {
  _type: 'condominio',
  _id: 'condominio-millenio',
  nome: 'Millenio',
  slug: { _type: 'slug', current: 'millenio' },
  bairro: bairroRef,
  tipo: 'condominio-fechado',
  construtora: 'Carvalho Hosken',
  status: 'Últimas unidades',
  precoMinimo: 780248,
  areaPrivativaMin: 79,
  areaPrivativaMax: 82,
  tipologiasDisponiveis: ['2-quartos'],
  ordem: 6,
  infraestrutura: [
    'Academia Cia Atlética', 'Spa com saunas', 'Sala de massagem', 'Sala multiuso',
    'Fitness externo', 'Spa externo', 'Piscina adulto', 'Piscina infantil',
    'Piscina com raia de 25m', 'Deck molhado', 'Hidromassagem', 'Bar da piscina',
    'Salão de festas', 'Salão de jogos', 'Brinquedoteca', 'Playground',
    'Home office', 'Café', 'Bar', 'Deck lounge', 'Pergolado de festas',
    'Lounge coberto', 'Praça do encontro', 'Praça das Jabuticabas',
    'Alameda das Fontes', 'Acesso ao parque Ilha Pura',
  ],
  sobre: [
    block('Millenio: A Melhor Relação Custo-Benefício na Ilha Pura', 'h2'),
    block(
      'O Millenio é a porta de entrada para morar na Ilha Pura. Com apartamentos de 2 suítes entre 79 e 82 m² a partir de R$ 780.248, é o condomínio de menor preço de entrada no bairro planejado olímpico da Barra da Tijuca — sem abrir mão do padrão de qualidade e da infraestrutura completa que caracterizam todo o empreendimento.',
    ),
    block(
      'Distribuído em 3 torres — Ed. Sydney, Ed. Singapura e Ed. Chicago — o Millenio oferece layouts inteligentes que aproveitam cada centímetro quadrado. O acabamento de alto padrão, as janelas amplas e a varanda completam a proposta de um apartamento moderno e funcional.',
    ),
    block(
      'A infraestrutura de lazer é extensa: academia Cia Atlética, spa com saunas, piscina com raia de 25 metros, deck molhado, hidromassagem, salão de jogos, brinquedoteca, home office, café, bar e praças integradas. A Alameda das Fontes conecta os edifícios num percurso arborizado e charmoso, e o acesso ao Parque Ilha Pura expande infinitamente as opções de lazer ao ar livre.',
    ),
  ],
  faqs: [
    faq(
      'O Millenio é o apartamento mais barato da Ilha Pura?',
      'Sim. O Millenio tem o menor preço de entrada da Ilha Pura — a partir de R$ 780.248 — tornando-se a melhor oportunidade de investimento no bairro planejado olímpico da Barra da Tijuca. Apesar do menor preço, mantém o padrão Carvalho Hosken com acabamento de alto padrão e infraestrutura completa.',
    ),
    faq(
      'Quantos quartos tem o Millenio?',
      'O Millenio possui apartamentos de 2 suítes. As áreas privativas variam entre 79 m² e 82 m² dependendo da tipologia e do andar. São 4 tipos de plantas distribuídos nas 3 torres (Sydney, Singapura e Chicago).',
    ),
    faq(
      'O Millenio tem piscina com raia?',
      'Sim. O Millenio possui piscina com raia de 25 metros, piscina adulto, piscina infantil, deck molhado e hidromassagem. Para prática de natação e hidroginástica, a raia de 25m é o diferencial.',
    ),
    faq(
      'O Millenio é um bom investimento para locação?',
      'Sim. Apartamentos de 2 quartos na Ilha Pura têm alta demanda de locação de executivos, casais sem filhos e investidores que buscam locação por temporada. O Millenio combina menor preço de compra com boa rentabilidade de aluguel — tornando o cap rate atraente em relação aos outros condomínios da Ilha Pura.',
    ),
    faq(
      'O Millenio ainda tem unidades à venda?',
      'O Millenio está com últimas unidades disponíveis. A procura é alta, especialmente por andares mais altos. Para consultar disponibilidade e preços atualizados, entre em contato com a equipe da Admirata Imóveis.',
    ),
  ],
}

// ─── CRIAR TODOS ─────────────────────────────────────────────────────────────
const condominios = [
  { nome: 'Pura por Artefacto', doc: puraArtefacto },
  { nome: 'Oro by Ornare', doc: oroOrnare },
  { nome: 'Astra', doc: astra },
  { nome: 'Elos', doc: elos },
  { nome: 'Saint Michel', doc: saintMichel },
  { nome: 'Millenio', doc: millenio },
]

console.log('⏳ Criando 6 condomínios da Ilha Pura no Sanity...\n')

let ok = 0
for (const { nome, doc } of condominios) {
  try {
    const result = await client.createOrReplace(doc)
    console.log(`✅ ${nome} — ID: ${result._id}`)
    ok++
  } catch (err) {
    console.error(`❌ ${nome} — Erro: ${err.message}`)
  }
}

console.log(`\n${ok}/${condominios.length} condomínios criados com sucesso!`)
if (ok === condominios.length) {
  console.log('\n🏠 URLs disponíveis:')
  condominios.forEach(({ doc }) =>
    console.log(`   https://admirata.com.br/condominios/${doc.slug.current}`)
  )
}
