import type { WithContext, Thing } from 'schema-dts'

/**
 * Injects a JSON-LD structured-data script. Safe for RSC — it renders a plain
 * <script type="application/ld+json"> tag with serialized data.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> | WithContext<T>[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, app-generated content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
