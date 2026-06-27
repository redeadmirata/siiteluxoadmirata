/**
 * Define condicao='obra-administracao' em todos os imóveis dos
 * condomínios Calper / Cidade Arte (Ilha Pura e entorno).
 *
 * Esses imóveis exibem o bloco "Sem Banco · Sem Juros · Sem Comprovação de Renda".
 *
 * Uso: node scripts/set-condicao-calper.mjs
 */
import { createClient } from '@sanity/client'

const TOKEN = 'skH4t0uLAlJq61v4EFHVonFwZKdqoletaPwax5eiI1YmGlqVkE1Z6AXPEIcBPbqHQLggEf9ZNxPNv1ERPbnX0CUx1aWiBqipQaMfBu3O280929p6pkBnDK0ScGCAtAKSS8JwYxI6EhNQKoCrU6joRc5gKJLl4GtvHGQfIBUlRR5tpDNTIdFp'

const client = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: TOKEN,
  useCdn: false,
})

// IDs dos condomínios Calper/Cidade Arte
const CALPER_CONDOMINIOS = [
  'condominio-millenio',
  'condominio-viure',
  'condominio-elos',
  'condominio-saint-michel',
  'condominio-astra',
  'condominio-pura-artefacto',
  'condominio-wide-residences',
]

console.log('🔍 Buscando imóveis Calper/Cidade Arte no Sanity...\n')

const imovelIds = await client.fetch(
  `*[_type == "imovel" && condominioRef._ref in $condominios]._id`,
  { condominios: CALPER_CONDOMINIOS }
)

if (imovelIds.length === 0) {
  console.log('⚠️  Nenhum imóvel encontrado com esses condomínios.')
  console.log('   Verifique se os documentos têm condominioRef preenchido.')
  process.exit(0)
}

console.log(`📦 ${imovelIds.length} imóvel(is) encontrado(s):\n`)
imovelIds.forEach(id => console.log(`   • ${id}`))
console.log()

for (const id of imovelIds) {
  try {
    await client.patch(id).set({ condicao: 'obra-administracao', novidade: false }).commit()
    console.log(`  ✅ ${id}`)
  } catch (err) {
    console.log(`  ❌ ${id} — ${err.message}`)
  }
}

console.log('\n✅ Concluído. Esses imóveis agora exibem o bloco "Sem Banco · Sem Juros".')
