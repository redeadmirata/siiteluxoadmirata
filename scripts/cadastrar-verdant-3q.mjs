/**
 * Cadastra apartamento 3 quartos — Grand Club Verdant / Camorim
 * Uso: node scripts/cadastrar-verdant-3q.mjs
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TOKEN = 'skH4t0uLAlJq61v4EFHVonFwZKdqoletaPwax5eiI1YmGlqVkE1Z6AXPEIcBPbqHQLggEf9ZNxPNv1ERPbnX0CUx1aWiBqipQaMfBu3O280929p6pkBnDK0ScGCAtAKSS8JwYxI6EhNQKoCrU6joRc5gKJLl4GtvHGQfIBUlRR5tpDNTIdFp'

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: TOKEN,
  useCdn: false,
})

const CONDOMINIO_ID = 'condominio-verdant-valley'
const BAIRRO_ID    = 'bairro-camorim'
const IMOVEL_ID    = 'imovel-verdant-valley-3q-001'
const SLUG         = 'apartamento-3-quartos-grand-club-verdant-camorim'

const APT_DIR = path.join(
  __dirname,
  '../drive-imagens/Verdant Valley/Verdant Valley -3-001/Verdant Valley'
)

// ─── SEO ──────────────────────────────────────────────────────────────────────
const SEO = {
  metaTitle: 'Apartamento 3 Quartos no Grand Club Verdant | Camorim',   // 53 chars
  metaDescription:
    'Ap. 3 quartos (1 suíte), varanda com cortina de vidro, piso em porcelanato. ' +
    'Grand Club Verdant no Camorim — padaria, mercado 24h e lazer. Aluguel R$ 2.900/mês.',  // 156 chars
}

// ─── Descrição Storytelling ────────────────────────────────────────────────────
const DESCRICAO_PT = `Morar no Grand Club Verdant é escolher uma rotina com mais conforto, segurança e praticidade em uma das regiões que mais crescem entre a Barra da Tijuca, Jacarepaguá e o Recreio.

Este apartamento é ideal para quem busca um imóvel pronto para morar, funcional e com estrutura de condomínio clube. Unidade térrea com 3 quartos, sendo 1 suíte, 1 vaga de garagem, piso em porcelanato, varanda com cortina de vidro e cozinha com armários planejados, fogão e cooktop. A suíte conta com armário e ar-condicionado split.

O Grand Club Verdant oferece lazer completo, espaços para caminhada, portaria com controle de acesso, padaria interna e mercado 24h de autoatendimento — conveniências que reduzem deslocamentos e tornam a rotina muito mais leve.

A região do Camorim / Barra Olímpica oferece fácil acesso à Barra da Tijuca, Recreio, Riocentro, Parque Olímpico, Ilha Pura, Shopping Metropolitano, supermercados, farmácias, restaurantes, clínicas e principais vias da cidade.

Condições de locação: aluguel R$ 2.900 | condomínio aprox. R$ 1.100 | renda mínima R$ 11.000. Garantias aceitas: seguro fiança, título de capitalização ou depósito caução.`

// ─── Características ──────────────────────────────────────────────────────────
const CARACTERISTICAS = [
  { _key: 'c01', _type: 'object', grupo: 'Acabamento',     nome: 'Piso em porcelanato' },
  { _key: 'c02', _type: 'object', grupo: 'Acabamento',     nome: 'Varanda com cortina de vidro' },
  { _key: 'c03', _type: 'object', grupo: 'Acabamento',     nome: 'Cozinha com armários planejados' },
  { _key: 'c04', _type: 'object', grupo: 'Acabamento',     nome: 'Fogão e cooktop' },
  { _key: 'c05', _type: 'object', grupo: 'Acabamento',     nome: 'Suíte com armário e ar-condicionado split' },
  { _key: 'c06', _type: 'object', grupo: 'Lazer',          nome: 'Áreas de lazer' },
  { _key: 'c07', _type: 'object', grupo: 'Lazer',          nome: 'Espaços para caminhada' },
  { _key: 'c08', _type: 'object', grupo: 'Segurança',      nome: 'Portaria com controle de acesso' },
  { _key: 'c09', _type: 'object', grupo: 'Infraestrutura', nome: 'Padaria dentro do condomínio' },
  { _key: 'c10', _type: 'object', grupo: 'Infraestrutura', nome: 'Mercado 24h de autoatendimento' },
]

// ─── Upload de imagens ────────────────────────────────────────────────────────
async function uploadImages() {
  let files
  try {
    files = (await readdir(APT_DIR))
      .filter(f => /\.(jpg|jpeg)$/i.test(f))
      .sort()
  } catch (err) {
    console.error(`❌ Pasta não encontrada: ${APT_DIR}`)
    throw err
  }

  console.log(`📸 ${files.length} fotos encontradas. Iniciando upload...\n`)
  const uploaded = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(APT_DIR, file)
    process.stdout.write(`  [${String(i + 1).padStart(2)}/${files.length}] ${file} ... `)

    try {
      const asset = await client.assets.upload('image', createReadStream(filePath), {
        filename: file,
        contentType: 'image/jpeg',
      })
      uploaded.push({ file, assetId: asset._id })
      console.log(`✅ ${asset._id}`)
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  return uploaded
}

// ─── Criação do documento ─────────────────────────────────────────────────────
async function createImovel(uploadedImages) {
  const imagens = uploadedImages.map((img, i) => ({
    _type: 'object',
    _key: `img-${String(i).padStart(3, '0')}`,
    arquivo: {
      _type: 'image',
      asset: { _type: 'reference', _ref: img.assetId },
    },
    alt: i === 0
      ? 'Sala do apartamento 3 quartos no Grand Club Verdant — Camorim, Barra Olímpica, RJ'
      : `Foto ${i + 1} — Apartamento 3 quartos Grand Club Verdant, Camorim`,
    principal: i === 0,
    tour360: false,
    isStaging: false,
  }))

  const doc = {
    _type: 'imovel',
    _id: IMOVEL_ID,
    titulo: 'Apartamento 3 Quartos no Grand Club Verdant — Camorim / Barra Olímpica',
    slug: { _type: 'slug', current: SLUG },
    tipo: 'Apartamento',
    finalidade: 'Locação',
    mercado: 'Rio de Janeiro',
    status: 'Disponível',
    destaque: false,
    exclusivo: false,
    permuta: false,
    novidade: true,
    precoSobConsulta: false,
    preco: 2900,
    condominio: 1100,
    quartos: 3,
    suites: 1,
    vagas: 1,
    andar: 'Térreo',
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    condominioRef: { _type: 'reference', _ref: CONDOMINIO_ID },
    tipologia: '3-quartos',
    publicadoEm: new Date().toISOString(),
    imagens,
    caracteristicas: CARACTERISTICAS,
    descricaoPtBr: DESCRICAO_PT,
    seo: SEO,
  }

  console.log('\n📝 Criando documento no Sanity...')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Imóvel criado! _id: ${result._id}`)
  console.log(`\n🔗 Site:   https://admirata.com.br/imoveis/${SLUG}`)
  console.log(`📋 Studio: https://gvf51tpc.sanity.studio/structure/imovel;${IMOVEL_ID}\n`)
  return result
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════════════════')
  console.log('  Admirata — Cadastro de Imóvel')
  console.log('  Grand Club Verdant · 3 Quartos · Camorim · Locação')
  console.log('══════════════════════════════════════════════════════════\n')

  const uploaded = await uploadImages()
  console.log(`\n✅ ${uploaded.length} fotos enviadas ao Sanity\n`)

  if (uploaded.length === 0) {
    console.error('❌ Nenhuma imagem foi enviada. Verifique o caminho das fotos.')
    process.exit(1)
  }

  await createImovel(uploaded)
  console.log('🎉 Cadastro concluído com sucesso!')
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
