/**
 * Queries GROQ do domínio Imóvel.
 * Fragmentos locais — não exportar para fora da feature.
 */

import { groq } from 'next-sanity'

const imagemFragment = groq`
  arquivo {
    asset->{ _id, url, metadata { lqip, dimensions } },
    hotspot, crop,
    alt, principal, tour360, urlMatterport, isStaging, stagingPar
  }
`

const bairroFragment = groq`
  bairro->{ _id, nome, slug, cidade, estado, mercado }
`

const cardFragment = groq`{
  _id, titulo, slug, tipo, preco, areaUtil, quartos, vagas,
  ${bairroFragment},
  "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
    asset->{ _id, url, metadata { lqip, dimensions } },
    hotspot, crop, alt
  }
}`

export const IMOVEIS_CARD_QUERY = groq`
  *[_type == "imovel" && status == "Disponível"] | order(publicadoEm desc) {
    _id, titulo, slug, tipo, finalidade, mercado, status, destaque,
    exclusivo, permuta, novidade, precoSobConsulta,
    preco, areaUtil, quartos, suites, vagas, andar,
    ${bairroFragment},
    "condominionome": condominioRef->nome,
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEIS_FILTRADOS_QUERY = groq`
  *[
    _type == "imovel"
    && status == "Disponível"
    && ($tipo == "" || tipo == $tipo)
    && ($mercado == "" || mercado == $mercado)
    && ($finalidade == "" || finalidade == $finalidade)
    && ($bairroSlug == "" || bairro->slug.current == $bairroSlug)
    && ($precoMin == 0 || preco >= $precoMin)
    && ($precoMax == 0 || preco <= $precoMax)
    && ($quartos == 0 || quartos >= $quartos)
    && ($novidade != "true" || novidade == true)
    && ($exclusivo != "true" || exclusivo == true)
  ] | order(publicadoEm desc) [$offset...$end] {
    _id, titulo, slug, tipo, finalidade, mercado, status,
    exclusivo, permuta, novidade, precoSobConsulta,
    preco, areaUtil, quartos, suites, vagas, andar,
    ${bairroFragment},
    "condominionome": condominioRef->nome,
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEL_PDI_QUERY = groq`
  *[_type == "imovel" && slug.current == $slug][0] {
    _id, titulo, slug, tipo, finalidade, mercado, status, destaque,
    novidade, condicao, exclusivo,
    preco, condominio, iptu, areaUtil, areaTotal,
    quartos, suites, banheiros, vagas, andar,
    ${bairroFragment},
    "condominioRef": condominioRef->{ "slug": slug.current, "bairroSlug": bairro->slug.current },
    "condominioNome": condominioRef->nome,
    "condominioAnoEntrega": condominioRef->anoEntrega,
    endereco,
    imagens[] { ${imagemFragment} },
    plantas[] {
      arquivo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
      titulo,
      ambientes[] { nome, tipo, area, x, y }
    },
    caracteristicas[] { grupo, nome },
    tourVirtual, videoUrl,
    descricaoPtBr, descricaoEnUs, descricaoFrFr,
    seo, publicadoEm
  }
`

export const IMOVEIS_DESTAQUE_QUERY = groq`
  *[_type == "imovel" && destaque == true && status == "Disponível"] | order(publicadoEm desc)[0...6] {
    _id, titulo, slug, tipo, finalidade, mercado, preco, areaUtil, quartos, vagas,
    ${bairroFragment},
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEIS_POR_CONDOMINIO_QUERY = groq`
  *[_type == "imovel" && condominioRef->slug.current == $condSlug && status == "Disponível"] | order(publicadoEm desc)[0...24] {
    _id, titulo, slug, tipo, finalidade, preco, areaUtil, quartos, vagas, tipologia,
    ${bairroFragment},
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEIS_POR_TIPOLOGIA_QUERY = groq`
  *[_type == "imovel" && condominioRef->slug.current == $condSlug && tipologia == $tipologia && status == "Disponível"] | order(publicadoEm desc)[0...24] {
    _id, titulo, slug, tipo, preco, areaUtil, quartos, vagas, tipologia,
    ${bairroFragment},
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEIS_POR_BAIRRO_QUERY = groq`
  *[_type == "imovel" && bairro->slug.current == $bairroSlug && status == "Disponível" && !(_id in path("drafts.**"))] | order(publicadoEm desc)[0...$limit] {
    _id, titulo, slug, tipo, preco, areaUtil, quartos, vagas,
    ${bairroFragment},
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

export const IMOVEIS_COBERTURA_QUERY = groq`
  *[_type == "imovel" && tipo in ["Cobertura", "Cobertura duplex", "Penthouse"] && status == "Disponível"] | order(publicadoEm desc)[0...24]
  ${cardFragment}
`

export const IMOVEIS_COBERTURA_TOTAL_QUERY = groq`
  count(*[_type == "imovel" && tipo in ["Cobertura", "Cobertura duplex", "Penthouse"] && status == "Disponível"])
`

export const IMOVEIS_VISTA_MAR_QUERY = groq`
  *[_type == "imovel" && caracteristicas[].nome in ["Vista mar", "Vista para o mar", "Vista mar parcial"] && status == "Disponível"] | order(publicadoEm desc)[0...24]
  ${cardFragment}
`

export const IMOVEIS_SLUGS_QUERY = groq`
  *[_type == "imovel" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }
`
