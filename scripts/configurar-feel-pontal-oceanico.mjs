/**
 * Configura o Feel Pontal Oceânico Nature no Sanity.
 *
 * Simulação: npx sanity exec scripts/configurar-feel-pontal-oceanico.mjs --with-user-token
 * Aplicar:   npx sanity exec scripts/configurar-feel-pontal-oceanico.mjs --with-user-token -- --apply
 */
import sanityCli from 'sanity/cli'
import { createReadStream, existsSync } from 'fs'
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { getCliClient } = sanityCli
const client = getCliClient({ apiVersion: '2024-06-01' })
const APPLY = process.argv.includes('--apply')
const SLUG = 'feel-pontal-oceanico-nature'
const IMAGE_DIR = join(__dirname, '..', 'drive-imagens', 'Calper', 'feel-pontal-oceanico', 'site-selecionadas')
const TOUR_URL = 'https://aboutavisit.com/3d-model/feel-pontal-oceanico-calper/fullscreen/'

const photos = [
  ['fachada', '01-fachada.jpg', 'Fachada diurna do Feel Pontal Oceânico Nature', 'Arquitetura integrada à paisagem', true],
  ['aerea', '02-aerea.png', 'Vista aérea do Feel Pontal Oceânico Nature', 'O conjunto e seu entorno'],
  ['fachada-noturna', '03-fachada-noturna.jpg', 'Fachada noturna do Feel Pontal Oceânico Nature', 'Fachada noturna'],
  ['portico', '04-portico.png', 'Pórtico de entrada do Feel Pontal Oceânico Nature', 'Entrada do condomínio'],
  ['piscina', '05-piscina.jpg', 'Piscina do Feel Pontal Oceânico Nature', 'Piscina e deck molhado'],
  ['academia', '06-academia.jpg', 'Academia do Feel Pontal Oceânico Nature', 'Academia'],
  ['festas', '07-salao-festas.jpg', 'Salão de festas gourmet do Feel Pontal Oceânico Nature', 'Salão de festas gourmet'],
  ['churrasqueira', '08-churrasqueira.jpg', 'Churrasqueira e pool house do Feel Pontal Oceânico Nature', 'Churrasqueira e pool house'],
  ['pet-place', '09-pet-place.jpg', 'Pet place do Feel Pontal Oceânico Nature', 'Pet place'],
  ['playground', '10-playground.png', 'Playground e redário do Feel Pontal Oceânico Nature', 'Playground e redário'],
  ['sauna', '11-sauna.png', 'Sauna com repouso do Feel Pontal Oceânico Nature', 'Sauna e repouso'],
  ['garden', '12-garden.png', 'Terraço de Garden Studio do Feel Pontal Oceânico Nature', 'Garden Studio'],
  ['varanda', '13-varanda.jpeg', 'Varanda com vista para a natureza no Feel Pontal Oceânico Nature', 'Varanda e paisagem'],
  ['apartamento', '14-apartamento.png', 'Ambiente de Studio Design do Feel Pontal Oceânico Nature', 'Studio Design'],
  ['duplex', '15-cobertura.png', 'Terraço de Studio Dúplex do Feel Pontal Oceânico Nature', 'Studio Dúplex'],
  ['detalhe', '16-detalhe-fachada.jpg', 'Detalhe dos elementos de fachada do Feel Pontal Oceânico Nature', 'Detalhe da arquitetura'],
].map(([key, file, alt, caption, cover = false]) => ({ key, file, alt, caption, cover }))

const plants = [
  ['planta-studio', 'planta-studio.jpg', 'Studio Design — 30 a 36 m²', 'Studio'],
  ['planta-garden', 'planta-garden.jpg', 'Garden Studio — 39 a 83 m²', 'Garden Studio'],
  ['planta-duplex', 'planta-cobertura.jpg', 'Studio Dúplex — 55 a 70 m²', 'Studio Dúplex'],
].map(([key, file, name, quartos]) => ({ key, file, name, quartos }))

const logo = { key: 'logo', file: 'logo.png', alt: 'Logo Feel Pontal Oceânico Nature' }
const block = (key, text, style = 'normal') => ({
  _type: 'block', _key: key, style, markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
})

const sobre = [
  block('manifesto', 'Entre a reserva, o mar e a cidade, morar encontra um ritmo mais leve.'),
  block('natureza-h2', 'A natureza continua por perto', 'h2'),
  block('natureza-p', 'O Feel Nature está no Pontal Oceânico, entre a Reserva Ambiental do Recreio e a Avenida das Américas. Praias, montanhas e áreas preservadas fazem parte da paisagem cotidiana, enquanto comércio, serviços e mobilidade permanecem acessíveis para a rotina.'),
  block('arquitetura-h2', 'Arquitetura minimalista e acolhedora', 'h2'),
  block('arquitetura-p', 'Quatro edifícios de linhas contemporâneas, tons naturais e elementos verticais formam um conjunto que conversa com o entorno. As fachadas ganham movimento com varandas e brises, e os espaços compartilhados foram distribuídos para aproximar convivência, lazer e bem-estar.'),
  block('lazer-h2', 'Menos pressa. Mais tempo vivido.', 'h2'),
  block('lazer-p', 'Piscina com deck molhado, academia, sauna, redário, playground, salão de festas gourmet, coworking, churrasqueira, pool house e espaços para pets criam diferentes possibilidades ao longo do dia. O Beach Point do CDesign Hotel estende essa experiência até a Praia do Recreio.'),
  block('plantas-h2', 'Espaços compactos que ampliam possibilidades', 'h2'),
  block('plantas-p', 'O projeto reúne Studios Design de aproximadamente 30 a 36 m², Garden Studios de 39 a 83 m² e Studios Dúplex de 55 a 70 m². São plantas pensadas para morar, receber ou construir uma rotina mais flexível, algumas com terraços descobertos e áreas externas privativas.'),
  block('conveniencia-p', 'Fechadura inteligente, aplicativo do condomínio, lavanderia compartilhada, guarda-entregas, pranchário e espaço Take It acrescentam praticidade sem tirar o foco do essencial: viver perto da natureza e deixar o dia seguir com mais leveza.'),
]

const infrastructure = [
  'Piscina', 'Deck molhado', 'Academia', 'Sauna com repouso', 'Play Kids',
  'Redário', 'Salão de festas gourmet', 'Coworking', 'Churrasqueira', 'Pool house',
  'Pet place', 'Pet care', 'Lavanderia compartilhada', 'Guarda-entregas',
  'Pranchário', 'Espaço Take It', 'Beach Point CDesign Hotel',
]

const faqs = [
  ['Quais são as tipologias do Feel Pontal Oceânico Nature?', 'O projeto reúne Studios Design de 30,20 a 35,75 m², Garden Studios de 39,36 a 83,06 m² e Studios Dúplex de 55,13 a 70,27 m².'],
  ['Quantas unidades e edifícios fazem parte do projeto?', 'A ficha técnica informa 424 unidades distribuídas em quatro blocos residenciais.'],
  ['Como é a área de lazer?', 'O condomínio apresenta piscina com deck molhado, academia, sauna, playground, redário, salão de festas gourmet, coworking, churrasqueira, pool house e espaços para pets.'],
  ['Onde fica o Feel Nature?', 'O empreendimento fica na Rua Teixeira Heizer, 1.700, no Pontal Oceânico, Recreio dos Bandeirantes, próximo à reserva ambiental e às praias da região.'],
  ['Existe visita virtual do Feel Nature?', 'Sim. A página disponibiliza acesso à experiência virtual 3D oficial do empreendimento.'],
].map(([pergunta, resposta], index) => ({ _type: 'faq', _key: `faq-${index + 1}`, pergunta, resposta }))

const allMedia = [...photos, ...plants, logo]
const missing = allMedia.filter((item) => !existsSync(join(IMAGE_DIR, item.file)))
if (missing.length) throw new Error(`Arquivos ausentes: ${missing.map((item) => item.file).join(', ')}`)

const current = await client.fetch(`*[_type == "condominio" && slug.current == $slug][0]`, { slug: SLUG })
if (!current) throw new Error(`Documento não encontrado: ${SLUG}`)

console.log(`Modo: ${APPLY ? 'APLICAR' : 'SIMULAÇÃO'}`)
console.log(`Documento: ${current.nome} (${current._id})`)
console.log(`Capa: ${photos[0].file} | Galeria: ${photos.length - 1} | Plantas: ${plants.length} | Logo: ${logo.file}`)
console.log('Unidades: 424 | Torres: 4 | Áreas: 30,20–83,06 m²')
console.log(`Visita virtual: ${TOUR_URL}`)

if (!APPLY) {
  console.log('\nNenhuma alteração foi gravada. Use --apply para confirmar.')
  process.exit(0)
}

const contentType = (file) => {
  const extension = extname(file).toLowerCase()
  return extension === '.png' ? 'image/png' : 'image/jpeg'
}
const filenameFor = (file) => `feel-pontal-oceanico-nature-${file}`
const filenames = allMedia.map((item) => filenameFor(item.file))
const existingAssets = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename in $files]{originalFilename, _id}`, { files: filenames })
const existing = new Map(existingAssets.map((asset) => [asset.originalFilename, asset._id]))
const uploaded = new Map()

for (const [index, item] of allMedia.entries()) {
  const filename = filenameFor(item.file)
  let assetId = existing.get(filename)
  process.stdout.write(`[${String(index + 1).padStart(2, '0')}/${allMedia.length}] ${item.file} ... `)
  if (!assetId) {
    const asset = await client.assets.upload('image', createReadStream(join(IMAGE_DIR, item.file)), {
      filename, contentType: contentType(item.file),
    })
    assetId = asset._id
    console.log('ok')
  } else console.log('já existente')
  uploaded.set(item.key, assetId)
}

const cover = photos.find((photo) => photo.cover)
const fotoCapa = { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(cover.key) }, alt: cover.alt }
const galeria = photos.filter((photo) => !photo.cover).map((photo) => ({
  _type: 'object', _key: photo.key,
  asset: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(photo.key) } },
  alt: photo.alt, legenda: photo.caption,
}))
const plantasBaixas = plants.map((plant) => ({
  _type: 'object', _key: plant.key, nome: plant.name, quartos: plant.quartos,
  imagem: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(plant.key) } },
}))

const patch = {
  tipo: 'vertical', construtora: 'Calper', status: current.status || 'Lançamento', forcarNoindex: false,
  numTorres: 4, numUnidades: 424, areaTotal: 10045, areaPrivativaMin: 30.2, areaPrivativaMax: 83.06,
  tipologiasDisponiveis: ['1-quarto', 'cobertura'],
  descricao: 'Studios, Gardens e Dúplex entre a reserva ambiental e o mar, com arquitetura acolhedora, lazer e serviços para uma rotina mais leve no Pontal Oceânico.',
  sobre, infraestrutura, faqs, fotoCapa, galeria, plantasBaixas, tourVirtual: TOUR_URL,
  logoEmpreendimento: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(logo.key) }, alt: logo.alt },
  geo: {
    ...(current.geo || {}),
    proximidades: ['Reserva Ambiental do Recreio', 'Praia do Pontal', 'Praia do Recreio', 'Avenida das Américas', 'BRT', 'Beach Point CDesign Hotel'],
  },
  seo: {
    ...(current.seo || {}),
    titulo: 'Feel Pontal Oceânico Nature | Studios no Recreio',
    descricao: 'Conheça o Feel Nature no Pontal Oceânico: Studios, Gardens e Dúplex próximos à reserva e às praias, com lazer, serviços e visita virtual 3D.',
  },
}

const draftId = `drafts.${current._id}`
const draft = await client.getDocument(draftId)
for (const id of draft ? [current._id, draftId] : [current._id]) {
  await client.patch(id).set(patch).commit()
  console.log(`Atualizado: ${id}`)
}

const verified = await client.fetch(`*[_id == $id][0]{nome, status, numTorres, numUnidades, areaPrivativaMin, areaPrivativaMax, tourVirtual, "capa": fotoCapa.asset->url, "logo": logoEmpreendimento.asset->url, "fotos": count(galeria), "plantas": count(plantasBaixas), "blocos": count(sobre)}`, { id: current._id })
console.log('\nVerificação final:')
console.log(JSON.stringify(verified, null, 2))
