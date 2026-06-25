import { groq } from 'next-sanity'

// ─── Fragmentos reutilizáveis ─────────────────────────────────────

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

// ─── Imóveis ──────────────────────────────────────────────────────

/** Card resumido — usado em listagem, destaque e bairros */
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

/** Card com filtros (FacetedSearch) */
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

/** PDI completa — todos os campos */
export const IMOVEL_PDI_QUERY = groq`
  *[_type == "imovel" && slug.current == $slug][0] {
    _id, titulo, slug, tipo, finalidade, mercado, status, destaque,
    novidade, exclusivo,
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

/** Imóveis em destaque (Home) */
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

/** Imóveis por condomínio (NÍVEL 2 — lista de imóveis do condomínio) */
export const IMOVEIS_POR_CONDOMINIO_QUERY = groq`
  *[_type == "imovel" && condominioRef->slug.current == $condSlug && status == "Disponível"] | order(publicadoEm desc)[0...24] {
    _id, titulo, slug, tipo, preco, areaUtil, quartos, vagas, tipologia,
    ${bairroFragment},
    "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
      asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot, crop, alt
    }
  }
`

/** Imóveis por tipologia (NÍVEL 3 — filtra por condomínio + tipologia) */
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

/** Imóveis por bairro (Landing de bairro) */
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

// ─── Bairros ──────────────────────────────────────────────────────

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

// ─── Condomínios ──────────────────────────────────────────────────

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

export const CONDOMINIOS_SLUGS_QUERY = groq`
  *[_type == "condominio" && defined(slug.current)] { "slug": slug.current }
`

export const FOTOS_CONDOMINIO_QUERY = groq`
  *[_type == "imovel" && condominioRef->slug.current == $slug && defined(imagens) && count(imagens) > 0][0] {
    "fotos": imagens[]{
      "url": arquivo.asset->url,
      "lqip": arquivo.asset->metadata.lqip,
      "alt": alt
    }
  }
`

/** Condomínios de um bairro — para NÍVEL 1 (cards linkando para NÍVEL 2) */
export const CONDOMINIOS_POR_BAIRRO_QUERY = groq`
  *[_type == "condominio" && bairro->slug.current == $bairroSlug] | order(nome asc) {
    _id, nome, slug,
    "fotoCapa": fotoCapa.asset->{ _id, url, metadata { lqip, dimensions } },
    "totalImoveis": count(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"])
  }
`

/** Condomínio único — por slug de bairro + slug de condomínio (NÍVEL 2) */
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

/** Nome + bairro + tipologias — para NÍVEL 3 breadcrumb */
export const CONDOMINIO_NOME_BAIRRO_QUERY = groq`
  *[_type == "condominio" && bairro->slug.current == $bairroSlug && slug.current == $condSlug][0] {
    nome,
    "bairroNome": bairro->nome,
    "tipologiasDisponiveis": array::unique(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível"].tipologia)
  }
`

/** Slugs {bairroSlug, condSlug} para generateStaticParams do NÍVEL 2 */
export const CONDOMINIOS_SLUGS_HIERARQUIA_QUERY = groq`
  *[_type == "condominio" && defined(slug.current) && defined(bairro->slug.current)] {
    "bairroSlug": bairro->slug.current,
    "condSlug": slug.current
  }
`

/** Slugs {bairroSlug, condSlug, tipologias[]} para generateStaticParams do NÍVEL 3 */
export const TIPOLOGIAS_SLUGS_QUERY = groq`
  *[_type == "condominio" && defined(slug.current) && defined(bairro->slug.current)] {
    "bairroSlug": bairro->slug.current,
    "condSlug": slug.current,
    "tipologias": array::unique(*[_type == "imovel" && condominioRef._ref == ^._id && status == "Disponível" && defined(tipologia)].tipologia)
  }
`

// ─── Páginas de característica ────────────────────────────────────

const cardFragment = groq`{
  _id, titulo, slug, tipo, preco, areaUtil, quartos, vagas,
  bairro->{ _id, nome, slug, cidade, estado, mercado },
  "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
    asset->{ _id, url, metadata { lqip, dimensions } },
    hotspot, crop, alt
  }
}`

/** Coberturas e Penthouses */
export const IMOVEIS_COBERTURA_QUERY = groq`
  *[_type == "imovel" && tipo in ["Cobertura", "Cobertura duplex", "Penthouse"] && status == "Disponível"] | order(publicadoEm desc)[0...24]
  ${cardFragment}
`
export const IMOVEIS_COBERTURA_TOTAL_QUERY = groq`
  count(*[_type == "imovel" && tipo in ["Cobertura", "Cobertura duplex", "Penthouse"] && status == "Disponível"])
`

/** Imóveis frente ao mar */
export const IMOVEIS_FRENTE_MAR_QUERY = groq`
  *[_type == "imovel" && caracteristicas[].nome in ["Frente mar", "Frente ao mar", "Frente de praia"] && status == "Disponível"] | order(publicadoEm desc)[0...24]
  ${cardFragment}
`
export const IMOVEIS_FRENTE_MAR_TOTAL_QUERY = groq`
  count(*[_type == "imovel" && caracteristicas[].nome in ["Frente mar", "Frente ao mar", "Frente de praia"] && status == "Disponível"])
`

/** Imóveis com vista mar */
export const IMOVEIS_VISTA_MAR_QUERY = groq`
  *[_type == "imovel" && caracteristicas[].nome in ["Vista mar", "Vista para o mar", "Vista mar parcial"] && status == "Disponível"] | order(publicadoEm desc)[0...24]
  ${cardFragment}
`
export const IMOVEIS_VISTA_MAR_TOTAL_QUERY = groq`
  count(*[_type == "imovel" && caracteristicas[].nome in ["Vista mar", "Vista para o mar", "Vista mar parcial"] && status == "Disponível"])
`

// ─── Lançamentos ──────────────────────────────────────────────────

const lancamentoCardFragment = groq`{
  _id, titulo, slug, statusObra, construtora, precoAPartirDe,
  "bairro": bairroRef->{ _id, nome, slug, cidade, estado },
  "imagemCapa": imagemCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop }
}`

/** Listagem geral de lançamentos */
export const LANCAMENTOS_LISTING_QUERY = groq`
  *[_type == "lancamento" && statusObra != "entregue"] | order(_createdAt desc)[0...24]
  ${lancamentoCardFragment}
`

/** Na-planta + em-obras + breve */
export const LANCAMENTOS_NA_PLANTA_QUERY = groq`
  *[_type == "lancamento" && statusObra in ["na-planta", "em-obras", "breve"]] | order(_createdAt desc)[0...24]
  ${lancamentoCardFragment}
`

/** Detalhe de um lançamento */
export const LANCAMENTO_DETALHE_QUERY = groq`
  *[_type == "lancamento" && slug.current == $slug][0] {
    _id, titulo, slug, statusObra, construtora, precoAPartirDe, precoAte,
    descricao, diferenciais, dataEntregaPrevista,
    "bairro": bairroRef->{ _id, nome, slug, cidade, estado },
    imagemCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    galeria[] { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
    plantas[] { asset->{ _id, url, metadata { lqip, dimensions } }, alt, titulo },
    faqs[] { pergunta, resposta },
    metaTitle, metaDescription
  }
`

/** Slugs para generateStaticParams */
export const LANCAMENTOS_SLUGS_QUERY = groq`
  *[_type == "lancamento" && defined(slug.current)] { "slug": slug.current }
`

// ─── Slugs para sitemap & generateStaticParams ─────────────────

/** Slugs de imóveis — generateStaticParams + sitemap */
export const IMOVEIS_SLUGS_QUERY = groq`
  *[_type == "imovel" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }
`

/** Slugs de bairros — generateStaticParams + sitemap */
export const BAIRROS_SLUGS_QUERY = groq`
  *[_type == "bairro" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

/** Listagem do blog */
export const BLOG_LISTING_QUERY = groq`
  *[_type == "post"] | order(publicadoEm desc)[0...24] {
    _id, titulo, slug, categoria, resumo, publicadoEm,
    "imagemCapa": imagemCapa {
      asset->{ _id, url, metadata { lqip } },
      alt
    }
  }
`

/** Detalhe de um post do blog */
export const BLOG_POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, titulo, slug, categoria, resumo, publicadoEm, autor,
    conteudo,
    "imagemCapa": imagemCapa {
      asset->{ _id, url, metadata { lqip } },
      alt
    },
    "bairroRelacionado": bairroRelacionado->{ _id, nome, slug, cidade, estado },
    seo { metaTitle, metaDescription, ogImage { asset->{ url } } }
  }
`

/** Slugs de posts do blog — generateStaticParams + sitemap */
export const BLOG_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`

/** Bairro minimal — cabeçalho e meta das páginas /imoveis/[finalidade]/[bairro] */
export const BAIRRO_MINIMAL_QUERY = groq`
  *[_type == "bairro" && slug.current == $slug][0] {
    _id, nome, slug, cidade, estado, mercado,
    "fotoCapa": fotoCapa { asset->{ url, metadata { lqip } }, hotspot, crop },
    metaTitle, metaDescription,
    "totalImoveis": count(*[_type == "imovel" && bairro._ref == ^._id && status == "Disponível"])
  }
`

/** Bairros planejados — listagem /bairros-planejados */
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

/** Detalhe de um bairro planejado — /bairros-planejados/[slug] */
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

/** Slugs de bairros planejados — generateStaticParams */
export const BAIRROS_PLANEJADOS_SLUGS_QUERY = groq`
  *[_type == "bairro" && bairroplanejado == true && defined(slug.current)] { "slug": slug.current }
`

/** Slugs dos condomínios do empreendimento Ilha Pura */
export const ILHAPURA_CONDOMINIOS_SLUGS_QUERY = groq`
  *[_type == "condominio" && bairro->slug.current == "ilha-pura" && defined(slug.current)] {
    "slug": slug.current
  }
`

/** Unidades (imóveis) do Ilha Pura */
export const ILHAPURA_IMOVEIS_QUERY = groq`
  *[_type == "imovel" && condominioRef->bairro->slug.current == "ilha-pura" && defined(slug.current) && defined(condominioRef->slug.current)] {
    "slug": slug.current,
    "condSlug": condominioRef->slug.current,
    finalidade
  }
`
