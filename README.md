# Admirata Imóveis — Site de Luxo

> Top 3 imobiliárias digitais do Brasil · Alto padrão · Rio de Janeiro + Serra Gaúcha

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| CMS | Sanity v3 (PROJECT_ID: `gvf51tpc`) |
| Estilização | Tailwind CSS 3 + CSS Custom Properties |
| Animações | Framer Motion + GSAP |
| Internacionalização | next-intl (pt-BR, en, es) |
| Tipagem | TypeScript strict |
| Testes | Vitest + Testing Library |
| Analytics | Meta Pixel + consent layer |
| Deploy | Vercel |

---

## Comandos

```bash
# Desenvolvimento
pnpm dev            # Next.js dev server (http://localhost:3000)
pnpm studio         # Sanity Studio (http://localhost:3333)

# Qualidade
pnpm build          # Build de produção
pnpm lint           # ESLint
pnpm type-check     # TypeScript sem emitir
pnpm test           # Vitest
pnpm test:ui        # Vitest com UI
pnpm test:coverage  # Cobertura

# Sanity
pnpm sanity:deploy  # Deploy do schema
pnpm sanity:typegen # Geração de tipos TypeScript
```

---

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Rotas internacionalizadas (pt-BR, en, es)
│   │   ├── layout.tsx      # Layout raiz com fontes, providers, ThemeScript
│   │   ├── page.tsx        # Home
│   │   ├── imoveis/        # Listagem de imóveis
│   │   ├── imovel/[slug]/  # PDI — Página de Detalhe do Imóvel
│   │   └── ...
│   └── globals.css         # Design tokens CSS + dark mode + reset
│
├── components/
│   ├── icons/              # Sistema de ícones (Lucide + custom SVGs)
│   │   ├── index.ts        # Barrel export — todos os ícones categorizados
│   │   └── WhatsAppIcon.tsx
│   ├── ui/                 # Componentes UI base (Button, Badge, Skeleton...)
│   ├── layout/             # Navbar, Footer, wrappers
│   ├── home/               # Seções da Home
│   ├── pdi/                # Seções da página de imóvel
│   ├── busca/              # Filtros e busca
│   └── analytics/          # CookieBanner, pixels
│
├── features/               # Feature-based architecture (FBA)
│   └── pdi/                # Feature PDI com sub-features por seção
│
├── hooks/                  # Custom hooks
│   ├── useBreakpoint.ts    # Breakpoint atual + helpers is/isAbove/isBelow
│   ├── useViewport.ts      # isMobile / isTablet / isDesktop
│   └── useMediaQuery.ts    # useIsAbove, useIsBelow, useIs{Xs..6Xl}
│
├── lib/
│   ├── breakpoints.ts      # SINGLE SOURCE OF TRUTH — 10 breakpoints
│   ├── tokens.ts           # Design tokens TypeScript exportáveis
│   ├── formatters.ts       # Formatadores de preço, área, data
│   └── ...
│
├── providers/
│   ├── index.tsx           # AppProviders — composição de todos os providers
│   ├── ThemeProvider.tsx   # Dark/light mode + ThemeScript (anti-FOUC)
│   ├── QueryProvider.tsx   # TanStack Query v5
│   ├── MotionProvider.tsx  # LazyMotion + AnimatePresence
│   └── AnalyticsProvider.tsx
│
├── sanity/                 # Schema + queries + client Sanity
├── styles/
│   └── animations.css      # Keyframes e helpers de animação
└── types/                  # Tipos TypeScript globais
```

---

## Design System

### Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#1a1a2e` | Azul-marinho profundo — cor principal |
| `--color-gold` | `#b8960c` | Dourado editorial — CTAs e destaques |
| `--color-stone` | `#f5f0e8` | Areia quente — fundo premium |
| `--color-text` | `#2b2b2b` | Corpo de texto |
| `--color-muted` | `#8a8a9a` | Labels e texto secundário |

### Tipografia

| Família | Variável | Uso |
|---|---|---|
| Cormorant Garamond | `--font-display` | Headlines editoriais |
| Inter | `--font-body` | Corpo e UI |
| JetBrains Mono | `--font-mono` | Preços, m², métricas |

### Breakpoints (Mobile First)

| Nome | px | Contexto |
|---|---|---|
| `xs` | 360px | Android compact |
| `sm` | 390px | iPhone 14 / Pixel 8 |
| `md` | 430px | iPhone Pro Max |
| `lg` | 768px | Tablet portrait ← divisor mobile/desktop |
| `xl` | 1024px | iPad landscape / laptop |
| `2xl` | 1280px | Laptop standard |
| `3xl` | 1440px | Desktop — **referência primária** |
| `4xl` | 1600px | Desktop large |
| `5xl` | 1920px | Full HD |
| `6xl` | 2560px | 2K / QHD |

Fonte única: `src/lib/breakpoints.ts` → alimenta Tailwind, CSS vars e hooks JS.

### Easing

| Token | Valor | Uso |
|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transições de layout |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Botões com bounce |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas de viewport |

---

## Design Tokens TypeScript

```ts
import { tokens } from '@/lib/tokens'

tokens.colors.gold           // '#b8960c'
tokens.easing.outExpo        // 'cubic-bezier(0.16, 1, 0.3, 1)'
tokens.duration.slow         // 600 (ms)
tokens.zIndex.navbar         // 100
tokens.shadows.gold          // '0 4px 24px rgba(184, 150, 12, 0.25)'
```

---

## Sistema de Ícones

```ts
// Import por categoria — todos tree-shakeable
import {
  BedDouble, Bath, Car, Area,   // Imóvel
  Gym, Pool, Security, Spa,     // Amenidades
  MapPin, Compass,              // Localização
  Phone, Mail, Chat,            // Contato
} from '@/components/icons'

// SVG custom
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
```

Baseado em **Lucide React v0.468** (já instalado). Ícones não disponíveis no Lucide têm fallback semântico (ex: `CircleParking` para `ParkingSquare`).

---

## Dark Mode

Implementação via `ThemeProvider` + CSS custom properties:

- `ThemeProvider` → aplica `data-theme="dark"` e `class="dark"` no `<html>`
- `ThemeScript` → script inline no `<head>` para evitar FOUC
- `globals.css` → bloco `[data-theme="dark"]` com paleta luxury escura

```ts
import { useTheme } from '@/providers'

const { theme, setTheme, toggleTheme } = useTheme()
```

---

## Responsividade

Abordagem **Mobile First**: código base para mobile, breakpoints progressivos via `@media (min-width: ...)`.

**Regra de migração** de Tailwind defaults antigos:
- `sm:` (640px) → `lg:` (768px) — "tablet+"
- `md:` (768px) → `lg:` (768px) — mesmo px, novo nome
- `lg:` (1024px) → `xl:` (1024px) — mesmo px, novo nome

**Container padding responsivo** (`--container-pad`):
`20px → 24px → 40px → 56px → 80px → 96px → 112px → 128px → 192px`

---

## Hooks Disponíveis

```ts
import {
  useBreakpoint,   // { breakpoint, isAbove, isBelow, is }
  useViewport,     // { isMobile, isTablet, isDesktop, width, height }
  useMediaQuery,   // (query: string) => boolean
  useIsAbove,      // (bp: Breakpoint) => boolean
  useIsBelow,      // (bp: Breakpoint) => boolean
  useIsLg,         // boolean — tablet+
  useIs3Xl,        // boolean — desktop 1440px+
  usePrefersReducedMotion,
  usePrefersColorSchemeDark,
  useIsTouch,
  useIsHighDpi,
} from '@/hooks'
```

---

## Princípios de Arquitetura

- **Server Components por padrão** — `'use client'` apenas para estado/interatividade
- **Feature-Based Architecture (FBA)** — features em `src/features/`, não em `components/`
- **Composition over Inheritance** — sem herança de classes, composição via props
- **Single Source of Truth** — breakpoints em `lib/breakpoints.ts`, tokens em `lib/tokens.ts`
- **SOLID** — responsabilidade única por arquivo, sem código morto, sem `any`
- **Zero warnings** — strict TypeScript, ESLint sem supressões

---

## Sanity

- **Project ID:** `gvf51tpc`
- **Dataset:** `production`
- **Studio:** `/studio` (rota separada, fora do `[locale]`)
- **Tipos gerados:** `pnpm sanity:typegen`
- **Queries:** `src/sanity/queries.ts`

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SITE_URL=https://admirata.com.br
NEXT_PUBLIC_SANITY_PROJECT_ID=gvf51tpc
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
NEXT_PUBLIC_META_PIXEL_ID=...
```
