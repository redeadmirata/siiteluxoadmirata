'use client'

import Image from 'next/image'
import { useState } from 'react'
import { urlForImovelImage } from '@/sanity/client'
import type { ImovelPlanta } from '@/types/sanity'

interface PlantaViewerProps {
  plantas: ImovelPlanta[]
}

export default function PlantaViewer({ plantas }: PlantaViewerProps) {
  const [ativa, setAtiva] = useState(0)

  if (!plantas.length) return null

  const planta = plantas[ativa]

  function getUrl(p: ImovelPlanta) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return urlForImovelImage(p.arquivo as any, 1200)
    } catch {
      return p.arquivo.asset?.url ?? ''
    }
  }

  return (
    <section aria-label="Plantas" className="section-padding">
      <div className="divider-gold mb-8" aria-hidden="true" />
      <h2 className="text-xs tracking-widest uppercase text-gold mb-6">
        Plantas
      </h2>

      {/* Tabs se houver mais de uma planta */}
      {plantas.length > 1 && (
        <div className="flex gap-4 mb-6 overflow-x-auto pb-1">
          {plantas.map((p, i) => (
            <button
              key={i}
              onClick={() => setAtiva(i)}
              className={`text-xs uppercase tracking-wider whitespace-nowrap pb-2 border-b transition-colors ${
                i === ativa
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {p.titulo ?? `Planta ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Imagem da planta com labels de ambientes */}
      <div className="relative w-full bg-stone overflow-hidden">
        <div className="relative aspect-[4/3]">
          <Image
            src={getUrl(planta)}
            alt={planta.titulo ?? 'Planta do imóvel'}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain p-4"
            placeholder={planta.arquivo.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={planta.arquivo.asset?.metadata?.lqip}
          />

          {/* Labels de ambientes */}
          {planta.ambientes?.map((amb, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${amb.x ?? 50}%`,
                top: `${amb.y ?? 50}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="bg-ink/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">
                {amb.nome}
                {amb.area ? ` · ${amb.area}m²` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
