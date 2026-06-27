/**
 * Queries GROQ do domínio Condomínio.
 */

import { groq } from 'next-sanity'

export const CONDOMINIOS_QUERY = groq`
  *[_type == "condominio"] | order(ordem asc) {
    _id, nome, slug, tipo, destaque, descricao, infraestrutura, areaTotal, totalLotes,
    bairro->{ _id, nome, slug, cidade, estado, mercado },
    "fotoCapa": fotoCapa.asset->{ _id, url, metadata { lqip, dimensions } },
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

export const CONDOMINIOS_DESTAQUE_QUERY = groq`
  *[_type == "condominio" && destaque == true] | order(ordem asc)[0...6] {
    _id, nome, slug, tipo, descricao,
    bairro->{ _id, nome, slug, cidade, estado, mercado },
    "fotoCapa": fotoCapa.asset->{ _id, url, metadata { lqip, dimensions } },
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

export const CONDOMINIO_QUERY = groq`
  *[_type == "condominio" && slug.current == $slug][0] {
    _id, nome, slug, tipo, descricao, infraestrutura, areaTotal, totalLotes,
    construtora, anoEntrega, numTorres, numUnidades, forcarNoindex,
    sobre,
    bairro->{ _id, nome, slug, cidade, estado, mercado },
    "fotoCapa": fotoCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    galeria[]{ "asset": asset.asset->{ _id, url, metadata { lqip, dimensions } }, alt, legenda },
    faqs[] { pergunta, resposta },
    geo { lat, lng, proximidades },
    "tipologiasDisponiveis": array::unique(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"].tipologia),
    condominiosProximos[]->{ nome, slug },
    seo { titulo, descricao },
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

export const CONDOMINIO_POR_BAIRRO_QUERY = groq`
  *[_type == "condominio" && bairro->slug.current == $bairroSlug && slug.current == $condSlug][0] {
    _id, nome, slug, tipo, descricao, infraestrutura, areaTotal, totalLotes,
    sobre, construtora, anoEntrega, numTorres, numUnidades,
    forcarNoindex, condominiosProximos[]->{ nome, slug },
    faqs[] { pergunta, resposta },
    geo { lat, lng, proximidades },
    seo { titulo, descricao },
    videoTour, heroVideoUrl,
    bairro->{ _id, nome, slug, cidade, estado, mercado },
    "fotoCapa": fotoCapa.asset->{ _id, url, metadata { lqip, dimensions } },
    galeria[]{ "asset": asset.asset->{ _id, url, metadata { lqip, dimensions } }, alt, legenda },
    "tipologiasDisponiveis": array::unique(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"].tipologia),
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

export const CONDOMINIOS_POR_BAIRRO_QUERY = groq`
  *[_type == "condominio" && bairro->slug.current == $bairroSlug] | order(nome asc) {
    _id, nome, slug,
    "fotoCapa": fotoCapa.asset->{ _id, url, metadata { lqip, dimensions } },
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

export const CONDOMINIOS_SLUGS_QUERY = groq`
  *[_type == "condominio" && defined(slug.current)] { "slug": slug.current }
`

export const CONDOMINIOS_SLUGS_HIERARQUIA_QUERY = groq`
  *[_type == "condominio" && defined(slug.current) && defined(bairro->slug.current)] {
    "bairroSlug": bairro->slug.current,
    "condSlug": slug.current
  }
`

export const TIPOLOGIAS_SLUGS_QUERY = groq`
  *[_type == "condominio" && defined(slug.current) && defined(bairro->slug.current)] {
    "bairroSlug": bairro->slug.current,
    "condSlug": slug.current,
    "tipologias": array::unique(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível" && defined(tipologia)].tipologia)
  }
`
