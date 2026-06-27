/**
 * Cadastra apartamento 2 quartos — Bloco 1, Apto 503, Vitale View / Camorim
 * Uso: node scripts/cadastrar-vitale-view-b1-503.mjs
 *
 * Planta (Quadro de Áreas — Bloco 01, linha "103 A 503"):
 *   Área privativa: 48,73 m² · Varanda: 2,07 m² · Total: 50,80 m²
 *   Planta maior com suíte — 5º andar com vista livre
 *
 * Condições de venda:
 *   Preço: R$ 399.000 · Imóvel entregue conforme a construtora · Aceita FGTS · Financia qualquer banco
 *
 * Fotos: área de lazer do condomínio (mesma galeria do Vitale View)
 * Vídeo: https://youtu.be/yixMTPRyI5c?si=kmU-JGD3WDXlJsl5
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

const CONDOMINIO_ID = 'condominio-vitale-view'
const BAIRRO_ID     = 'bairro-camorim'
const IMOVEL_ID     = 'imovel-vitale-view-b1-503'
const SLUG          = 'apartamento-2-quartos-vitale-view-camorim-bloco-1-vista-livre'

// Ordem editorial — fachada e espaços abertos primeiro (reforçam a narrativa de vista e amplitude)
const FOTOS_PRIORIDADE = [
  '23-Fachada',
  '17-Vista Aerea do Lazer de cima',
  '19-Vista Aerea do Lazer v05',
  '25-Vista Aerea Geral',
  '18-Vista Varanda',
  '05-Piscina',
  '35-Bar Piscina',
  '15-Deck Mirante',
  '01-Academia',
  '12-Crossfit',
  '08-Quadra Poliesportiva',
  '10-Quadra de Volley',
  '26-Escalada',
  '09-Futmesa',
  '06-churrasqueira',
  '33-Churrasqueira de baixo',
  '04-salao de festas',
  '03-Salao de Festas Infantil',
  '14-Redario',
  '13-Espaco Pet',
  '29-Brinquedoteca',
  '30-Playground',
  '27-Coworking',
  '31-bicicletario',
  '24-Acesso',
  '02-Jogos',
  '32-Jogos',
  '28-Workshop',
  '11-Chuveirao',
  '07-Easymarketing',
]

const FOTOS_DIR = path.join(
  __dirname,
  '../drive-imagens/Vitale/Vitale View/VITALE VIEW - IMG FINAIS'
)

const EXCLUIR = /([-\s]alta\.jpg|[-\s]altissima\.jpg|altissima-mais clara\.jpg)/i

// ─── SEO — arrojado, sem tom de vendedor ──────────────────────────────────────

const SEO = {
  metaTitle:
    'Apto 2 Quartos com Vista Livre no Vitale View Camorim — R$ 399.000 | Admirata Imóveis',
  metaDescription:
    'Apartamento 48,73 m² com suíte, varanda e vista livre no 5º andar do Vitale View, Camorim. ' +
    'Entregue pela construtora, pronto para personalizar. Resort particular: piscina, escalada, futmesa, van exclusiva. ' +
    'R$ 399.000 — aceita FGTS, financia qualquer banco.',
}

// ─── Descrição — copy Admirata: encantadora, sem forçar ───────────────────────

const DESCRICAO_PT = `Há apartamentos que você entra e imediatamente entende. Este é um deles.

No quinto andar do Bloco 1 do Vitale View, a varanda não enquadra outra janela — enquadra céu e copa de árvores. Vista livre no Camorim significa ver o verde que rodeia o bairro sem obstáculo à frente. É o tipo de detalhe que parece pequeno na planta e enorme no dia a dia.

O apartamento tem 48,73 m² de área privativa, 2 quartos (sendo 1 suíte) e varanda. Será entregue exatamente como a construtora finalizou — sem intervenções adicionais, sem maquiagem. Uma tela em branco para quem quer imprimir sua própria identidade no espaço.

Abaixo, o Vitale View faz o resto. Mais de 25 espaços de lazer prontos para uso: a piscina com borda, o bar molhado, o muro de escalada, a quadra de areia, o futmesa — esse esporte de mesa jogado com os pés que vira o ponto de encontro do condomínio. Academia, CrossFit, dois salões de festas, churrasqueira com forno de pizza, deck mirante e trilha ecológica. Tudo dentro do endereço.

A vida fora do condomínio também foi pensada: uma van exclusiva faz o trajeto até a Estrada dos Bandeirantes. O Parque Ilha Pura está a poucos minutos. Barra da Tijuca e Recreio dos Bandeirantes são vizinhanças acessíveis.

Aceita FGTS como parte do pagamento. Financiamento aprovado em qualquer banco. Preço: R$ 399.000.`

// ─── Características ──────────────────────────────────────────────────────────

const CARACTERISTICAS = [
  { _key: 'c01', _type: 'object', grupo: 'Planta',        nome: '2 quartos com suíte · 48,73 m² de área privativa' },
  { _key: 'c02', _type: 'object', grupo: 'Planta',        nome: 'Varanda de 2,07 m²' },
  { _key: 'c03', _type: 'object', grupo: 'Planta',        nome: '1 vaga de garagem' },
  { _key: 'c04', _type: 'object', grupo: 'Localização',   nome: '5º andar — vista livre, sem prédios à frente' },
  { _key: 'c05', _type: 'object', grupo: 'Estado',        nome: 'Entregue conforme a construtora — pronto para personalizar' },
  { _key: 'c06', _type: 'object', grupo: 'Financiamento', nome: 'Aceita FGTS como parte do pagamento' },
  { _key: 'c07', _type: 'object', grupo: 'Financiamento', nome: 'Financiamento aprovado em qualquer banco' },
  { _key: 'c08', _type: 'object', grupo: 'Lazer',         nome: 'Piscina adulto e infantil com deck molhado e bar da piscina' },
  { _key: 'c09', _type: 'object', grupo: 'Lazer',         nome: 'Muro de escalada, slackline e futmesa' },
  { _key: 'c10', _type: 'object', grupo: 'Lazer',         nome: 'Academia completa e CrossFit' },
  { _key: 'c11', _type: 'object', grupo: 'Lazer',         nome: 'Quadra poliesportiva e quadra de areia' },
  { _key: 'c12', _type: 'object', grupo: 'Lazer',         nome: '2 salões de festas + churrasqueira com forno de pizza' },
  { _key: 'c13', _type: 'object', grupo: 'Lazer',         nome: 'Deck mirante e trilha ecológica' },
  { _key: 'c14', _type: 'object', grupo: 'Lazer',         nome: 'Brinquedoteca, playground e espaço pet' },
  { _key: 'c15', _type: 'object', grupo: 'Mobilidade',    nome: 'Van exclusiva até a Estrada dos Bandeirantes' },
  { _key: 'c16', _type: 'object', grupo: 'Mobilidade',    nome: 'Smart Car elétrico para deslocamento interno' },
  { _key: 'c17', _type: 'object', grupo: 'Mobilidade',    nome: 'Bicicletário e bicicletas compartilhadas' },
  { _key: 'c18', _type: 'object', grupo: 'Infraestrutura', nome: 'Mini mercado dentro do condomínio' },
  { _key: 'c19', _type: 'object', grupo: 'Infraestrutura', nome: 'Coworking e sala de reuniões' },
  { _key: 'c20', _type: 'object', grupo: 'Segurança',     nome: 'Portaria e segurança 24h' },
  { _key: 'c21', _type: 'object', grupo: 'Localização',   nome: 'Próximo ao Parque Ilha Pura e Parque Linear do Cidade Jardim' },
  { _key: 'c22', _type: 'object', grupo: 'Localização',   nome: '15 min da Barra da Tijuca · 12 min das praias do Recreio' },
]

// ─── Upload de imagens ────────────────────────────────────────────────────────

async function uploadImages() {
  let allFiles
  try {
    allFiles = (await readdir(FOTOS_DIR))
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .filter(f => !EXCLUIR.test(f))
  } catch (err) {
    console.error(`❌ Pasta não encontrada: ${FOTOS_DIR}`)
    throw err
  }

  const sortByPriority = (a, b) => {
    const pa = FOTOS_PRIORIDADE.findIndex(p => a.startsWith(p))
    const pb = FOTOS_PRIORIDADE.findIndex(p => b.startsWith(p))
    if (pa === -1 && pb === -1) return a.localeCompare(b)
    if (pa === -1) return 1
    if (pb === -1) return -1
    return pa - pb
  }

  const files = allFiles.sort(sortByPriority)
  console.log(`📸 ${files.length} fotos na ordem editorial. Iniciando upload...\n`)

  const uploaded = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(FOTOS_DIR, file)
    const contentType = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
    process.stdout.write(`  [${String(i + 1).padStart(2)}/${files.length}] ${file} ... `)

    try {
      const asset = await client.assets.upload('image', createReadStream(filePath), {
        filename: file,
        contentType,
      })
      uploaded.push({ file, assetId: asset._id })
      console.log(`✅ ${asset._id}`)
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  return uploaded
}

// ─── Criação do imóvel ────────────────────────────────────────────────────────

async function createImovel(uploadedImages) {
  const imagens = uploadedImages.map((img, i) => ({
    _type: 'object',
    _key: `img-${String(i).padStart(3, '0')}`,
    arquivo: {
      _type: 'image',
      asset: { _type: 'reference', _ref: img.assetId },
    },
    alt: i === 0
      ? 'Fachada do Vitale View — Condomínio em Camorim, Jacarepaguá'
      : `Vitale View Camorim — ${img.file.replace(/\.[^.]+$/, '').replace(/[-_v0-9]/g, ' ').trim()}`,
    principal: i === 0,
    tour360: false,
    isStaging: false,
  }))

  const doc = {
    _type: 'imovel',
    _id: IMOVEL_ID,
    titulo: 'Apartamento 2 Quartos com Vista Livre no Vitale View — Camorim',
    slug: { _type: 'slug', current: SLUG },
    tipo: 'Apartamento',
    finalidade: 'Venda',
    mercado: 'Rio de Janeiro',
    status: 'Disponível',
    destaque: true,
    exclusivo: false,
    permuta: false,
    condicao: 'pronto',
    novidade: false,
    precoSobConsulta: false,
    preco: 399000,
    quartos: 2,
    suites: 1,
    vagas: 1,
    andar: '5°',
    areaUtil: 48.73,
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    condominioRef: { _type: 'reference', _ref: CONDOMINIO_ID },
    tipologia: '2-quartos',
    videoUrl: 'https://youtu.be/yixMTPRyI5c?si=kmU-JGD3WDXlJsl5',
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
  console.log('══════════════════════════════════════════════════════════════')
  console.log('  Admirata — Cadastro de Imóvel')
  console.log('  Vitale View · 2 Quartos + Suíte · Bloco 1 · Apto 503 · Vista Livre · Venda')
  console.log('══════════════════════════════════════════════════════════════\n')
  console.log('  Planta: 48,73 m² priv. + 2,07 m² varanda = 50,80 m² total')
  console.log('  Preço:  R$ 399.000 | Entregue pela construtora | Aceita FGTS\n')

  const uploaded = await uploadImages()
  console.log(`\n✅ ${uploaded.length} fotos enviadas ao Sanity\n`)

  if (uploaded.length === 0) {
    console.error('❌ Nenhuma imagem enviada. Verifique o caminho das fotos.')
    process.exit(1)
  }

  await createImovel(uploaded)
  console.log('🎉 Cadastro concluído com sucesso!')
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
