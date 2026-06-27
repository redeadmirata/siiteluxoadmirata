import { groq } from 'next-sanity'

const lancamentoCardFragment = groq`{
  _id, titulo, slug, statusObra, construtora, precoAPartirDe,
  "bairro": bairroRef->{ _id, nome, slug, cidade, estado },
  "imagemCapa": imagemCapa { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop }
}`

export const LANCAMENTOS_LISTING_QUERY = groq`
  *[_type == "lancamento" && statusObra != "entregue"] | order(_createdAt desc)[0...24]
  ${lancamentoCardFragment}
`

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

export const LANCAMENTOS_SLUGS_QUERY = groq`
  *[_type == "lancamento" && defined(slug.current)] { "slug": slug.current }
`
