/**
 * Queries GROQ do domínio Bairro.
 */

import { groq } from 'next-sanity'

export const BAIRROS_QUERY = groq`
  *[_type == "bairro"] | order(ordem asc) {
    _id, nome, slug, cidade, estado, mercado, regiao, ordem,
    fotoCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    fotoAerea { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"])
  }
`

export const BAIRRO_QUERY = groq`
  *[_type == "bairro" && slug.current == $slug][0] {
    _id, nome, slug, cidade, estado, mercado, regiao, zona,
    fotoCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    fotoAerea { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    descricao, geo, pontosDeInteresse[] { nome, categoria, lat, lng },
    introTexto, porQueMorar, caracteristicas,
    faixaPreco { min, max, tipoPredominante },
    faqs[] { pergunta, resposta },
    bairrosProximos[]->{ _id, nome, slug },
    destaque, metaTitle, metaDescription,
    heroVideoUrl,
    ogImage { asset->{ _id, url } },
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"])
  }
`

export const BAIRRO_MINIMAL_QUERY = groq`
  *[_type == "bairro" && slug.current == $slug][0] {
    _id, nome, slug, cidade, estado, mercado,
    "fotoCapa": fotoCapa { asset->{ url, metadata { lqip } }, hotspot, crop },
    metaTitle, metaDescription,
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"])
  }
`

export const BAIRROS_PLANEJADOS_QUERY = groq`
  *[_type == "bairro" && bairroplanejado == true] | order(ordem asc) {
    _id, nome, slug, cidade, estado, mercado, regiao,
    incorporadora, areaTotal, anoInauguracao, introTexto,
    "fotoCapa": fotoCapa { asset->{ url, metadata { lqip } }, hotspot, crop },
    "fotoAerea": fotoAerea { asset->{ url, metadata { lqip } }, hotspot, crop },
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"]),
    "totalCondominios": count(*[_type == "condominio" && bairro._ref == ^._id]),
    metaTitle, metaDescription
  }
`

export const BAIRRO_PLANEJADO_QUERY = groq`
  *[_type == "bairro" && slug.current == $slug && bairroplanejado == true][0] {
    _id, nome, slug, cidade, estado, mercado, regiao,
    incorporadora, areaTotal, anoInauguracao,
    introTexto, porQueMorar, descricao, caracteristicas,
    faixaPreco, amenidades, faqs,
    bairrosProximos[]->{ _id, nome, slug, cidade },
    "fotoCapa": fotoCapa { asset->{ url, metadata { lqip } }, hotspot, crop },
    "fotoAerea": fotoAerea { asset->{ url, metadata { lqip } }, hotspot, crop },
    "ogImage": ogImage { asset->{ url } },
    heroVideoUrl, metaTitle, metaDescription,
    "condominios": *[_type == "condominio" && bairro._ref == ^._id] | order(ordem asc) {
      _id, nome, slug, status, construtora,
      precoMinimo, precoMaximo, areaPrivativaMin, areaPrivativaMax,
      prazoEntrega, tipologiasDisponiveis, videoTour, heroVideoUrl,
      comissao, vgv, whatsappCorretor, mensagemCorretorWhatsapp,
      visibilidadeCorretor,
      "imagemCapa": fotoCapa.asset->{ url, metadata { lqip } },
      "plantasBaixas": plantasBaixas[] {
        nome, quartos, area,
        "imagem": imagem { asset->{ url, metadata { lqip } } }
      },
      "tabelaPreco": tabelaPreco { asset->{ url } },
      "materialMarketing": materialMarketing[] {
        titulo, tipo, url,
        "arquivo": arquivo { asset->{ url } }
      }
    },
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"]),
    geo, pontosDeInteresse,
    metaTitle, metaDescription
  }
`

export const BAIRROS_SLUGS_QUERY = groq`
  *[_type == "bairro" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

export const BAIRROS_PLANEJADOS_SLUGS_QUERY = groq`
  *[_type == "bairro" && bairroplanejado == true && defined(slug.current)] { "slug": slug.current }
`
