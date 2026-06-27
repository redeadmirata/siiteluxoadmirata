import { groq } from 'next-sanity'

export const BLOG_LISTING_QUERY = groq`
  *[_type == "post"] | order(publicadoEm desc)[0...24] {
    _id, titulo, slug, categoria, resumo, publicadoEm,
    "imagemCapa": imagemCapa {
      asset->{ _id, url, metadata { lqip } },
      alt
    }
  }
`

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

export const BLOG_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`
