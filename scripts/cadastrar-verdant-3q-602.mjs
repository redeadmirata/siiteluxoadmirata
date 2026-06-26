/**
 * Cadastra apartamento 3 quartos À VENDA — Apto 602 Bloco 3, Grand Club Verdant / Camorim
 * Fotos: Apto 602 bloco 3 + Fotos Clube (sem duplicatas)
 * Uso: node scripts/cadastrar-verdant-3q-602.mjs
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
const IMOVEL_ID    = 'imovel-verdant-valley-3q-602'
const SLUG         = 'apartamento-3-quartos-a-venda-grand-club-verdant-camorim'

const APT_DIR   = path.join(__dirname, '../drive-imagens/Verdant Valley/Apartamento 602 bloco 3')
const CLUBE_DIR = path.join(__dirname, '../drive-imagens/Verdant Valley/Fotos Clube')

// ─── SEO — otimizado para comprador 3Q faixa R$500-600k Camorim/Jacarepaguá ──
const SEO = {
  metaTitle: 'Apartamento 3 Quartos à Venda | Grand Club Verdant Camorim — R$ 550.000',
  metaDescription:
    'Apto 3 quartos (1 suíte) pronto para morar no Grand Club Verdant, Camorim. ' +
    'Vista montanha, armários planejados, cozinha equipada, 1 vaga. R$ 550.000. Visite!',
}

// ─── Descrição storytelling com palavras-chave naturais ───────────────────────
const DESCRICAO_PT = `Apartamento 3 quartos à venda no Grand Club Verdant, em Camorim — Jacarepaguá. Pronto para morar, com acabamento diferenciado e uma das melhores posições do empreendimento.

Localizado no 6º andar do Bloco 3, o apartamento 602 entrega o que os compradores mais exigentes procuram: vista privilegiada para a montanha e o Rio Camorim, iluminação natural generosa, ventilação cruzada e silêncio — tudo o que um andar alto proporciona.

A planta bem distribuída conta com 3 quartos sendo 1 suíte, 1 vaga de garagem, armários planejados nos 3 dormitórios e cozinha funcional equipada com armários, cooktop e forno. A área de serviço independente é separada por vidro temperado — um detalhe de acabamento que eleva o imóvel.

O Grand Club Verdant é um dos maiores condomínios clube da Zona Oeste do Rio. São piscinas recreativas e raia de 25m, academia completa, quadra de tênis, campo de futebol, quadra poliesportiva e de areia, saunas com espaço de repouso, hidromassagem, churrasqueiras, salões de festas, salão de jogos, brinquedoteca, pet place, minimercado, praças, boulevard arborizado e portaria com segurança 24h.

Endereço: Estrada de Camorim, 1003 — Jacarepaguá, Rio de Janeiro. Próximo ao Riocentro, Parque Olímpico, Ilha Pura, Barra da Tijuca e principais acessos da cidade.

Apartamento 3 quartos à venda em Camorim por R$ 550.000. Uma oportunidade de adquirir um imóvel pronto, bem localizado e com lazer de resort.`

// ─── Características ──────────────────────────────────────────────────────────
const CARACTERISTICAS = [
  { _key: 'c01', _type: 'object', grupo: 'Acabamento',     nome: 'Pronto para morar' },
  { _key: 'c02', _type: 'object', grupo: 'Acabamento',     nome: 'Armários planejados nos 3 quartos' },
  { _key: 'c03', _type: 'object', grupo: 'Acabamento',     nome: 'Cozinha com armários, cooktop e forno' },
  { _key: 'c04', _type: 'object', grupo: 'Acabamento',     nome: 'Área de serviço com vidro temperado' },
  { _key: 'c05', _type: 'object', grupo: 'Localização',    nome: 'Vista para montanha e Rio Camorim' },
  { _key: 'c06', _type: 'object', grupo: 'Localização',    nome: 'Andar alto — 6º andar' },
  { _key: 'c07', _type: 'object', grupo: 'Localização',    nome: 'Iluminação natural e ventilação diferenciadas' },
  { _key: 'c08', _type: 'object', grupo: 'Lazer',          nome: 'Piscinas recreativas + raia de 25m' },
  { _key: 'c09', _type: 'object', grupo: 'Lazer',          nome: 'Academia completa' },
  { _key: 'c10', _type: 'object', grupo: 'Lazer',          nome: 'Quadras (tênis, futebol, poliesportiva e areia)' },
  { _key: 'c11', _type: 'object', grupo: 'Lazer',          nome: 'Saunas, hidromassagem e churrasqueiras' },
  { _key: 'c12', _type: 'object', grupo: 'Lazer',          nome: 'Salões de festas e jogos, brinquedoteca, pet place' },
  { _key: 'c13', _type: 'object', grupo: 'Infraestrutura', nome: 'Minimercado e boulevard arborizado' },
  { _key: 'c14', _type: 'object', grupo: 'Segurança',      nome: 'Portaria com segurança 24h' },
]

// ─── Coleta arquivos de imagem (sem MP4, sem duplicatas " - Copia") ───────────
async function listarImagens(dir) {
  try {
    const files = await readdir(dir)
    return files
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .filter(f => !f.includes(' - Copia'))
      .sort()
  } catch {
    console.warn(`⚠️  Pasta não encontrada ou vazia: ${dir}`)
    return []
  }
}

// ─── Upload de imagens ────────────────────────────────────────────────────────
async function uploadImages() {
  const aptFiles   = (await listarImagens(APT_DIR)).map(f => ({ dir: APT_DIR,   file: f, grupo: 'apt' }))
  const clubeFiles = (await listarImagens(CLUBE_DIR)).map(f => ({ dir: CLUBE_DIR, file: f, grupo: 'clube' }))

  // Fotos do apartamento primeiro, depois área de lazer
  const all = [...aptFiles, ...clubeFiles]
  console.log(`📸 ${aptFiles.length} fotos do apartamento + ${clubeFiles.length} do clube = ${all.length} total\n`)

  const uploaded = []

  for (let i = 0; i < all.length; i++) {
    const { dir, file, grupo } = all[i]
    const filePath = path.join(dir, file)
    const label = grupo === 'clube' ? `[clube] ${file}` : file
    process.stdout.write(`  [${String(i + 1).padStart(3)}/${all.length}] ${label} ... `)

    try {
      const contentType = /\.png$/i.test(file) ? 'image/png' : 'image/jpeg'
      const asset = await client.assets.upload('image', createReadStream(filePath), {
        filename: file,
        contentType,
      })
      uploaded.push({ file, assetId: asset._id, grupo })
      console.log(`✅ ${asset._id}`)
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  return uploaded
}

// ─── Criação do documento ─────────────────────────────────────────────────────
async function createImovel(uploadedImages) {
  const imagens = uploadedImages.map((img, i) => {
    const isApt   = img.grupo === 'apt'
    const isFirst = i === 0
    return {
      _type: 'object',
      _key: `img-${String(i).padStart(3, '0')}`,
      arquivo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: img.assetId },
      },
      alt: isFirst
        ? 'Vista do apartamento 602 no Grand Club Verdant — Camorim, Jacarepaguá, RJ'
        : isApt
          ? `Foto ${i + 1} — Apto 3 quartos Grand Club Verdant 602 Bloco 3, Camorim`
          : `Área de lazer Grand Club Verdant — foto ${i + 1}`,
      principal: isFirst,
      tour360: false,
      isStaging: false,
    }
  })

  const doc = {
    _type: 'imovel',
    _id: IMOVEL_ID,
    titulo: 'Apartamento 3 Quartos à Venda no Grand Club Verdant — Camorim / Jacarepaguá',
    slug: { _type: 'slug', current: SLUG },
    tipo: 'Apartamento',
    finalidade: 'Venda',
    mercado: 'Rio de Janeiro',
    status: 'Disponível',
    destaque: true,
    exclusivo: false,
    permuta: false,
    novidade: true,
    precoSobConsulta: false,
    preco: 550000,
    quartos: 3,
    suites: 1,
    vagas: 1,
    andar: '6º',
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    condominioRef: { _type: 'reference', _ref: CONDOMINIO_ID },
    tipologia: '3-quartos',
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
  console.log('  Grand Club Verdant · 3 Quartos · Apto 602 Bloco 3 · VENDA · R$550k')
  console.log('══════════════════════════════════════════════════════════\n')

  const uploaded = await uploadImages()
  console.log(`\n✅ ${uploaded.length} fotos enviadas ao Sanity\n`)

  if (uploaded.length === 0) {
    console.error('❌ Nenhuma imagem foi enviada. Verifique os caminhos das pastas.')
    process.exit(1)
  }

  await createImovel(uploaded)
  console.log('🎉 Cadastro concluído com sucesso!')
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
