import { defineType, defineField, defineArrayMember } from 'sanity'

export const imovel = defineType({
  name: 'imovel',
  title: 'Imóvel',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Dados Básicos', default: true },
    { name: 'localizacao', title: 'Localização' },
    { name: 'midia', title: 'Mídia' },
    { name: 'caracteristicas', title: 'Características' },
    { name: 'storytelling', title: 'Textos / SEO' },
  ],
  fields: [
    // ─── Dados Básicos ─────────────────────────────────────────────
    defineField({
      name: 'titulo',
      title: 'Título do imóvel',
      type: 'string',
      group: 'basico',
      validation: (r) => r.required().min(10).max(100),
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
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      group: 'basico',
      options: {
        list: [
          'Apartamento',
          'Cobertura',
          'Cobertura Duplex',
          'Penthouse',
          'Casa',
          'Casa de Condomínio',
          'Terreno',
          'Loja',
          'Sala Comercial',
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'finalidade',
      title: 'Finalidade',
      type: 'string',
      group: 'basico',
      options: {
        list: ['Venda', 'Locação', 'Temporada'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mercado',
      title: 'Mercado',
      type: 'string',
      group: 'basico',
      options: {
        list: ['Rio de Janeiro', 'Gramado', 'Canela'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basico',
      options: {
        list: ['Disponível', 'Em negociação', 'Vendido', 'Locado', 'Fora do mercado'],
        layout: 'radio',
      },
      initialValue: 'Disponível',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destaque',
      title: 'Imóvel em destaque na Home?',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'exclusivo',
      title: 'Exclusividade Admirata',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'permuta',
      title: 'Aceita Permuta',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'novidade',
      title: 'Imóvel novo (badge "Novo")',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    defineField({
      name: 'condicao',
      title: 'Condição do imóvel',
      description:
        'Define o badge principal e os blocos especiais da PDI. ' +
        '"Obra por Administração" exibe o bloco Sem Banco / Sem Juros.',
      type: 'string',
      group: 'basico',
      options: {
        list: [
          { title: '✅ Pronto para Morar', value: 'pronto' },
          { title: '🚀 Lançamento', value: 'lancamento' },
          { title: '🏗️ Em Obras', value: 'em-obras' },
          { title: '🏦 Obra por Administração (Sem Banco · Sem Juros)', value: 'obra-administracao' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'precoSobConsulta',
      title: 'Preço sob consulta (oculta valor)',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
    }),
    // ─── Locação / Localização ────────────────────────────────────
    defineField({
      name: 'condominioRef',
      title: 'Condomínio / Empreendimento',
      description: 'Referência ao condomínio cadastrado — define a hierarquia de URL (bairro/condominio/tipologia)',
      type: 'reference',
      to: [{ type: 'condominio' }],
      group: 'localizacao',
    }),
    defineField({
      name: 'tipologia',
      title: 'Tipologia (slug da categoria)',
      type: 'string',
      group: 'localizacao',
      description: 'Define o Nível 3 da URL: /imoveis/[bairro]/[condominio]/[tipologia]/',
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
        layout: 'radio',
      },
    }),
    defineField({
      name: 'corretorRef',
      title: 'Corretor responsável',
      type: 'reference',
      group: 'localizacao',
      to: [{ type: 'corretor' }],
    }),
    defineField({
      name: 'publicadoEm',
      title: 'Publicado em',
      type: 'datetime',
      group: 'basico',
    }),

    // ─── Preços ────────────────────────────────────────────────────
    defineField({
      name: 'preco',
      title: 'Preço (R$)',
      type: 'number',
      group: 'basico',
      validation: (r) => r.positive(),
    }),
    defineField({
      name: 'condominio',
      title: 'Condomínio (R$/mês)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'iptu',
      title: 'IPTU (R$/mês)',
      type: 'number',
      group: 'basico',
    }),

    // ─── Metragens ─────────────────────────────────────────────────
    defineField({
      name: 'areaUtil',
      title: 'Área útil (m²)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'areaTotal',
      title: 'Área total (m²)',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'quartos',
      title: 'Quartos',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'suites',
      title: 'Suítes',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'banheiros',
      title: 'Banheiros',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'vagas',
      title: 'Vagas de garagem',
      type: 'number',
      group: 'basico',
    }),
    defineField({
      name: 'andar',
      title: 'Andar / Pavimento',
      type: 'string',
      group: 'basico',
      placeholder: 'Ex: 12º andar · Cobertura · Térreo',
    }),

    // ─── Localização ───────────────────────────────────────────────
    defineField({
      name: 'bairro',
      title: 'Bairro',
      type: 'reference',
      to: [{ type: 'bairro' }],
      group: 'localizacao',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endereco',
      title: 'Endereço (oculto no site)',
      type: 'object',
      group: 'localizacao',
      fields: [
        {
          name: 'logradouro',
          title: 'Logradouro (não exibido)',
          type: 'string',
        },
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),

    // ─── Imagens ───────────────────────────────────────────────────
    defineField({
      name: 'imagens',
      title: 'Galeria de imagens',
      type: 'array',
      group: 'midia',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'arquivo',
              title: 'Imagem',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
            },
            { name: 'alt', title: 'Alt text (SEO)', type: 'string' },
            {
              name: 'principal',
              title: 'Foto de capa?',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'tour360',
              title: 'É um tour 360°?',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'urlMatterport',
              title: 'URL Matterport (se tour 360°)',
              type: 'url',
            },
            {
              name: 'isStaging',
              title: 'É foto de home staging?',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'stagingPar',
              title: 'ID da foto original (para slider before/after)',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'arquivo',
              principal: 'principal',
            },
            prepare({ title, media, principal }) {
              return {
                title: title ?? 'Sem alt text',
                subtitle: principal ? '★ Capa' : '',
                media,
              }
            },
          },
        }),
      ],
    }),

    // ─── Tour Virtual e Vídeo ─────────────────────────────────────
    defineField({
      name: 'tourVirtual',
      title: 'Tour Virtual 360° (URL)',
      description: 'Cole o link do Kuula, Matterport, iGuide ou qualquer plataforma de tour virtual.',
      type: 'url',
      group: 'midia',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vídeo do imóvel (YouTube ou Vimeo)',
      description: 'Cole o link do YouTube (youtube.com/watch?v=... ou youtu.be/...) ou Vimeo.',
      type: 'url',
      group: 'midia',
    }),

    // ─── Plantas ───────────────────────────────────────────────────
    defineField({
      name: 'plantas',
      title: 'Plantas baixas',
      type: 'array',
      group: 'midia',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'arquivo',
              title: 'Arquivo da planta',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'titulo',
              title: 'Título',
              type: 'string',
              placeholder: 'Ex: Planta do apartamento tipo',
            },
            {
              name: 'ambientes',
              title: 'Labels de ambiente (hotspots)',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    { name: 'nome', title: 'Nome do ambiente', type: 'string' },
                    {
                      name: 'tipo',
                      title: 'Tipo',
                      type: 'string',
                      options: {
                        list: ['coberto', 'descoberto', 'pergolado', 'terraço', 'piscina'],
                      },
                    },
                    { name: 'area', title: 'Área (m²)', type: 'number' },
                    {
                      name: 'x',
                      title: 'Posição X (% da largura)',
                      type: 'number',
                      validation: (r) => r.min(0).max(100),
                    },
                    {
                      name: 'y',
                      title: 'Posição Y (% da altura)',
                      type: 'number',
                      validation: (r) => r.min(0).max(100),
                    },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // ─── Características ───────────────────────────────────────────
    defineField({
      name: 'caracteristicas',
      title: 'Características',
      type: 'array',
      group: 'caracteristicas',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'grupo',
              title: 'Grupo',
              type: 'string',
              options: {
                list: [
                  'Lazer',
                  'Segurança',
                  'Acabamento',
                  'Vista',
                  'Arquitetura',
                  'Infraestrutura',
                ],
              },
            },
            { name: 'nome', title: 'Característica', type: 'string' },
          ],
          preview: {
            select: { title: 'nome', subtitle: 'grupo' },
          },
        }),
      ],
    }),

    // ─── Storytelling e SEO ────────────────────────────────────────
    defineField({
      name: 'descricaoPtBr',
      title: 'Storytelling — pt-BR',
      type: 'text',
      rows: 6,
      group: 'storytelling',
    }),
    defineField({
      name: 'descricaoEnUs',
      title: 'Storytelling — en-US',
      type: 'text',
      rows: 6,
      group: 'storytelling',
    }),
    defineField({
      name: 'descricaoFrFr',
      title: 'Storytelling — fr-FR',
      type: 'text',
      rows: 6,
      group: 'storytelling',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'storytelling',
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
      ],
    }),
  ],

  preview: {
    select: {
      title: 'titulo',
      subtitle: 'bairro.nome',
      media: 'imagens.0.arquivo',
    },
  },
})
