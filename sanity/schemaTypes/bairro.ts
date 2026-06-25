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
      description: 'Zona geografica do Rio. Ignorar para Serra Gaucha.',
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
      description: 'Marcar se este bairro e um empreendimento de bairro planejado (ex: Ilha Pura, Peninsula, Rio2)',
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
      title: 'Area total do bairro (m2)',
      type: 'number',
      group: 'basico',
      description: 'Area total do empreendimento em m2',
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
      description: 'Ex: Parque 72mil m2, Escola, Shopping, Segurança 24h',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titulo', title: 'Titulo', type: 'string' },
            { name: 'descricao', title: 'Descricao curta', type: 'string' },
            {
              name: 'icone',
              title: 'Icone (emoji ou nome)',
              type: 'string',
              description: 'Ex: parque',
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
      title: 'Foto aerea (parallax no hero)',
      type: 'image',
      group: 'basico',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem Open Graph (1200x630)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),

    // ─── Conteúdo SEO ──────────────────────────────────────────────
    defineField({
      name: 'introTexto',
      title: 'Intro curta (aparece no hero)',
      type: 'text',
      group: 'conteudo',
      rows: 2,
    }),
    defineField({
      name: 'porQueMorar',
      title: 'Por que morar aqui? (rich text)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'block' })],
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
      description: 'Frase curta usada no fallback da meta description.',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'faixaPreco',
      title: 'Faixa de preco dos imoveis',
      type: 'object',
      group: 'conteudo',
      fields: [
        defineField({ name: 'min', title: 'Preco minimo (R$)', type: 'number' }),
        defineField({ name: 'max', title: 'Preco maximo (R$)', type: 'number' }),
        defineField({
          name: 'tipoPredominante',
          title: 'Tipo predominante',
          type: 'string',
          description: 'Ex: Apartamentos e coberturas de alto padrao',
        }),
      ],
    }),
    defineField({
      name: 'caracteristicas',
      title: 'Caracteristicas / tags do bairro',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
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
    }),
    defineField({
      name: 'bairrosProximos',
      title: 'Bairros proximos (linkagem interna)',
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
                  'Metro',
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
      description: 'Ex: Imoveis a venda na Barra da Tijuca | Admirata RJ',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (150-160 chars)',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'cidade' },
  },
})
