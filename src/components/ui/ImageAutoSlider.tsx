'use client'

import Image from 'next/image'

export interface SliderImage {
  url: string
  alt?: string | null
  lqip?: string | null
}

interface Props {
  images: SliderImage[]
  /** Altura do slide em pixels. Padrão: 260px mobile, 340px desktop */
  height?: number
  /** Duração de um ciclo completo em segundos. Padrão: 40s */
  duracao?: number
}

/**
 * Slider de imagens infinito com scroll automático — sem JS para animação,
 * apenas CSS keyframes. Pausa ao passar o mouse.
 *
 * As imagens são duplicadas para criar o loop perfeito (translateX -50%).
 */
export function ImageAutoSlider({ images, height = 300, duracao = 40 }: Props) {
  if (!images || images.length === 0) return null

  // Duplicar para loop perfeito
  const loop = [...images, ...images]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      {/* Faixa animada */}
      <div
        className="flex gap-3 w-max"
        style={{
          animation: `scroll-x ${duracao}s linear infinite`,
        }}
        // Pausa ao hover — funciona via grupo CSS
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'
        }}
      >
        {loop.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 overflow-hidden rounded-xl"
            style={{
              width: `${Math.round(height * 1.42)}px`, // proporção ~√2 ≈ 4:3
              height: `${height}px`,
            }}
          >
            <Image
              src={img.url}
              alt={img.alt ?? 'Feel Pontal Oceânico Nature'}
              width={Math.round(height * 1.42)}
              height={height}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out-expo"
              placeholder={img.lqip ? 'blur' : 'empty'}
              blurDataURL={img.lqip ?? undefined}
              loading={i < 4 ? 'eager' : 'lazy'}
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 420px"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
