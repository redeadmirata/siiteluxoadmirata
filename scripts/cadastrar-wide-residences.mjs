/**
 * Cadastra o condomínio Wide Residences — Calper / Recreio dos Bandeirantes
 * Uso: node scripts/cadastrar-wide-residences.mjs
 *
 * - Faz upload das fotos (excluindo imagens de obra, logos e ícones)
 * - Cria o documento do tipo 'condominio' no Sanity
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const key = () => randomBytes(6).toString('hex')

const TOKEN = 'skH4t0uLAlJq61v4EFHVonFwZKdqoletaPwax5eiI1YmGlqVkE1Z6AXPEIcBPbqHQLggEf9ZNxPNv1ERPbnX0CUx1aWiBqipQaMfBu3O280929p6pkBnDK0ScGCAtAKSS8JwYxI6EhNQKoCrU6joRc5gKJLl4GtvHGQfIBUlRR5tpDNTIdFp'

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: TOKEN,
  useCdn: false,
})

const CONDOMINIO_ID  = 'condominio-wide-residences'
const BAIRRO_ID      = 'bairro-recreio-dos-bandeirantes'

const FOTOS_DIR = path.join(
  __dirname,
  '../drive-imagens/Calper/Wide Residences/Wide Residences - Calper/Wide Residences - Calper'
)

// Padrões a excluir: obras, logos, ícones, whatsapp, arquivos default
const EXCLUIR = /andamento-obra|calper-horiz|calper-neg|translate_24dp|default\.svg|whatsapp/i

// ─── Copy Admirata ─────────────────────────────────────────────────────────────

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

const faq = (pergunta, resposta) => ({
  _type: 'object',
  _key: key(),
  pergunta,
  resposta,
})

const SOBRE = [
  block('Design que define a Barra Bonita', 'h2'),
  block(
    'Erguido na Barra Bonita como um ícone contemporâneo do Recreio dos Bandeirantes, o Wide Residences chegou para redefinir o que significa morar bem na Zona Oeste do Rio de Janeiro. Torre única de 25 pavimentos, fachada de vidro que dialoga com a luz natural e uma localização estratégica ao lado do Recreio Shopping — tudo combinado com mais de 20 espaços de lazer que transformam o cotidiano em experiência.'
  ),
  block(
    'A Varanda Infinity é a assinatura do Wide: piso nivelado entre sala e varanda, fechamento em cortina de vidro entregue pela construtora. Não há fronteira entre interior e exterior — o apartamento se expande para o ar aberto, para a luz e para a vista. É um detalhe que parece pequeno até o momento em que você vive nele.'
  ),
  block(
    'No rooftop, a piscina cinematográfica com borda infinita oferece uma das vistas mais impressionantes da região. Ao redor dela: bar da piscina, solarium e a sensação de estar acima da cidade. Abaixo, quadra de tênis em saibro, beach tennis, academia com área de crossfit ao ar livre, SPA com sauna e repouso, três churrasqueiras, salão gourmet e uma infraestrutura pensada para cada ritmo de vida.'
  ),
  block(
    'A inteligência do Wide vai além do concreto e do vidro. Fechadura smart com abertura por aplicativo, reconhecimento facial nos acessos, vagas com carregadores para veículos elétricos, guarda-entregas inteligente e vending machines disponíveis 24 horas. E para quem precisa chegar ao metrô: ônibus privativo até a estação Jardim Oceânico — um benefício raro que simplifica a mobilidade urbana sem abrir mão da tranquilidade do Recreio.'
  ),
]

const FAQS = [
  faq(
    'O Wide Residences está pronto para morar?',
    'Sim. O Wide Residences é um empreendimento concluído e pronto para morar, localizado na Barra Bonita, Recreio dos Bandeirantes. As unidades disponíveis podem ser adquiridas com condições especiais de financiamento pela construtora Calper — sem banco, sem juros e sem comprovação de renda.'
  ),
  faq(
    'Como funciona o financiamento pela Calper?',
    'O Wide Residences é comercializado pela Calper com a modalidade "Obra por Administração": financiamento direto com a construtora, sem intermediação bancária. Isso significa sem juros bancários, sem comprovação de renda no modelo tradicional e condições personalizadas para cada comprador. Entre em contato com nossa equipe para entender as condições vigentes.'
  ),
  faq(
    'Quais tipologias estão disponíveis no Wide Residences?',
    'O Wide Residences oferece apartamentos de 2 quartos com suíte (74 a 88 m²), apartamentos de 3 quartos com suíte (90 a 116 m²) e coberturas duplex de 2 e 3 quartos (139 a 220 m²). Todas as unidades contam com Varanda Infinity: fechamento de vidro e piso nivelado com a sala, entregues prontos pela construtora.'
  ),
  faq(
    'O que é a Varanda Infinity do Wide Residences?',
    'A Varanda Infinity é o grande diferencial do Wide Residences: o piso da varanda é nivelado com o piso da sala e o fechamento é feito por cortina de vidro panorâmica, entregue já instalada pela construtora. O resultado é um ambiente mais amplo, integrado e com luminosidade máxima — sem obras adicionais necessárias para o morador.'
  ),
  faq(
    'Qual é a localização do Wide Residences?',
    'O Wide Residences está localizado na Barra Bonita, uma das sub-regiões em maior crescimento do Recreio dos Bandeirantes, ao lado do Recreio Shopping. O condomínio oferece ônibus privativo até a estação de metrô Jardim Oceânico, garantindo fácil acesso à Barra da Tijuca e ao restante da cidade.'
  ),
]

const INFRAESTRUTURA = [
  'Piscina cinematográfica com borda infinita no terraço',
  'Bar da piscina',
  'Quadra de Tênis em Saibro',
  'Quadra de Beach Tennis',
  'Quadra Polivalente',
  'Academia completa com área de CrossFit ao ar livre',
  'SPA — sauna, repouso e sala de massagem',
  'Salão de Festas Gourmet com lounge externo',
  'Salão de Jogos e Sala Multiuso',
  'Brinquedoteca e Playground',
  'Coworking e Sala de Reuniões',
  'Redário',
  'Dog Park',
  '3 Churrasqueiras',
  'Ônibus privativo até a estação Jardim Oceânico',
  'Fechadura Smart com abertura por aplicativo',
  'Reconhecimento facial nos acessos',
  'Vagas com tomadas para carros elétricos',
  'Lavanderia compartilhada',
  'Guarda-entregas inteligente',
  'Vending machines 24 horas (Espaço Take IT)',
  'Bicicletário e Pranchário',
  'Espaço de ferramentas compartilhadas',
  'Segurança 24h',
  'Aplicativo exclusivo do condomínio',
]

// ─── Upload de imagens ─────────────────────────────────────────────────────────

async function uploadImages() {
  let files
  try {
    files = (await readdir(FOTOS_DIR))
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .filter(f => !EXCLUIR.test(f))
      .sort()
  } catch (err) {
    console.error(`❌ Pasta não encontrada: ${FOTOS_DIR}`)
    throw err
  }

  console.log(`📸 ${files.length} fotos selecionadas (obras excluídas). Iniciando upload...\n`)
  const uploaded = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(FOTOS_DIR, file)
    const ext = path.extname(file).toLowerCase()
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg'
    process.stdout.write(`  [${String(i + 1).padStart(3)}/${files.length}] ${file} ... `)

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

// ─── Criação do condomínio ─────────────────────────────────────────────────────

async function createCondominio(uploadedImages) {
  // Primeira imagem = capa; demais = galeria
  const [capa, ...resto] = uploadedImages

  const fotoCapa = capa ? {
    _type: 'image',
    asset: { _type: 'reference', _ref: capa.assetId },
    alt: 'Wide Residences — Recreio dos Bandeirantes',
  } : undefined

  const galeria = resto.map((img, i) => ({
    _type: 'object',
    _key: `gal-${String(i).padStart(3, '0')}`,
    asset: { _type: 'reference', _ref: img.assetId },
    alt: `Wide Residences — foto ${i + 2}`,
  }))

  const doc = {
    _type: 'condominio',
    _id: CONDOMINIO_ID,
    nome: 'Wide Residences',
    slug: { _type: 'slug', current: 'wide-residences' },
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    tipo: 'vertical',
    construtora: 'Calper',
    status: 'Pronto para Morar',
    numTorres: 1,
    numUnidades: 336,
    areaPrivativaMin: 74,
    areaPrivativaMax: 220,
    tipologiasDisponiveis: ['2-quartos', '3-quartos', 'cobertura'],
    videoUrl: 'https://youtu.be/PKCCAwjr3Wo?si=XBHySjGB4XCF06Ji',
    infraestrutura: INFRAESTRUTURA,
    sobre: SOBRE,
    faqs: FAQS,
    ordem: 10,
    forcarNoindex: false,
    geo: {
      lat: -23.0118,
      lng: -43.4526,
      proximidades: [
        'Recreio Shopping',
        'Praias do Recreio',
        'Parque Olímpico',
        'Estação de metrô Jardim Oceânico (ônibus privativo)',
        'Barra da Tijuca',
      ],
    },
    seo: {
      titulo: 'Wide Residences Calper — Recreio dos Bandeirantes | Admirata Imóveis',
      descricao:
        'Condomínio vertical pronto para morar no Recreio dos Bandeirantes. ' +
        'Varanda Infinity, piscina de borda infinita no terraço, ônibus privativo até o metrô. ' +
        '2 e 3 quartos + coberturas (74 a 220 m²). Financiamento direto Calper — sem banco, sem juros.',
    },
    ...(fotoCapa && { fotoCapa }),
    ...(galeria.length > 0 && { galeria }),
  }

  console.log('\n📝 Criando documento do condomínio no Sanity...')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Condomínio criado! _id: ${result._id}`)
  console.log(`\n🔗 Site:   https://admirata.com.br/condominios/wide-residences`)
  console.log(`📋 Studio: https://gvf51tpc.sanity.studio/structure/condominio;${CONDOMINIO_ID}\n`)

  return result
}

// ─── Adicionar Wide ao set-condicao-calper ─────────────────────────────────────

async function atualizarCalperScript() {
  console.log('\n💡 Lembrete: adicione "condominio-wide-residences" à lista CALPER_CONDOMINIOS')
  console.log('   em scripts/set-condicao-calper.mjs para que futuros imóveis do Wide')
  console.log('   recebam automaticamente condicao="obra-administracao".\n')
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('══════════════════════════════════════════════════════════')
  console.log('  Admirata — Cadastro de Condomínio')
  console.log('  Wide Residences · Calper · Recreio dos Bandeirantes')
  console.log('══════════════════════════════════════════════════════════\n')

  const uploaded = await uploadImages()
  console.log(`\n✅ ${uploaded.length} fotos enviadas ao Sanity\n`)

  if (uploaded.length === 0) {
    console.error('❌ Nenhuma imagem foi enviada. Verifique o caminho das fotos.')
    process.exit(1)
  }

  await createCondominio(uploaded)
  await atualizarCalperScript()

  console.log('🎉 Cadastro concluído com sucesso!')
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
