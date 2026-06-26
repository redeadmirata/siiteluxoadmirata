/**
 * Adiciona videoUrl ao Verdant Valley 3q para teste do hero cinematográfico.
 * Uso: node scripts/update-verdant-videourl.mjs
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

await client
  .patch('imovel-verdant-valley-3q-001')
  .set({ videoUrl: 'https://youtu.be/DjsSZQZPbz4?t=27' })
  .commit()

console.log('✅ videoUrl atualizado!')
console.log('🔗 https://admirata.com.br/imovel/apartamento-3-quartos-grand-club-verdant-camorim')
