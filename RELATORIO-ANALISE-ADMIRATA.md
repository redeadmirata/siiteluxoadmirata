# Relatório de Análise — Admirata Platform

> Análise de aderência arquitetural · Repositório `C:\Projetos\admirata` (branch `main`, HEAD `be9f4f5`)
> Base normativa: `AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `README.md`
> Data: 27/06/2026 · **Nenhum código foi alterado** — documento para aprovação prévia.

---

## Sumário executivo

O repositório é um portal imobiliário **Next.js 14 + Sanity v3** maduro e funcional, com um Design System próprio sólido, SEO técnico forte (100% das páginas com `generateMetadata`) e i18n em 4 idiomas. A base **já adota** boa parte da filosofia dos documentos: arquitetura em camadas, tokens centralizados, conteúdo orientado a CMS, providers globais e componentização.

O ponto crítico não é qualidade — é **divergência entre o documentado e o real** em dois eixos:

1. **Stack documentada ≠ stack implementada.** `AGENTS.md`/`PROJECT.md`/`ARCHITECTURE.md` descrevem Next 15 / React 19 / Tailwind v4 / Supabase / shadcn. O projeto roda Next 14 / React 18 / Tailwind 3 / Sanity / Headless UI. O `README.md` descreve a stack real corretamente — os três docs de governança estão desatualizados (ou são aspiracionais).
2. **A camada `features/` está praticamente morta.** Existem 19 features com `types/constants/services`, mas **0 importações** a partir de `app/` ou `components/`. A lógica real vive em `src/sanity/queries.ts` (28 importadores) e `src/components/`. Há duplicação de queries e de componentes de SEO.

Recomendação: **não migrar a stack**; em vez disso, **atualizar os documentos para refletir a realidade** e então decidir conscientemente o destino de `features/` (consolidar ou remover). Detalhes e plano de fases abaixo.

---

## 1. O que já está implementado

### Aplicação (Next.js App Router, i18n)
- Roteamento internacionalizado completo em `src/app/[locale]/` (pt-BR, en, es, fr) via `next-intl`, com middleware reescrevendo `/` → `/pt-BR/`.
- **31 páginas** cobrindo home, listagens (`imoveis`, `lancamentos`, `condominios`, `bairros`, `bairros-planejados`, `blog`), PDI do imóvel (`imovel/[slug]`), landings segmentadas (`venda`, `locacao`, `cobertura`, `frente-mar`, `vista-mar`, `na-planta`, `temporada`), institucionais (`sobre`, `contato`, `favoritos`, privacidade, termos) e landing dedicada (`gramado`).
- Rotas aninhadas profundas: `imoveis/[slug]/[condominio]/[tipologia]`.
- `API route` de revalidação (`/api/revalidate`) e Sanity Studio embarcado em `/studio`.

### CMS e dados
- Integração Sanity v3 (`PROJECT_ID: gvf51tpc`): `src/sanity/client.ts` + `src/sanity/queries.ts` (GROQ central), tipos gerados (`sanity.types.ts`, `src/types/sanity`).
- Catálogos estáticos orientados a dados em `src/data/` (amenities, bairros, markets, property-types, tipologias, features, config.json) — aderente ao princípio "conteúdo orientado a dados".

### Design System (real e em uso)
- Tokens centralizados em `src/lib/tokens.ts` (cores, easing, tipografia) sincronizados com `globals.css` (CSS vars) e `tailwind.config.ts`.
- Paleta da marca (`ink`, `gold`, `stone`, `text`, `muted`, `overlay`), tipografia editorial (Cormorant display / Inter body / JetBrains mono), breakpoints mobile-first (360 → 2560px, referências 390px e 1440px), keyframes/animações nomeadas.
- **~45 componentes** em `src/components/ui` (Button, Card, Modal, Tabs, Accordion, Drawer, Gallery, Hero, etc.) + domínio (`home`, `pdi`, `cards`, `busca`, `contato`, `empreendimento`, `layout`).

### Infraestrutura transversal
- Providers globais: Theme, Query (TanStack), Analytics, Motion (Framer), SmoothScroll (Lenis), Favorites.
- Hooks reutilizáveis: `useBreakpoint`, `useLenis`, `useScroll`, `useViewport`, `useFavorites`, `useIntersectionObserver`, `useDebounce`, etc.
- Services isolados: `analytics`, `sanity`, `whatsapp`.

### SEO técnico (forte)
- **31/31 páginas com `generateMetadata`.** `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image` (global + por imóvel), JSON-LD (`SchemaJSONLD`, `SchemaJSONLDBairro`).

### Qualidade / tooling
- ESLint, Prettier, Husky, lint-staged, commitlint, editorconfig, Vitest configurado, scripts `type-check`/`format`/`test`.

---

## 2. O que está aderente às diretrizes

| Diretriz (PROJECT/ARCHITECTURE/AGENTS) | Status | Evidência |
|---|---|---|
| Arquitetura em camadas (Core/Features/Infra/App) | **Aderente (estrutura)** | `src/{app,components,features,hooks,providers,services,lib,utils,types,styles,config,data}` existe conforme especificado |
| Conteúdo orientado a dados / sem hardcode | **Majoritariamente aderente** | Páginas renderizam de Sanity + `src/data/`; i18n em `messages/*.json` |
| Design System como fonte única | **Aderente** | `tokens.ts` ↔ `globals.css` ↔ `tailwind.config.ts` sincronizados |
| TypeScript estrito | **Aderente** | `tsconfig` strict, tipos Sanity gerados |
| SEO enterprise (metadata, OG, JSON-LD, sitemap, robots) | **Aderente** | Cobertura total de metadata + infra SEO presente |
| Performance (Server Components, dynamic import, image opt) | **Parcial/Aderente** | `dynamic()` na PDI, Server Components nas páginas; falta medição Lighthouse formal |
| Providers globais sem excesso | **Aderente** | 6 providers, todos justificados |
| Componentização por níveis (UI/Layout/Business) | **Aderente na prática** | `ui/` (genéricos) + `layout/` + domínio; ver ressalva §3 |
| i18n / escalabilidade de conteúdo | **Aderente** | 4 locales, roteamento dinâmico |

---

## 3. O que precisa ser refatorado

### 3.1 — Camada `features/` órfã (prioridade ALTA)
19 features (`hero`, `gallery`, `imoveis`, `lancamentos`, `bairros`, `condominios`, `blog`, `seo`, `floorplans`, `amenities`, `location`, `tour`, `busca`, `contact`, `favoritos`, `analytics`, `lifestyle`, `home`, `shared`) contêm apenas `types/constants/services` — **nenhuma com `components/` populada e 0 importadores** em `app/`/`components/`. Resultado: estrutura paralela que duplica a lógica real (`src/sanity/queries.ts` vs `features/*/services/queries.ts`).
**Decisão necessária:** (a) consolidar — mover componentes de domínio de `src/components/{home,pdi,...}` para `features/*/components/` e ligar a app a `features/`; ou (b) assumir o padrão atual (`components/` + `sanity/`) como oficial e remover `features/`. Manter ambos viola "nunca duplicar lógica".

### 3.2 — Duplicação de SEO/JSON-LD (prioridade MÉDIA)
Coexistem `src/components/SchemaJSONLD.tsx`, `SchemaJSONLDBairro.tsx`, `src/components/seo/JsonLd.tsx`, `src/lib/schema/bairro.ts` e o esqueleto `features/seo/`. Consolidar em um único **SEO Engine** (conforme PROJECT.md) que gere schema a partir de dados.

### 3.3 — Rotas legadas não-localizadas (prioridade BAIXA)
`src/app/{page,bairros,blog,condominios,favoritos,imoveis}` são stubs `notFound()` ("Legado"). Limpeza segura após confirmar que nada referencia.

### 3.4 — Cobertura de testes (prioridade MÉDIA)
Apenas `src/test/smoke.test.ts`. PROJECT.md exige Vitest + Playwright + RTL. Playwright **ausente** do `package.json`. Sem testes por feature.

### 3.5 — Componentes próximos do limite / possíveis duplicações (prioridade BAIXA)
`ImovelCard` + `ImovelCardMobile` (avaliar unificação responsiva). Regra de ~300 linhas do ARCHITECTURE.md deve ser auditada em `EmpreendimentoLanding`, `HeroCinematico`, PDI.

### 3.6 — Divergência documental (prioridade ALTA — bloqueia governança)
`AGENTS.md`/`PROJECT.md`/`ARCHITECTURE.md` citam Next 15, React 19, Tailwind v4, Supabase, shadcn/ui — **nada disso está instalado**. O real é Next 14 / React 18 / Tailwind 3 / Sanity / Headless UI (corretamente descrito só no `README.md`). Toda IA que seguir os docs literalmente proporá refatorações erradas. **Alinhar documentos à realidade é pré-requisito** para qualquer fase seguinte.

### 3.7 — Conceito "Coupé Tower / engine de empreendimentos" vs portal (prioridade ESTRATÉGICA)
Os docs descrevem um *framework de empreendimento único* (Coupé Tower como dado). O código é um *portal multi-imóvel* (imóveis, bairros, condomínios, lançamentos via Sanity). São visões compatíveis, mas precisam ser reconciliadas explicitamente: a "engine de empreendimentos" deve ser modelada como um tipo de conteúdo Sanity dentro do portal, não como app separado.

---

## 4. Plano de implementação proposto (fases)

> Ordenado por desbloqueio de risco. Cada fase é incremental e não quebra produção. **Aguardando aprovação antes de qualquer alteração de código.**

**Fase 0 — Reconciliação documental (1–2 dias).**
Atualizar `AGENTS.md`/`PROJECT.md`/`ARCHITECTURE.md` para a stack real (Next 14, React 18, Tailwind 3, Sanity, Headless UI, next-intl). Registrar decisão sobre `features/` (§3.1). Sem isto, governança por IA gera ruído. *Entrega: docs versionados, fonte única de verdade.*

**Fase 1 — Decisão e consolidação de `features/` (3–5 dias).**
Definir padrão oficial. Se consolidar: migrar lógica de domínio para `features/*` e eliminar `src/sanity/queries.ts` duplicado; se remover: apagar esqueletos órfãos e manter `components/` + `sanity/`. *Entrega: uma única árvore de domínio, 0 duplicações de query.*

**Fase 2 — SEO Engine unificado (2–3 dias).**
Centralizar JSON-LD/metadata num módulo orientado a dados (RealEstate, FAQ, Breadcrumb, LocalBusiness). Eliminar os 3 caminhos paralelos. *Entrega: schema gerado a partir de dados Sanity, cobertura validada.*

**Fase 3 — Estratégia de testes (3–4 dias).**
Adicionar Playwright ao `package.json`, smoke E2E das rotas críticas (home, listagem, PDI, contato) e testes unitários de hooks/services. *Entrega: CI com testes verdes, baseline de cobertura.*

**Fase 4 — Auditoria de performance (2–3 dias).**
Medir Lighthouse/CWV reais, validar Server Components, `dynamic()`, otimização de imagens Sanity. *Entrega: relatório com metas >95 e correções pontuais.*

**Fase 5 — Higiene de código (1–2 dias).**
Remover rotas legadas (§3.3), auditar componentes >300 linhas (§3.5), unificar `ImovelCard`. *Entrega: base limpa.*

**Fase 6 — Engine de empreendimentos (escopo a definir).**
Modelar "empreendimento" (ex.: Coupé Tower) como tipo Sanity reutilizável renderizado pela plataforma (§3.7), conforme roadmap Fase 3/12 do PROJECT.md.

---

## 5. Riscos e observações
- **Deploy:** memória do projeto registra histórico de build quebrado por `package.json`. Recomenda-se validar `pnpm build` limpo como gate da Fase 0 (não executado nesta análise, que foi read-only).
- **Duas cópias do repositório:** existe uma cópia em OneDrive (`Site luxo admirata`) além de `C:\Projetos\admirata`. Confirmar que `C:\Projetos\admirata` é a única fonte ativa para evitar trabalho divergente.
- Nada neste relatório foi aplicado ao código. Próximo passo aguarda sua escolha das fases a iniciar.
