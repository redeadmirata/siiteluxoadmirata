'use client'

/**
 * MotionProvider — Framer Motion
 *
 * Usa LazyMotion com domAnimation para reduzir o bundle em ~50%
 * vs. importar motion diretamente (~30KB → ~18KB gzipped).
 *
 * IMPORTANTE: nos componentes filhos usar `m` em vez de `motion`:
 *   import { m } from 'framer-motion'   ← correto com LazyMotion
 *   import { motion } from 'framer-motion' ← ignorado pelo tree-shaking
 *
 * Configura:
 * - reducedMotion: 'user' — respeita prefers-reduced-motion
 * - AnimatePresence mode='wait' para transições de página
 */

import {
  LazyMotion,
  domAnimation,
  AnimatePresence,
  type AnimatePresenceProps,
  type ReactNode,
} from 'framer-motion'

// ─── Variantes padrão reutilizáveis ───────────────────────────────────────────

export const VARIANTS = {
  /** Fade in suave — padrão Admirata */
  fadeIn: {
    hidden:  { opacity: 0, y: 16, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  },
  /** Slide lateral — para painéis e drawers */
  slideRight: {
    hidden:  { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -24 },
  },
  /** Scale up sutil — para modais e lightbox */
  scaleUp: {
    hidden:  { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.96 },
  },
  /** Reveal horizontal — para clip-path de headlines */
  clipReveal: {
    hidden:  { clipPath: 'inset(0 100% 0 0)' },
    visible: { clipPath: 'inset(0 0% 0 0)' },
  },
} as const

/** Transição padrão Admirata — suave e elegante */
export const TRANSITION_DEFAULT = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

/** Transição rápida para micro-interações */
export const TRANSITION_FAST = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

/** Stagger para listas de cards */
export const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface MotionProviderProps {
  children: ReactNode
  /** Modo de AnimatePresence — 'wait' faz o exit terminar antes do enter */
  presenceMode?: AnimatePresenceProps['mode']
}

export function MotionProvider({
  children,
  presenceMode = 'wait',
}: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode={presenceMode}>
        {children}
      </AnimatePresence>
    </LazyMotion>
  )
}

// ─── Hook de preferência de movimento ─────────────────────────────────────────

/**
 * Retorna true se o usuário prefere movimento reduzido.
 * Usar para desabilitar animações complexas (parallax, scroll-triggered).
 */
export { useReducedMotion } from 'framer-motion'
