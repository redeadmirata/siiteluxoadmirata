/**
 * Cadastra apartamento 2 quartos — Bloco 3, Apto 509, Vitale View / Camorim
 * Uso: node scripts/cadastrar-vitale-view-b3-509.mjs
 *
 * Planta (Quadro de Áreas — Blocos 02, 03, 04 e 05):
 *   Linha "109 A 509" → Área privativa: 40,50 m² · Varanda: 2,07 m² · Total: 42,57 m²
 *
 * Condições de venda:
 *   Preço: R$ 364.990 · Entrada: 20% (R$ 72.998) · Financia qualquer banco · Aceita FGTS
 *
 * Fotos: área de lazer do condomínio (sem fotos específicas do apartamento)
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
const IMOVEL_ID     = 'imovel-vitale-view-b3-509'
const SLUG          = 'apartamento-2-quartos-vitale-view-camorim-bloco-3'

// Fotos de lazer do condomínio — ordem editorial curada
const FOTOS_PRIORIDADE = [
  '23-Fachada',          // 1. Fachada — impacto visual imediato
  '25-Vista Aerea Geral', // 2. Vista aérea do lazer completo
  '05-Piscina',          // 3. Piscina — diferencial emocional
  '35-Bar Piscina',      // 4. Bar da piscina
  '17-Vista Aerea do Lazer de cima', // 5. Vista aérea de cima
  '19-Vista Aerea do Lazer v05', // 6. Vista aérea lateral
  '01-Academia',         // 7. Academia
  '12-Crossfit',         // 8. CrossFit
  '08-Quadra Poliesportiva', // 9. Quadra poliesportiva
  '10-Quadra de Volley', // 10. Beach tennis / areia
  '26-Escalada',         // 11. Muro de escalada
  '09-Futmesa',          // 12. Futmesa — diferencial único
  '06-churrasqueira',    // 13. Churrasqueira
  '33-Churrasqueira de baixo', // 14. Churrasqueira 2
  '04-salao de festas',  // 15. Salão de festas
  '03-Salao de Festas Infantil', // 16. Salão infantil
  '15-Deck Mirante',     // 17. Deck mirante
  '14-Redario',          // 18. Redário
  '13-Espaco Pet',       // 19. Espaço pet
  '29-Brinquedoteca',    // 20. Brinquedoteca
  '30-Playground',       // 21. Playground
  '18-Vista Varanda',    // 22. Vista da varanda
  '27-Coworking',        // 23. Coworking
  '31-bicicletario',     // 24. Bicicletário
  '24-Acesso',           // 25. Acesso / entrada
  '02-Jogos',            // 26. Salão de jogos
  '32-Jogos',            // 27. Jogos (versão 2)
  '28-Workshop',         // 28. Oficina / workshop
  '11-Chuveirao',        // 29. Chuveirão
  '07-Easymarketing',    // 30. Outros ângulos
]

const FOTOS_DIR = path.join(
  __dirname,
  '../drive-imagens/Vitale/Vitale View/VITALE VIEW - IMG FINAIS'
)

// Excluir versões "alta" e "altissima" (duplicatas de alta resolução)
const EXCLUIR = /([-\s]alta\.jpg|[-\s]altissima\.jpg|altissima-mais clara\.jpg)/i

// ─── SEO — arrojado para alto engajamento ─────────────────────────────────────

const SEO = {
  metaTitle:
    'Apto 2 Quartos + Vaga no Vitale View Camorim — R$ 364.990 | Aceita FGTS | Admirata',
  metaDescription:
    'Apartamento 2 quartos (40,50 m²) com vaga no Vitale View, Camorim. ' +
    '5º andar, lazer resort completo: piscina, escalada, futmesa, academia, churrasqueira e van exclusiva. ' +
    'R$ 364.990 — entrada 20%, financia qualquer banco, aceita FGTS. Consulte a Admirata.',
}

// ─── Descrição — copy Admirata arrojado ───────────────────────────────────────

const DESCRICAO_PT = `Cinco andares acima do nível da rua, com um condomínio resort embaixo e Camorim como endereço. Esta é a equação do apartamento 509 no Vitale View — um dos endereços mais completos de Jacarepaguá.

São 40,50 m² projetados com inteligência: dois quartos, varanda com 2,07 m² de área privativa adicional, e uma vaga de garagem incluída. O imóvel está pronto para morar. O condomínio é 100% concluído e a área de lazer funciona em plena capacidade desde o primeiro dia.

O que "lazer completo" significa aqui? Piscina adulto e infantil com deck molhado, bar da piscina, muro de escalada, slackline, quadra poliesportiva, quadra de areia, futmesa (o esporte de mesa jogado com os pés — um diferencial raro), academia, CrossFit, dois salões de festas, churrasqueira com forno de pizza, brinquedoteca, playground, deck mirante e trilha ecológica. São mais de 25 espaços de lazer para usar sem sair do condomínio.

Camorim é o bairro que quem conhece não troca. Verde, tranquilo, rodeado de parques — e estrategicamente conectado. Uma van exclusiva do condomínio faz o trajeto até a Estrada dos Bandeirantes. O Parque Ilha Pura e o Parque Linear do Cidade Jardim ficam a minutos. Barra da Tijuca e Recreio dos Bandeirantes estão a menos de 15 minutos.

Condições: R$ 364.990 · Entrada de 20% (R$ 72.998) · Financiamento aprovado em qualquer banco · Aceita uso do FGTS como parte do pagamento. Entre em contato — a Admirata responde no mesmo dia.`

// ─── Características ──────────────────────────────────────────────────────────

const CARACTERISTICAS = [
  { _key: 'c01', _type: 'object', grupo: 'Planta',          nome: '2 quartos · 40,50 m² de área privativa' },
  { _key: 'c02', _type: 'object', grupo: 'Planta',          nome: 'Varanda de 2,07 m²' },
  { _key: 'c03', _type: 'object', grupo: 'Planta',          nome: '1 vaga de garagem incluída' },
  { _key: 'c04', _type: 'object', grupo: 'Localização',     nome: '5º andar — andar alto com boa ventilação' },
  { _key: 'c05', _type: 'object', grupo: 'Financiamento',   nome: 'Aceita financiamento por qualquer banco' },
  { _key: 'c06', _type: 'object', grupo: 'Financiamento',   nome: 'Aceita FGTS como parte do pagamento' },
  { _key: 'c07', _type: 'object', grupo: 'Financiamento',   nome: 'Entrada de 20% — R$ 72.998' },
  { _key: 'c08', _type: 'object', grupo: 'Lazer',           nome: 'Piscina adulto e infantil com deck molhado e bar da piscina' },
  { _key: 'c09', _type: 'object', grupo: 'Lazer',           nome: 'Muro de escalada, slackline e futmesa' },
  { _key: 'c10', _type: 'object', grupo: 'Lazer',           nome: 'Academia completa e CrossFit' },
  { _key: 'c11', _type: 'object', grupo: 'Lazer',           nome: 'Quadra poliesportiva e quadra de areia' },
  { _key: 'c12', _type: 'object', grupo: 'Lazer',           nome: '2 salões de festas + churrasqueira com forno de pizza' },
  { _key: 'c13', _type: 'object', grupo: 'Lazer',           nome: 'Deck mirante e trilha ecológica' },
  { _key: 'c14', _type: 'object', grupo: 'Lazer',           nome: 'Brinquedoteca, playground e espaço pet' },
  { _key: 'c15', _type: 'object', grupo: 'Mobilidade',      nome: 'Van exclusiva até a Estrada dos Bandeirantes' },
  { _key: 'c16', _type: 'object', grupo: 'Mobilidade',      nome: 'Smart Car elétrico para deslocamento interno' },
  { _key: 'c17', _type: 'object', grupo: 'Mobilidade',      nome: 'Bicicletário e bicicletas compartilhadas' },
  { _key: 'c18', _type: 'object', grupo: 'Infraestrutura',  nome: 'Mini mercado dentro do condomínio' },
  { _key: 'c19', _type: 'object', grupo: 'Infraestrutura',  nome: 'Coworking e sala de reuniões' },
  { _key: 'c20', _type: 'object', grupo: 'Segurança',       nome: 'Portaria e segurança 24h' },
  { _key: 'c21', _type: 'object', grupo: 'Localização',     nome: 'A 15 min da Barra da Tijuca e 12 min das praias do Recreio' },
  { _key: 'c22', _type: 'object', grupo: 'Localização',     nome: 'Próximo ao Parque Ilha Pura e Parque Linear do Cidade Jardim' },
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

  // Ordena pelo prefixo de prioridade editorial; o restante vem depois
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
      ? 'Fachada do Vitale View — Condomínio em Camorim, Jacarepaguá (Rio de Janeiro)'
      : `Vitale View Camorim — ${img.file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
    principal: i === 0,
    tour360: false,
    isStaging: false,
  }))

  const doc = {
    _type: 'imovel',
    _id: IMOVEL_ID,
    titulo: 'Apartamento 2 Quartos + Vaga no Vitale View — Camorim / Jacarepaguá',
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
    preco: 364990,
    quartos: 2,
    suites: 0,
    vagas: 1,
    andar: '5°',
    areaUtil: 40.50,
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
  console.log('  Vitale View · 2 Quartos · Bloco 3 · Apto 509 · Camorim · Venda')
  console.log('══════════════════════════════════════════════════════════════\n')
  console.log('  Planta: 40,50 m² priv. + 2,07 m² varanda = 42,57 m² total')
  console.log('  Preço:  R$ 364.990 | Entrada 20% | Financia qualquer banco | Aceita FGTS\n')

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
