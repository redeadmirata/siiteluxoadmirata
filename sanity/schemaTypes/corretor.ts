import { defineType, defineField } from 'sanity'

export const corretor = defineType({
  name: 'corretor',
  title: 'Corretor',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome completo',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nome', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto profissional',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'creci',
      title: 'CRECI',
      type: 'string',
      description: 'Ex: CRECI/RJ 12345-F',
    }),
    defineField({
      name: 'especialidade',
      title: 'Especialidade',
      type: 'string',
      options: {
        list: [
          { title: 'Rio de Janeiro — Zona Oeste', value: 'rj-oeste' },
          { title: 'Rio de Janeiro — Zona Sul', value: 'rj-sul' },
          { title: 'Serra Gaúcha — Gramado/Canela', value: 'rs-gramado' },
          { title: 'Lançamentos', value: 'lancamentos' },
          { title: 'Alto Padrão', value: 'alto-padrao' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (apenas números)',
      type: 'string',
      description: 'Ex: 5521998079459',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram (@ sem arroba)',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio curta',
      type: 'text',
      rows: 3,
      description: 'Aparece na ficha do imóvel. Máximo 200 caracteres.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'ativo',
      title: 'Corretor ativo',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'creci', media: 'foto' },
  },
})
