/**
 * JSON-LD builders — Admirata
 *
 * Gera objetos schema.org tipados para injetar via <script type="application/ld+json">.
 * Cada builder retorna o objeto pronto para JSON.stringify.
 *
 * Uso:
 *   import { buildImovelJsonLd, buildBreadcrumbJsonLd } from '@/features/seo/services/jsonld'
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildImovelJsonLd(imovel, url)) }} />
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://admirata.com.br'

// ─── Types internos ───────────────────────────────────────────────────────────

interface ImovelJsonLdParams {
  titulo: string
  descricao?: string
  url: string
  imagens?: string[]
  preco?: number
  precoSobConsulta?: boolean
  area?: number
  quartos?: number
  suites?: number
  banheiros?: number
  vagas?: number
  bairroNome?: string
  cidadeNome?: string
  estadoNome?: string
  condominioNome?: string
  publicadoEm?: string
  tipo?: string
  finalidade?: string
}

interface BreadcrumbItem {
  name: string
  url?: string
}

interface CondominioJsonLdParams {
  nome: string
  descricao?: string
  url: string
  imagem?: string
  bairroNome?: string
  cidadeNome?: string
  estadoNome?: string
  anoEntrega?: number
}

interface BairroJsonLdParams {
  nome: string
  descricao?: string
  url: string
  imagem?: string
  cidadeNome?: string
  estadoNome?: string
  totalImoveis?: number
}

// ─── Imóvel — RealEstateListing + Apartment/House ────────────────────────────

/**
 * Schema para PDI de imóvel.
 * Combina RealEstateListing (anúncio) com Apartment (propriedade).
 */
export function buildImovelJsonLd(params: ImovelJsonLdParams) {
  const {
    titulo, descricao, url, imagens, preco, precoSobConsulta,
    area, quartos, suites, banheiros, vagas,
    bairroNome, cidadeNome, estadoNome, condominioNome,
    publicadoEm, tipo, finalidade,
  } = params

  const tipoSchema = tipo?.toLowerCase().includes('casa') ? 'House' : 'Apartment'
  const acaoPreco = finalidade === 'Locação' || finalidade === 'Temporada'
    ? 'RentAction'
    : 'BuyAction'

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: titulo,
    ...(descricao && { description: descricao }),
    url,
    ...(publicadoEm && { datePosted: publicadoEm }),
    ...(imagens?.length && {
      image: imagens.map((src) => ({
        '@type': 'ImageObject',
        url: src,
        width: 1200,
        height: 800,
      })),
    }),
    ...(!precoSobConsulta && preco && {
      offers: {
        '@type': 'Offer',
        price: preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'RealEstateAgent',
          '@id': `${SITE_URL}/#organization`,
          name: 'Admirata Imóveis',
        },
      },
    }),
    about: {
      '@type': tipoSchema,
      '@id': `${url}#property`,
      name: titulo,
      ...(descricao && { description: descricao }),
      ...(area && {
        floorSize: {
          '@type': 'QuantitativeValue',
          value: area,
          unitCode: 'MTK',
          unitText: 'm²',
        },
      }),
      ...(quartos && { numberOfRooms: quartos }),
      ...(suites && { numberOfBedrooms: suites }),
      ...(banheiros && { numberOfBathroomsTotal: banheiros }),
      ...(vagas && {
        amenityFeature: {
          '@type': 'LocationFeatureSpecification',
          name: 'Vagas de garagem',
          value: vagas,
        },
      }),
      ...(condominioNome && { containedInPlace: { '@type': 'Residence', name: condominioNome } }),
      ...(bairroNome && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: cidadeNome ?? 'Rio de Janeiro',
          addressRegion: estadoNome ?? 'RJ',
          addressCountry: 'BR',
          ...(bairroNome && { neighborhood: bairroNome }),
        },
        ...(acaoPreco === 'BuyAction' ? {
          potentialAction: {
            '@type': 'BuyAction',
            seller: { '@type': 'RealEstateAgent', '@id': `${SITE_URL}/#organization` },
          },
        } : {
          potentialAction: {
            '@type': 'RentAction',
            landlord: { '@type': 'RealEstateAgent', '@id': `${SITE_URL}/#organization` },
          },
        }),
      }),
    },
  }
}

// ─── Condomínio — ApartmentComplex ───────────────────────────────────────────

export function buildCondominioJsonLd(params: CondominioJsonLdParams) {
  const { nome, descricao, url, imagem, bairroNome, cidadeNome, estadoNome, anoEntrega } = params

  return {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    '@id': `${url}#complex`,
    name: nome,
    ...(descricao && { description: descricao }),
    url,
    ...(imagem && {
      image: { '@type': 'ImageObject', url: imagem },
    }),
    ...(anoEntrega && { yearBuilt: anoEntrega }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: cidadeNome ?? 'Rio de Janeiro',
      addressRegion: estadoNome ?? 'RJ',
      addressCountry: 'BR',
      ...(bairroNome && { neighborhood: bairroNome }),
    },
    containedInPlace: {
      '@type': 'City',
      name: cidadeNome ?? 'Rio de Janeiro',
    },
    broker: {
      '@type': 'RealEstateAgent',
      '@id': `${SITE_URL}/#organization`,
      name: 'Admirata Imóveis',
    },
  }
}

// ─── Bairro — Place / ItemList ────────────────────────────────────────────────

export function buildBairroJsonLd(params: BairroJsonLdParams) {
  const { nome, descricao, url, imagem, cidadeNome, estadoNome, totalImoveis } = params

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#listing`,
    name: `Imóveis em ${nome}`,
    ...(descricao && { description: descricao }),
    url,
    ...(totalImoveis && { numberOfItems: totalImoveis }),
    ...(imagem && {
      image: { '@type': 'ImageObject', url: imagem },
    }),
    itemListElement: [],
    about: {
      '@type': 'Place',
      name: nome,
      containedInPlace: {
        '@type': 'City',
        name: cidadeNome ?? 'Rio de Janeiro',
        containedInPlace: {
          '@type': 'State',
          name: estadoNome ?? 'Rio de Janeiro',
          containedInPlace: { '@type': 'Country', name: 'Brasil' },
        },
      },
    },
  }
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

/**
 * Gera BreadcrumbList para qualquer rota.
 *
 * Exemplo:
 *   buildBreadcrumbJsonLd([
 *     { name: 'Início', url: 'https://admirata.com.br' },
 *     { name: 'Barra da Tijuca', url: 'https://admirata.com.br/imoveis/barra-da-tijuca' },
 *     { name: 'Wide Residences' }, // último item sem URL
 *   ])
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string
  answer: string
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─── Helper — renderizar múltiplos schemas em um único script ─────────────────

/**
 * Combina múltiplos schemas em @graph para reduzir scripts no <head>.
 */
export function buildGraphJsonLd(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
