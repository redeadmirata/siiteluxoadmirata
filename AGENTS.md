# AGENTS.md

> Documento de governança para agentes de IA (Claude Code, Codex ou equivalentes).
> **Reconciliado com a implementação real em 27/06/2026.** A stack abaixo reflete o que está instalado no repositório (`package.json`), não uma meta futura. Itens ainda não implementados estão marcados como _Planejado_.

## Objetivo

Este repositório contém a plataforma oficial da **Admirata**.

O projeto **não** representa um único empreendimento. Trata-se de um **framework premium** para apresentação de imóveis e empreendimentos de alto padrão. Hoje opera como portal multi-imóvel (imóveis, bairros, condomínios, lançamentos) com conteúdo vindo do Sanity. A "engine de empreendimento único" (ex.: Coupé Tower) é uma evolução planejada sobre esta mesma base — ver `PROJECT.md` e `ARCHITECTURE.md`.

## Arquitetura

- Sempre preservar a arquitetura existente.
- Nunca reescrever funcionalidades apenas por preferência.
- Sempre evoluir a base atual.

## Design System

Existe um Design System oficial, **em uso e sincronizado** entre `src/lib/tokens.ts`, `src/app/globals.css` (CSS custom properties) e `tailwind.config.ts`.

- Nunca criar componentes duplicados.
- Antes de implementar qualquer interface: localizar o componente existente (`src/components/ui`, `src/components/layout`, e domínio); reutilizar sempre que possível; só criar novo quando não existir equivalente.

Todo novo componente deve seguir exatamente: tipografia, espaçamentos, tokens, animações, acessibilidade e convenções do projeto.

## Stack (real)

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 14** (App Router) |
| UI runtime | **React 18** |
| Linguagem | TypeScript (strict) |
| Estilização | **Tailwind CSS 3** + CSS Custom Properties |
| CMS / dados | **Sanity v3** (`PROJECT_ID: gvf51tpc`) |
| Componentes UI | **@headlessui/react** + componentes próprios (`src/components/ui`) |
| Animações | Framer Motion + GSAP + Lenis (smooth scroll) |
| Estado servidor | TanStack Query |
| Validação | Zod |
| i18n | next-intl (pt-BR, en, es, fr) |
| Mapas | Mapbox GL |
| Analytics | Meta Pixel + camada de consentimento |
| Qualidade | ESLint · Prettier · Husky · lint-staged · commitlint |
| Testes | Vitest (Playwright _Planejado_) |
| Deploy | Vercel |

> **Atenção, agentes:** versões anteriores deste documento citavam Next 15 / React 19 / Tailwind v4 / Supabase / shadcn/ui. **Nada disso está instalado.** Não proponha refatorações assumindo essas tecnologias. Em caso de dúvida, consulte `package.json` como fonte de verdade.

## Filosofia

Priorizar: reutilização, composição, performance, acessibilidade, SEO, código limpo.

Evitar: duplicação, componentes gigantes, lógica repetida, estilos inline, uso de `any`.

## Estrutura dos empreendimentos

Todo conteúdo deve ser orientado a dados (Sanity + `src/data/`). Nunca deixar textos hardcoded. Todo imóvel/empreendimento deve ser renderizado a partir de dados ou CMS.

## Performance

Objetivo: Lighthouse > 95, Core Web Vitals excelentes, lazy loading, code splitting, otimização de imagens (Sanity image pipeline), Server Components sempre que possível.

## UX

A experiência deve transmitir sofisticação, elegância, simplicidade, fluidez e narrativa visual. Evitar interfaces poluídas; priorizar espaços em branco e hierarquia.

## Desenvolvimento

Antes de modificar qualquer arquivo: compreender a arquitetura existente; verificar reutilização; manter compatibilidade; documentar decisões relevantes. Sempre entregar código pronto para produção.

## Padrão oficial de organização (decidido em 27/06/2026)

A camada `src/features/` foi **removida**. O padrão oficial é:

- **UI** em `src/components/` — genéricos em `ui/`, estruturais em `layout/`, e componentes de domínio agrupados por área (`home/`, `pdi/`, `cards/`, `busca/`, `contato/`, `empreendimento/`, `seo/`, `analytics/`).
- **Dados** em `src/sanity/queries.ts` (GROQ central) consumidos pelas páginas; catálogos estáticos em `src/data/`.
- **Lógica reutilizável** em `src/hooks/`, `src/lib/`, `src/services/`, `src/providers/`; tipos em `src/types/`.

Nunca recriar uma camada `features/` paralela. Novo componente de domínio vai para `src/components/<área>/`; nova query vai para `src/sanity/queries.ts`.
