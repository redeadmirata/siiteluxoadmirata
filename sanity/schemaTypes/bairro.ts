import { defineType, defineField, defineArrayMember } from 'sanity'

export const bairro = defineType({
  name: 'bairro',
  title: 'Bairro / Localidade',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Dados Básicos', default: true },
    { name: 'conteudo', title: 'Conteúdo SEO' },
    { name: 'mapa', title: 'Mapa & POIs' },
    { name: 'seo', title: 'SEO / Meta' },
  ],
  fields: [
    // ─── Dados Básicos ─────────────────────────────────────────────
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      group: 'basico',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'basico',
      options: { source: 'nome', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cidade',
      title: 'Cidade',
      type: 'string',
      group: 'basico',
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      group: 'basico',
      options: { list: ['RJ', 'RS'], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mercado',
      title: 'Mercado',
      type: 'string',
      group: 'basico',
      options: {
        list: ['Rio de Janeiro', 'Serra Gaúcha'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'regiao',
      title: 'Região / Sub-mercado',
      type: 'string',
      group: 'basico',
      description: 'Usado para agrupar bairros dentro do mercado na página /bairros',
      options: {
        list: [
          { title: 'Centro (Rio)', value: 'Centro' },
          { title: 'Zona Sul (Rio)', value: 'Zona Sul' },
          { title: 'Sudoeste / Barra (Rio)', value: 'Sudoeste' },
          { title: 'Gramado (Serra Gaúcha)', value: 'Gramado' },
          { title: 'Canela (Serra Gaúcha)', value: 'Canela' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'zona',
      title: 'Zona (RJ)',
      type: 'string',
      group: 'basico',
      description: 'Zona geográfica do Rio. Ignorar para Serra Gaúcha.',
      options: {
        list: [
          { title: 'Zona Oeste', value: 'oeste' },
          { title: 'Zona Sul', value: 'sul' },
          { title: 'Centro', value: 'centro' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      group: 'basico',
      initialValue: 99,
    }),
    defineField({
      name: 'bairroplanejado',
      title: 'Bairro Planejado?',
      type: 'boolean',
      group: 'basico',
      description: 'Marcar se este bairro é um empreendimento de bairro planejado (ex: Ilha Pura, Península, Rio2)',
      initialValue: false,
    }),
    defineField({
      name: 'incorporadora',
      title: 'Incorporadora / Desenvolvedor',
      type: 'string',
      group: 'basico',
      description: 'Ex: Carvalho Hosken, Odebrecht, Even',
    }),
    defineField({
      name: 'areaTotal',
      title: 'Área total do bairro (m²)',
      type: 'number',
      group: 'basico',
      description: 'Área total do empreendimento em m²',
    }),
    defineField({
      name: 'anoInauguracao',
      title: 'Ano de inauguração',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'amenidades',
      title: 'Amenidades do bairro planejado',
      type: 'array',
      group: 'conteudo',
      description: 'Ex: Parque 72mil m², Escola, Shopping, Segurança 24h',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descricao', title: 'Descrição curta', type: 'string' },
            {
              name: 'icone',
              title: 'Ícone (emoji ou nome)',
              type: 'string',
              description: 'Ex: 🌿 ou "parque"',
            },
          ],
          preview: { select: { title: 'titulo', subtitle: 'descricao' } },
        },
      ],
    }),

    // ─── Imagens ───────────────────────────────────────────────────
    defineField({
      name: 'fotoCapa',
      title: 'Foto de capa (card)',
      type: 'image',
      group: 'basico',
      options: { hotspot: true },
    }),
    defineField({
      name: 'fotoAerea',
      title: 'Foto aérea (parallax no hero)',
      type: 'image',
      group: 'basico',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem Open Graph (1200×630)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),

    // ─── Conteúdo SEO ──────────────────────────────────────────────
    defineField({
      name: 'introTexto',
      title: 'Intro curta (aparece no hero — 1-2 linhas)',
      type: 'text',
      group: 'conteudo',
      rows: 2,
      description: 'Ex: "A Barra da Tijuca reúne 18 km de praia com infraestrutura de primeiro mundo."',
    }),
    defineField({
      name: 'porQueMorar',
      title: 'Por que morar aqui? (rich text — 400-600 palavras)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Conteúdo único por bairro. Estrutura: visão geral → natureza → infraestrutura → mercado imobiliário → para quem é.',
    }),
    defineField({
      name: 'descricao',
      title: 'Texto SEO resumido (legado)',
      type: 'text',
      group: 'conteudo',
      rows: 8,
      description: 'Campo legado. Para novos bairros, prefira porQueMorar.',
    }),
    defineField({
      name: 'destaque',
      title: 'Frase de destaque (SEO / meta fallback)',
      type: 'string',
      group: 'conteudo',
      description: 'Frase curta usada no fallback da meta description. Ex: "vistas para o maciço da Tijuca e acesso direto à praia"',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'faixaPreco',
      title: 'Faixa de preço dos imóveis',
      type: 'object',
      group: 'conteudo',
      fields: [
        defineField({ name: 'min', title: 'Preço mínimo (R$)', type: 'number' }),
        defineField({ name: 'max', title: 'Preço máximo (R$)', type: 'number' }),
        defineField({
          name: 'tipoPredominante',
          title: 'Tipo predominante',
          type: 'string',
          description: 'Ex: Apartamentos e coberturas de alto padrão',
        }),
      ],
    }),
    defineField({
      name: 'caracteristicas',
      title: 'Características / tags do bairro',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Ex: praia, condomínio fechado, planejado, frente-mar, lazer completo',
    }),
    defineField({
      name: 'faqs',
      title: 'Perguntas frequentes (FAQPage schema)',
      type: 'array',
      group: 'conteudo',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({
              name: 'pergunta',
              title: 'Pergunta',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'resposta',
              title: 'Resposta',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'pergunta', subtitle: 'resposta' },
          },
        }),
      ],
      description: 'Mínimo 5 FAQs únicas por bairro. Geram FAQPage JSON-LD e aparecem como acordeão na página.',
    }),
    defineField({
      name: 'bairrosProximos',
      title: 'Bairros próximos (linkagem interna)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'bairro' }] })],
    }),

    // ─── Mapa & POIs ───────────────────────────────────────────────
    defineField({
      name: 'geo',
      title: 'Coordenadas (centro do bairro)',
      type: 'object',
      group: 'mapa',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),
    defineField({
      name: 'pontosDeInteresse',
      title: 'Pontos de interesse (mapa)',
      type: 'array',
      group: 'mapa',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'nome', title: 'Nome', type: 'string' },
            {
              name: 'categoria',
              title: 'Categoria',
              type: 'string',
              options: {
                list: [
                  'Praia',
                  'Restaurante',
                  'Shopping',
                  'Escola',
                  'Hospital',
                  'Metrô',
                  'Supermercado',
                  'Academia',
                ],
              },
            },
            { name: 'lat', title: 'Latitude', type: 'number' },
            { name: 'lng', title: 'Longitude', type: 'number' },
          ],
          preview: {
            select: { title: 'nome', subtitle: 'categoria' },
          },
        }),
      ],
    }),

    // ─── SEO / Meta ────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta title (max 60 chars)',
      type: 'string',
      group: 'seo',
      description: 'Ex: Imóveis à venda na Barra da Tijuca | Admirata