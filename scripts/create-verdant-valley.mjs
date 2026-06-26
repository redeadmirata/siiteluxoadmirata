// scripts/create-verdant-valley.mjs
// Cria bairro Camorim (se não existir) + condomínio Verdant Valley Residence
// Rode: node scripts/create-verdant-valley.mjs
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

const DRIVE = join(__dirname, '..', 'drive-imagens', 'Verdant Valley')
const CLUBE = join(DRIVE, 'Fotos Clube')

// ─── Imagens raiz (renders / marketing) ──────────────────────────────────────
const IMGS_RAIZ = [
  { file: '752x488-26-11-2019-14-22-31-158-verdant-valley-residence.jpg', label: 'Verdant Valley Residence — fachada', capa: true },
  { file: '04306e04469a6efe669ff5e7c7c0c8cc.jpg', label: 'Verdant Valley — área de lazer' },
  { file: '40588a3cb21218b87960dde54f30dce6.jpg', label: 'Verdant Valley — piscina' },
  { file: '7895f4610d6900291d01fa08c5f64a87.jpg', label: 'Verdant Valley — área verde' },
  { file: 'a8dddfb21bd64f9e73f8d87046424a3a.jpg', label: 'Verdant Valley — club' },
  { file: 'bf7a0774c7b1a235b9e3b1cb11e510e3.jpg', label: 'Verdant Valley — espaço gourmet' },
  { file: 'spa.jpg',                              label: 'Verdant Valley — spa' },
]

// ─── Seleção das Fotos Clube (sem duplicatas " - Copia") ─────────────────────
const IMGS_CLUBE = [
  { file: '20240416_110410.jpg', label: 'Grand Club Verdant — entrada' },
  { file: '20240416_111159.jpg', label: 'Grand Club Verdant — piscina principal' },
  { file: '20240416_111219.jpg', label: 'Grand Club Verdant — deck molhado' },
  { file: '20240416_111249.jpg', label: 'Grand Club Verdant — solário' },
  { file: '20240416_111321.jpg', label: 'Grand Club Verdant — área verde' },
  { file: '20240416_111325.jpg', label: 'Grand Club Verdant — playground' },
  { file: '20240416_111847.jpg', label: 'Grand Club Verdant — piscina recreativa' },
  { file: '20240416_111945.jpg', label: 'Grand Club Verdant — quadra' },
  { file: '20240416_112000.jpg', label: 'Grand Club Verdant — academia' },
  { file: '20240416_112016.jpg', label: 'Grand Club Verdant — fitness' },
  { file: '20240416_112036.jpg', label: 'Grand Club Verdant — espaço gourmet' },
  { file: '20240416_112100.jpg', label: 'Grand Club Verdant — salão de festas' },
  { file: '20240416_112133.jpg', label: 'Grand Club Verdant — sauna' },
  { file: '20240416_112144.jpg', label: 'Grand Club Verdant — sala de jogos' },
  { file: '20240416_112245.jpg', label: 'Grand Club Verdant — espaço cinema' },
  { file: '20240416_112356.jpg', label: 'Grand Club Verdant — espaço pub' },
  { file: '20240416_112522.jpg', label: 'Grand Club Verdant — praça living' },
  { file: '20240416_112601.jpg', label: 'Grand Club Verdant — pomar' },
  { file: '20240416_112648.jpg', label: 'Grand Club Verdant — bicicletário' },
  { file: '20240416_113853.jpg', label: 'Grand Club Verdant — pet place' },
]

async function uploadImage(filePath, label) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ Não encontrado: ${filePath}`)
    return null
  }
  process.stdout.write(`  ↑ ${label}… `)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename: label })
  console.log(`✓ ${asset._id}`)
  return asset._id
}

async function run() {
  console.log('\n🏗  Verdant Valley Residence — criação no Sanity\n')

  // ── 1. Garantir bairro Camorim ───────────────────────────────────────────
  console.log('📍 Verificando bairro Camorim…')
  const bairroExistente = await client.fetch(
    '*[_type=="bairro" && slug.current=="camorim"][0]{_id}'
  )

  if (!bairroExistente) {
    console.log('   → Criando bairro Camorim…')
    await client.createOrReplace({
      _type: 'bairro',
      _id:   'bairro-camorim',
      nome:  'Camorim',
      slug:  { _type: 'slug', current: 'camorim' },
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      mercado: 'Rio de Janeiro',
      regiao: 'Jacarepaguá',
      zona:   'oeste',
      ordem:  20,
      introTexto:
        'Camorim é um bairro tranquilo de Jacarepaguá, cercado de natureza, com acesso privilegiado ao RioCentro, ao Recreio e à Barra da Tijuca — um dos endereços de maior valorização da Zona Oeste carioca.',
      descricao:
        'Localizado em Jacarepaguá, na Zona Oeste do Rio de Janeiro, o bairro de Camorim oferece qualidade de vida, verde e tranquilidade a poucos minutos do centro empresarial do RioCentro e da Praia do Recreio dos Bandeirantes. Com boa infraestrutura de transportes e serviços, é um dos bairros que mais valoriza na cidade.',
      metaTitle: 'Imóveis em Camorim — Jacarepaguá, Rio de Janeiro | Admirata',
      metaDescription:
        'Condomínios e apartamentos em Camorim, Jacarepaguá. Verde, tranquilidade e acesso ao Recreio e RioCentro. Portfólio exclusivo Admirata Imóveis.',
    })
    console.log('   ✅ Bairro Camorim criado (bairro-camorim)\n')
  } else {
    console.log(`   ✅ Bairro Camorim já existe (${bairroExistente._id})\n`)
  }

  const bairroId = bairroExistente?._id ?? 'bairro-camorim'

  // ── 2. Upload imagens raiz ────────────────────────────────────────────────
  console.log('📸 Upload imagens de marketing:')
  const uploadedRaiz = []
  let capaId = null

  for (const img of IMGS_RAIZ) {
    const filePath = join(DRIVE, img.file)
    const assetId = await uploadImage(filePath, img.label)
    if (!assetId) continue
    if (img.capa) capaId = assetId
    uploadedRaiz.push({ assetId, label: img.label })
  }

  // ── 3. Upload Fotos Clube ─────────────────────────────────────────────────
  console.log('\n📸 Upload Fotos Clube:')
  const uploadedClube = []

  for (const img of IMGS_CLUBE) {
    const filePath = join(CLUBE, img.file)
    const assetId = await uploadImage(filePath, img.label)
    if (!assetId) continue
    uploadedClube.push({ assetId, label: img.label })
  }

  const totalImgs = uploadedRaiz.length + uploadedClube.length
  console.log(`\n✅ ${totalImgs} imagens enviadas ao Sanity CDN\n`)

  // ── 4. Montar galeria ─────────────────────────────────────────────────────
  const galeria = [...uploadedRaiz, ...uploadedClube].map(({ assetId, label }) => ({
    _type: 'image',
    _key: key(),
    asset: { _type: 'reference', _ref: assetId },
    alt: label,
  }))

  // ── 5. Criar condomínio ───────────────────────────────────────────────────
  const doc = {
    _type: 'condominio',
    _id:   'condominio-verdant-valley',
    nome:  'Verdant Valley Residence',
    slug:  { _type: 'slug', current: 'verdant-valley' },
    bairro: { _type: 'reference', _ref: bairroId },

    tipo: 'condominio-fechado',
    construtora: 'Living Construtora',
    status: 'Pronto',
    anoEntrega: 2017,
    ordem: 1,

    areaPrivativaMin: 49,
    areaPrivativaMax: 63,
    tipologiasDisponiveis: ['2-quartos'],

    infraestrutura: [
      'Piscina adulto',
      'Piscina infantil',
      'Aquaplay',
      'Solário',
      'Academia completa',
      'Fitness ao ar livre',
      'Sauna',
      'Quadra de esportes',
      'Quadra de areia',
      'Quadra de tênis',
      'Salão de festas',
      'Espaço gourmet',
      'Espaço pub',
      'Espaço cinema',
      'Sala de jogos',
      'Brinquedoteca',
      'Playground',
      'Parquinho',
      'Praça living',
      'Bosque',
      'Pomar',
      'Paisagismo completo',
      'Espelho d\'água',
      'Lago decorativo',
      'Pet place',
      'Bicicletário',
      'Mini-market',
      'Portaria 24h',
      'Segurança 24h',
      'CFTV',
      'Elevador',
      'Wi-Fi nas áreas comuns',
      'Captação e reuso de água',
    ],

    sobre: [
      block('Verdant Valley Residence: Um Refúgio Verde em Camorim', 'h2'),
      block(
        'O Verdant Valley Residence é um condomínio de alto padrão localizado na Estrada de Camorim, 1003, em Jacarepaguá. Com projeto da Living Construtora, entregue em 2017, o empreendimento se destaca pelo Grand Club Verdant — uma área de lazer de mais de 20.000 m² que transforma o dia a dia dos moradores em experiência de resort.',
      ),
      block('Grand Club Verdant: Mais de 20.000 m² de Lazer', 'h3'),
      block(
        'O clube do condomínio é o coração do Verdant Valley: piscinas de adulto e infantil com aquaplay, academia completa, sauna, quadras de esportes, areia e tênis, salão de festas, espaço pub, espaço cinema, sala de jogos, brinquedoteca, praça living, bosque, pomar e pet place. Infraestrutura comparável à de grandes resorts urbanos, dentro de um condomínio residencial.',
      ),
      block('Localização: O Melhor de Dois Mundos', 'h3'),
      block(
        'Camorim oferece tranquilidade e verde sem abrir mão da conectividade. A poucos minutos do RioCentro — maior centro de convenções da América Latina —, do Recreio dos Bandeirantes e da Barra da Tijuca, o bairro é uma escolha estratégica para famílias e profissionais que buscam qualidade de vida na Zona Oeste do Rio.',
      ),
      block('Tipologias: Apartamentos 2 Quartos com Varanda', 'h3'),
      block(
        'Unidades de 49 a 63 m² com 2 quartos (sendo 1 suíte), varanda, 1 vaga de garagem e acabamento de alto padrão. Imóvel pronto para morar com toda a infraestrutura do Grand Club Verdant à sua disposição.',
      ),
    ],

    faqs: [
      {
        _type: 'object', _key: key(),
        pergunta: 'Onde fica o Verdant Valley Residence?',
        resposta: 'Na Estrada de Camorim, 1003, bairro Camorim, Jacarepaguá, Rio de Janeiro — CEP 22780-070. Próximo ao RioCentro e à Praia do Recreio.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'O Verdant Valley já está pronto?',
        resposta: 'Sim. O empreendimento foi entregue em 2017 pela Living Construtora e está pronto para morar.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'Quais são as tipologias do Verdant Valley?',
        resposta: 'Apartamentos de 2 quartos (1 suíte) com varanda, áreas de 49 a 63 m² e 1 vaga de garagem.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'O que é o Grand Club Verdant?',
        resposta: 'É a área de lazer do condomínio com mais de 20.000 m², incluindo piscinas, academia, sauna, quadras, salão de festas, espaço pub, cinema, sala de jogos, brinquedoteca, bosque, pomar e pet place.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'Qual é a distância do Verdant Valley ao Recreio e à Barra?',
        resposta: 'O condomínio fica a aproximadamente 10 minutos da Praia do Recreio dos Bandeirantes e 15 minutos da Barra da Tijuca, com fácil acesso pelas principais vias da Zona Oeste.',
      },
    ],

    seo: {
      titulo: 'Verdant Valley Residence — Apartamentos em Camorim, Jacarepaguá | Admirata',
      descricao: 'Conheça o Verdant Valley Residence em Camorim, Jacarepaguá. Apartamentos 2 quartos prontos, Grand Club com 20.000 m² de lazer. Consulte a Admirata.',
    },

    ...(capaId && {
      fotoCapa: { _type: 'image', asset: { _type: 'reference', _ref: capaId } },
    }),
    ...(galeria.length > 0 && { galeria }),
  }

  console.log('📝 Criando condomínio no Sanity…')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Condomínio criado: ${result._id}`)
  console.log('\n👉 URL no site: /imoveis/camorim/verdant-valley')
  console.log('👉 Sanity Studio: admirata.com.br/studio\n')
}

run().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
