# Site Público — UI kit

Recriação fiel do **site institucional Admirata** em produção (admirata.com.br).

## Fonte de verdade
Reconstruído a partir do repositório real **`redeadmirata/siiteluxoadmirata`** (Next.js 14 · Sanity · Tailwind · next-intl · framer-motion/gsap). Tokens, tipografia, copy e estrutura espelham o código de produção — **não** o restante deste design system (que usa paleta petrol/Jost).

> ⚠️ **Divergência de marca:** o site em produção usa uma paleta própria — **ink `#1a1a2e` + gold `#b8960c` + stone `#f5f0e8`**, com **Cormorant Garamond + Inter + JetBrains Mono**. Difere dos tokens petrol/ouro do design system Admirata neste projeto. Este kit segue o site real. Decidir se unificamos as duas direções é uma pergunta aberta ao cliente.

## Telas (click-through interativo)
- **Home** — hero escuro (`HeroHome`), grade de imóveis em destaque, grade de bairros, footer com newsletter.
- **Imóveis** — listagem com filtros por tipo / mercado (Rio · Serra) / quartos (`FiltrosSearch` com chips), contador de resultados.
- **Detalhe (PDI)** — galeria hero, preço, descrição, ficha técnica em grade, características por grupo, CTA sticky (WhatsApp + agendar), imóveis semelhantes.
- Condomínios / Bairros / Blog / Favoritos — placeholders (existem em produção via Sanity).

## Arquivos
- `index.html` — tokens reais inline (espelha `src/app/globals.css`), Google Fonts, mount.
- `data.jsx` — imóveis de demonstração, bairros, formatadores, WhatsApps reais e `PropImg` (placeholder arquitetônico abstrato — imagens reais vêm do Sanity).
- `app.jsx` — Navbar, Hero, cards, filtros, PDI, footer, FAB WhatsApp, shell de navegação.

## Dados reais embutidos
- WhatsApp Rio `+55 21 99807-9459` · Serra Gaúcha `+55 54 99264-3070`
- CRECI-F 58308 · CRECI RJ-008553/O
- Mercados: Barra, Recreio, Leblon, Ipanema, Jacarepaguá (RJ) · Gramado, Canela (RS)

## Pendências / para preencher
- **Fotos reais** dos imóveis (hoje placeholders) — vêm do Sanity em produção.
- Telas Condomínios, Bairros, Blog, Sobre, Contato (estrutura existe no repo; recriação focou no fluxo principal).
- Multi-idioma PT/EN/FR existe no site — kit em PT-BR.
