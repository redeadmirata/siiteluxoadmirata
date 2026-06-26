// scripts/create-imovel-verdant-valley-b4-102.mjs
// Cria imóvel: Bloco 4, Apt 102 — Verdant Valley Residence
// Pré-requisito: apt-fotos-urls.txt na pasta Downloads (gerado pelo Chrome)
// Rode: node scripts/create-imovel-verdant-valley-b4-102.mjs

import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import os from 'os'

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_TOKEN ||
    'sk6bBO33OUJvdTqs2VBwjZt5mcgHUk44h6PKfWwAXujxRfhjjV2Lq2Y2ssgvzWrfd162TtXmyrbcHKyXX0TFput7QAAVUsqtdR4ckSlaOnTacGxPC5LHyyq1gEbKrCAD9l4A1y5WzjQy815SswnnvWTbkklFDdmJAEUjHDcXKudeTLuRtlYf',
  useCdn: false,
})

// ── Ler URLs das fotos ────────────────────────────────────────────────────────
// O arquivo foi gerado pelo Chrome visitando o álbum do Google Photos
const URL_FILE = join(os.homedir(), 'Downloads', 'apt-fotos-urls.txt')

if (!existsSync(URL_FILE)) {
  console.error(`\n❌ Arquivo não encontrado: ${URL_FILE}`)
  console.error('   Abra o álbum do Google Photos no Chrome e execute o script de extração.')
  process.exit(1)
}

const FOTO_URLS = readFileSync(URL_FILE, 'utf8')
  .trim()
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)

console.log(`\n📷 ${FOTO_URLS.length} URLs de foto carregadas de ${URL_FILE}`)

// ── Alttext para cada foto (pelo índice) ──────────────────────────────────────
const ALT_TEXTS = [
  'Apt 102 B4 — sala de estar com porcelanato',
  'Apt 102 B4 — sala de jantar',
  'Apt 102 B4 — varanda com cortina de vidro',
  'Apt 102 B4 — cozinha planejada',
  'Apt 102 B4 — cozinha com cooktop e armários',
  'Apt 102 B4 — área de serviço',
  'Apt 102 B4 — quarto suíte',
  'Apt 102 B4 — suíte com armário embutido e split',
  'Apt 102 B4 — banheiro suíte',
  'Apt 102 B4 — quarto 2',
  'Apt 102 B4 — quarto 3',
  'Apt 102 B4 — banheiro social',
  'Apt 102 B4 — corredor',
  'Apt 102 B4 — detalhe acabamento',
  'Apt 102 B4 — vista do apartamento',
  'Grand Club Verdant — área de lazer',
  'Grand Club Verdant — piscina',
  'Grand Club Verdant — deck',
  'Grand Club Verdant — academia',
  'Grand Club Verdant — espaço gourmet',
  'Grand Club Verdant — salão de festas',
  'Grand Club Verdant — área verde',
  'Verdant Valley Residence — fachada',
  'Verdant Valley Residence — portaria',
  'Verdant Valley Residence — circulação',
  'Verdant Valley Residence — estacionamento',
  'Verdant Valley Residence — vista aérea',
  'Verdant Valley Residence — áreas comuns',
  'Verdant Valley Residence — paisagismo',
  'Verdant Valley Residence — condomínio',
]

// ── Upload de foto via URL (Google Photos → Sanity CDN) ───────────────────────
async function uploadFromUrl(photoUrl, alt, index) {
  process.stdout.write(`  [${index + 1}/${FOTO_URLS.length}] ${alt.slice(0, 50)}… `)
  try {
    const res = await fetch(photoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Referer': 'https://photos.google.com/',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename: `verdant-b4-102-${index + 1}.jpg`,
      contentType: 'image/jpeg',
    })
    console.log(`✓ ${asset._id}`)
    return asset._id
  } catch (err) {
    console.log(`⚠ Falha: ${err.message}`)
    return null
  }
}

async function run() {
  console.log('\n🏠 Imóvel: Bloco 4, Apt 102 — Verdant Valley Residence\n')

  // ── 1. Verificar bairro e condomínio ─────────────────────────────────────
  console.log('🔍 Verificando bairro e condomínio no Sanity…')

  const [bairro, condo] = await Promise.all([
    client.fetch('*[_type=="bairro" && slug.current=="camorim"][0]{_id}'),
    client.fetch('*[_type=="condominio" && slug.current=="verdant-valley"][0]{_id}'),
  ])

  if (!bairro) {
    console.error('❌ Bairro Camorim não encontrado. Rode primeiro: node scripts/create-verdant-valley.mjs')
    process.exit(1)
  }
  if (!condo) {
    console.error('❌ Condomínio Verdant Valley não encontrado. Rode primeiro: node scripts/create-verdant-valley.mjs')
    process.exit(1)
  }

  console.log(`   ✅ Bairro: ${bairro._id}`)
  console.log(`   ✅ Condomínio: ${condo._id}\n`)

  // ── 2. Upload das fotos ───────────────────────────────────────────────────
  console.log('📸 Upload das fotos para o Sanity CDN:')

  const uploadedAssets = []
  for (let i = 0; i < FOTO_URLS.length; i++) {
    const url = FOTO_URLS[i]
    const alt = ALT_TEXTS[i] ?? `Apt 102 B4 — foto ${i + 1}`
    const assetId = await uploadFromUrl(url, alt, i)
    if (assetId) uploadedAssets.push({ assetId, alt, principal: i === 0 })
  }

  console.log(`\n✅ ${uploadedAssets.length}/${FOTO_URLS.length} fotos enviadas\n`)

  // ── 3. Montar array de imagens ────────────────────────────────────────────
  const imagens = uploadedAssets.map(({ assetId, alt, principal }) => ({
    _key: key(),
    arquivo: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
      crop: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    alt,
    principal,
    tour360: false,
    isStaging: false,
  }))

  // ── 4. Documento do imóvel ────────────────────────────────────────────────
  const doc = {
    _type: 'imovel',
    _id:   'imovel-verdant-b4-apt102',

    titulo: 'Apartamento 3 Quartos com Varanda — Bloco 4, Verdant Valley',
    slug:   { _type: 'slug', current: 'verdant-valley-bloco4-apt102' },

    tipo:       'Apartamento',
    finalidade: 'Locação',
    mercado:    'Rio de Janeiro',
    status:     'Disponível',
    novidade:   true,
    exclusivo:  false,

    // ── Referências ──
    bairro:        { _type: 'reference', _ref: bairro._id },
    condominioRef: { _type: 'reference', _ref: condo._id },

    // ── Financeiro ──
    preco:      2900,   // aluguel mensal
    condominio: 1100,   // taxa aproximada

    // ── Características ──
    quartos:   3,
    suites:    1,
    banheiros: 2,
    vagas:     1,
    tipologia: '3-quartos',
    andar:     'Térreo',

    // ── Descrição ──
    descricaoPtBr: `Apartamento 3 quartos com 1 suíte no condomínio Verdant Valley Residence, Bloco 4, apartamento 102. Localizado no térreo, com acesso facilitado ao Grand Club de mais de 20.000 m².

O imóvel conta com acabamento em porcelanato, varanda com cortina de vidro, cozinha planejada com armários, fogão e cooktop, e suíte com armário embutido e ar-condicionado split.

Aluguel: R$ 2.900/mês | Condomínio: ~R$ 1.100/mês | Renda mínima exigida: R$ 11.000.

Garantias aceitas: seguro fiança, título de capitalização ou depósito caução.

O Verdant Valley Residence fica na Estrada de Camorim, 1.003, em Jacarepaguá — a 10 minutos do Recreio dos Bandeirantes e do RioCentro.`,

    // ── Características detalhadas ──
    caracteristicas: [
      { _key: key(), grupo: 'Acabamento', nome: 'Porcelanato' },
      { _key: key(), grupo: 'Acabamento', nome: 'Cozinha planejada' },
      { _key: key(), grupo: 'Acabamento', nome: 'Armários embutidos' },
      { _key: key(), grupo: 'Acabamento', nome: 'Cortina de vidro na varanda' },
      { _key: key(), grupo: 'Acabamento', nome: 'Ar-condicionado split' },
      { _key: key(), grupo: 'Lazer', nome: 'Grand Club 20.000 m²' },
      { _key: key(), grupo: 'Lazer', nome: 'Piscina adulto e infantil' },
      { _key: key(), grupo: 'Lazer', nome: 'Academia completa' },
      { _key: key(), grupo: 'Lazer', nome: 'Sauna' },
      { _key: key(), grupo: 'Lazer', nome: 'Quadra de esportes' },
      { _key: key(), grupo: 'Lazer', nome: 'Espaço gourmet' },
      { _key: key(), grupo: 'Lazer', nome: 'Salão de festas' },
      { _key: key(), grupo: 'Lazer', nome: 'Pet place' },
      { _key: key(), grupo: 'Lazer', nome: 'Playground' },
      { _key: key(), grupo: 'Segurança', nome: 'Portaria 24h' },
      { _key: key(), grupo: 'Segurança', nome: 'CFTV' },
      { _key: key(), grupo: 'Infraestrutura', nome: '1 vaga de garagem' },
      { _key: key(), grupo: 'Arquitetura', nome: 'Varanda' },
      { _key: key(), grupo: 'Arquitetura', nome: 'Andar térreo' },
    ],

    // ── Vídeo do condomínio ──
    videoUrl: 'https://youtu.be/DjsSZQZPbz4',

    // ── SEO ──
    seo: {
      metaTitle: 'Apt 3 Quartos para Alugar em Camorim — Verdant Valley | Admirata',
      metaDescription:
        'Apartamento 3 quartos com suíte e varanda no Verdant Valley, Camorim. R$ 2.900/mês. Grand Club 20.000 m². Consulte a Admirata.',
    },

    publicadoEm: new Date().toISOString(),

    ...(imagens.length > 0 && { imagens }),
  }

  // ── 5. Criar no Sanity ────────────────────────────────────────────────────
  console.log('📝 Criando imóvel no Sanity…')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Imóvel criado: ${result._id}`)
  console.log('\n👉 URL no site: /imoveis/locacao/camorim')
  console.log('👉 Sanity Studio: https://admirata.com.br/studio\n')
}

run().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
