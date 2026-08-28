type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** JSON-LD an toàn cho Google (script type=application/ld+json). */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
