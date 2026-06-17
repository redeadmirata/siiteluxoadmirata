import { defineType, defineField, defineArrayMember } from 'sanity'

export const condominio = defineType({
  name: 'condominio',
  title: 'Condomínio / Empreendimento',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Dados Básicos', default: true },
    { name: 'conteudo', title: 'Conteúdo SEO' },
    { name: 'midia', title: 'Mídia' },
    { name: 'localizacao', title: 'Localização' },
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
      name: 'bairro',
      title: 'Bairro',
      type: 'reference',
      group: 'basico',
      to: [{ type: 'bairro' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      group: 'basico',
      options: {
        list: [
          { title: 'Condomínio Fechado', value: 'condominio-fechado' },
          { title: 'Bairro Planejado', value: 'bairro-planejado' },
          { title: 'Empreendimento Vertical', value: 'vertical' },
          { title: 'Resort / Club', value: 'resort' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'destaque',
      title: 'Destaque na home',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'forcarNoindex',
      title: 'Forçar noindex (override manual)',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
      description: 'Se marcado, a página recebe noindex mesmo tendo imóveis ativos.',
    }),
    defineField({
      name: 'construtora',
      title: 'Construtora / Incorporadora',
      type: 'string',
      group: 'basico',
    }),
    defineField({
      name: 'anoEntrega',
      title: 'Ano de entrega',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'numTorres',
      title: 'Número de torres',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'numUnidades',
      title: 'Total de unidades',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'areaTotal',
      title: 'Área total do condomínio (m²)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'totalLotes',
      title: 'Total de lotes / terrenos',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'tipologiasDisponiveis',
      title: 'Tipologias disponíveis',
      type: 'array',
      group: 'basico',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: '1 quarto', value: '1-quarto' },
              { title: '2 quartos', value: '2-quartos' },
              { title: '3 quartos', value: '3-quartos' },
              { title: '4 quartos', value: '4-quartos' },
              { title: 'Cobertura', value: 'cobertura' },
              { title: 'Penthouse', value: 'penthouse' },
              { title: 'Casa', value: 'casa' },
              { title: 'Terreno', value: 'terreno' },
            ],
          },
        }),
      ],
      description: 'Tipologias existentes — usadas para gerar páginas de tipologia (Nível 3 da hierarquia).',
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      group: 'basico',
      initialValue: 100,
    }),

    // ─── Conteúdo SEO ──────────────────────────────────────────────
    defineField({
      name: 'sobre',
      title: 'Sobre o condomínio (rich text — 200-300 palavras)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Texto ÚNICO e original. Sem este campo, a página recebe noindex automático (anti-thin-content).',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição resumida (legado)',
      type: 'text',
      group: 'conteudo',
      rows: 5,
      description: 'Campo legado. Para novos condomínios, use "Sobre o condomínio".',
    }),
    defineField({
      name: 'infraestrutura',
      title: 'Infraestrutura / Lazer',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Ex: piscina olímpica, marina, campo de golf, academia, segurança 24h',
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
      description: '3-5 FAQs específicas. Ex: "Quanto custa um apartamento na Península?"',
    }),
    defineField({
      name: 'condominiosProximos',
      title: 'Condomínios próximos (linkagem interna)',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'condominio' }] })],
    }),

    // ─── Mídia ─────────────────────────────────────────────────────
    defineField({
      name: 'fotoCapa',
      title: 'Foto de capa',
      type: 'object',
      group: 'midia',
      fields: [
        defineField({
          name: 'asset',
          title: 'Imagem',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ],
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria de fotos',
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
            prepare({ media, title }) {
              return { title: title ?? 'Foto', media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem Open Graph (1200×630)',
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
    }),

    // ─── Localização ───────────────────────────────────────────────
    defineField({
      name: 'geo',
      title: 'Geolocalização',
      type: 'object',
      group: 'localizacao',
      fields: [
        defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
        defineField({
          name: 'proximidades',
          title: 'Proximidades (texto)',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          options: { layout: 'tags' },
          description: 'Ex: 500m da praia, próximo ao BRT, a 5 min do shopping',
        }),
      ],
    }),

    // ─── SEO / Meta ────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Meta title (max 60 chars)',
          type: 'string',
          description: 'Ex: Península Barra da Tijuca — Imóveis à venda | Admirata',
          validation: (r) => r.max(60),
        }),
        defineField({
          name: 'descricao',
          title: 'Meta description (max 160 chars)',
          type: 'text',
          rows: 2,
          validation: (r) => r.max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'nome',
      subtitle: 'bairro.nome',
      media: 'fotoCapa.asset',
    },
  },
})
