# Variáveis de Ambiente — Referência (Vercel)

Auditoria cruzando o que o **código realmente usa** com o `.env.local.example`.
Fonte de verdade: as variáveis abaixo. Configurar em **Vercel → admirata-imoveis →
Settings → Environment Variables** (ambiente **Production**, e também Preview se quiser).

> O conector da Vercel não expõe as envs já setadas, então confira no painel
> contra esta lista. Após qualquer mudança de env, é preciso **Redeploy**.

## Críticas — precisam ser setadas para as features novas funcionarem

| Variável | Para quê | Sem ela |
|---|---|---|
| `SANITY_REVALIDATE_SECRET` | Autentica o webhook `/api/revalidate` | Webhook responde 503; conteúdo só atualiza via ISR (até 1h) |
| `LEAD_WEBHOOK_URL` | Destino dos leads (`/api/lead` → planilha/n8n) | Lead é recebido mas **não é salvo** (rota responde 202 e só loga) |

> ⚠️ Antes a doc citava `REVALIDATION_SECRET` — o nome correto é
> **`SANITY_REVALIDATE_SECRET`** (já corrigido no código e no `.env.example`).

## Já têm fallback no código — funcionam sem setar, mas o ideal é setar

| Variável | Fallback no código | Observação |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gvf51tpc` | — |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | — |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-06-01` | — |
| `NEXT_PUBLIC_SITE_URL` | `https://admirata.com.br` | usado em canonical/sitemap/OG |
| `NEXT_PUBLIC_GA_ID` | `G-E5BR36BRDR` | GA4; já ativo via fallback |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1508453854293434` | Pixel Admirata; já ativo via fallback |

## Condicionais / opcionais

| Variável | Quando é necessária |
|---|---|
| `SANITY_API_TOKEN` | Preview/Draft Mode e scripts de escrita no Sanity (read-only não precisa). Provavelmente já setada — o build atual funciona |
| `NEXT_PUBLIC_HERO_VIDEO_SRC` | Só se quiser apontar o vídeo do hero a um CDN (fallback: `/videos/hero-rio-lagoa.mp4`) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | **Não usada hoje** — sem componente de mapa. Setar só quando a Fase 7 (Localização) for construída |

## Resumo: o que fazer agora na Vercel

1. **Setar `SANITY_REVALIDATE_SECRET`** (gerar UUID) → ver `docs/revalidacao-sanity.md`.
2. **Setar `LEAD_WEBHOOK_URL`** (URL do Apps Script) → ver `docs/captacao-leads.md`.
3. Confirmar que `SANITY_API_TOKEN` está setada (necessária se usar preview/scripts).
4. (Opcional) Setar GA/Pixel/Sanity/SITE_URL explicitamente — já funcionam via fallback.
5. **Redeploy** após as mudanças.

Tudo o que tem fallback já está operacional no deploy atual. As únicas pendências
reais de configuração são as duas variáveis **Críticas** acima.
