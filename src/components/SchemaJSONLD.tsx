import type { ImovelPDI } from '@/types/sanity'

interface SchemaJSONLDProps {
  imovel: ImovelPDI
  url: string
}

export default function SchemaJSONLD({ imovel, url }: SchemaJSONLDProps) {
  const imagemUrl =
    imovel.imagens?.find((i) => i.arquivo.principal)?.arquivo.asset?.url ??
    imovel.imagens?.[0]?.arquivo.asset?.url

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: imovel.titulo,
    url,
    description: imovel.descricaoPtBr ?? '',
    ...(imagemUrl && { image: imagemUrl }),
    ...(imovel.preco && {
      offers: {
        '@type': 'Offer',
        price: imovel.preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(imovel.bairro && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: imovel.bairro.cidade,
        addressRegion: imovel.bairro.estado,
        addressCountry: 'BR',
      },
    }),
    ...(imovel.areaUtil && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: imovel.areaUtil,
        unitCode: 'MTK',
      },
    }),
    ...(imovel.quartos && { numberOfRooms: imovel.quartos }),
    ...(imovel.publicadoEm && { datePosted: imovel.publicadoEm }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
