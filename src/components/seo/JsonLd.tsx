/**
 * JsonLd — Server Component
 * Injeta um bloco <script type="application/ld+json"> no HTML.
 * Substitui SchemaJSONLD e SchemaJSONLDBairro (que eram cópias do mesmo padrão).
 *
 * @example
 * <JsonLd schema={{ '@context': 'https://schema.org', '@type': 'RealEstateListing', ... }} />
 * <JsonLd schema={[schemaA, schemaB]} />  // múltiplos schemas
 */
export default function JsonLd({
  schema,
}: {
  schema: Record<string, unknown> | Record<string, unknown>[]
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
