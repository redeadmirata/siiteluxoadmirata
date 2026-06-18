// scripts/update-pura-artefacto.mjs
// Atualiza o Pura por Artefacto com dados completos do site oficial
// Rode: node scripts/update-pura-artefacto.mjs
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

// ─── MASTERPLAN COMPLETO (47 espaços conforme site oficial) ──────────────────
const masterplan = [
  'Pórtico de acesso',
  'Deck Espetáculo',
  'Estar Fogo',
  'Fire pit',
  'Pool House',
  'Deck pool house',
  'Espelhos d\'água',
  'Piscina adulto com deck molhado',
  'SPAs externos',
  'Piscina infantil',
  'Piscina de raia com 25m',
  'Solário',
  'Pool bar',
  'Churrasqueiras com forno de pizza',
  'Espaço Refúgio',
  'Estar Alma',
  'Estar Cor',
  'Playground',
  'Fitness externo',
  'Estar Arte',
  'Pet place',
  'Acesso ao parque Ilha Pura',
  'SPA (interno)',
  'Academia completa',
  'Pet care',
  'Sala de massagem',
  'Sala de dança',
  'Salão de beleza',
  'Spinning',
  'Salão de festas infantil',
  'Brinquedoteca',
  'Jogos virtuais',
  'Salão de festas teen',
  'Bar central',
  'Estúdio de música',
  'Jogos analógicos',
  'Salão de festas adulto',
  'Club house premium',
  'Espaço gourmet',
  'Podcast studio',
  'Office',
  'Sala de reunião',
  'Chroma key',
  'Lobby Vida',
  'Lobby Alma',
  'Lobby Essência',
  'Lobby Cor',
]

// ─── TEXTO EDITORIAL COMPLETO (com parceiros) ────────────────────────────────
const sobre = [
  block('Pura por Artefacto: O Encontro do Essencial com o Extraordinário', 'h2'),
  block(
    'O Pura por Artefacto é o mais recente lançamento da Ilha Pura — um projeto onde arquitetura, design e pensamento criativo se reúnem para dar forma a um novo marco no bairro planejado mais exclusivo da Barra da Tijuca. Com curadoria de mobiliário e design assinada pela Artefacto, paisagismo pelo Escritório Burle Marx e projeto de interiores das áreas comuns pela FEU Singular, o Pura redefine o que significa morar com sofisticação no Rio de Janeiro.',
  ),
  block(
    'Com apartamentos de 3 e 4 quartos entre 117 e 264 m², o Pura entrega plantas generosas, varanda gourmet e acabamentos de altíssimo padrão. O masterplan conta com 47 espaços de lazer distribuídos em dois lobbies distintos — Lobby Vida e Lobby Alma — garantindo ambientes para cada momento do dia e cada fase da vida.',
  ),

  block('Paisagismo Burle Marx', 'h3'),
  block(
    'O paisagismo criado pelo Escritório Burle Marx para o Pura por Artefacto foi concebido como uma experiência de bem-estar, sensibilidade e contemplação. Mais do que o uso da vegetação, o projeto se estrutura a partir de um desenho integrado da paisagem, onde caminhos, decks, espaços de estar, mobiliário e elementos como piscinas, espelhos d\'água e pérgolas constroem uma vivência contínua e envolvente.',
  ),
  block(
    'O conjunto das piscinas e do deck mirante assume papel central na proposta, funcionando como elemento focal do paisagismo. É para esse ponto que os percursos convergem e de onde se revela uma vista privilegiada do Parque Ilha Pura, com as montanhas ao fundo, reforçando a relação entre espaço construído e paisagem natural.',
  ),
  block(
    'Foi desenvolvido um deck mirante com áreas de estar contemplativo e arquibancadas em deck voltadas para o parque. Esse espaço explora a presença do elemento d\'água do lago principal e valoriza a vista para a paisagem natural do Parque da Pedra Branca. As formas fluidas dos espaços de estar, associadas ao uso de uma vegetação tropical rica em texturas, cores e volumes, somadas às pérgolas de cobertura com desenhos de formas reversas, conferem ao conjunto um caráter singular de sofisticação e exclusividade, reafirmando o paisagismo como expressão artística e elemento estruturador da experiência de morar.',
  ),

  block('Interiores FEU Singular', 'h3'),
  block(
    '"Na FEU Singular, começamos sempre pensando em como as áreas comuns podem, de fato, fazer parte da vida de quem mora ali. Neste projeto, cada espaço foi pensado como uma continuação do morar. Ambientes que acolhem, convidam à permanência e acompanham os diferentes momentos do dia com naturalidade e conforto."',
  ),
  block(
    '"A linguagem é contemporânea, sem excessos. Tons naturais, madeira e pedra, combinados a uma iluminação mais suave, constroem uma atmosfera calma, sensorial e atemporal. O desenho privilegia a fluidez e a sensação de bem-estar, seja nos momentos de cuidado, de pausa ou de convivência. Mais do que criar espaços bonitos, houve o cuidado de projetar ambientes que funcionam no dia a dia e que sejam agradáveis de usar. Porque é o uso que dá sentido à arquitetura."',
  ),

  block('Design e Mobiliário Artefacto', 'h3'),
  block(
    'Fundada em 1976, a Artefacto chega a 2026 celebrando 50 anos de história como uma das principais referências do design e da indústria moveleira de alto padrão no Brasil. Ao longo de cinco décadas, a marca construiu uma trajetória pautada pela longevidade, excelência construtiva, design autoral e relacionamento consistente com a arquitetura e o modo de viver contemporâneo.',
  ),

  block('Plantas e Tipologias', 'h3'),
  block(
    'O Pura por Artefacto oferece apartamentos com área privativa de 125,63 m² (andares 1 ao 15, unidades 01 a 04) e 126,14 m² (unidades especiais 1602 e 1603 no 16º andar). Todos com 3 quartos, varanda gourmet e suíte master. As tipologias de 4 quartos e coberturas (até 264 m²) completam o mix de produtos.',
  ),

  block('47 Espaços de Lazer', 'h3'),
  block(
    'Do Pórtico de Acesso ao Lobby Cor, o masterplan do Pura foi projetado para atender cada fase da vida dos moradores: Deck Espetáculo, Fire pit, Pool House com deck privativo, três piscinas (adulto com deck molhado, infantil e raia de 25m), solário, pool bar, spa, academia, pet care, sala de massagem, salão de beleza, sala de dança, spinning, brinquedoteca, jogos analógicos e virtuais, salões de festa para adultos, teens e crianças, estúdio de música, podcast studio, chroma key, office, sala de reunião e quatro lobbies temáticos: Vida, Alma, Essência e Cor.',
  ),
]

// ─── FAQs COMPLETOS ──────────────────────────────────────────────────────────
const faqs = [
  faq(
    'O que é o Pura por Artefacto?',
    'O Pura por Artefacto é o mais recente lançamento da Ilha Pura, na Barra da Tijuca. Com curadoria de mobiliário pela Artefacto (50 anos de história), paisagismo pelo Escritório Burle Marx e design de interiores das áreas comuns pela FEU Singular, oferece apartamentos de 3 e 4 quartos (117 a 264 m²) a partir de R$ 1.208.780.',
  ),
  faq(
    'Quais são as plantas e áreas dos apartamentos do Pura por Artefacto?',
    'O Pura por Artefacto oferece: Apartamentos padrão (andares 1 ao 15, unidades 01 a 04) com área privativa de 125,63 m², e apartamentos especiais (1602 e 1603 no 16º andar) com 126,14 m². Há também tipologias de 4 quartos e coberturas com área privativa de até 264 m². Todos com varanda gourmet.',
  ),
  faq(
    'Quais são os 47 espaços de lazer do Pura por Artefacto?',
    'O Pura por Artefacto tem 47 espaços numerados no masterplan: Pórtico de acesso, Deck Espetáculo, Estar Fogo, Fire pit, Pool House, Deck pool house, Espelhos d\'água, Piscina adulto com deck molhado, SPAs externos, Piscina infantil, Piscina de raia 25m, Solário, Pool bar, Churrasqueiras com forno de pizza, Espaço Refúgio, Estar Alma, Estar Cor, Playground, Fitness externo, Estar Arte, Pet place, Acesso ao parque, SPA, Academia, Pet care, Massagem, Sala de dança, Salão de beleza, Spinning, Salão de festas infantil, Brinquedoteca, Jogos virtuais, Salão de festas teen, Bar central, Estúdio de música, Jogos analógicos, Salão de festas adulto, Club house premium, Espaço gourmet, Podcast, Office, Sala de reunião, Chroma key, e 4 Lobbies (Vida, Alma, Essência e Cor).',
  ),
  faq(
    'Quem assinou o paisagismo do Pura por Artefacto?',
    'O paisagismo foi assinado pelo Escritório Burle Marx, o mesmo responsável pelo Parque Ilha Pura. O projeto é concebido como uma experiência de bem-estar, sensibilidade e contemplação, com caminhos, decks, espelhos d\'água, pérgolas e vegetação tropical rica em texturas. O deck mirante oferece vista privilegiada para o Parque da Pedra Branca.',
  ),
  faq(
    'Quem é a FEU Singular no Pura por Artefacto?',
    'A FEU Singular é o escritório responsável pelo design de interiores das áreas comuns do Pura por Artefacto. A proposta usa linguagem contemporânea com tons naturais, madeira e pedra, iluminação suave e atmosfera calma e atemporal — pensada para que as áreas comuns sejam uma extensão natural do morar.',
  ),
  faq(
    'Por que a Artefacto está envolvida no Pura por Artefacto?',
    'A Artefacto, fundada em 1976 e com 50 anos de história, foi escolhida como curadora de design e mobiliário do empreendimento. A marca é uma das principais referências do design moveleiro de alto padrão no Brasil, com trajetória pautada por longevidade, excelência construtiva e design autoral.',
  ),
  faq(
    'O Pura por Artefacto tem decorado para visitar?',
    'Sim. O decorado do Pura por Artefacto está disponível para visitas e inclui: quarto infantil, sala integrada, quarto/escritório, sala de jantar, sala e varanda gourmet, suíte master, banheiro da suíte, banheiro social, cozinha integrada, varanda e closet — tudo com mobiliário Artefacto e acabamentos de alto padrão.',
  ),
  faq(
    'O Pura por Artefacto tem acesso direto ao Parque Ilha Pura?',
    'Sim. O item 22 do masterplan é o "Acesso ao parque", com passagem direta para o Parque Ilha Pura de 72.000 m². O deck mirante foi projetado especificamente para valorizar a vista do lago principal e do Parque da Pedra Branca, criando uma conexão visual e física entre o condomínio e o parque.',
  ),
  faq(
    'O Pura por Artefacto tem academia e spa?',
    'Sim. O Pura por Artefacto tem academia completa (item 24 do masterplan), spa interno (item 23), SPAs externos (item 9), sala de massagem (item 26), spinning (item 29), sala de dança (item 27) e fitness externo (item 19). Para bem-estar e saúde, é o condomínio mais completo da Ilha Pura.',
  ),
  faq(
    'Qual a diferença entre o Lobby Vida, Lobby Alma, Lobby Essência e Lobby Cor?',
    'O Pura por Artefacto conta com quatro lobbies temáticos — Vida, Alma, Essência e Cor — que organizam as diferentes áreas de convivência e serviços do condomínio. Cada lobby tem identidade visual e programação de uso distintas, permitindo que os moradores encontrem o ambiente certo para cada momento do dia.',
  ),
]

// ─── DOCUMENTO COMPLETO ──────────────────────────────────────────────────────
const doc = {
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
  tipologiasDisponiveis: ['3-quartos', '4-quartos', 'cobertura'],
  numTorres: 1,
  destaque: true,
  ordem: 1,

  // Infraestrutura = masterplan completo (47 itens)
  infraestrutura: masterplan,

  sobre,
  faqs,
}

console.log('⏳ Atualizando Pura por Artefacto com dados completos...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Documento atualizado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Infraestrutura: ${doc.infraestrutura.length} itens (masterplan completo)`)
  console.log(`   FAQs: ${doc.faqs.length} perguntas`)
  console.log(`   Sobre: ${doc.sobre.length} blocos editoriais`)
  console.log(`   URL: https://admirata.com.br/condominios/pura-por-artefacto`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
