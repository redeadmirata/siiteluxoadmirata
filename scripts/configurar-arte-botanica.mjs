/**
 * Configura conteúdo, mídia e plantas do Arte Botânica no Sanity.
 *
 * Simulação: npx sanity exec scripts/configurar-arte-botanica.mjs --with-user-token
 * Aplicar:   npx sanity exec scripts/configurar-arte-botanica.mjs --with-user-token -- --apply
 */

import sanityCli from 'sanity/cli'
import { createReadStream, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { getCliClient } = sanityCli
const client = getCliClient({ apiVersion: '2024-06-01' })

const APPLY = process.argv.includes('--apply')
const DOCUMENT_ID = 'condominio-arte-botanica'
const IMAGE_DIR = join(__dirname, '..', 'drive-imagens', 'Calper', 'Arte Botânica')

const images = [
  ['fachada', '01-fachada.jpg', 'Fachada do Arte Botânica integrada ao paisagismo', 'Arquitetura e natureza', true],
  ['piscina', '02-piscina.jpg', 'Piscina do Arte Botânica entre os edifícios', 'Parque aquático'],
  ['parque-aquatico', '03-parque-aquatico.jpg', 'Parque aquático do Arte Botânica', 'Água, sol e paisagismo'],
  ['piscina-infantil', '04-piscina-infantil.jpg', 'Piscina infantil com brinquedos aquáticos', 'Piscina infantil'],
  ['alameda', '05-alameda.jpg', 'Alameda arborizada e áreas de lazer do Arte Botânica', 'Uma paisagem para viver todos os dias'],
  ['varanda', '06-varanda.jpg', 'Vista da varanda para o paisagismo do Cidade Arte', 'Vista para o verde'],
  ['fitness-externo', '07-fitness-externo.jpg', 'Espaço fitness externo do Arte Botânica', 'Fitness externo'],
  ['academia', '08-academia.jpg', 'Academia do Arte Botânica integrada à área externa', 'Academia'],
  ['churrasqueira', '09-churrasqueira.jpg', 'Churrasqueira em meio ao paisagismo', 'Convivência ao ar livre'],
  ['playground', '10-playground.jpg', 'Playground infantil do Arte Botânica', 'Playground'],
  ['salao-festas', '11-salao-festas.jpg', 'Salão de festas com abertura para o jardim', 'Salão de festas'],
  ['coworking', '12-coworking.jpg', 'Coworking do Arte Botânica', 'Coworking'],
  ['spa', '13-spa.jpg', 'Spa e espaço de relaxamento do Arte Botânica', 'Spa'],
  ['brinquedoteca', '14-brinquedoteca.jpg', 'Brinquedoteca do Arte Botânica', 'Brinquedoteca'],
  ['townhouse', '15-townhouse.jpg', 'Área externa privativa de uma Townhouse do Arte Botânica', 'Townhouse'],
  ['lobby', '16-lobby.jpg', 'Lobby do Arte Botânica com elementos naturais', 'Lobby'],
].map(([key, file, alt, caption, cover = false]) => ({ key, file, alt, caption, cover }))

const plants = [
  ['planta-2q', 'planta-2-quartos.jpg', 'Apartamento de 2 quartos', '2 quartos'],
  ['planta-3q', 'planta-3-quartos.jpg', 'Apartamento de 3 quartos', '3 quartos', 74],
  ['planta-up-garden', 'planta-up-garden.jpg', 'Up Garden', '2 ou 3 quartos'],
  ['planta-cobertura', 'planta-cobertura-duplex.jpg', 'Cobertura Dúplex', '2 ou 3 quartos'],
].map(([key, file, name, quartos, area]) => ({ key, file, name, quartos, area }))

const block = (key, text, style = 'normal') => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
})

const sobre = [
  block('manifesto', 'A natureza não está apenas na paisagem. Ela participa da arquitetura, da luz e da rotina.'),
  block('titulo-arquitetura', 'Morar entre arquitetura e natureza', 'h2'),
  block('texto-arquitetura', 'No Arte Botânica, os quatro edifícios se abrem para o verde do Cidade Arte. Varandas, grandes aberturas, concreto aparente e jardins verticais criam uma relação contínua entre os ambientes internos e a paisagem — uma arquitetura pensada para receber luz natural e fazer o dia respirar com mais calma.'),
  block('titulo-ritmos', 'Espaços para diferentes ritmos', 'h2'),
  block('texto-ritmos', 'O parque aquático reúne piscina adulto, raia de 25 metros, deck molhado, biribol e piscina infantil com toboágua. Ao redor, academia, fitness externo, quadras, playgrounds, churrasqueira, spa, sauna, salão de festas, coworking e espaços para crianças e pets permitem que cada morador encontre sua própria maneira de aproveitar o tempo.'),
  block('titulo-casa', 'Casas que acompanham diferentes momentos', 'h2'),
  block('texto-casa', 'As plantas incluem apartamentos de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 60 a 197 m². Há opções com jardins, terraços e espaços externos privativos para quem deseja estar ainda mais perto do verde.'),
  block('texto-rotina', 'Na rotina, serviços compartilhados, espaço para entregas, fechadura inteligente e transporte condominial até o metrô Jardim Oceânico acrescentam conveniência sem tirar o protagonismo do essencial: morar em um lugar onde arquitetura, paisagismo e vida cotidiana foram pensados como uma só experiência.'),
]

const infraestrutura = [
  'Piscina adulto', 'Raia de 25 metros', 'Deck molhado', 'Biribol',
  'Piscina infantil com toboágua', 'Academia', 'Fitness externo',
  'Quadra de areia / beach tennis', 'Quadra poliesportiva', 'Playground',
  'Brinquedoteca', 'Salão de festas', 'Churrasqueira', 'Coworking',
  'Spa', 'Sauna', 'Espaço massagem', 'Home cinema', 'Espaço gamer',
  'Pet place', 'Pet care', 'Lavanderia compartilhada', 'Ferramentas compartilhadas',
]

const faqs = [
  ['Quais são as tipologias do Arte Botânica?', 'O projeto reúne apartamentos de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 60 a 197 m².'],
  ['Quantas unidades e edifícios fazem parte do projeto?', 'O Arte Botânica é formado por quatro edifícios e 548 unidades ao todo, incluindo apartamentos, Townhouses e lojas.'],
  ['Como é a área de lazer?', 'A área de lazer inclui parque aquático, raia de 25 metros, piscinas adulto e infantil, academia, quadras, playgrounds, spa, sauna, salão de festas, coworking e outros espaços de convivência.'],
  ['Onde fica o Arte Botânica?', 'O empreendimento fica no Cidade Arte, na Barra Olímpica, em endereço informado pela incorporadora como Avenida Antônio Gallotti, 2.4 SE – Barra, Rio de Janeiro.'],
  ['Qual é o status do empreendimento?', 'A incorporadora Calper informa atualmente o Arte Botânica com status de obras.'],
].map(([pergunta, resposta], index) => ({ _type: 'faq', _key: `faq-${index + 1}`, pergunta, resposta }))

const allFiles = [...images, ...plants].map((item) => item.file)
const missing = allFiles.filter((file) => !existsSync(join(IMAGE_DIR, file)))

const current = await client.getDocument(DOCUMENT_ID)
if (!current) throw new Error(`Documento não encontrado: ${DOCUMENT_ID}`)

console.log(`Modo: ${APPLY ? 'APLICAR' : 'SIMULAÇÃO'}`)
console.log(`Documento: ${current.nome} (${current.slug?.current})`)
console.log(`Capa: ${images.find((image) => image.cover).file}`)
console.log(`Galeria: ${images.filter((image) => !image.cover).length} imagens`)
console.log(`Plantas: ${plants.length}`)
console.log(`Sobre: ${sobre.length} blocos`)
console.log(`Infraestrutura: ${infraestrutura.length} itens`)
if (missing.length) throw new Error(`Arquivos ausentes: ${missing.join(', ')}`)

if (!APPLY) {
  console.log('\nNenhuma alteração foi gravada. Use --apply para confirmar.')
  process.exit(0)
}

const filenameFor = (file) => `arte-botanica-${file}`
const existingAssets = await client.fetch(
  `*[_type == "sanity.imageAsset" && originalFilename in $files]{originalFilename, _id}`,
  { files: allFiles.map(filenameFor) }
)
const assetsByFilename = new Map(existingAssets.map((asset) => [asset.originalFilename, asset._id]))
const uploaded = new Map()

for (const [index, item] of [...images, ...plants].entries()) {
  const filename = filenameFor(item.file)
  process.stdout.write(`[${String(index + 1).padStart(2, '0')}/${allFiles.length}] ${filename} ... `)
  let assetId = assetsByFilename.get(filename)
  if (!assetId) {
    const asset = await client.assets.upload('image', createReadStream(join(IMAGE_DIR, item.file)), {
      filename,
      contentType: 'image/jpeg',
    })
    assetId = asset._id
    console.log('ok')
  } else {
    console.log('já existente')
  }
  uploaded.set(item.key, assetId)
}

const cover = images.find((image) => image.cover)
const fotoCapa = {
  _type: 'image',
  asset: { _type: 'reference', _ref: uploaded.get(cover.key) },
  alt: cover.alt,
}

const galeria = images.filter((image) => !image.cover).map((image) => ({
  _type: 'object',
  _key: image.key,
  asset: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(image.key) } },
  alt: image.alt,
  legenda: image.caption,
}))

const plantasBaixas = plants.map((plant) => ({
  _type: 'object',
  _key: plant.key,
  nome: plant.name,
  quartos: plant.quartos,
  ...(plant.area ? { area: plant.area } : {}),
  imagem: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(plant.key) } },
}))

const patch = {
  tipo: 'vertical',
  construtora: 'Calper',
  status: 'Em obras',
  forcarNoindex: false,
  numTorres: 4,
  numUnidades: 548,
  areaTotal: 15963.09,
  areaPrivativaMin: 60,
  areaPrivativaMax: 197,
  tipologiasDisponiveis: ['2-quartos', '3-quartos', 'cobertura'],
  descricao: 'Arquitetura e paisagismo formam uma só experiência no Arte Botânica, com moradias de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex no Cidade Arte.',
  sobre,
  infraestrutura,
  faqs,
  fotoCapa,
  galeria,
  plantasBaixas,
  seo: {
    ...(current.seo || {}),
    titulo: 'Arte Botânica | Cidade Arte Barra',
    descricao: 'Conheça o Arte Botânica no Cidade Arte: arquitetura integrada ao verde, plantas de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex.',
  },
}

const draftId = `drafts.${DOCUMENT_ID}`
const draft = await client.getDocument(draftId)
const targetIds = draft ? [DOCUMENT_ID, draftId] : [DOCUMENT_ID]

for (const id of targetIds) {
  await client.patch(id).set(patch).commit()
  console.log(`Atualizado: ${id}`)
}

const verified = await client.fetch(
  `*[_id == $id][0]{nome, status, construtora, numTorres, numUnidades, areaPrivativaMin, areaPrivativaMax, "capa": fotoCapa.asset->url, "fotos": count(galeria), "plantas": count(plantasBaixas), "blocos": count(sobre), "infra": count(infraestrutura)}`,
  { id: DOCUMENT_ID }
)
console.log('\nVerificação final:')
console.log(JSON.stringify(verified, null, 2))
