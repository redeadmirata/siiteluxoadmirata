/**
 * Define condicao='pronto' em todos os imóveis do Grand Club Verdant.
 * Uso: node scripts/set-condicao-verdant.mjs
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

// Todos os IDs de imóveis Verdant
const verdantIds = [
  'imovel-verdant-valley-3q-001',   // 3Q locação — Térreo
  'imovel-verdant-valley-3q-602',   // 3Q venda — 6º andar
  // Adicione 'imovel-verdant-valley-2q-410' aqui quando o script de cadastro rodar
]

console.log('📦 Atualizando condicao → "pronto" nos imóveis Verdant...\n')

for (const id of verdantIds) {
  try {
    await client.patch(id).set({ condicao: 'pronto', novidade: false }).commit()
    console.log(`  ✅ ${id}`)
  } catch (err) {
    console.log(`  ❌ ${id} — ${err.message}`)
  }
}

console.log('\n✅ Concluído.')
