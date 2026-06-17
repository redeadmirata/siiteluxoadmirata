import { defineType, defineField, defineArrayMember } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog / Lifestyle',
  type: 'document',
  groups: [
    { name: 'conteudo', title: 'Conteúdo', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      group: 'conteudo',
      validation: (r) => r.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'conteudo',
      options: { source: 'titulo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      group: 'conteudo',
      options: {
        list: [
          { title: 'Lifestyle RJ', value: 'lifestyle-rj' },
          { title: 'Serra Gaúcha', value: 'serra-gaucha' },
          { title: 'Mercado Imobiliário', value: 'mercado' },
          { title: 'Arquitetura & Design', value: 'arquitetura' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imagemCapa',
      title: 'Imagem de capa (parallax)',
      type: 'image',
      group: 'conteudo',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        },
      ],
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo / Subtítulo',
      type: 'text',
      group: 'conteudo',
      rows: 3,
      description: 'Exibido no card da listagem. Máx. 200 caracteres.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'conteudo',
      title: 'Conteúdo',
      type: 'array',
      group: 'conteudo',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'legenda', title: 'Legenda', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'bairroRelacionado',
      title: 'Bairro relacionado (CTA lateral)',
      type: 'reference',
      to: [{ type: 'bairro' }],
      group: 'conteudo',
      description: 'Usado no CTA flutuante dentro do artigo',
    }),
    defineField({
      name: 'autor',
      title: 'Autor',
      type: 'string',
      group: 'conteudo',
      initialValue: 'Admirata Imóveis',
    }),
    defineField({
      name: 'publicadoEm',
      title: 'Publicado em',
      type: 'datetime',
      group: 'conteudo',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destaque',
      title: 'Post em destaque?',
      type: 'boolean',
      group: 'conteudo',
      initialValue: false,
    }),

    // ─── SEO ──────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta title (máx. 60 caracteres)',
          type: 'string',
          validation: (r) => r.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta description (máx. 160 caracteres)',
          type: 'text',
          rows: 3,
          validation: (r) => r.max(160),
        },
        {
          name: 'ogImage',
          title: 'OG Image (1200×630)',
          type: 'image',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'titulo',
      media: 'imagemCapa',
      categoria: 'categoria',
      publicadoEm: 'publicadoEm',
    },
    prepare({ title, media, categoria, publicadoEm }) {
      const data = publicadoEm
        ? new Date(publicadoEm).toLocaleDateString('pt-BR')
        : ''
      return {
        title: title ?? 'Sem título',
        media,
        subtitle: `${categoria ?? ''} · ${data}`,
      }
    },
  },

  orderings: [
    {
      title: 'Mais recentes',
      name: 'publicadoEmDesc',
      by: [{ field: 'publicadoEm', direction: 'desc' }],
    },
  ],
})
