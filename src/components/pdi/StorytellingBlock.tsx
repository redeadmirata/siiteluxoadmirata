interface StorytellingBlockProps {
  descricao?: string
  titulo?: string
}

export default function StorytellingBlock({ descricao, titulo }: StorytellingBlockProps) {
  if (!descricao) return null

  const paragrafos = descricao.split('\n\n').filter(Boolean)

  return (
    <section aria-label="Descrição do imóvel" className="py-12 md:py-16 border-t border-stone">

      {/* Label editorial */}
      {titulo && (
        <div className="flex items-center gap-4 mb-10">
          <span className="block w-6 h-px bg-gold flex-shrink-0" aria-hidden="true" />
          <h2 className="text-[10px] font-medium tracking-[0.22em] uppercase text-gold">
            {titulo}
          </h2>
        </div>
      )}

      {/* Primeiro parágrafo em destaque, demais em corpo normal */}
      <div className="max-w-prose space-y-5">
        {paragrafos.map((paragrafo, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'text-lg font-light leading-relaxed text-ink/90'
                : 'text-base leading-relaxed text-ink/70'
            }
          >
            {paragrafo}
          </p>
        ))}
      </div>
    </section>
  )
}
