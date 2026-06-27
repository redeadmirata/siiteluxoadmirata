# Captação de Leads — Setup

O formulário de contato (e qualquer chamada a `POST /api/lead`) envia o lead para a
URL configurada em `LEAD_WEBHOOK_URL`. Hoje o destino é uma **planilha do Google**
via Google Apps Script. Trocar para n8n / Supabase / CRM depois = só mudar a URL.

## Fluxo

```
ContatoForm → POST /api/lead (valida com Zod) → LEAD_WEBHOOK_URL (Apps Script) → Planilha
```

O lead é gravado mesmo que o usuário não conclua o envio no WhatsApp (o POST usa
`keepalive`). Se `LEAD_WEBHOOK_URL` estiver vazia, a rota responde 202 e apenas loga.

## Passo 1 — Criar a planilha + Apps Script

1. Crie uma planilha no Google Sheets (ex.: "Admirata — Leads").
2. Menu **Extensões → Apps Script**.
3. Apague o conteúdo e cole o script abaixo. Salve (Ctrl+S).

```javascript
// Recebe leads do site Admirata e grava na aba "Leads".
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // (Opcional) proteção por token: defina o mesmo valor em LEAD_WEBHOOK_TOKEN
    // var TOKEN = 'troque-por-um-uuid';
    // if (data.token !== TOKEN) return _json({ ok: false, error: 'unauthorized' });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data','Nome','Telefone','E-mail','Origem','Intenção','Assunto/Notas','Mensagem','Página','UTM','Imóvel']);
    }
    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.name || '', data.phone || '', data.email || '',
      data.source || '', data.intent || '', data.notes || '',
      data.message || '', data.pageUrl || '',
      data.utm ? JSON.stringify(data.utm) : '',
      data.propertyTitle || data.propertySlug || ''
    ]);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Passo 2 — Publicar como Web App

1. No Apps Script: **Implantar → Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Eu**. Quem tem acesso: **Qualquer pessoa**.
4. **Implantar** e autorize o acesso à planilha.
5. Copie a **URL do app da Web** (algo como `https://script.google.com/macros/s/.../exec`).

## Passo 3 — Configurar na Vercel

1. Vercel → projeto **admirata-imoveis** → **Settings → Environment Variables**.
2. Adicione:
   - `LEAD_WEBHOOK_URL` = a URL do passo 2 (ambiente **Production**).
3. **Redeploy** (Deployments → ⋯ → Redeploy) para aplicar a env.

Pronto — os próximos envios do formulário aparecem na planilha.

## Notas

- **Segurança:** o Web App fica público (qualquer um pode chamar a URL). Para um
  site em produção, recomendo ativar o token opcional (descomente no script e
  adicione `LEAD_WEBHOOK_TOKEN` na Vercel; eu ajusto a rota para enviá-lo). O
  honeypot do formulário já barra bots simples que passem pelo site.
- **Migração futura:** para Supabase/Postgres/n8n, basta trocar `LEAD_WEBHOOK_URL`
  (ou eu adiciono um branch na rota `/api/lead`). O formulário não muda.
- **Outros pontos de entrada:** hoje só o `ContatoForm` está ligado. WhatsApp
  flutuante, CTAs e o form da PDI podem ser ligados ao mesmo `/api/lead` depois.
