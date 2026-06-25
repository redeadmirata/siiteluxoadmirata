// scripts/create-endless-peninsula-edsa.mjs
// Upload das imagens chave + criação do condomínio Endless Península by Edsa
// Rode: node scripts/create-endless-peninsula-edsa.mjs
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

const DRIVE = join(__dirname, '..', 'drive-imagens', 'Cyrela', 'lançamentos',
  'Endless Península by Edsa _ Imóveis Barra da Tijuca, RJ _ Cyrela')

// ─── Imagens selecionadas (nome do arquivo → legenda) ──────────────────────
const IMAGES = [
  // Capa / Hero
  { file: 'imgi_8_Ilustração Artística - Piscinas%2C solário e deck molhado (3)_0.jpg',        label: 'Piscinas, solário e deck molhado — Endless Península', capa: true },
  { file: 'imgi_193_Ilustração Artística - Vista Aérea Do Park Design By Edsa_4.jpg.webp',     label: 'Vista aérea — Park Design by Edsa' },
  { file: 'imgi_54_Fotomontagem das fachadas com vista para Lagoa.webp',                        label: 'Fachadas com vista para a Lagoa de Jacarepaguá' },
  // Lazer
  { file: 'imgi_11_Ilustração Artística - Piscina recreativa e solário_0.jpg.webp',             label: 'Piscina recreativa e solário' },
  { file: 'imgi_17_Ilustração Artística - Piscina recreativa com raia 25m_0.webp',              label: 'Piscina com raia de 25m' },
  { file: 'imgi_27_Ilustração Artística - Piscina indoor Climatizada de 25M_0.webp',            label: 'Piscina indoor climatizada de 25m' },
  { file: 'imgi_32_Ilustração Artística - Piscina com água salgada_0.webp',                     label: 'Piscina com água salgada' },
  { file: 'imgi_16_Ilustração Artística - Vista aérea do lazer (2)_0.webp',                     label: 'Vista aérea do lazer' },
  { file: 'imgi_51_Ilustração Artística - Beach Tennis.webp',                                   label: 'Beach Tennis' },
  { file: 'imgi_21_Ilustração Artística - Quadra recreativa com arquibancada_0.webp',           label: 'Quadra recreativa com arquibancada' },
  { file: 'imgi_26_Ilustração Artística - Fitness (2)_0.webp',                                  label: 'Fitness' },
  { file: 'imgi_25_Ilustração Artística - Sauna úmida_0.webp',                                  label: 'Sauna úmida' },
  { file: 'imgi_36_Ilustração Artística - Espaço gourmet_0.webp',                               label: 'Espaço gourmet' },
  { file: 'imgi_39_Ilustração Artística - Endless bar_0.webp',                                  label: 'Endless bar' },
  { file: 'imgi_23_Ilustração Artística - Playground_0.webp',                                   label: 'Playground' },
  { file: 'imgi_53_Ilustração Artística - Coworking.webp',                                      label: 'Coworking' },
  // Apartamentos
  { file: 'imgi_42_Ilustração Artística - Apartamento 1409 do ed. Parque - Sala.webp',          label: 'Ed. Parque — Apartamento sala' },
  { file: 'imgi_47_Ilustração Artística - Apartamento 1308 do ed. Reserva - Sala.webp',         label: 'Ed. Reserva — Apartamento sala' },
  { file: 'imgi_49_Ilustração Artística - Apartamento 1503 do ed. Lagoa - Sala.webp',           label: 'Ed. Lagoa — Apartamento sala' },
  { file: 'imgi_50_Ilustração Artística - Apartamento 1503 do ed. Lagoa - Suíte.webp',          label: 'Ed. Lagoa — Suíte' },
  { file: 'imgi_46_Ilustração Artística - Cobertura linear 1801 do ed. Lagoa - Terraço (2).webp', label: 'Cobertura linear — Terraço' },
  // Fachada
  { file: 'imgi_34_Ilustração Artística - Fachada do edifício Pedra da Gávea _0.webp',          label: 'Fachada Ed. Pedra da Gávea' },
  { file: 'imgi_48_Ilustração Artística - Acessos e guarita.webp',                              label: 'Acessos e guarita' },
  { file: 'imgi_28_Ilustração Artística - Lobby do edifício Pedra da Gávea_0.webp',             label: 'Lobby Ed. Pedra da Gávea' },
]

async function uploadImage(filename, label) {
  const filePath = join(DRIVE, filename)
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ Não encontrado: ${filename}`)
    return null
  }
  process.stdout.write(`  ↑ ${label}… `)
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename: label })
  console.log(`✓ ${asset._id}`)
  return asset._id
}

async function run() {
  console.log('\n🏗  Endless Península by Edsa — upload de imagens + criação do condomínio\n')

  // ── Upload todas as imagens ──────────────────────────────────────────────
  const uploaded = []
  let capaId = null

  for (const img of IMAGES) {
    const assetId = await uploadImage(img.file, img.label)
    if (!assetId) continue
    if (img.capa) capaId = assetId
    uploaded.push({ assetId, label: img.label })
  }

  console.log(`\n✅ ${uploaded.length} imagens enviadas ao Sanity CDN\n`)

  // ── Galeria ──────────────────────────────────────────────────────────────
  const galeria = uploaded.map(({ assetId, label }) => ({
    _type: 'image',
    _key: key(),
    asset: { _type: 'reference', _ref: assetId },
    alt: label,
  }))

  // ── Documento condomínio ─────────────────────────────────────────────────
  const doc = {
    _type: 'condominio',
    _id:   'condominio-endless-peninsula-edsa',
    nome:  'Endless Península by Edsa',
    slug:  { _type: 'slug', current: 'endless-peninsula-edsa' },
    bairro: { _type: 'reference', _ref: 'bairro-peninsula' },

    tipo: 'condominio-fechado',
    construtora: 'Cyrela RJZ',
    status: 'Lançamento',
    prazoEntrega: '2028',
    ordem: 1,

    areaPrivativaMin: 70,
    areaPrivativaMax: 550,
    tipologiasDisponiveis: ['2-quartos', '3-quartos', '4-quartos', 'cobertura'],

    infraestrutura: [
      'Piscina recreativa com solário',
      'Piscina com raia de 25m',
      'Piscina indoor climatizada 25m',
      'Piscina com água salgada',
      'Deck molhado',
      'Beach Tennis',
      'Quadra recreativa com arquibancada',
      'Fitness completo',
      'Sauna úmida',
      'Spa',
      'Espaço gourmet',
      'Endless bar',
      'Salão de festas',
      'Playground',
      'Brinquedoteca',
      'Coworking',
      'Espaço multiuso',
      'Churrasqueira',
      'Vista para Lagoa de Jacarepaguá',
      'Paisagismo Edsa',
      'Guarita com controle de acesso',
    ],

    sobre: [
      block('Endless Península by Edsa: O Novo Ícone da Barra da Tijuca', 'h2'),
      block(
        'O Endless Península by Edsa é o mais aguardado lançamento da Cyrela RJZ no bairro planejado Península, na Barra da Tijuca. Com paisagismo assinado pela Edsa — renomado escritório australiano responsável pelos maiores resorts do mundo —, o empreendimento entrega uma experiência de resort permanente às margens da Lagoa de Jacarepaguá.',
      ),
      block('Quatro Edifícios, Uma Experiência Única', 'h3'),
      block(
        'O empreendimento é composto por quatro torres: Ed. Parque, Ed. Lagoa, Ed. Pedra da Gávea e Ed. Reserva. Cada edifício tem caráter próprio e compartilha uma área de lazer integrada de mais de 20.000 m², com piscinas de diferentes propostas, beach tennis, quadra recreativa com arquibancada e o exclusivo Endless Bar.',
      ),
      block('Tipologias para Todos os Perfis de Alto Padrão', 'h3'),
      block(
        'Apartamentos de 2 e 3 quartos com 70 a 131 m², coberturas lineares e dúplex de até 550 m² com terraços privativos. Todas as unidades com acabamento de alto padrão, suítes amplas e vistas privilegiadas para a lagoa ou para o Park Design by Edsa.',
      ),
      block('Localização: O Coração da Península', 'h3'),
      block(
        'Situado dentro do bairro planejado Península, com acesso pela Avenida das Américas, o Endless combina a tranquilidade do condomínio-bairro com a praticidade de estar a minutos do BarraShopping, escolas internacionais, restaurantes e da Praia da Barra da Tijuca.',
      ),
    ],

    faqs: [
      {
        _type: 'object', _key: key(),
        pergunta: 'O que é o Endless Península by Edsa?',
        resposta: 'É um condomínio de alto padrão da Cyrela RJZ, localizado no bairro planejado Península, Barra da Tijuca, com paisagismo assinado pela Edsa e área de lazer completa.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'Quantas torres tem o Endless Península?',
        resposta: 'São quatro edifícios: Ed. Parque, Ed. Lagoa, Ed. Pedra da Gávea e Ed. Reserva, cada um com características e vistas distintas.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'Quais tipologias estão disponíveis no Endless Península?',
        resposta: 'Apartamentos de 2 quartos (70 m²), 3 quartos (90 m²), 4 quartos (118 a 131 m²), coberturas lineares e dúplex com terraços de até 550 m².',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'Qual é a previsão de entrega do Endless Península?',
        resposta: 'A previsão de entrega é 2028, conforme cronograma da Cyrela RJZ.',
      },
      {
        _type: 'object', _key: key(),
        pergunta: 'O Endless fica dentro do bairro planejado Península?',
        resposta: 'Sim, o Endless Península está localizado dentro do bairro planejado Península, na Barra da Tijuca, com acesso pela Av. das Américas e segurança perimetral do bairro.',
      },
    ],

    seo: {
      titulo: 'Endless Península by Edsa — Apartamentos e Coberturas na Barra da Tijuca | Admirata',
      descricao: 'Conheça o Endless Península by Edsa, lançamento da Cyrela RJZ na Barra da Tijuca. Paisagismo Edsa, 4 torres, apartamentos de 2 a 4 quartos e coberturas. Consulte a Admirata.',
    },

    ...(capaId && {
      fotoCapa: { _type: 'image', asset: { _type: 'reference', _ref: capaId } },
    }),
    ...(galeria.length > 0 && { galeria }),
  }

  console.log('📝 Criando/atualizando condomínio no Sanity…')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Condomínio criado: ${result._id}`)
  console.log('\n👉 URL no site: /imoveis/peninsula/endless-peninsula-edsa')
  console.log('👉 Sanity Studio: https://admirata.sanity.studio/structure/condominio\n')
}

run().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
