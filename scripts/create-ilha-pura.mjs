// scripts/create-ilha-pura.mjs
// Rode: node scripts/create-ilha-pura.mjs
import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_TOKEN ||
    'skqIL1rWOGnkDwVwghYYe8BjuR1wRITr9LRHsUouSG3j0qFBqfRwAZcTRpNbHVP7VBBKQTB9uvh9U3ROcKCOrwVNJ5xBf9K0xOJcEYhPH1DIEbtuxgyoDw3MIdZ7CFRpGXxORqydcKMMcIXozcm6IOhaYYBulMJiom2574rBRexH3hDBfqU0',
  useCdn: false,
})

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

const doc = {
  _type: 'bairro',
  _id: 'bairro-ilha-pura',
  nome: 'Ilha Pura',
  slug: { _type: 'slug', current: 'ilha-pura' },
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  mercado: 'Rio de Janeiro',
  regiao: 'Sudoeste',
  zona: 'oeste',
  ordem: 7,
  bairroplanejado: true,
  incorporadora: 'Carvalho Hosken',
  areaTotal: 720000,
  anoInauguracao: 2016,
  introTexto:
    'A Ilha Pura é o bairro planejado mais exclusivo da Barra da Tijuca — legado olímpico transformado em condomínio-bairro de alto padrão com segurança total, 72.000 m² de parque e lazer completo.',

  amenidades: [
    { _type: 'object', _key: key(), titulo: 'Parque Central', descricao: '72.000 m² de área verde com lagoas e trilhas', icone: '🌿' },
    { _type: 'object', _key: key(), titulo: 'Segurança 24h', descricao: 'Controle de acesso perimetral com guaritas e câmeras', icone: '🔒' },
    { _type: 'object', _key: key(), titulo: 'Piscinas Olímpicas', descricao: 'Complexo aquático legado dos Jogos 2016', icone: '🏊' },
    { _type: 'object', _key: key(), titulo: 'Quadras Esportivas', descricao: 'Quadras poliesportivas, tênis e beach tennis', icone: '🎾' },
    { _type: 'object', _key: key(), titulo: 'Academias Modernas', descricao: 'Academias completas distribuídas pelos condomínios', icone: '💪' },
    { _type: 'object', _key: key(), titulo: 'Área Comercial', descricao: 'Restaurantes, farmácias e serviços internos', icone: '🛍️' },
    { _type: 'object', _key: key(), titulo: 'Escola e Creche', descricao: 'Equipamentos educacionais dentro do bairro', icone: '📚' },
    { _type: 'object', _key: key(), titulo: 'Ciclovias', descricao: 'Malha de ciclovias integrada ao parque e ao entorno', icone: '🚲' },
  ],

  porQueMorar: [
    block('Ilha Pura: O Legado Olímpico que Virou o Bairro Mais Cobiçado da Barra', 'h2'),
    block(
      'Construída para os Jogos Olímpicos Rio 2016 como a Vila dos Atletas, a Ilha Pura foi projetada do zero com os mais altos padrões urbanísticos internacionais. Após as olimpíadas, a Carvalho Hosken transformou o legado em um condomínio-bairro de uso misto com 31 condomínios residenciais, área verde generosa e infraestrutura completa — tudo cercado por segurança perimetral 24 horas.',
    ),
    block('Natureza e Urbanismo Integrados', 'h3'),
    block(
      'Com 72.000 m² de parque central, lagoas ornamentais e trilhas para caminhada, a Ilha Pura oferece a experiência rara de viver em meio à natureza sem abrir mão da Barra da Tijuca ao redor. As ruas internas são arborizadas, o trânsito de veículos é controlado e o pedestre é o protagonista — um modelo de urbanismo raramente encontrado no Rio de Janeiro.',
    ),
    block('Infraestrutura e Serviços Completos', 'h3'),
    block(
      'O bairro conta com área comercial própria, escola, creche, academias, piscinas olímpicas, quadras poliesportivas e ciclovia. Tudo que uma família precisa no dia a dia está dentro dos muros. A localização privilegiada no coração da Barra da Tijuca garante fácil acesso à Linha Amarela, ao Recreio dos Bandeirantes e às principais vias expressas.',
    ),
    block('Mercado Imobiliário em Alta Valorização', 'h3'),
    block(
      'Os apartamentos da Ilha Pura variam de studios funcionais a unidades de 3 e 4 quartos com suíte. O mercado de revenda mantém valorização consistente desde a entrega em 2016. O perfil de compradores é diversificado: famílias que buscam segurança e lazer, profissionais que trabalham na Barra, e investidores que aproveitam a alta demanda por locações de curta e longa temporada.',
    ),
    block('Para Quem é a Ilha Pura?', 'h3'),
    block(
      'A Ilha Pura é ideal para famílias com crianças que valorizam segurança e áreas de lazer ao ar livre, para casais que querem conforto urbano sem abrir mão da qualidade de vida, e para investidores que buscam um produto imobiliário com histórico olímpico e alta liquidez na Barra da Tijuca.',
    ),
  ],

  descricao:
    'Ilha Pura é um bairro planejado na Barra da Tijuca, Rio de Janeiro, desenvolvido pela Carvalho Hosken como Vila dos Atletas para os Jogos Olímpicos 2016. Com 720.000 m² de área total, 72.000 m² de parque, 31 condomínios residenciais e segurança perimetral, é o empreendimento residencial mais exclusivo da Zona Oeste carioca.',

  faixaPreco: {
    min: 650000,
    max: 3500000,
    tipoPredominante: 'Apartamentos de 1 a 4 quartos em condomínio fechado',
  },

  caracteristicas: [
    'bairro planejado',
    'legado olímpico',
    'condomínio fechado',
    'segurança 24h',
    'parque privativo',
    'piscina olímpica',
    'Barra da Tijuca',
    'alto padrão',
    'pet friendly',
    'ciclovia',
    'área verde',
    'infraestrutura completa',
  ],

  faqs: [
    {
      _type: 'object',
      _key: key(),
      pergunta: 'O que é a Ilha Pura?',
      resposta:
        'A Ilha Pura é um bairro planejado fechado localizado na Barra da Tijuca, Rio de Janeiro. Foi construída pela incorporadora Carvalho Hosken para servir como Vila dos Atletas durante os Jogos Olímpicos de 2016. Após o evento, foi convertida em um condomínio-bairro residencial de alto padrão com 31 condomínios, aproximadamente 3.600 apartamentos, 72.000 m² de área verde, piscinas olímpicas, quadras, academia e área comercial própria.',
    },
    {
      _type: 'object',
      _key: key(),
      pergunta: 'Qual o preço dos imóveis na Ilha Pura?',
      resposta:
        'Os apartamentos na Ilha Pura variam entre R$ 650.000 e R$ 3.500.000 dependendo do tamanho, andar e condomínio específico. Os studios e apartamentos de 1 quarto são os mais acessíveis, enquanto os de 3 e 4 quartos com suíte atingem valores mais elevados. O mercado de revenda é ativo e com valorização consistente desde a entrega em 2016.',
    },
    {
      _type: 'object',
      _key: key(),
      pergunta: 'A Ilha Pura tem escola e comércio?',
      resposta:
        'Sim. O bairro conta com equipamentos educacionais (escola e creche), área comercial com restaurantes, farmácia e serviços essenciais. Há também a proximidade de grandes centros comerciais da Barra da Tijuca, como o BarraShopping, Via Parque e Américas Shopping, todos a menos de 10 minutos de carro.',
    },
    {
      _type: 'object',
      _key: key(),
      pergunta: 'Como é a segurança na Ilha Pura?',
      resposta:
        'A Ilha Pura possui segurança perimetral 24 horas com controle de acesso rigoroso em todas as entradas. O bairro é completamente murado e monitorado por câmeras. Cada condomínio interno possui sua própria portaria, criando uma dupla barreira de segurança. É considerada uma das áreas residenciais mais seguras do Rio de Janeiro.',
    },
    {
      _type: 'object',
      _key: key(),
      pergunta: 'A Ilha Pura fica perto de qual praia?',
      resposta:
        'A Ilha Pura está localizada na Barra da Tijuca, a aproximadamente 5 km da Praia da Barra da Tijuca e a 3 km da Praia do Recreio dos Bandeirantes. Embora não seja frente-mar, o acesso às praias é rápido e o bairro compensa com seu parque interno de 72.000 m².',
    },
    {
      _type: 'object',
      _key: key(),
      pergunta: 'Vale a pena investir em imóvel na Ilha Pura?',
      resposta:
        'Sim. A Ilha Pura apresenta alta liquidez no mercado de revenda e locação, impulsionada pelo legado olímpico, pela infraestrutura completa e pela localização estratégica na Barra da Tijuca. A demanda por locação de curta temporada é elevada, especialmente de executivos e expatriados. A valorização histórica desde 2016 é consistente, tornando o bairro referência de qualidade de vida e investimento na Zona Oeste carioca.',
    },
  ],

  geo: { lat: -23.0094, lng: -43.3628 },

  pontosDeInteresse: [
    { _type: 'object', _key: key(), nome: 'Parque Central Ilha Pura', categoria: 'lazer', lat: -23.0094, lng: -43.3628 },
    { _type: 'object', _key: key(), nome: 'BarraShopping', categoria: 'shopping', lat: -23.0066, lng: -43.3218 },
    { _type: 'object', _key: key(), nome: 'Praia da Barra da Tijuca', categoria: 'praia', lat: -23.0111, lng: -43.3073 },
    { _type: 'object', _key: key(), nome: 'Hospital Barra D\'Or', categoria: 'saude', lat: -23.0061, lng: -43.3205 },
    { _type: 'object', _key: key(), nome: 'Colégio Andrews', categoria: 'educacao', lat: -23.0094, lng: -43.345 },
    { _type: 'object', _key: key(), nome: 'Recreio Shopping', categoria: 'shopping', lat: -23.0143, lng: -43.4512 },
  ],
}

console.log('⏳ Criando bairro Ilha Pura no Sanity...')

try {
  const result = await client.createOrReplace(doc)
  console.log('✅ Bairro criado com sucesso!')
  console.log(`   ID: ${result._id}`)
  console.log(`   Slug: ${result.slug?.current}`)
  console.log(`   URL: https://admirata.com.br/bairros/ilha-pura`)
} catch (err) {
  console.error('❌ Erro:', err.message)
  process.exit(1)
}
