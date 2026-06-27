# public/

Assets estáticos servidos diretamente pela CDN do Next.js em `/`.

---

## Estrutura

```
public/
├── images/          Imagens estáticas da UI (não de imóveis)
├── videos/          Vídeos de background / institucionais
├── icons/           Ícones SVG avulsos e favicon variants
├── logos/           Logotipo Admirata em variações
└── fonts/           Fontes self-hosted (WOFF2)
```

---

## Convenções

### `images/`
Imagens da interface — placeholders, ilustrações, backgrounds fixos, OG image padrão.  
**Fotos de imóveis e bairros ficam no Sanity** (nunca aqui).

| Arquivo sugerido | Uso |
|---|---|
| `og-default.jpg` | Open Graph padrão (1200×630) |
| `placeholder-imovel.jpg` | Fallback quando imóvel sem foto |
| `hero-home.jpg` | Hero da home (fallback sem vídeo) |

### `videos/`
Vídeos leves para background (`.mp4` + `.webm`). Máximo **8 MB** por arquivo.

| Arquivo sugerido | Uso |
|---|---|
| `hero-loop.mp4` | Hero da home — autoplay muted loop |
| `hero-loop.webm` | Versão WebM (menor) |

### `icons/`
- `favicon.ico` — 32×32
- `icon-192.png` — PWA
- `icon-512.png` — PWA
- `apple-touch-icon.png` — 180×180

### `logos/`
| Arquivo | Variação |
|---|---|
| `logo.svg` | Principal (escuro) |
| `logo-white.svg` | Versão clara (para fundos escuros) |
| `logo-gold.svg` | Versão ouro |
| `logo-mark.svg` | Ícone/símbolo isolado |
| `logo.png` | Fallback PNG 2× (400px de largura) |

### `fonts/`
Fontes self-hosted carregadas via `next/font/local`.  
Apenas **WOFF2** (melhor compressão, suporte universal).

| Arquivo | Fonte |
|---|---|
| `CormorantGaramond-Light.woff2` | Display — peso 300 |
| `CormorantGaramond-Regular.woff2` | Display — peso 400 |
| `CormorantGaramond-Italic.woff2` | Display — itálico |
| `CormorantGaramond-SemiBold.woff2` | Display — peso 600 |
| `Inter-Variable.woff2` | Body — variável |

---

## Regras

- **Nunca** commitar fotos de imóveis aqui — use o Sanity
- Imagens da UI: otimizar com **Squoosh** ou similar antes de commitar
- Vídeos: converter com `ffmpeg -crf 28` para manter tamanho razoável
- Fontes: baixar do Google Fonts ou Foundry e converter com `glyphhanger`
