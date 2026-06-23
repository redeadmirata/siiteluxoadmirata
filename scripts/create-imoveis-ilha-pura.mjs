// scripts/create-imoveis-ilha-pura.mjs
// Cadastra as unidades de estoque pronto do Ilha Pura como documentos `imovel`,
// ligados ao respectivo condomínio (condominioRef) e ao bairro Ilha Pura.
// Rode: node scripts/create-imoveis-ilha-pura.mjs
//
// Idempotente: usa createOrReplace com _id determinístico. Pode rodar de novo
// para reaplicar valores (edite ESTE arquivo, não o Studio, até o cadastro final).

import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Carrega SANITY_API_TOKEN do .env.local (sem hardcode de segredo) ──────────
const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
loadEnv()

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('❌ SANITY_API_TOKEN não encontrado (.env.local). Abortando.')
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
const bairroRef = { _type: 'reference', _ref: 'bairro-ilha-pura' }
const condRef = (id) => ({ _type: 'reference', _ref: id })

const AVISO_LEGAL =
  'Valores e disponibilidade sujeitos a alteração sem aviso prévio.'

// ── Unidades (tabela de estoque pronto Ilha Pura) ────────────────────────────
const unidades = [
  {
    _id: 'imovel-ilha-pura-elos-1408',
    titulo: 'Apartamento 3 Quartos, 2 Suítes — Elos, Ilha Pura',
    slug: 'elos-iris-1408',
    cond: 'condominio-elos',
    tipologia: '3-quartos',
    quartos: 3,
    suites: 2,
    areaUtil: 115.37,
    preco: 1295351,
    andar: 'Bloco 1-IRIS · Unidade 1408',
    resumo:
      'Apartamento de 3 quartos com 2 suítes (115,37 m²) no Elos, dentro do bairro planejado Ilha Pura, na Barra da Tijuca.',
  },
  {
    _id: 'imovel-ilha-pura-saint-michel-101',
    titulo: 'Apartamento 4 Quartos — Saint Michel, Ilha Pura',
    slug: 'saint-michel-bordeaux-101',
    cond: 'condominio-saint-michel',
    tipologia: '4-quartos',
    quartos: 4,
    suites: undefined,
    areaUtil: 160.2,
    preco: 1574482,
    andar: 'Bloco 1-BORDEAUX · Unidade 101',
    resumo:
      'Apartamento de 4 quartos (160,20 m²) no Saint Michel, dentro do bairro planejado Ilha Pura, na Barra da Tijuca.',
  },
  {
    _id: 'imovel-ilha-pura-millenio-1307',
    titulo: 'Double Suite (2 Suítes) — Millenio, Ilha Pura',
    slug: 'millenio-chicago-1307',
    cond: 'condominio-millenio',
    tipologia: '2-quartos',
    quartos: 2,
    suites: 2,
    areaUtil: 79.2,
    preco: 784292,
    andar: 'Bloco 1-CHICAGO · Unidade 1307',
    resumo:
      'Apartamento Double Suite — 2 suítes (79,20 m²) no Millenio, dentro do bairro planejado Ilha Pura, na Barra da Tijuca.',
  },
  {
    _id: 'imovel-ilha-pura-viure-1501',
    titulo: 'Apartamento 3 Quartos — Viure, Ilha Pura',
    slug: 'viure-gaudi-1501',
    cond: 'condominio-viure',
    tipologia: '3-quartos',
    quartos: 3,
    suites: undefined,
    areaUtil: 115.15,
    preco: 1139221,
    andar: 'Bloco 2-GAUDÍ · Unidade 1501',
    resumo:
      'Apartamento de 3 quartos (115,15 m²) no Viure, dentro do bairro planejado Ilha Pura, na Barra da Tijuca.',
  },
  {
    _id: 'imovel-ilha-pura-astra-404',
    titulo: 'Apartamento 2 Quartos — Astra, Ilha Pura',
    slug: 'astra-selene-404',
    cond: 'condominio-astra',
    tipologia: '2-quartos',
    quartos: 2,
    suites: undefined,
    areaUtil: 90.32,
    preco: 922461,
    andar: 'Bloco 2-SELENE · Unidade 404',
    resumo:
      'Apartamento de 2 quartos (90,32 m²) no Astra, dentro do bairro planejado Ilha Pura, na Barra da Tijuca.',
  },
]

const buildDoc = (u) => {
  const doc = {
    _id: u._id,
    _type: 'imovel',
    titulo: u.titulo,
    slug: { _type: 'slug', current: u.slug },
    tipo: 'Apartamento',
    finalidade: 'Venda',
    mercado: 'Rio de Janeiro',
    status: 'Disponível',
    bairro: bairroRef,
    condominioRef: condRef(u.cond),
    tipologia: u.tipologia,
    preco: u.preco,
    precoSobConsulta: false,
    areaUtil: u.areaUtil,
    quartos: u.quartos,
    andar: u.andar,
    publicadoEm: new Date().toISOString(),
    // Aviso legal exigido + resumo da unidade
    descricaoPtBr: `${u.resumo} ${AVISO_LEGAL}`,
  }
  if (typeof u.suites === 'number') doc.suites = u.suites
  return doc
}

async function run() {
  console.log(`\n🏗  Cadastrando ${unidades.length} unidades do Ilha Pura...\n`)
  for (const u of unidades) {
    try {
      await client.createOrReplace(buildDoc(u))
      console.log(`✅ ${u.titulo}`)
      console.log(`   R$ ${u.preco.toLocaleString('pt-BR')} · ${u.areaUtil} m² · ${u.andar}`)
      console.log(`   https://admirata.com.br/imovel/${u.slug}\n`)
    } catch (e) {
      console.error(`❌ Falha em ${u.titulo}: ${e.message}\n`)
    }
  }
  console.log('Concluído. As unidades aparecem nas páginas dos condomínios em /ilhapura/condominios/[slug].')
}

run()
