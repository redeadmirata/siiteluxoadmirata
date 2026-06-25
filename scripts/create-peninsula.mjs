// scripts/create-peninsula.mjs
// Cria o bairro planejado Península no Sanity + upload da fotoCapa
// Rode: node scripts/create-peninsula.mjs
import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_TOKEN ||
    'sk6bBO33OUJvdTqs2VBwjZt5mcgHUk44h6PKfWwAXujxRfhjjV2Lq2Y2ssgvzWrfd162TtXmyrbcHKyXX0TFput7QAAVUsqtdR4ckSlaOnTacGxPC5LHyyq1gEbKrCAD9l4A1y5WzjQy815SswnnvWTbkklFDdmJAEUjHDcXKudeTLuRtlYf',
  useCdn: false,
})

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

// ─── Upload imagem helper ───────────────────────────────────────────────────
async function uploadImage(filePath, label) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ Arquivo não encontrado: ${filePath}`)
    return null
  }
  console.log(`  ↑ Upload: ${label}`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: label,
  })
  console.log(`  ✓ ${label} → ${asset._id}`)
  return asset._id
}

// ─── Imagens da pasta Endless Península (proxy para fotoCapa/fotoAerea) ──────
const DRIVE = join(__dirname, '..', 'drive-imagens', 'Cyrela', 'lançamentos',
  'Endless Península by Edsa _ Imóveis Barra da Tijuca, RJ _ Cyrela')

async function run() {
  console.log('\n🏗  Criando bairro planejado: Península\n')

  // ── Capa: foto aérea geral do bairro ────────────────────────────────────
  const capaPath   = join(DRIVE, 'imgi_226_Peninsula-Barra.jpg')
  const aeriaPath  = join(DRIVE, 'imgi_193_Ilustração Artística - Vista Aérea Do Park Design By Edsa_4.jpg.webp')

  const capaId  = await uploadImage(capaPath,  'Peninsula-Barra-capa.jpg')
  const aeriaId = await uploadImage(aeriaPath, 'Peninsula-vista-aerea.webp')

  // ── Documento ────────────────────────────────────────────────────────────
  const doc = {
    _type: 'bairro',
    _id:   'bairro-peninsula',
    nome:  'Península',
    slug:  { _type: 'slug', current: 'peninsula' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
    regiao: 'Barra da Tijuca',
    zona:   'oeste',
    ordem:  8,
    bairroplanejado: true,
    incorporadora: 'Carvalho Hosken',
    areaTotal: 500000,
    anoInauguracao: 1999,

    introTexto:
      'A Península é o bairro planejado mais antigo e consolidado da Barra da Tijuca — 500.000 m² às margens da Lagoa de Jacarepaguá com arquitetura integrada à natureza, segurança perimetral total e os empreendimentos mais exclusivos do Rio de Janeiro.',

    descricao:
      'Bairro planejado na Barra da Tijuca desenvolvido pela Carvalho Hosken, a Península reúne alguns dos mais exclusivos condomínios do Rio de Janeiro às margens da Lagoa de Jacarepaguá. Com 500.000 m² de área total, infraestrutura completa, segurança 24h e fácil acesso às principais vias da cidade, é o endereço de alto padrão mais cobiçado da Zona Oeste carioca.',

    amenidades: [
      { _type: 'object', _key: key(), titulo: 'Às margens da Lagoa', descricao: 'Vista privilegiada para a Lagoa de Jacarepaguá', icone: '🌊' },
      { _type: 'object', _key: key(), titulo: 'Segurança perimetral', descricao: 'Controle de acesso 24h com câmeras e rondas', icone: '🔒' },
      { _type: 'object', _key: key(), titulo: 'Natureza preservada', descricao: 'Extensa área verde integrada ao ecossistema da lagoa', icone: '🌿' },
      { _type: 'object', _key: key(), titulo: 'Localização estratégica', descricao: 'Acesso direto à Av. das Américas e Linha Amarela', icone: '🗺️' },
      { _type: 'object', _key: key(), titulo: 'Empreendimentos exclusivos', descricao: 'Cyrela, Carvalho Hosken e outros grandes players', icone: '🏛️' },
      { _type: 'object', _key: key(), titulo: 'Beach tennis e esportes', descricao: 'Quadras e áreas esportivas de alto nível', icone: '🎾' },
    ],

    porQueMorar: [
      block('Península: O Endereço Mais Exclusivo da Barra da Tijuca', 'h2'),
      block(
        'Desenvolvida pela Carvalho Hosken às margens da Lagoa de Jacarepaguá, a Península é o bairro planejado pioneiro da Barra da Tijuca — um projeto urbano que combina natureza exuberante, segurança total e os empreendimentos residenciais mais sofisticados do Rio de Janeiro.',
      ),
      block('Uma Paisagem Única no Rio de Janeiro', 'h3'),
      block(
        'Localizada entre a Lagoa de Jacarepaguá e a Pedra da Gávea, a Península oferece vistas panorâmicas incomparáveis. Cada condomínio foi projetado para integrar a arquitetura à paisagem natural, com áreas de lazer voltadas para a lagoa e preservação da mata ciliar.',
      ),
      block('Infraestrutura e Valorização Contínua', 'h3'),
      block(
        'A Península é referência em valorização imobiliária na Barra da Tijuca. Com acesso privilegiado à Av. das Américas, à Linha Amarela e ao BarraShopping, o bairro concentra os mais novos lançamentos de luxo do Rio de Janeiro — como o Endless Península by Edsa, da Cyrela RJZ.',
      ),
      block('Para Quem é a Península?', 'h3'),
      block(
        'Famílias que buscam segurança e qualidade de vida no coração da Barra, profissionais de alta renda que valorizam privacidade e natureza, e investidores que enxergam na Península um ativo imobiliário com histórico de valorização consistente.',
      ),
    ],

    faqs: [
      {
        _type: 'object',
        _key: key(),
        pergunta: 'Onde fica o bairro planejado Península?',
        resposta: 'A Península está localizada na Barra da Tijuca, Rio de Janeiro, às margens da Lagoa de Jacarepaguá, com acesso pela Avenida das Américas.',
      },
      {
        _type: 'object',
        _key: key(),
        pergunta: 'Quem desenvolveu o bairro Península?',
        resposta: 'O bairro foi desenvolvido pela Carvalho Hosken, uma das maiores incorporadoras do Rio de Janeiro, responsável por empreendimentos como a Ilha Pura.',
      },
      {
        _type: 'object',
        _key: key(),
        pergunta: 'Quais são os lançamentos disponíveis na Península?',
        resposta: 'O principal lançamento atual é o Endless Península by Edsa, da Cyrela RJZ, com apartamentos de 2 a 4 quartos e coberturas, projeto paisagístico assinado pela Edsa.',
      },
      {
        _type: 'object',
        _key: key(),
        pergunta: 'Como chegar à Península na Barra da Tijuca?',
        resposta: 'O acesso principal é pela Avenida das Américas, com entrada sinalizada próxima ao BarraShopping. Também há acesso pela Linha Amarela.',
      },
    ],

    metaTitle: 'Bairro Planejado Península — Barra da Tijuca, Rio de Janeiro | Admirata',
    metaDescription: 'Conheça a Península, o bairro planejado mais exclusivo da Barra da Tijuca. Às margens da Lagoa de Jacarepaguá, com segurança total e os melhores lançamentos do Rio.',

    ...(capaId  && { fotoCapa:  { _type: 'image', asset: { _type: 'reference', _ref: capaId  } } }),
    ...(aeriaId && { fotoAerea: { _type: 'image', asset: { _type: 'reference', _ref: aeriaId } } }),
  }

  console.log('\n📝 Criando/atualizando documento bairro-peninsula…')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Bairro planejado criado: ${result._id}`)
  console.log('\n👉 Acesse o Sanity Studio para revisar: https://admirata.sanity.studio/structure/bairro\n')
}

run().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
