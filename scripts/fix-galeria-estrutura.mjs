// scripts/fix-galeria-estrutura.mjs
// Corrige a estrutura da galeria e fotoCapa nos condomínios — o upload anterior
// gravou um nível extra de aninhamento que o GROQ não consegue resolver.
//
// ANTES (errado):
//   galeria[].asset = { _type: 'image', asset: { _ref: 'image-xxx' } }
//   fotoCapa = { asset: { _type: 'image', asset: { _ref: '...' } }, alt: '...' }
//
// DEPOIS (correto):
//   galeria[].asset = { _type: 'reference', _ref: 'image-xxx' }
//   fotoCapa = { _type: 'image', asset: { _ref: '...' } }
//
// Rode: node scripts/fix-galeria-estrutura.mjs

import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'

const key = () => randomBytes(6).toString('hex')

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skqIL1rWOGnkDwVwghYYe8BjuR1wRITr9LRHsUouSG3j0qFBqfRwAZcTRpNbHVP7VBBKQTB9uvh9U3ROcKCOrwVNJ5xBf9K0xOJcEYhPH1DIEbtuxgyoDw3MIdZ7CFRpGXxORqydcKMMcIXozcm6IOhaYYBulMJiom2574rBRexH3hDBfqU0',
  useCdn: false,
})

const CONDOMINIOS = [
  'condominio-elos',
  'condominio-millenio',
  'condominio-saint-michel',
  'condominio-viure',
]

async function fixCondominio(id) {
  console.log(`\n🔧 Corrigindo: ${id}`)

  const doc = await client.getDocument(id)
  if (!doc) {
    console.log(`   ⚠️  Documento não encontrado`)
    return
  }

  const galeria = doc.galeria
  const fotoCapa = doc.fotoCapa

  if (!galeria && !fotoCapa) {
    console.log(`   ⚠️  Sem galeria nem fotoCapa — pulando`)
    return
  }

  let newGaleria = galeria
  let newFotoCapa = fotoCapa

  // ── Corrige galeria ────────────────────────────────────────────────────────
  if (galeria && galeria.length > 0) {
    const firstItem = galeria[0]

    // Detecta se está no formato errado:
    // errado: item.asset = { _type: 'image', asset: { _ref: '...' } }
    // correto: item.asset = { _type: 'reference', _ref: '...' }
    if (firstItem.asset && firstItem.asset._type === 'image' && firstItem.asset.asset?._ref) {
      console.log(`   📦 Galeria com estrutura errada — corrigindo ${galeria.length} itens`)
      newGaleria = galeria.map((item) => ({
        _key: item._key || key(),
        asset: { _type: 'reference', _ref: item.asset.asset._ref },
        alt: item.alt || '',
        legenda: item.legenda || '',
      }))
    } else if (firstItem.asset?._ref) {
      console.log(`   ✅ Galeria já tem estrutura correta (${galeria.length} itens)`)
      newGaleria = galeria // sem mudança
    } else {
      console.log(`   ⚠️  Estrutura da galeria desconhecida:`, JSON.stringify(firstItem.asset).slice(0, 100))
      newGaleria = galeria
    }
  }

  // ── Corrige fotoCapa ───────────────────────────────────────────────────────
  if (fotoCapa) {
    // Errado: { asset: { _type: 'image', asset: { _ref: '...' } }, alt: '...' }
    // Correto: { _type: 'image', asset: { _ref: '...' } }
    if (fotoCapa.asset?._type === 'image' && fotoCapa.asset?.asset?._ref) {
      console.log(`   📦 fotoCapa com estrutura errada — corrigindo`)
      newFotoCapa = {
        _type: 'image',
        asset: { _type: 'reference', _ref: fotoCapa.asset.asset._ref },
      }
    } else if (fotoCapa._type === 'image' && fotoCapa.asset?._ref) {
      console.log(`   ✅ fotoCapa já tem estrutura correta`)
      newFotoCapa = fotoCapa // sem mudança
    } else {
      console.log(`   ⚠️  Estrutura da fotoCapa desconhecida:`, JSON.stringify(fotoCapa).slice(0, 120))
    }
  }

  // ── Salva ──────────────────────────────────────────────────────────────────
  try {
    const patch = client.patch(id)
    if (newGaleria !== galeria) patch.set({ galeria: newGaleria })
    if (newFotoCapa !== fotoCapa) patch.set({ fotoCapa: newFotoCapa })
    await patch.commit()
    console.log(`   ✅ Corrigido — galeria: ${newGaleria?.length ?? 0} itens`)
  } catch (err) {
    console.error(`   ❌ Erro ao salvar: ${err.message}`)
  }
}

console.log('🚀 Corrigindo estrutura da galeria e fotoCapa nos condomínios')
console.log('='.repeat(60))

for (const id of CONDOMINIOS) {
  await fixCondominio(id)
}

console.log('\n✅ Concluído! Verifique: https://admirata.com.br/condominios')
