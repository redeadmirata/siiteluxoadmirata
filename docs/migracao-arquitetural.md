# Migração arquitetural incremental

## Decisão oficial

A plataforma mantém a organização definida em `AGENTS.md` e `ARCHITECTURE.md`:

- UI genérica e de domínio em `src/components/`;
- queries GROQ centralizadas em `src/sanity/queries.ts`;
- integrações externas em `src/services/`;
- transformação e regras puras em `src/lib/`;
- páginas de `src/app/` limitadas à orquestração.

Não deve ser recriada uma camada paralela `src/features/`.

## Fase 1 — piloto de condomínios

Implementada em 28/06/2026, ainda sem deploy:

- acesso ao Sanity retirado da página de detalhe de condomínio;
- consultas encapsuladas em `src/services/condominios.ts`;
- transformação de dados, metadata e JSON-LD isolados em
  `src/lib/condominios/presentation.ts`;
- dados específicos de clubes centralizados em `src/data/condominios.ts`;
- unidades e FAQs extraídas para componentes próprios;
- landing narrativa dividida em módulos menores que 300 linhas;
- deduplicação por requisição com `React.cache()`;
- consultas independentes executadas em paralelo;
- imports diretos usados no caminho crítico, evitando ampliar barrels;
- testes de arquitetura e de transformação adicionados ao Vitest.

## Fronteiras verificadas por testes

- a página piloto não importa `@/sanity/client` nem queries GROQ;
- a página e os componentes piloto permanecem abaixo de 300 linhas;
- metadata, Portable Text, vídeo e contato oficial possuem testes unitários.

## Próximas fases

1. Migrar `bairros-planejados/[slug]`, atualmente a maior página.
2. Migrar listagens de imóveis e bairros para serviços tipados.
3. Consolidar os caminhos paralelos de JSON-LD no mesmo padrão do piloto.
4. Remover estilos inline estáticos, preservando apenas valores dinâmicos de animação.
5. Eliminar ocorrências remanescentes de `any`.
6. Adicionar Playwright para home, busca, imóvel, condomínio, lead e idiomas.

Cada fase deve passar por type-check, Vitest, lint, build e smoke test local antes de
qualquer commit ou deploy.
