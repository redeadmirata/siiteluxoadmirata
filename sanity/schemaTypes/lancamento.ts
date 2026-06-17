import { defineType, defineField, defineArrayMember } from 'sanity'

export const lancamento = defineType({
  name: 'lancamento',
  title: 'Lançamento',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Dados Básicos', default: true },
    { name: 'conteudo', title: 'Conteúdo' },
    { name: 'midia', title: 'Mídia' },
    { name: 'seo', title: 'SEO / Meta' },
  ],
  fields: [
    // ─── Dados Básicos ─────────────────────────────────────────────
    defineField({
      name: 'titulo',
      title: 'Nome do lançamento',
      type: 'string',
      group: 'basico',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'basico',
      options: { source: 'titulo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bairro',
      title: 'Bairro',
      type: 'reference',
      group: 'basico',
      to: [{ type: 'bairro' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'construtora',
      title: 'Construtora / Incorporadora',
      type: 'string',
      group: 'basico',
    }),
    defineField({
      name: 'statusObra',
      title: 'Status da obra',
      type: 'string',
      group: 'basico',
      options: {
        list: [
          { title: 'Na planta', value: 'na-planta' },
          { title: 'Em obras', value: 'em-obras' },
          { title: 'Pronto para morar', value: 'pronto' },
          { title: 'Breve lançamento', value: 'breve' },
        ],
        layout: 'radio',
      },
      initialValue: 'na-planta',
    }),
    defineField({
      name: 'previsaoEntrega',
      title: 'Previsão de entrega',
      type: 'string',
      group: 'basico',
      description: 'Ex: 2º trimestre 2027',
    }),
    defineField({
      name: 'precoAPartirDe',
      title: 'Preço a partir de (R$)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'destaque',
      title: 'Destaque na seção de lançamentos',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'tipologias',
      title: 'Tipologias',
      type: 'array',
      group: 'basico',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tipologia',
          fields: [
            defineField({ name: 'descricao', title: 'Descrição', type: 'string', description: 'Ex: 3 suítes com garden' }),
            defineField({ name: 'area', title: 'Área (m²)', type: 'string', description: 'Ex: 120 a 145 m²' }),
            defineField({ name: 'preco', title: 'Preço (R$)', type: 'number' }),
          ],
          preview: {
            select: { title: 'descricao', subtitle: 'area' },
          },
        }),
      ],
    }),

    // ─── Conteúdo ──────────────────────────────────────────────────
    defineField({
      name: 'descricao',
      title: 'Descrição (rich text)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'infraestrutura',
      title: 'Infraestrutura / Lazer',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'diferenciais',
      title: 'Diferenciais do empreendimento',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Ex: Marina privativa, heliporto, frente-mar, vista 360°',
    }),

    // ─── Mídia ─────────────────────────────────────────────────────
    defineField({
      name: 'imagemCapa',
      title: 'Imagem de capa',
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria (renders / perspectivas)',
      type: 'array',
      group: 'midia',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'asset', title: 'Imagem', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'alt', title: 'Alt', type: 'string' }),
            defineField({ name: 'legenda', title: 'Legenda', type: 'string' }),
          ],
          preview: {
            select: { media: 'asset', title: 'legenda' },
            prepare({ media, title }) { return { title: title ?? 'Render', media } },
          },
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL do vídeo (YouTube/Vimeo)',
      type: 'url',
      group: 'midia',
    }),

    // ─── SEO / Meta ────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta title (max 60 chars)',
      type: 'string',
      group: 'seo',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (max 160 chars)',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem Open Graph',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'bairro.nome',
      media: 'imagemCapa',
    },
  },
})
