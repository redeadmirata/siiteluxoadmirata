/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Tipos permitidos
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nova funcionalidade
        'fix',      // correção de bug
        'docs',     // documentação
        'style',    // formatação, sem mudança de lógica
        'refactor', // refatoração sem feat/fix
        'perf',     // melhoria de performance
        'test',     // testes
        'build',    // build system, dependências
        'ci',       // CI/CD
        'chore',    // tarefas de manutenção
        'revert',   // reverter commit
        'content',  // conteúdo Sanity / copywriting
        'design',   // ajustes visuais, tokens, animações
        'seo',      // SEO, meta, schema.org
      ],
    ],

    // Obrigatório ter tipo
    'type-empty': [2, 'never'],

    // Scope opcional, mas quando presente deve ser kebab-case
    'scope-case': [2, 'always', 'kebab-case'],

    // Subject: começa com minúscula, sem ponto final
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],

    // Tamanho do header
    'header-max-length': [2, 'always', 100],

    // Body: linha em branco antes
    'body-leading-blank': [1, 'always'],

    // Footer: linha em branco antes
    'footer-leading-blank': [1, 'always'],
  },

  /**
   * Exemplos válidos:
   *   feat(hero): adicionar parallax no scroll
   *   fix(cta): corrigir número whatsapp na praça rs
   *   content(pdi): atualizar descrição wide residences
   *   seo(bairros): adicionar schema RealEstateListing
   *   design(tokens): ajustar escala tipográfica mobile
   *   perf(images): habilitar avif no next/image
   */
}

module.exports = config
