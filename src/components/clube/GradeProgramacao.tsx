'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { ClubeGradeProgramacao } from '@/data/clube-verdant-programacao'

export default function GradeProgramacao({ grade }: { grade: ClubeGradeProgramacao }) {
  const [aberta, setAberta] = useState(false)

  useEffect(() => {
    if (!aberta) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAberta(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberta])

  return (
    <section id="grade-clube" className="border-y border-white/10 bg-[#070910] py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.38em] text-gold">Grade oficial</p>
            <h3 className="mt-4 font-display text-4xl font-light text-white sm:text-5xl">
              A semana em movimento
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Programação atualizada em {grade.atualizadoEm}. Toque na imagem para ampliar e
              consultar cada horário.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAberta(true)}
              className="border-gold/50 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Ver em tela cheia
            </button>
            <a
              href={grade.src}
              download={grade.downloadName}
              className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/50"
            >
              Baixar imagem
            </a>
            {grade.pdfSrc && (
              <a
                href={grade.pdfSrc}
                download
                className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/50"
              >
                Baixar PDF
              </a>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAberta(true)}
          className="group relative mt-10 block w-full cursor-zoom-in overflow-hidden rounded-sm bg-white shadow-2xl shadow-black/30"
          aria-label="Ampliar a programação oficial do Clube Verdant"
        >
          <Image
            src={grade.src}
            alt={grade.alt}
            width={grade.width}
            height={grade.height}
            loading="lazy"
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </button>
      </div>

      {aberta && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Programação Wellness em tela cheia"
        >
          <div className="mb-3 flex items-center justify-between gap-4 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Arraste ou role para consultar — Esc fecha
            </p>
            <button
              type="button"
              onClick={() => setAberta(false)}
              className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-black"
              autoFocus
            >
              Fechar
            </button>
          </div>
          <div className="flex-1 overflow-auto overscroll-contain rounded-sm bg-white p-2 sm:p-4">
            <Image
              src={grade.src}
              alt={grade.alt}
              width={grade.width}
              height={grade.height}
              sizes="100vw"
              className="mx-auto h-auto min-w-[900px] max-w-none"
            />
          </div>
        </div>
      )}
    </section>
  )
}
