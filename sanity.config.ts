import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'admirata',
  title: 'Admirata Imóveis',

  projectId,
  dataset,

  // ─── Plugins ────────────────────────────────────────────────────
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Admirata')
          .items([
            S.listItem()
              .title('Imóveis')
              .child(
                S.documentTypeList('imovel')
                  .title('Imóveis')
                  .defaultOrdering([{ field: 'publicadoEm', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Bairros / Localidades')
              .child(
                S.documentTypeList('bairro')
                  .title('Bairros')
                  .defaultOrdering([{ field: 'ordem', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Blog / Lifestyle')
              .child(
                S.documentTypeList('blogPost')
                  .title('Posts')
                  .defaultOrdering([{ field: 'publicadoEm', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-06-01' }),
  ],

  schema: {
    types: schemaTypes,
  },

  // ─── Studio embutido em /studio ──────────────────────────────────
  basePath: '/studio',
})
