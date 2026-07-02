# PROJECT.md — Admirata Platform

> **Reconciliado com a implementação real em 27/06/2026.** A seção _Stack Tecnológica_ reflete o que está instalado (`package.json`). Itens de visão ainda não implementados estão marcados como _Planejado_.

## Visão geral

A Admirata Platform é a plataforma oficial da **Admirata Negócios Imobiliários**. Não representa um único site de empreendimento: é um **framework premium** para apresentação de imóveis de alto padrão, preparado para crescimento contínuo.

Hoje funciona como portal multi-imóvel (imóveis, bairros, condomínios, lançamentos) com conteúdo no Sanity. O primeiro empreendimento dedicado previsto é o **Coupé Tower** — porém toda a arquitetura deve permanecer reutilizável para qualquer incorporadora e qualquer empreendimento.

## Objetivos

Construir a melhor plataforma imobiliária do Brasil em UX, UI, performance, SEO, acessibilidade, escalabilidade e qualidade de código. O projeto deve permitir publicar dezenas ou centenas de empreendimentos sem alterar a arquitetura principal.

## Filosofia

Design atemporal · Performance em primeiro lugar · Componentização · Reutilização máxima · Arquitetura limpa · Conteúdo orientado a dados · SEO técnico avançado · Acessibilidade · Manutenção simples · Escalabilidade.

Nunca criar soluções específicas para um único empreendimento. Toda solução deve ser reutilizável.

## Arquitetura (módulos)

```
Core
├── Design System
├── UI Components
├── SEO Engine
├── CMS Engine (Sanity)
├── Analytics
├── Search Engine
├── Maps (Mapbox)
├── Forms
├── Gallery
├── Floor Plans
├── Videos
├── Theme
└── Utilities

Empreendimentos (dados)
├── Coupé Tower (Planejado)
└── …
```

## Design System

Existe um Design System oficial, **em uso**, com tokens centralizados em `src/lib/tokens.ts` ↔ `globals.css` ↔ `tailwind.config.ts`. É a única fonte de verdade da interface. Nunca criar componentes duplicados; reutilizar `src/components/ui` e camadas de domínio.

## Conteúdo

Todo conteúdo deve ser orientado a dados (Sanity + `src/data/` + `messages/*.json`). Nunca deixar informações fixas no código. A interface nunca deve depender de textos hardcoded.

## Stack Tecnológica (real)

| Camada | Tecnologia instalada |
|---|---|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18 · TypeScript strict · Tailwind CSS 3 |
| CMS / dados | **Sanity v3** (`gvf51tpc`) — _não Supabase_ |
| UI | **@headlessui/react** + componentes próprios — _não shadcn/ui_ |
| Animação | Framer Motion · GSAP · Lenis |
| Carrossel / comparação | react-compare-slider |
| Validação | Zod |
| Estado servidor | TanStack Query |
| i18n | next-intl (pt-BR, en, es, fr) |
| Mapas | Mapbox GL |
| Qualidade | ESLint · Prettier · Husky · lint-staged · commitlint |
| Testes | Vitest |
| Deploy | Vercel |

**Planejado (ainda não instalado):** Playwright (E2E), React Hook Form, CMS administrativo próprio. Tecnologias citadas em versões antigas deste doc e **não usadas**: Next 15, React 19, Tailwind v4, Supabase, shadcn/ui, Embla Carousel.

## Estrutura do projeto (real)

```
src/
├── app/[locale]/   # rotas i18n (pt-BR, en, es) + /studio + /api
├── components/     # ui, layout, home, pdi, cards, busca, contato, empreendimento, seo, analytics (UI oficial por domínio)
├── hooks/
├── providers/      # Theme, Query, Analytics, Motion, SmoothScroll, Favorites
├── services/       # analytics, sanity, whatsapp
├── sanity/         # client.ts, queries.ts (GROQ central — fonte de dados real)
├── lib/            # tokens, formatters, cn, cache, schema
├── data/           # catálogos estáticos (amenities, bairros, markets, tipologias…)
├── config/         # navigation, sanity, site
├── i18n/ · styles/ · types/ · utils/
messages/           # pt-BR.json, en.json, es.json, fr.json
```

## Objetivos de UX

Transmitir sofisticação, elegância, confiança, exclusividade, tecnologia e fluidez. A navegação deve parecer uma experiência editorial — não um catálogo imobiliário tradicional.

## Objetivos de performance

Lighthouse > 95 · SEO ~100 · Accessibility ~100 · Best Practices ~100 · Core Web Vitals excelentes.

## SEO

Cada página possui: Metadata, OpenGraph, Twitter Cards, JSON-LD, Sitemap, Robots, Canonical, Breadcrumb. _Planejado/consolidar:_ FAQ Schema e Real Estate Schema num **SEO Engine único** (hoje há implementações paralelas — ver `ARCHITECTURE.md`).

## Arquitetura dos empreendimentos

Cada empreendimento deve fornecer apenas seus dados; a renderização é sempre feita pelos componentes da plataforma. Estrutura-alvo:

```
/data/<empreendimento>/
  index.json · gallery.json · floorplans.json · videos.json · location.json · faq.json · seo.json
```

## Código

Sempre: TypeScript estrito, componentes pequenos, composition over inheritance, SOLID, Clean Architecture, Clean Code. Evitar: `any`, duplicação, estilos inline, componentes gigantes, lógica repetida.

## CMS

O projeto usa **Sanity v3** como CMS. Evolução planejada: painel administrativo que permita gerir empreendimentos, galerias, plantas, vídeos, SEO, FAQ, CTA, bairros, incorporadoras e leads sem alterar código.

## Roadmap

O roadmap de visão (Fases 1–12: Foundation → Design System → Engine de Empreendimentos → Home Cinematográfica → Galeria Editorial → Plantas Interativas → Localização → SEO Enterprise → Conversão → Performance → CMS → Framework) permanece válido como direção de longo prazo.

**Plano de execução imediato** (ver `RELATORIO-ANALISE-ADMIRATA.md`): Fase 0 reconciliação documental (este commit) → decisão sobre `features/` → SEO Engine único → estratégia de testes → auditoria de performance → higiene de código → engine de empreendimentos.

## Papel da IA

Toda IA deve: compreender primeiro a arquitetura existente; reutilizar componentes; nunca reescrever sem necessidade; manter compatibilidade; propor melhorias sem quebrar funcionalidades; documentar decisões; preservar a identidade visual da Admirata. **Tratar `package.json` como fonte de verdade da stack.**

## Decisões registradas

- **Organização (27/06/2026):** `src/features/` foi **removida**. Padrão oficial = `src/components/` (UI por domínio) + `src/sanity/` (dados). Ver `ARCHITECTURE.md`.

## Pendências (decisões em aberto)

1. **SEO Engine**: unificar os caminhos paralelos de JSON-LD (`SchemaJSONLD`, `SchemaJSONLDBairro`, `seo/JsonLd`, `lib/schema/bairro`) — Fase 2.
2. **Testes**: adicionar Playwright e ampliar cobertura — Fase 3.

## Visão de longo prazo

Tornar-se plataforma imobiliária de referência, capaz de publicar empreendimentos de diferentes incorporadoras com uma única base de código — bastando adicionar dados e mídias, mantendo consistência visual, alto desempenho, SEO excelente e experiência premium.
