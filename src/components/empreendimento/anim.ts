/**
 * anim.ts — tokens de animação da landing de empreendimento.
 *
 * Centraliza variantes Framer Motion e parâmetros de parallax usados pelas
 * seções cinematográficas. Mantém o comportamento DOCUMENTADO (regra do projeto:
 * cada animação deve ser anotada para o handoff de dev).
 *
 * Easing padrão Admirata: [0.22, 1, 0.36, 1] (expo-out suave).
 */

import type { Variants } from 'framer-motion'

/** Easing expo-out suave — assinatura de movimento da marca. */
export const EASE_ADMIRATA = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Reveal de entrada na viewport: fade + slide-up + leve blur.
 * Anotação handoff: "fade in + slide up 24px + blur 6→0, 0.7s, expo-out".
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_ADMIRATA },
  },
}

/**
 * Reveal de headline editorial via clip-path (cobertura horizontal).
 * Anotação handoff: "clip-path inset 100%→0%, 0.9s, expo-out".
 */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.9, ease: EASE_ADMIRATA },
  },
}

/**
 * Container com stagger dos filhos.
 * Anotação handoff: "stagger 0.1s entre filhos, delay inicial 0.05s".
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

/** Configuração padrão de `whileInView` — dispara uma vez, 25% visível. */
export const VIEWPORT_ONCE = { once: true, amount: 0.25 } as const

/** Deslocamento de parallax do hero (px no eixo Y ao longo do scroll). */
export const HERO_PARALLAX_Y = 120
