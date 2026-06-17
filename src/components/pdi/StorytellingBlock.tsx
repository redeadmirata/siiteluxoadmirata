interface StorytellingBlockProps {
  descricao?: string
  titulo?: string
}

export default function StorytellingBlock({ descricao, titulo }: StorytellingBlockProps) {
  if (!descricao) return null

  return (
    <section aria-label="Descrição do imóvel" className="section-padding">
      <div className="divider-gold mb-8" aria-hidden="true" />

      {titulo && (
        <h2 className="text-xs tracking-widest uppercase text-gold mb-6">
          {titulo}
        </h2>
      )}

      <div className="max-w-2xl">
        {descricao.split('\n\n').map((paragrafo, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-ink/80 mb-4 last:mb-0"
          >
            {paragrafo}
          </p>
        ))}
      </div>
    </section>
  )
}
