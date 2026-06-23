/**
 * fix-deploy.mjs
 * Corrige dois problemas que bloqueiam o deploy no Vercel:
 *   1. package.json com next@9.3.3 → restaura para 14.2.35
 *   2. Remove arquivos lixo criados pelo erro do node -e no cmd
 *
 * Roda com: node fix-deploy.mjs
 * (dentro de C:\Projetos\admirata)
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'

// ─── 1. Corrigir package.json ─────────────────────────────────────────────────
const pkgPath = 'package.json'
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const versaoAtual = pkg.dependencies?.next
const versaoCorreta = '14.2.35'

if (versaoAtual === versaoCorreta) {
  console.log(`✅ package.json já está correto (next@${versaoCorreta})`)
} else {
  pkg.dependencies.next = versaoCorreta
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
  console.log(`✅ package.json corrigido: next@${versaoAtual} → next@${versaoCorreta}`)
}

// ─── 2. Remover arquivos lixo ─────────────────────────────────────────────────
const lixo = [
  `console.log('Publicados!')).catch(console.error)`,
  `{`,
]

for (const arquivo of lixo) {
  if (existsSync(arquivo)) {
    unlinkSync(arquivo)
    console.log(`🗑️  Removido: ${arquivo}`)
  } else {
    console.log(`   Não encontrado (ok): ${arquivo}`)
  }
}

// ─── 3. Commit e push ─────────────────────────────────────────────────────────
console.log('\n📦 Fazendo commit e push...')
execSync('git add .', { stdio: 'inherit' })
execSync('git commit -m "fix: next 14.2.35 + remove arquivos lixo do cmd"', { stdio: 'inherit' })
execSync('git push', { stdio: 'inherit' })

console.log('\n✅ Pronto! Aguarde o Vercel fazer o deploy.')
console.log('   Acompanhe em: https://vercel.com/dashboard')
