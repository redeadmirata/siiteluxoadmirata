// scripts/upload-imagens-imoveis-ilha-pura.mjs
// Faz upload das fotos de ÁREA DE LAZER (galeria placeholder até termos fotos da
// unidade específica) para o Sanity Assets e popula o campo `imagens` de cada
// imóvel (unidade) do Ilha Pura. A 1ª foto vira a capa (principal = true).
//
// Token: defina SANITY_API_TOKEN (Editor) na sessão antes de rodar —
//   set SANITY_API_TOKEN=seu_token   (cmd)
// Rode: node scripts/upload-imagens-imoveis-ilha-pura.mjs

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readdir, readFile } from 'fs/promises'
import { join, basename, extname, dirname } from 'path'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Token do .env.local (ou da env da sessão, que tem prioridade) ──────────────
async function loadEnv() {
  try {
    const raw = await readFile(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
await loadEnv()

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('❌ SANITY_API_TOKEN não encontrado. Rode: set SANITY_API_TOKEN=seu_token')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'gvf51tpc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-06-01',
  token,
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')
const BASE = join(__dirname, '..', 'drive-imagens')
const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const isImage = (f) => IMG_EXTS.has(extname(f).toLowerCase())

// ── Unidades → pasta de galeria (lazer/áreas comuns) ──────────────────────────
const UNIDADES = [
  {
    id: 'imovel-ilha-pura-elos-1408',
    nome: 'Elos 1408',
    dir: join(BASE, 'Condomínio Elos-20260618T043955Z-3-001', 'Condomínio Elos', 'Fotos Lazer - Elos'),
    alt: 'Elos — Área de lazer (Ilha Pura)',
    limit: 12,
  },
  {
    id: 'imovel-ilha-pura-millenio-1307',
    nome: 'Millenio 1307',
    dir: join(BASE, 'Millenio', 'Condomínio Millenio', 'Fotos Lazer - Millenio'),
    alt: 'Millenio — Área de lazer (Ilha Pura)',
    limit: 12,
  },
  {
    id: 'imovel-ilha-pura-saint-michel-101',
    nome: 'Saint Michel 101',
    dir: join(BASE, 'Saint-Michel', 'Condomínio Saint Michel', 'Fotos Lazer - Saint Michel'),
    alt: 'Saint Michel — Área de lazer (Ilha Pura)',
    limit: 12,
  },
  {
    id: 'imovel-ilha-pura-viure-1501',
    nome: 'Viure 1501',
    dir: join(BASE, 'Viure', 'Condomínio Viure', 'Fotos Lazer - Viure'),
    alt: 'Viure — Área de lazer (Ilha Pura)',
    limit: 12,
  },
  {
    id: 'imovel-ilha-pura-astra-404',
    nome: 'Astra 404',
    dir: join(BASE, 'Astra'), // sem pasta de lazer — usa áreas comuns/fachada
    alt: 'Astra — Áreas comuns (Ilha Pura)',
    limit: 12,
  },
]

async function listImages(dirPath, limit) {
  try {
    const files = (await readdir(dirPath)).filter(isImage).sort().slice(0, limit)
    return files.map((f) => join(dirPath, f))
  } catch {
    return []
  }
}

async function uploadImage(filePath, filename) {
  const ext = extname(filePath).toLowerCase()
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename, contentType })
  return asset._id
}

const makeImagemItem = (assetId, alt, principal) => ({
  _key: key(),
  arquivo: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
  alt,
  principal,
})

async function processUnidade(u) {
  console.log(`\n🏠 ${u.nome}`)
  const files = await listImages(u.dir, u.limit)
  if (files.length === 0) {
    console.log(`   ⚠️  Nenhuma imagem em: ${u.dir}`)
    return
  }
  console.log(`   📂 ${basename(u.dir)}: ${files.length} imagens`)

  const imagens = []
  for (const filePath of files) {
    const filename = basename(filePath)
    process.stdout.write(`      ⬆️  ${filename} ... `)
    try {
      const assetId = await uploadImage(filePath, filename)
      imagens.push(makeImagemItem(assetId, u.alt, imagens.length === 0))
      process.stdout.write('✅\n')
    } catch (err) {
      process.stdout.write(`❌ ${err.message}\n`)
    }
  }

  if (imagens.length === 0) {
    console.log('   ⚠️  Nenhuma imagem carregada — pulando patch')
    return
  }

  try {
    await client.patch(u.id).set({ imagens }).commit()
    console.log(`   ✅ Galeria salva: ${imagens.length} fotos (1ª = capa)`)
  } catch (err) {
    console.error(`   ❌ Erro ao salvar: ${err.message}`)
  }
}

console.log('🚀 Upload de imagens das unidades Ilha Pura → Sanity')
for (const u of UNIDADES) await processUnidade(u)
console.log('\nConcluído.')
