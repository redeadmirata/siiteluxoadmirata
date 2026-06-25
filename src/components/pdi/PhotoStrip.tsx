'use client'

import Image from 'next/image'
import { urlForImovelImage } from '@/sanity/client'
import type { ImovelImagem } from '@/types/sanity'

interface PhotoStripProps {
  imagens: ImovelImagem[]
  /** Tamanho do quadrado em px — padrão 176 */
  size?: number
  /** Label da seção (acessibilidade) */
  label?: string
}

/**
 * Faixa horizontal animada de fotos em formato square (1:1).
 * Usa animação CSS pura (performática, sem JS) — duas cópias side by side
 * deslocando -50% continuamente para criar loop seamless.
 */
export default function PhotoStrip({ imagens, size = 176, label = 'Galeria' }: PhotoStripProps) {
  if (imagens.length < 3) return null

  function getUrl(img: ImovelImagem) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return urlForImovelImage(img.arquivo as any, size * 2)
    } catch {
      return img.arquivo.asset?.url ?? ''
    }
  }

  // Duplica para loop seamless
  const doubled = [...imagens, ...imagens]
  // Duração proporcional ao número de fotos
  const duration = Math.max(20, imagens.length * 3.5)

  return (
    <section
      aria-label={label}
      className="w-full overflow-hidden"
      style={{ height: size }}
    >
      <style>{`
        @keyframes photo-strip-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .photo-strip-track {
          display: flex;
          gap: 4px;
          width: max-content;
          animation: photo-strip-scroll ${duration}s linear infinite;
        }
        .photo-strip-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .photo-strip-track { animation: none; }
        }
      `}</style>

      <div className="photo-strip-track">
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden"
            style={{ width: size, height: size }}
            aria-hidden={i >= imagens.length}
          >
            <Image
              src={getUrl(img)}
              alt={i < imagens.length ? (img.arquivo.alt ?? '') : ''}
              fill
              sizes={`${size}px`}
              className="object-cover"
              placeholder={img.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={img.arquivo.asset?.metadata?.lqip}
              loading={i < 6 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
