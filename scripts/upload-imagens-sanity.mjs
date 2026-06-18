// scripts/upload-imagens-sanity.mjs
// Faz upload das imagens locais (drive-imagens/) para o Sanity Assets
// e popula o campo `galeria` + `fotoCapa` de cada condomínio.
// Rode: node scripts/upload-imagens-sanity.mjs
import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readdir } from 'fs/promises'
import { join, basename, extname } from 'path'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skqIL1rWOGnkDwVwghYYe8BjuR1wRITr9LRHsUouSG3j0qFBqfRwAZcTRpNbHVP7VBBKQTB9uvh9U3ROcKCOrwVNJ5xBf9K0xOJcEYhPH1DIEbtuxgyoDw3MIdZ7CFRpGXxORqydcKMMcIXozcm6IOhaYYBulMJiom2574rBRexH3hDBfqU0',
  useCdn: false,
})

// ─── Diretório base ───────────────────────────────────────────────────────────
const BASE = join(__dirname, '..', 'drive-imagens')

// ─── Extensões aceitas ────────────────────────────────────────────────────────
const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const isImage = (f) => IMG_EXTS.has(extname(f).toLowerCase())

// ─── Mapeia diretórios de imagens por condomínio ──────────────────────────────
// Estratégia: Fotos Lazer (prioritárias) + Apartamento Decorado (até 15 fotos)
const CONDOMINIOS = [
  {
    id: 'condominio-elos',
    nome: 'Elos',
    dirs: [
      // Fotos do lazer — todas (26)
      {
        path: join(BASE, 'Condomínio Elos-20260618T043955Z-3-001', 'Condomínio Elos', 'Fotos Lazer - Elos'),
        legenda: 'Lazer Elos',
        limit: 26,
      },
      // Decorado 2 quartos — 5 fotos
      {
        path: join(BASE, 'Condomínio Elos-20260618T043955Z-3-001', 'Condomínio Elos', 'FOTOS APARTAMENTOS DECORADOS', 'Decorado - 2 quartos 85m²'),
        legenda: 'Decorado 2 quartos 85m²',
        limit: 5,
      },
      // Decorado 3 quartos — 5 fotos
      {
        path: join(BASE, 'Condomínio Elos-20260618T043955Z-3-001', 'Condomínio Elos', 'FOTOS APARTAMENTOS DECORADOS', 'Decorado - 3 quartos 118m²'),
        legenda: 'Decorado 3 quartos 118m²',
        limit: 5,
      },
      // Decorado 4 quartos — 5 fotos
      {
        path: join(BASE, 'Condomínio Elos-20260618T043955Z-3-001', 'Condomínio Elos', 'FOTOS APARTAMENTOS DECORADOS', 'Decorado - 4 quartos 125m²'),
        legenda: 'Decorado 4 quartos 125m²',
        limit: 5,
      },
    ],
  },
  {
    id: 'condominio-millenio',
    nome: 'Millenio',
    dirs: [
      {
        path: join(BASE, 'Millenio', 'Condomínio Millenio', 'Fotos Lazer - Millenio'),
        legenda: 'Lazer Millenio',
        limit: 99,
      },
      {
        path: join(BASE, 'Millenio', 'Condomínio Millenio', 'Apartamento Decorado'),
        legenda: 'Apartamento Decorado',
        limit: 99,
      },
      {
        path: join(BASE, 'Millenio', 'Condomínio Millenio', 'Apartamento 1507 Chicago'),
        legenda: 'Apartamento 1507 Chicago',
        limit: 99,
      },
    ],
  },
  {
    id: 'condominio-saint-michel',
    nome: 'Saint Michel',
    dirs: [
      {
        path: join(BASE, 'Saint-Michel', 'Condomínio Saint Michel', 'Fotos Lazer - Saint Michel'),
        legenda: 'Lazer Saint Michel',
        limit: 99,
      },
      {
        path: join(BASE, 'Saint-Michel', 'Condomínio Saint Michel', 'Apartamento Decorado'),
        legenda: 'Apartamento Decorado',
        limit: 99,
      },
      {
        path: join(BASE, 'Saint-Michel', 'Condomínio Saint Michel', 'Apartamento Modelo'),
        legenda: 'Apartamento Modelo',
        limit: 99,
      },
    ],
  },
  {
    id: 'condominio-viure',
    nome: 'Viure',
    dirs: [
      {
        path: join(BASE, 'Viure', 'Condomínio Viure', 'Fotos Lazer - Viure'),
        legenda: 'Lazer Viure',
        limit: 99,
      },
      {
        path: join(BASE, 'Viure', 'Condomínio Viure', 'Apartamento - 505 Dali'),
        legenda: 'Apartamento 505 Dali',
        limit: 99,
      },
      {
        path: join(BASE, 'Viure', 'Condomínio Viure', 'Apartamento Decorado'),
        legenda: 'Apartamento Decorado',
        limit: 99,
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function listImages(dirPath, limit) {
  try {
    const files = await readdir(dirPath)
    return files
      .filter(isImage)
      .sort()
      .slice(0, limit)
      .map((f) => join(dirPath, f))
  } catch {
    return [] // diretório pode não existir
  }
}

async function uploadImage(filePath, filename) {
  const ext = extname(filePath).toLowerCase()
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const stream = createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, { filename, contentType })
  return asset._id
}

function makeGaleriaItem(assetId, alt, legenda) {
  return {
    _key: key(),
    asset: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
    },
    alt,
    legenda,
  }
}

// ─── Upload por condomínio ────────────────────────────────────────────────────

async function processCondominio(condo) {
  console.log(`\n🏢 ${condo.nome}`)
  const galeria = []

  for (const dir of condo.dirs) {
    const files = await listImages(dir.path, dir.limit)
    if (files.length === 0) {
      console.log(`   ⚠️  Nenhuma imagem em: ${basename(dir.path)}`)
      continue
    }
    console.log(`   📂 ${basename(dir.path)}: ${files.length} imagens`)

    for (const filePath of files) {
      const filename = basename(filePath)
      process.stdout.write(`      ⬆️  ${filename} ... `)
      try {
        const assetId = await uploadImage(filePath, filename)
        galeria.push(makeGaleriaItem(assetId, `${condo.nome} — ${dir.legenda}`, dir.legenda))
        process.stdout.write(`✅ ${assetId.slice(0, 30)}...\n`)
      } catch (err) {
        process.stdout.write(`❌ ${err.message}\n`)
      }
    }
  }

  if (galeria.length === 0) {
    console.log(`   ⚠️  Nenhuma imagem carregada — pulando patch`)
    return
  }

  // fotoCapa = primeira imagem da galeria
  const fotoCapa = {
    asset: {
      _type: 'image',
      asset: { _type: 'reference', _ref: galeria[0].asset.asset._ref },
    },
    alt: `${condo.nome} — foto de capa`,
  }

  try {
    await client
      .patch(condo.id)
      .set({ galeria, fotoCapa })
      .commit()
    console.log(`   ✅ Galeria salva: ${galeria.length} fotos`)
  } catch (err) {
    console.error(`   ❌ Erro ao salvar galeria: ${err.message}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('🚀 Upload de imagens dos condomínios Ilha Pura → Sanity')
console.log('='.repeat(60))

for (const condo of CONDOMINIOS) {
  await processCondominio(condo)
}

console.log('\n✅ Concluído!')
console.log('Acesse: https://www.sanity.io/manage/personal/project/gvf51tpc')
