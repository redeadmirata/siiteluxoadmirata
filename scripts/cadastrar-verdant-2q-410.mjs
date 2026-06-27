/**
 * Cadastra apartamento 2 quartos — Apto 410 Bloco 4, Grand Club Verdant / Camorim
 * Uso: node scripts/cadastrar-verdant-2q-410.mjs
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
const IMOVEL_ID    = 'imovel-verdant-valley-2q-410'
const SLUG         = 'apartamento-2-quartos-grand-club-verdant-camorim-bloco-4'

const APT_DIR = path.join(
  __dirname,
  '../drive-imagens/Verdant Valley/Apartamento 410 Bloco 4'
)

// ─── SEO ──────────────────────────────────────────────────────────────────────
const SEO = {
  metaTitle: 'Apartamento 2 Quartos no Grand Club Verdant | Camorim — R$ 2.700',
  metaDescription:
    'Ap. 2 quartos (1 suíte), cozinha equipada, split e ar-condicionado. ' +
    'Grand Club Verdant no Camorim — piscina, academia e lazer completo. Aluguel R$ 2.700/mês.',
}

// ─── Descrição Storytelling ────────────────────────────────────────────────────
const DESCRICAO_PT = `Chegue apenas com suas malas. Este apartamento foi pensado para quem quer conforto imediato, sem trabalho de montar uma casa do zero.

O imóvel conta com 2 quartos (sendo 1 suíte), 1 vaga de garagem, split na sala e ar-condicionado nos quartos — garantindo frescor em todos os ambientes. A cozinha já vem equipada com geladeira, fogão e máquina de lavar. Para completar a mudança, basta trazer sofá e TV.

Localizado no Bloco 4 do Grand Club Verdant, o apartamento tem sol da manhã e vista livre — uma combinação que transforma o dia a dia em algo mais agradável.

O Grand Club Verdant oferece estrutura de lazer completa: piscinas recreativas e raia de 25m, academia, quadra de tênis, campo de futebol, quadra poliesportiva e de areia, saunas, hidromassagem, churrasqueiras, salão de festas, salão de jogos, brinquedoteca, pet place, minimercado e boulevard arborizado com praças de convivência — tudo dentro do condomínio, com segurança e portaria 24h.

Fica próximo ao Riocentro, Parque Olímpico e Barra da Tijuca, com fácil acesso às principais vias da cidade.

Condições: aluguel R$ 2.700 | condomínio aprox. R$ 1.000 | IPTU R$ 80.`

// ─── Características ──────────────────────────────────────────────────────────
const CARACTERISTICAS = [
  { _key: 'c01', _type: 'object', grupo: 'Acabamento',     nome: 'Cozinha equipada com geladeira, fogão e máquina de lavar' },
  { _key: 'c02', _type: 'object', grupo: 'Acabamento',     nome: 'Split na sala' },
  { _key: 'c03', _type: 'object', grupo: 'Acabamento',     nome: 'Ar-condicionado nos quartos' },
  { _key: 'c04', _type: 'object', grupo: 'Localização',    nome: 'Sol da manhã' },
  { _key: 'c05', _type: 'object', grupo: 'Localização',    nome: 'Vista livre' },
  { _key: 'c06', _type: 'object', grupo: 'Lazer',          nome: 'Piscinas recreativas e raia de 25m' },
  { _key: 'c07', _type: 'object', grupo: 'Lazer',          nome: 'Academia completa' },
  { _key: 'c08', _type: 'object', grupo: 'Lazer',          nome: 'Quadra de tênis, campo de futebol e quadras poliesportivas' },
  { _key: 'c09', _type: 'object', grupo: 'Lazer',          nome: 'Saunas e hidromassagem' },
  { _key: 'c10', _type: 'object', grupo: 'Lazer',          nome: 'Churrasqueiras, salão de festas e salão de jogos' },
  { _key: 'c11', _type: 'object', grupo: 'Infraestrutura', nome: 'Minimercado e pet place' },
  { _key: 'c12', _type: 'object', grupo: 'Segurança',      nome: 'Portaria e segurança 24h' },
]

// ─── Upload de imagens ────────────────────────────────────────────────────────
async function uploadImages() {
  let files
  try {
    files = (await readdir(APT_DIR))
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
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
      ? 'Sala do apartamento 2 quartos no Grand Club Verdant Bloco 4 — Camorim, RJ'
      : `Foto ${i + 1} — Apartamento 2 quartos Grand Club Verdant Apto 410 Bloco 4, Camorim`,
    principal: i === 0,
    tour360: false,
    isStaging: false,
  }))

  const doc = {
    _type: 'imovel',
    _id: IMOVEL_ID,
    titulo: 'Apartamento 2 Quartos no Grand Club Verdant — Camorim / Barra Olímpica',
    slug: { _type: 'slug', current: SLUG },
    tipo: 'Apartamento',
    finalidade: 'Locação',
    mercado: 'Rio de Janeiro',
    status: 'Disponível',
    destaque: false,
    exclusivo: false,
    permuta: false,
    condicao: 'pronto',
    novidade: false,
    precoSobConsulta: false,
    preco: 2700,
    condominio: 1000,
    iptu: 80,
    quartos: 2,
    suites: 1,
    vagas: 1,
    andar: '4º',
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    condominioRef: { _type: 'reference', _ref: CONDOMINIO_ID },
    tipologia: '2-quartos',
    videoUrl: 'https://youtu.be/DjsSZQZPbz4?t=27',
    publicadoEm: new Date().toISOString(),
    imagens,
    caracteristicas: CARACTERISTICAS,
    descricaoPtBr: DESCRICAO_PT,
    seo: SEO,
  }

  console.log('\n📝 Criando documento no Sanity...')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Imóvel criado! _id: ${result._id}`)
  console.log(`\n🔗 Site:   https://admirata.com.br/imovel/${SLUG}`)
  console.log(`📋 Studio: https://gvf51tpc.sanity.studio/structure/imovel;${IMOVEL_ID}\n`)
  return result
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════════════════')
  console.log('  Admirata — Cadastro de Imóvel')
  console.log('  Grand Club Verdant · 2 Quartos · Apto 410 Bloco 4 · Camorim · Locação')
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
