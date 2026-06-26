'use client'

/**
 * PDITitulo — Título do imóvel abaixo do hero, com efeito blur-fade.
 *
 * Entra em cena quando o usuário rola para fora do hero full-screen.
 * Cada elemento tem um delay escalonado, criando a cascata visual
 * inspirada no padrão MagicUI blur-fade.
 */

import { motion } from 'framer-motion'
import { formatArea } from '@/lib/formatters'

interface PDITituloProps {
  titulo: string
  condominioNome?: string | null
  quartos?: number | null
  areaUtil?: number | null
}

/** Variante de animação: blur-fade escalado */
function blurFade(delay = 0) {
  return {
    initial: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    },
    whileInView: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
    viewport: { once: true, margin: '-40px' },
    transition: {
      duration: 0.75,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }
}

export default function PDITitulo({
  titulo,
  condominioNome,
  quartos,
  areaUtil,
}: PDITituloProps) {
  const stats = [
    quartos ? `${quartos} ${quartos === 1 ? 'quarto' : 'quartos'}` : null,
    areaUtil ? formatArea(areaUtil) : null,
  ].filter(Boolean)

  return (
    <div className="container-site py-10 md:py-14 lg:py-16">
      {/* Condomínio — eyebrow secundário */}
      {condominioNome && (
        <motion.p
          {...blurFade(0)}
          className="mb-2 text-sm font-light tracking-wide text-ink/45 md:text-base"
        >
          {condominioNome}
        </motion.p>
      )}

      {/* Título principal */}
      <motion.h1
        {...blurFade(0.1)}
        className="font-light leading-[1.06] text-ink"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4.5vw, 4.2rem)',
        }}
      >
        {titulo}
      </motion.h1>

      {/* Stats discretos */}
      {stats.length > 0 && (
        <motion.p
          {...blurFade(0.2)}
          className="mt-4 flex items-center gap-3 text-sm font-light text-ink/40"
        >
          {stats.map((s, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-ink/20" />}
              {s}
            </span>
          ))}
        </motion.p>
      )}
    </div>
  )
}
