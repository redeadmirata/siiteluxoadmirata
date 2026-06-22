'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * ShimmerText — texto com varredura de brilho contínua.
 * Adaptado de 21st.dev (tom_ui/shimmer-text) para a identidade Admirata:
 * - framer-motion (stack do projeto) em vez de motion/react
 * - variantes restritas aos tokens do Design System (gold/ink/stone/muted)
 * - respeita prefers-reduced-motion (renderiza texto sólido, sem animação)
 *
 * Uso:
 *   <ShimmerText variant="gold" className="font-display text-5xl">
 *     Ilha Pura
 *   </ShimmerText>
 */
type Variant = 'default' | 'gold' | 'ink' | 'stone' | 'muted'

interface ShimmerTextProps {
  children: React.ReactNode
  className?: string
  /** Cor base do texto — apenas tokens da paleta Admirata */
  variant?: Variant
  /** Duração da varredura (s) */
  duration?: number
  /** Atraso inicial (s) */
  delay?: number
  /** Intervalo entre repetições (s) */
  repeatDelay?: number
}

const variantMap: Record<Variant, string> = {
  default: '',
  gold: 'text-gold',
  ink: 'text-ink',
  stone: 'text-stone',
  muted: 'text-muted',
}

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ')

export function ShimmerText({
  children,
  className,
  variant = 'gold',
  duration = 1.8,
  delay = 0.8,
  repeatDelay = 2.5,
}: ShimmerTextProps) {
  const prefersReducedMotion = useReducedMotion()

  // Acessibilidade: sem animação, texto sólido e legível.
  if (prefersReducedMotion) {
    return (
      <span className={cx('inline-block', variantMap[variant], className)}>
        {children}
      </span>
    )
  }

  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        className={cx(
          'inline-block [--shimmer-contrast:rgba(255,255,255,0.65)]',
          variantMap[variant],
          className,
        )}
        style={
          {
            WebkitTextFillColor: 'transparent',
            background:
              'currentColor linear-gradient(to right, currentColor 0%, var(--shimmer-contrast) 40%, var(--shimmer-contrast) 60%, currentColor 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50% 200%',
          } as React.CSSProperties
        }
        initial={{ backgroundPositionX: '250%' }}
        animate={{ backgroundPositionX: ['-100%', '250%'] }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          repeatDelay,
          ease: 'linear',
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default ShimmerText
