/**
 * Cadastra o condomínio Vitale View — Camorim / Jacarepaguá
 * Uso: node scripts/cadastrar-vitale-view.mjs
 *
 * Nota: empreendimento 100% vendido pelo incorporador.
 * Admirata opera com revendas e locações de terceiros.
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

const CONDOMINIO_ID = 'condominio-vitale-view'
const BAIRRO_ID     = 'bairro-camorim'

const FOTOS_DIR = path.join(
  __dirname,
  '../drive-imagens/Vitale/Vitale View/VITALE VIEW - IMG FINAIS'
)

// Excluir versões duplicadas de alta/altíssima resolução e arquivos de mídia
// Mantém padrão, "-alta" e "altissima-mais clara compactada" (piscina — única versão)
const EXCLUIR = /([-\s]alta\.jpg|[-\s]altissima\.jpg|altissima-mais clara\.jpg|\.pdf$|\.mp4$|\.zip$)/i

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
  block('Natureza como pano de fundo, resort como estilo de vida', 'h2'),
  block(
    'O Vitale View nasceu em Camorim com uma premissa clara: oferecer o melhor de dois mundos. De um lado, a tranquilidade de um bairro cercado de parques e mata atlântica — a poucos minutos do Parque Ilha Pura, do Parque Linear do Cidade Jardim e do Rio2. Do outro, uma infraestrutura de lazer que rivaliza com os melhores resorts da região, organizada em dois ambientes imersivos: Espaço Clube e Espaço Praia.'
  ),
  block(
    'São mais de 25 espaços de lazer pensados para diferentes perfis e ritmos de vida. Quem busca movimento encontra quadra poliesportiva, quadra de areia, muro de escalada, slackline, espaço funcional na areia, academia e área de CrossFit. Quem busca descanso tem piscina adulto e infantil com deck molhado, bar da piscina, redário e deck mirante com visual privilegiado. E o diferencial que chama atenção: futmesa — o esporte de mesa jogado com os pés, que vira ponto de encontro natural entre os moradores.'
  ),
  block(
    'As tipologias do Vitale View foram desenhadas para aproveitar ao máximo cada metro quadrado. Os Gardens no térreo têm quintais privativos generosos — uma raridade em condomínios verticais. As Coberturas Duplex no 6º andar entregam terraços privativos descobertos com vista aberta, transformando o dia a dia em algo próximo de uma casa com o conforto de um condomínio com portaria 24h.'
  ),
  block(
    'A mobilidade dentro e fora do condomínio é parte do projeto. Um veículo elétrico (Smart Car) circula dentro do complexo. Uma van exclusiva leva os moradores até a Estrada dos Bandeirantes — acesso estratégico para Barra da Tijuca, Recreio e o restante da cidade. Coworking, oficina de pequenos reparos, mini mercado e bicicletário com sistema de compartilhamento completam uma equação pensada até o último detalhe.'
  ),
  block(
    'O Vitale View está 100% vendido pelo incorporador. Os imóveis disponíveis na Admirata são exclusivamente por meio de revenda ou locação de terceiros — uma oportunidade rara em um condomínio que raramente apresenta giro de carteira.'
  ),
]

const FAQS = [
  faq(
    'O Vitale View ainda tem unidades disponíveis?',
    'O Vitale View foi lançado com 360 unidades e está 100% vendido pelo incorporador. As unidades disponíveis na Admirata são exclusivamente revendas ou locações de terceiros. Entre em contato para verificar a disponibilidade atual — novas oportunidades surgem com frequência.'
  ),
  faq(
    'Onde fica o Vitale View?',
    'O Vitale View está localizado na Estrada do Caçambê, 360, no bairro Camorim, em Jacarepaguá, Rio de Janeiro. O condomínio fica próximo ao Parque Ilha Pura, ao Parque Linear do Cidade Jardim e ao Parque Linear do Rio2, com acesso fácil à Barra da Tijuca e ao Recreio dos Bandeirantes. Uma van exclusiva do condomínio leva os moradores até a Estrada dos Bandeirantes.'
  ),
  faq(
    'Quais são as tipologias do Vitale View?',
    'O Vitale View oferece apartamentos de 2 quartos (com e sem suíte, entre 40,50 e 48,73 m²), Gardens no térreo com quintais privativos (área total de até 50,80 m²) e Coberturas Duplex no 6º andar com terraços privativos descobertos (área total de até 103,20 m²). Todas as unidades têm varanda. Há ainda unidades adaptadas para PCD (1 quarto).'
  ),
  faq(
    'Qual é a infraestrutura de lazer do Vitale View?',
    'O Vitale View oferece mais de 25 espaços de lazer divididos em Espaço Clube e Espaço Praia: piscina adulto e infantil, deck molhado, bar da piscina, chuveirão, quadra poliesportiva, quadra de areia, muro de escalada, slackline, espaço funcional na areia, futmesa, academia, CrossFit, 2 salões de festas, 2 churrasqueiras (uma com forno de pizza), deck mirante, brinquedoteca, playground, espaço pet, trilha ecológica, coworking, redário e bicicletário compartilhado.'
  ),
  faq(
    'Como é a mobilidade no Vitale View?',
    'O Vitale View conta com dois serviços exclusivos de mobilidade: uma van que transporta moradores até a Estrada dos Bandeirantes (acesso para Barra da Tijuca e restante da cidade) e um Smart Car elétrico para deslocamentos dentro do condomínio. Há ainda bicicletário e sistema de bicicletas compartilhadas para uso interno.'
  ),
]

const INFRAESTRUTURA = [
  // Espaço Clube
  'Academia completa',
  'CrossFit',
  'Muro de escalada',
  'Slackline',
  'Futmesa',
  'Espaço funcional na areia',
  'Redário',
  'Coworking e sala de reuniões',
  'Oficina de pequenos reparos (Workshop)',
  'Mini mercado',
  'Bicicletário e sistema de bicicletas compartilhadas',
  // Espaço Praia
  'Piscina adulto',
  'Piscina infantil',
  'Deck molhado',
  'Bar da piscina',
  'Chuveirão',
  'Quadra poliesportiva',
  'Quadra de areia',
  // Social
  '2 Salões de Festas',
  'Salão de Festas Infantil',
  '2 Churrasqueiras (uma com forno de pizza)',
  'Deck Mirante',
  'Salão de Jogos',
  // Família
  'Brinquedoteca',
  'Playground',
  'Espaço Pet',
  'Trilha ecológica',
  // Mobilidade
  'Van exclusiva até a Estrada dos Bandeirantes',
  'Smart Car elétrico para deslocamentos internos',
  // Segurança
  'Portaria e segurança 24h',
  '360 vagas para bicicletas',
  'Vagas para PCD e motos',
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

  console.log(`📸 ${files.length} fotos selecionadas. Iniciando upload...\n`)
  const uploaded = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(FOTOS_DIR, file)
    const ext = path.extname(file).toLowerCase()
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg'
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

// ─── Criação do condomínio ─────────────────────────────────────────────────────

async function createCondominio(uploadedImages) {
  // Primeira imagem boa como capa: fachada (arquivo 23) vem no índice ~18
  // O sort() garante ordem numérica pelo prefixo. A fachada (23-) será a capa.
  const capaIdx = uploadedImages.findIndex(img => img.file.startsWith('23-Fachada'))
  const capaEntry = capaIdx >= 0 ? uploadedImages[capaIdx] : uploadedImages[0]

  const fotoCapa = {
    _type: 'image',
    asset: { _type: 'reference', _ref: capaEntry.assetId },
    alt: 'Vitale View — Fachada do condomínio em Camorim, Jacarepaguá',
  }

  const galeria = uploadedImages
    .filter((_, i) => i !== capaIdx)
    .map((img, i) => ({
      _type: 'object',
      _key: `gal-${String(i).padStart(3, '0')}`,
      asset: { _type: 'reference', _ref: img.assetId },
      alt: `Vitale View — ${img.file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
    }))

  const doc = {
    _type: 'condominio',
    _id: CONDOMINIO_ID,
    nome: 'Vitale View',
    slug: { _type: 'slug', current: 'vitale-view' },
    bairro: { _type: 'reference', _ref: BAIRRO_ID },
    tipo: 'condominio-fechado',
    construtora: 'Vitale',
    status: 'Pronto para Morar',
    numTorres: 5,
    numUnidades: 360,
    areaTotal: 41063,
    areaPrivativaMin: 40,
    areaPrivativaMax: 103,
    tipologiasDisponiveis: ['2-quartos', 'garden', 'cobertura'],
    videoUrl: 'https://youtu.be/yixMTPRyI5c?si=kmU-JGD3WDXlJsl5',
    infraestrutura: INFRAESTRUTURA,
    sobre: SOBRE,
    faqs: FAQS,
    ordem: 20,
    forcarNoindex: false,
    geo: {
      lat: -22.9872,
      lng: -43.4219,
      proximidades: [
        'Parque Ilha Pura',
        'Parque Linear do Cidade Jardim',
        'Parque Linear do Rio2',
        'Estrada dos Bandeirantes (van exclusiva)',
        'Barra da Tijuca (15 min)',
        'Recreio dos Bandeirantes (12 min)',
        'Shopping Cristal Mall',
      ],
    },
    seo: {
      titulo: 'Vitale View Camorim — Revendas e Locações | Admirata Imóveis',
      descricao:
        'Condomínio Vitale View em Camorim: apartamentos 2Q, Gardens e Coberturas Duplex. ' +
        '25+ itens de lazer — piscina, escalada, futmesa, van exclusiva e Smart Car elétrico. ' +
        'Revenda e locação disponíveis via Admirata.',
    },
    fotoCapa,
    galeria,
  }

  console.log('\n📝 Criando documento do condomínio no Sanity...')
  const result = await client.createOrReplace(doc)
  console.log(`✅ Condomínio criado! _id: ${result._id}`)
  console.log(`\n🔗 Site:   https://admirata.com.br/condominios/vitale-view`)
  console.log(`📋 Studio: https://gvf51tpc.sanity.studio/structure/condominio;${CONDOMINIO_ID}\n`)

  return result
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('══════════════════════════════════════════════════════════')
  console.log('  Admirata — Cadastro de Condomínio')
  console.log('  Vitale View · Camorim / Jacarepaguá')
  console.log('══════════════════════════════════════════════════════════\n')

  const uploaded = await uploadImages()
  console.log(`\n✅ ${uploaded.length} fotos enviadas ao Sanity\n`)

  if (uploaded.length === 0) {
    console.error('❌ Nenhuma imagem foi enviada. Verifique o caminho das fotos.')
    process.exit(1)
  }

  await createCondominio(uploaded)
  console.log('🎉 Cadastro concluído com sucesso!')
  console.log('\n💡 Próximo passo: cadastrar as unidades de revenda/locação')
  console.log('   via scripts individuais com condicao="pronto".')
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
