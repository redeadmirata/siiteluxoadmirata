# Revalidação Sanity → Next.js (publicação instantânea)

Quando um documento é publicado no Sanity, um webhook chama `POST /api/revalidate`,
que invalida as rotas afetadas (via `revalidatePath`) e as cache tags. Sem isso, o
conteúdo só atualiza na janela de ISR (60s a 1h).

> A rota revalida por **rota** (não só por tag) porque a maioria dos fetches ainda
> não declara cache tags. Funciona com o código atual; migrar os fetches para
> `sanityFetch({ tags })` é uma melhoria futura (mais granular).

## Passo 1 — Gerar o secret

Gere um UUID aleatório (ex.: no terminal `node -e "console.log(crypto.randomUUID())"`).
Guarde-o; ele vai na Vercel e no header do webhook.

## Passo 2 — Vercel

1. Vercel → projeto **admirata-imoveis** → **Settings → Environment Variables**.
2. Adicione (ambiente **Production**):
   - `SANITY_REVALIDATE_SECRET` = o UUID do passo 1
3. **Redeploy** para aplicar.

> ⚠️ O código lê **`SANITY_REVALIDATE_SECRET`** (não `REVALIDATION_SECRET`, que estava
> no `.env.example` antigo — já corrigido).

## Passo 3 — Webhook no Sanity

Em **sanity.io/manage → projeto `gvf51tpc` → API → Webhooks → Create webhook**:

| Campo | Valor |
|---|---|
| Name | Revalidate Next.js |
| URL | `https://admirata.com.br/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | `POST` |
| API version | `v2024-06-01` (ou a mais recente) |
| Filter (GROQ) | `_type in ["imovel","condominio","bairro","post","lancamento","siteSettings"]` |
| Projection | `{ _type, slug }` |
| HTTP Headers | `Authorization: Bearer <SECRET do passo 1>` |

> O handler autentica pelo header `Authorization: Bearer <secret>`. Use o campo
> **HTTP Headers** do webhook (não o campo "Secret", que é para assinatura HMAC —
> deixe vazio por enquanto).

## Passo 4 — Testar

**Manual (GET, revalida uma rota):**
```bash
curl -H "Authorization: Bearer SEU_SECRET" \
  "https://admirata.com.br/api/revalidate?path=/[locale]/imoveis"
# → { "revalidated": true, "path": "/[locale]/imoveis" }
```

**Ponta a ponta:** edite um imóvel no Studio, publique, e confira na página dele em
poucos segundos. A resposta do webhook (em Sanity → Webhooks → Attempts) deve ser
`200` com `{ revalidated: true, paths: [...] }`.

## O que cada tipo revalida

| Tipo publicado | Rotas revalidadas |
|---|---|
| `imovel` | home, /imoveis, /imoveis/[bairro], /imovel/[slug] |
| `condominio` | home, /condominios, /condominios/[slug], /imoveis/[bairro]/[cond] |
| `bairro` | home, /bairros, /bairros/[slug], /bairros-planejados(/[slug]), /imoveis/[bairro] |
| `lancamento` | home, /lancamentos, /lancamento/[slug] |
| `post`/`artigo` | /blog, /blog/[slug] |
| `siteSettings` | home |

## Melhorias futuras (opcionais)

- **Tags granulares:** migrar os `client.fetch(..., { next: { revalidate } })` para
  `sanityFetch({ query, params, tags })` (já existe em `src/sanity/client.ts`) para
  revalidação por documento específico, reduzindo re-render desnecessário.
- **Assinatura HMAC:** trocar o Bearer por verificação de assinatura com
  `@sanity/webhook` (mais seguro que o header).
