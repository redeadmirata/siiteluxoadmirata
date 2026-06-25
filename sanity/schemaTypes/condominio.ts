import { defineType, defineField, defineArrayMember } from 'sanity'

export const condominio = defineType({
  name: 'condominio',
  title: 'Condomínio / Empreendimento',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Dados Básicos', default: true },
    { name: 'conteudo', title: 'Conteúdo SEO' },
    { name: 'midia', title: 'Mídia' },
    { name: 'corretor', title: '🏷 Área do Corretor' },
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
      name: 'status',
      title: 'Status do empreendimento',
      type: 'string',
      group: 'basico',
      options: {
        list: [
          { title: '🥂 Lançamento', value: 'Lançamento' },
          { title: '🔨 Em obras', value: 'Em obras' },
          { title: '🔑 Pronto para morar', value: 'Pronto' },
          { title: '🔥 Últimas unidades', value: 'Últimas unidades' },
          { title: '🚫 Esgotado', value: 'Esgotado' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'precoMinimo',
      title: 'Preço mínimo (R$)',
      type: 'number',
      group: 'basico',
      description: 'Menor preço de tabela atual. Ex: 841856',
    }),
    defineField({
      name: 'precoMaximo',
      title: 'Preço máximo (R$)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'areaPrivativaMin',
      title: 'Área privativa mínima (m²)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'areaPrivativaMax',
      title: 'Área privativa máxima (m²)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'prazoEntrega',
      title: 'Prazo de entrega',
      type: 'string',
      group: 'basico',
      description: 'Ex: Dezembro/2026, Pronto, Em obras — Previsão 2027',
    }),
    defineField({
      name: 'videoTour',
      title: 'Vídeo tour (YouTube URL)',
      type: 'url',
      group: 'basico',
      description: 'URL completa do YouTube. Ex: https://www.youtube.com/watch?v=xxx',
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Vídeo do hero (URL)',
      type: 'url',
      group: 'basico',
      description: 'YouTube, Vimeo ou MP4. Se vazio, usa o Vídeo tour no hero. Prioridade: heroVideoUrl > videoTour > fotoCapa.',
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
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
      fields: [
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

    // ─── Área do Corretor ──────────────────────────────────────────
    defineField({
      name: 'comissao',
      title: 'Comissão (%)',
      type: 'number',
      group: 'corretor',
      description: 'Percentual sobre o valor de venda. Ex: 6',
    }),
    defineField({
      name: 'vgv',
      title: 'VGV estimado (R$)',
      type: 'number',
      group: 'corretor',
      description: 'Valor geral de vendas do empreendimento.',
    }),
    defineField({
      name: 'plantasBaixas',
      title: 'Plantas baixas',
      type: 'array',
      group: 'corretor',
      description: 'Plantas para compartilhar com clientes. Uma por tipologia.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'nome',
              title: 'Nome da planta',
              type: 'string',
              description: 'Ex: Apartamento 3 suítes — 148m²',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'quartos',
              title: 'Quartos / Suítes',
              type: 'string',
              description: 'Ex: 3 suítes | 4 quartos',
            }),
            defineField({
              name: 'area',
              title: 'Área privativa (m²)',
              type: 'number',
            }),
            defineField({
              name: 'imagem',
              title: 'Imagem da planta',
              type: 'image',
              options: { hotspot: false },
            }),
          ],
          preview: {
            select: { title: 'nome', subtitle: 'area', media: 'imagem' },
            prepare({ title, subtitle, media }) {
              return { title, subtitle: subtitle ? `${subtitle} m²` : '', media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'tabelaPreco',
      title: 'Tabela de preços (PDF)',
      type: 'file',
      group: 'corretor',
      description: 'PDF da tabela atualizada. Visível apenas para corretores logados (futuramente).',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'materialMarketing',
      title: 'Materiais de marketing',
      type: 'array',
      group: 'corretor',
      description: 'Book, memorial, folder, apresentação. Links ou PDFs.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título do material',
              type: 'string',
              description: 'Ex: Book do Empreendimento, Tabela de Preços Junho/2026',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'tipo',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'PDF para download', value: 'pdf' },
                  { title: 'Link externo', value: 'link' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'arquivo',
              title: 'Arquivo (PDF)',
              type: 'file',
              options: { accept: '.pdf' },
            }),
            defineField({
              name: 'url',
              title: 'URL (se link externo)',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'titulo', subtitle: 'tipo' },
          },
        }),
      ],
    }),
    defineField({
      name: 'whatsappCorretor',
      title: 'WhatsApp dedicado para corretores',
      type: 'string',
      group: 'corretor',
      description: 'Número com DDI. Ex: 5521999999999 — pode ser diferente do WhatsApp de clientes.',
    }),
    defineField({
      name: 'mensagemCorretorWhatsapp',
      title: 'Mensagem pré-preenchida WhatsApp (corretor)',
      type: 'text',
      group: 'corretor',
      rows: 2,
      description: 'Ex: Olá, sou corretor e tenho interesse em parceria no Elos — Ilha Pura.',
    }),
    defineField({
      name: 'visibilidadeCorretor',
      title: 'Mostrar seção de corretor publicamente',
      type: 'boolean',
      group: 'corretor',
      initialValue: true,
      description: 'Se desmarcado, a seção fica oculta até implementação de login.',
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
