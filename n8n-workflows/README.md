# Admirata — Workflows N8n

Todos os workflows operam via **Webhook HTTP**. Importe cada `.json` no N8n em **Workflows → Import from File**.

---

## Configuração inicial

No N8n, crie as seguintes variáveis em **Settings → Variables**:

| Variável | Valor |
|---|---|
| `SANITY_TOKEN` | Token de escrita da Sanity (consulte Claude para obter) |
| `OPENAI_API_KEY` | Chave da API OpenAI (somente workflow 08) |

---

## Workflows disponíveis

### 01 — Criar Bairro
**POST** `/webhook/criar-bairro`

```json
{
  "nome": "Jacarepaguá",
  "mercado": "barra",
  "regiao": "Zona Oeste",
  "ordem": 20
}
```
Campos opcionais: `slug`, `cidade`, `estado`, `zona`.

---

### 02 — Criar Bairro Planejado
**POST** `/webhook/criar-bairro-planejado`

```json
{
  "nome": "Ilha Pura",
  "mercado": "barra",
  "incorporadora": "Carvalho Hosken",
  "introTexto": "Bairro olímpico planejado...",
  "anoInauguracao": 2016
}
```

---

### 03 — Criar Imóvel
**POST** `/webhook/criar-imovel`

```json
{
  "titulo": "Cobertura 4 Quartos no Leblon",
  "finalidade": "Venda",
  "tipo": "Cobertura",
  "preco": 4500000,
  "quartos": 4,
  "suites": 2,
  "banheiros": 4,
  "vagas": 2,
  "areaUtil": 220,
  "bairroId": "bairro-leblon",
  "destaque": true
}
```
`bairroId` e `condominioId` são os `_id` do Sanity (ex: `bairro-barra-da-tijuca`).

---

### 04 — Editar Imóvel
**POST** `/webhook/editar-imovel`

```json
{
  "_id": "imovel-cobertura-4q-leblon",
  "status": "Vendido",
  "preco": 4200000
}
```
Apenas os campos enviados são alterados. O cache do Next.js é revalidado automaticamente.

---

### 05 — Upload de Fotos
**POST** `/webhook/upload-foto`

```json
{
  "documentoId": "imovel-cobertura-4q-leblon",
  "imagemUrl": "https://meusite.com/foto-sala.jpg",
  "campo": "fotoCapa",
  "legenda": "Sala de estar"
}
```
`campo` aceita: `fotoCapa`, `fotoAerea`, `fotos` (galeria — adiciona ao array).

---

### 06 — Imóveis à Venda
**GET** `/webhook/imoveis-venda`

```
?bairro=barra-da-tijuca&quartos=3&precoMax=1500000&pagina=1
```
Retorna lista paginada com `imoveis[]` e `paginacao{ total, pagina, por_pagina, total_paginas }`.

---

### 07 — Imóveis Aluguel
**GET** `/webhook/imoveis-aluguel`

```
?bairro=ipanema&quartos=2
```
Igual ao 06, mas filtra `finalidade == 'Locação'`.

---

### 08 — Gerar Descrição com IA
**POST** `/webhook/gerar-descricao`

```json
{
  "_id": "imovel-cobertura-4q-leblon",
  "tom": "sofisticado",
  "focusSEO": "cobertura 4 quartos leblon"
}
```
Toms disponíveis: `sofisticado`, `direto`, `emocional`.

Fluxo: busca dados no Sanity → monta prompt → chama GPT-4o → salva descrição de volta no Sanity.

---

## IDs dos bairros criados

| Bairro | ID Sanity |
|---|---|
| Barra da Tijuca | `bairro-barra-da-tijuca` |
| Recreio dos Bandeirantes | `bairro-recreio-dos-bandeirantes` |
| Ilha Pura | `bairro-ilha-pura` |
| **Cidade Arte** *(planejado)* | `bairro-cidade-arte-barra` |
| Botafogo | `bairro-botafogo` |
| Copacabana | `bairro-copacabana` |
| Ipanema | `bairro-ipanema` |
| Leblon | `bairro-leblon` |
| Lapa | `bairro-lapa` |
| Centro | `893ce5d3-d469-46ef-bb68-af6fca299890` |
| Camorim | `bairro-camorim` |
| Curicica | `bairro-curicica` |
| Freguesia | `bairro-freguesia` |
| Itanhangá | `bairro-itanhanga` |
| Vargem Grande | `bairro-vargem-grande` |
| Vargem Pequena | `bairro-vargem-pequena` |
| Jacarepaguá | `bairro-jacarepagua` |

## Condomínios do Cidade Arte (Calper)

| Condomínio | ID Sanity |
|---|---|
| Arte Wave Surf Residences | `condominio-arte-wave` |
| Arte Design | `condominio-arte-design` |
| Arte Botânica | `condominio-arte-botanica` |
| Arte Jardim Residencial | `condominio-arte-jardim` |
| Arte Wood Residences | `condominio-arte-wood` |
