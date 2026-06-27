/**
 * generateBairroSchema
 * JSON-LD completo para páginas de bairro.
 * Gera um @graph com: BreadcrumbList, RealEstateAgent, ItemList e FAQPage.
 *
 * Tipos alinhados com os da aplicação (BairroFull + ImovelCard).
 */

import type { BairroFull, ImovelCard } from '@/types/sanity'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'
const PHONE     = '+55-21-99807-9459'
const WHATSAPP  = 'https://wa.me/5521998079459'
const INSTAGRAM = 'https://www.instagram.com/admirataimoveis'

/** Mapeia ImovelTipo → @type Schema.org mais próximo */
function schemaType(tipo: ImovelCard['tipo']): string {
  const map: Record<string, string> = {
    Apartamento:           'Apartment',
    Cobertura:             'Apartment',
    'Cobertura duplex':    'Apartment',
    Penthouse:             'Apartment',
    Casa:                  'SingleFamilyResidence',
    'Casa em condomínio':  'SingleFamilyResidence',
    Terreno:               'RealEstateListing',
  }
  return map[tipo] ?? 'RealEstateListing'
}

export function generateBairroSchema(
  bairro: BairroFull,
  imoveis: ImovelCard[],
  localePrefix = '',
): Record<string, unknown> {
  const bairroUrl = `${SITE_URL}${localePrefix}/bairros/${bairro.slug.current}/`

  const graph: Record<string, unknown>[] = [

    /* ── 1. BreadcrumbList ──────────────────────────────────────── */
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Bairros',
          item: `${SITE_URL}${localePrefix}/bairros/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: bairro.nome,
          item: bairroUrl,
        },
      ],
    },

    /* ── 2. RealEstateAgent ─────────────────────────────────────── */
    {
      '@type': 'RealEstateAgent',
      name: 'Admirata Negócios Imobiliários',
      url: SITE_URL,
      telephone: PHONE,
      areaServed: [
        { '@type': 'City', name: 'Rio de Janeiro', containedInPlace: { '@type': 'State', name: 'Rio de Janeiro' } },
        { '@type': 'City', name: 'Gramado',         containedInPlace: { '@type': 'State', name: 'Rio Grande do Sul' } },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rio de Janeiro',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
      sameAs: [INSTAGRAM, WHATSAPP],
    },

    /* ── 3. ItemList de imóveis ─────────────────────────────────── */
    {
      '@type': 'ItemList',
      name: `Imóveis em ${bairro.nome}`,
      ...(bairro.descricao && { description: bairro.descricao }),
      numberOfItems: imoveis.length,
      itemListElement: imoveis.map((imovel, i) => {
        const imagemUrl = imovel.imagemCapa?.asset?.url
        const imovelUrl = `${SITE_URL}/imoveis/${imovel.slug.current}/`

        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': schemaType(imovel.tipo),
            name: imovel.titulo,
            url: imovelUrl,
            ...(imagemUrl && { image: `${imagemUrl}?w=800&q=80` }),
            ...(imovel.areaUtil && {
              floorSize: {
                '@type': 'QuantitativeValue',
                value: imovel.areaUtil,
                unitCode: 'MTK',
              },
            }),
            ...(imovel.quartos != null && { numberOfRooms: imovel.quartos }),
            address: {
              '@type': 'PostalAddress',
              addressLocality: bairro.nome,
              addressRegion: bairro.estado,
              addressCountry: 'BR',
            },
            ...(!imovel.precoSobConsulta && imovel.preco && {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'BRL',
                price: imovel.preco,
                availability: 'https://schema.org/InStock',
              },
            }),
          },
        }
      }),
    },
  ]

  /* ── 4. FAQPage — incluso apenas se houver FAQs cadastradas ──── */
  if (bairro.faqs && bairro.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: bairro.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.pergunta,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.resposta,
        },
      })),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
