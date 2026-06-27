# ARCHITECTURE.md — Admirata Platform

> **Reconciliado com a implementação real em 27/06/2026.** Define a arquitetura-alvo e indica, onde aplicável, o estado atual versus o planejado. Toda implementação futura deve seguir estas diretrizes.

## Objetivo

Definir a arquitetura oficial da plataforma Admirata. Nenhuma funcionalidade deve ser desenvolvida sem respeitá-la.

## Princípios arquiteturais

Modularidade · Reutilização · Escalabilidade · Performance · Simplicidade · Testabilidade · Baixo acoplamento · Alta coesão. Toda decisão técnica deve favorecer a manutenção de longo prazo.

## Filosofia

A plataforma não representa um único site, e sim um **framework imobiliário reutilizável**. Todo empreendimento deve usar exatamente a mesma arquitetura. Nunca criar código específico para apenas um empreendimento.

## Stack de referência (real)

Next.js 14 (App Router) · React 18 · TypeScript strict · Tailwind 3 · Sanity v3 (CMS/dados) · @headlessui/react · Framer Motion / GSAP / Lenis · TanStack Query · Zod · next-intl · Mapbox GL · Vitest. _Playwright planejado._ `package.json` é a fonte de verdade.

## Organização geral (camadas)

```
Core  →  Domínio (components/<área>)  →  Infrastructure  →  Application
```

### Camada Core
Tudo que é reutilizável. Nenhum componente de negócio aqui.
```
Core: Design System · UI · Layout · Providers · Hooks · Utilities · Types · Config · Constants
```
**Estado atual:** implementado em `src/components/ui`, `src/components/layout`, `src/providers`, `src/hooks`, `src/lib`, `src/utils`, `src/types`, `src/config`.

### Camada de Domínio (UI por área)
> **Decisão 27/06/2026:** a camada `src/features/` foi **removida**. O domínio é organizado por **área dentro de `src/components/`**, não por pastas `features/*`.

Componentes de domínio agrupados por área: `components/home`, `components/pdi`, `components/cards`, `components/busca`, `components/contato`, `components/empreendimento`, `components/seo`, `components/analytics`. A lógica de dados correspondente vive em `src/sanity/queries.ts` (GROQ central) e `src/data/`; hooks e utilitários em `src/hooks` e `src/lib`.

Nunca recriar uma estrutura `features/*` paralela. Um domínio = uma pasta em `components/` + suas queries em `sanity/queries.ts`.

### Camada Infrastructure
Comunicação externa isolada. Nunca chamar APIs diretamente de componentes React.
```
services/: sanity · analytics · maps · whatsapp · crm · storage · api
```
**Estado atual:** `src/services/{sanity,analytics,whatsapp}` + `src/sanity/client.ts`.

### Camada Application
Monta páginas; apenas orquestra componentes. Regra de negócio fora das páginas.
```
app/[locale]/: (layout) (page) (route) (metadata)
```
**Estado atual:** `src/app/[locale]/` com 31 páginas, `/studio`, `/api/revalidate`.

## Organização das pastas

```
src/app · src/components · src/features · src/hooks · src/providers · src/services
src/sanity · src/lib · src/utils · src/types · src/styles · src/config · src/data · src/i18n
messages · public · docs
```

## Componentes (três níveis)

- **UI** — genéricos: Button, Card, Modal, Input, Tabs, Accordion, Tooltip (`src/components/ui`).
- **Layout** — estruturais: Navbar, Footer, Container, Section, Grid (`src/components/layout`, `ui/Container`, `ui/Section`).
- **Business** — domínio imobiliário: Hero, Gallery, Amenities, FloorPlans, Location, ContactForm, CTA, Comparison, FAQ (hoje em `src/components/{home,pdi,cards,empreendimento,busca,contato}`).

## Regras de componentização

Componentes não devem ultrapassar ~300 linhas. Ao crescer, dividir em hooks, services, subcomponents e utils. Nunca criar componentes gigantes.

## Fluxo de dados

```
Dados (Sanity / data) → Parser → Services → Hooks → Components → Pages
```
Nunca inverter este fluxo.

## Dados

Todo conteúdo orientado a dados; nunca escrever textos dentro dos componentes. Estrutura-alvo por empreendimento:
```
data/<empreendimento>/ index.json gallery.json videos.json floorplans.json location.json faq.json seo.json
```

## Serviços

Todo acesso externo passa por Services (Sanity, Mapbox, Analytics, CRM, Storage, API). Nunca acessar serviços diretamente da interface.

## Hooks

Lógica reutilizável vira Hook: `useGallery`, `useScroll`, `useTheme`, `useLeadForm`, `useAnalytics`, `useViewport` (já existem `useBreakpoint`, `useLenis`, `useFavorites`, `useIntersectionObserver`, `useDebounce`, `useScroll`, `useViewport`).

## Providers

Globais e justificados: Theme, Query, Analytics, Motion, Favorites, SmoothScroll. Nunca criar providers desnecessários.

## SEO Engine

Motor próprio de SEO gerando, a partir de dados: Metadata, OpenGraph, Twitter Cards, JSON-LD, Canonical, Robots, Sitemap, Breadcrumb, FAQ Schema, Real Estate Schema.
> **Estado atual:** Metadata/OG/Sitemap/Robots/Canonical/Breadcrumb implementados (100% das páginas). JSON-LD está **fragmentado** em `SchemaJSONLD`, `SchemaJSONLDBairro`, `seo/JsonLd` e `lib/schema/bairro` — **consolidar num engine único** é meta da Fase 2.

## Engine de empreendimentos

Cada empreendimento é um conjunto de dados; a renderização é feita pelos componentes da plataforma. `Dados → Parser → Componentes → Página`.

## Performance

Prioridades: Server Components, Streaming, Caching, Code Splitting, Image Optimization, Dynamic Imports, Lazy Loading, Suspense.

## Design System

O Design System oficial é a única referência visual. Nunca criar um segundo. Sempre reutilizar componentes existentes.

## Dependências entre camadas

```
UI → Layout → Business Components (components/<área>) → Pages
```
Nunca inverter dependências.

## Testes

Cada feature deve permitir testes independentes. Ferramentas: Vitest (instalado) + React Testing Library + **Playwright (planejado)**. Estado atual: apenas `src/test/smoke.test.ts` — ampliar cobertura é meta da Fase 3.

## Escalabilidade

A plataforma deve permitir novos empreendimentos, incorporadoras, bairros e tipos de conteúdo sem alteração estrutural.

## Processo de desenvolvimento

Antes de criar qualquer funcionalidade: analisar a arquitetura existente; verificar reutilização; verificar o Design System; localizar componentes semelhantes; implementar; documentar.

## Restrições

Nunca: duplicar componentes; criar estilos inline; usar `any`; misturar regras de negócio com interface; consumir APIs diretamente em componentes; hardcode de conteúdo; recriar uma camada `features/` paralela.

## Decisões registradas

- **27/06/2026 — `features/` removida.** Padrão oficial = `src/components/` (UI por domínio) + `src/sanity/` (dados). Importador remanescente repontado para `@/types/sanity`; aliases `@/features` removidos de `tsconfig.json`, `tailwind.config.ts` e `vitest.config.ts`.

## Pendências (decisões em aberto)

1. **SEO Engine** — unificar os caminhos paralelos de JSON-LD — Fase 2.
2. **Rotas legadas** — `src/app/{page,bairros,blog,condominios,favoritos,imoveis}` são stubs `notFound()`; limpar após verificação — Fase 5.
3. **Testes** — adicionar Playwright e ampliar cobertura — Fase 3.
4. **Testes** — adicionar Playwright e cobertura por feature.

## Objetivo final

Tornar-se uma plataforma modular, reutilizável e escalável, permitindo publicar qualquer empreendimento com exatamente a mesma arquitetura — preservando consistência técnica, alta performance, excelente UX e facilidade de manutenção.
