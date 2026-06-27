import JsonLd from '@/components/seo/JsonLd'
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
  return <JsonLd schema={generateBairroSchema(bairro, imoveis, localePrefix)} />
}
