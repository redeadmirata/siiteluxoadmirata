import { generateBairroSchema } from '@/lib/schema/bairro'
import type { BairroFull, ImovelCard } from '@/types/sanity'

interface SchemaJSONLDBairroProps {
  bairro: BairroFull
  imoveis: ImovelCard[]
  localePrefix?: string
}

export default function SchemaJSONLDBairro({
  bairro,
  imoveis,
  localePrefix = '',
}: SchemaJSONLDBairroProps) {
  const schema = generateBairroSchema(bairro, imoveis, localePrefix)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
