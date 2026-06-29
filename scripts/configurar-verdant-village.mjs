/**
 * Configura mídia e localização do condomínio Verdant Village no Sanity.
 *
 * Simulação (padrão): npx sanity exec scripts/configurar-verdant-village.mjs --with-user-token
 * Aplicar:             npx sanity exec scripts/configurar-verdant-village.mjs --with-user-token -- --apply
 *
 * O script é idempotente e preserva os demais campos já cadastrados.
 */

import sanityCli from 'sanity/cli'
import { createReadStream } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { getCliClient } = sanityCli
const client = getCliClient({
  apiVersion: '2024-06-01',
})

const APPLY = process.argv.includes('--apply')
const DOCUMENT_ID = 'd2f62c50-1c8e-412f-b18c-499df053ffd0'
const IMAGE_DIR = join(
  __dirname,
  '..',
  'drive-imagens',
  'Verdant Village',
  'verdant-village-galeria-26-11-2019-14-28-11-153'
)

const logo = {
  file: 'Logo png.png',
  alt: 'Logo Verdant Village Residence',
}

const images = [
  {
    key: 'capa-fachada',
    file: 'original-26-11-2019-14-27-57-607-verdant-village.jpg',
    alt: 'Fachada do condomínio Verdant Village no Camorim',
    caption: 'Verdant Village',
    cover: true,
  },
  {
    key: 'entrada-principal',
    file: 'original-26-11-2019-14-28-00-279-verdant-village.jpg',
    alt: 'Entrada principal do condomínio Verdant Village',
    caption: 'Entrada principal',
  },
  {
    key: 'fachada-acesso',
    file: 'original-26-11-2019-14-28-09-466-verdant-village.jpg',
    alt: 'Fachada e acesso do Verdant Village',
    caption: 'Fachada e acesso',
  },
  {
    key: 'area-externa-01',
    file: 'original-26-11-2019-14-27-49-623-verdant-village.jpg',
    alt: 'Área externa arborizada do Verdant Village',
    caption: 'Área externa',
  },
  {
    key: 'area-externa-02',
    file: 'original-26-11-2019-14-27-50-779-verdant-village.jpg',
    alt: 'Paisagismo do condomínio Verdant Village',
    caption: 'Paisagismo',
  },
  {
    key: 'convivencia-01',
    file: 'original-26-11-2019-14-27-46-435-verdant-village.jpg',
    alt: 'Espaço de convivência ao ar livre do Verdant Village',
    caption: 'Convivência ao ar livre',
  },
  {
    key: 'convivencia-02',
    file: 'original-26-11-2019-14-27-47-388-verdant-village.jpg',
    alt: 'Área comum do condomínio Verdant Village',
    caption: 'Área comum',
  },
  {
    key: 'convivencia-03',
    file: 'original-26-11-2019-14-27-48-419-verdant-village.jpg',
    alt: 'Área de convivência integrada à natureza no Verdant Village',
    caption: 'Integração com a natureza',
  },
  {
    key: 'gourmet-01',
    file: 'original-26-11-2019-14-27-43-138-verdant-village.jpg',
    alt: 'Espaço gourmet do condomínio Verdant Village',
    caption: 'Espaço gourmet',
  },
  {
    key: 'gourmet-02',
    file: 'original-26-11-2019-14-27-43-919-verdant-village.jpg',
    alt: 'Salão gourmet do Verdant Village',
    caption: 'Salão gourmet',
  },
  {
    key: 'gourmet-03',
    file: 'original-26-11-2019-14-27-44-810-verdant-village.jpg',
    alt: 'Ambiente interno do salão gourmet do Verdant Village',
    caption: 'Salão gourmet',
  },
  {
    key: 'gourmet-04',
    file: 'original-26-11-2019-14-27-45-607-verdant-village.jpg',
    alt: 'Área social do condomínio Verdant Village',
    caption: 'Área social',
  },
  {
    key: 'natureza-01',
    file: 'original-26-11-2019-14-27-54-216-verdant-village.jpg',
    alt: 'Caminho cercado pela natureza próximo ao Verdant Village',
    caption: 'Natureza ao redor',
  },
  {
    key: 'natureza-02',
    file: 'original-26-11-2019-14-27-55-372-verdant-village.jpg',
    alt: 'Área verde próxima ao condomínio Verdant Village',
    caption: 'Área verde',
  },
  {
    key: 'clube-aereo-01',
    file: 'original-26-11-2019-14-28-01-560-verdant-village.jpg',
    alt: 'Vista aérea do Grand Club Verdant',
    caption: 'Grand Club Verdant',
  },
  {
    key: 'clube-aereo-02',
    file: 'original-26-11-2019-14-28-02-700-verdant-village.jpg',
    alt: 'Piscinas e áreas esportivas do Grand Club Verdant',
    caption: 'Lazer e esportes',
  },
  {
    key: 'clube-aereo-03',
    file: 'original-26-11-2019-14-28-05-138-verdant-village.jpg',
    alt: 'Estrutura de lazer do Grand Club Verdant',
    caption: 'Estrutura de lazer',
  },
  {
    key: 'clube-aereo-04',
    file: 'original-26-11-2019-14-28-08-263-verdant-village.jpg',
    alt: 'Vista panorâmica do Grand Club Verdant',
    caption: 'Vista panorâmica do clube',
  },
]

const current = await client.getDocument(DOCUMENT_ID)
if (!current) {
  console.error(`Documento não encontrado: ${DOCUMENT_ID}`)
  process.exit(1)
}

const draftId = `drafts.${DOCUMENT_ID}`
const draft = await client.getDocument(draftId)
const targetIds = draft ? [DOCUMENT_ID, draftId] : [DOCUMENT_ID]

console.log(`Modo: ${APPLY ? 'APLICAR' : 'SIMULAÇÃO'}`)
console.log(`Documento: ${current.nome} (${current.slug?.current})`)
console.log(`Alvos: ${targetIds.join(', ')}`)
console.log(`Capa: ${images.find((image) => image.cover)?.file}`)
console.log(`Galeria: ${images.filter((image) => !image.cover).length} imagens`)
console.log(`Logo: ${logo.file}`)
console.log('Mapa: -22.970832, -43.4217423')
console.log('Construtora: Living Construtora')
console.log('SEO: Verdant Village — Condomínio no Camorim')

if (!APPLY) {
  console.log('\nNenhuma alteração foi gravada. Use --apply para confirmar.')
  process.exit(0)
}

const uploaded = new Map()
const existingAssets = await client.fetch(
  `*[_type == "sanity.imageAsset" && originalFilename in $files]{originalFilename, _id}`,
  { files: [...images.map((image) => image.file), logo.file] }
)
const assetsByFilename = new Map(
  existingAssets.map((asset) => [asset.originalFilename, asset._id])
)

for (const [index, image] of images.entries()) {
  process.stdout.write(`[${String(index + 1).padStart(2, '0')}/${images.length}] ${image.file} ... `)
  const existingAssetId = assetsByFilename.get(image.file)
  if (existingAssetId) {
    uploaded.set(image.key, existingAssetId)
    console.log('já existente')
    continue
  }
  const asset = await client.assets.upload('image', createReadStream(join(IMAGE_DIR, image.file)), {
    filename: image.file,
    contentType: 'image/jpeg',
  })
  uploaded.set(image.key, asset._id)
  console.log('ok')
}

let logoAssetId = assetsByFilename.get(logo.file)
if (logoAssetId) {
  console.log(`[logo] ${logo.file} ... já existente`)
} else {
  process.stdout.write(`[logo] ${logo.file} ... `)
  const logoAsset = await client.assets.upload(
    'image',
    createReadStream(join(IMAGE_DIR, logo.file)),
    {
      filename: logo.file,
      contentType: 'image/png',
    }
  )
  logoAssetId = logoAsset._id
  console.log('ok')
}

const cover = images.find((image) => image.cover)
const fotoCapa = {
  _type: 'image',
  asset: { _type: 'reference', _ref: uploaded.get(cover.key) },
  alt: cover.alt,
}

const galeria = images
  .filter((image) => !image.cover)
  .map((image) => ({
    _type: 'object',
    _key: image.key,
    asset: {
      _type: 'image',
      asset: { _type: 'reference', _ref: uploaded.get(image.key) },
    },
    alt: image.alt,
    legenda: image.caption,
  }))

for (const id of targetIds) {
  const source = id === DOCUMENT_ID ? current : draft
  await client
    .patch(id)
    .set({
      fotoCapa,
      galeria,
      logoEmpreendimento: {
        _type: 'image',
        asset: { _type: 'reference', _ref: logoAssetId },
        alt: logo.alt,
      },
      construtora: 'Living Construtora',
      geo: {
        ...(source.geo || {}),
        lat: -22.970832,
        lng: -43.4217423,
      },
      seo: {
        ...(source.seo || {}),
        titulo: 'Verdant Village — Condomínio no Camorim',
        descricao:
          'Conheça o Verdant Village no Camorim: apartamentos de 2 e 3 quartos, áreas de convivência e acesso ao Grand Club Verdant.',
      },
    })
    .commit()
  console.log(`Atualizado: ${id}`)
}

const verified = await client.fetch(
  `*[_id == $id][0]{nome, construtora, geo, "capa": fotoCapa.asset->url, "fotos": count(galeria)}`,
  { id: DOCUMENT_ID }
)

console.log('\nVerificação final:')
console.log(JSON.stringify(verified, null, 2))
