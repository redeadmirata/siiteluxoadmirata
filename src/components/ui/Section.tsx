import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /**
   * Controla o padding vertical da seção.
   * 'default' → clamp(4rem, 8vw, 8rem) topo e base
   * 'sm'      → padding menor (para seções secundárias)
   * 'lg'      → padding maior (hero-like)
   * 'none'    → sem padding (controle manual)
   */
  spacing?: 'sm' | 'default' | 'lg' | 'none'
  /**
   * Background pré-definido do design system.
   * 'stone'   → var(--color-stone) areia clara — padrão
   * 'ink'     → var(--color-ink) azul escuro
   * 'white'   → branco
   * 'none'    → sem background
   */
  bg?: 'stone' | 'ink' | 'white' | 'none'
}

const spacings = {
  sm: 'py-12 md:py-16',
  default: 'py-[clamp(4rem,8vw,8rem)]',
  lg: 'py-[clamp(6rem,12vw,12rem)]',
  none: '',
}

const backgrounds = {
  stone: 'bg-stone',
  ink: 'bg-ink text-white',
  white: 'bg-white',
  none: '',
}

/**
 * Section — seção de página com padding vertical e background do design system.
 *
 * @example
 * <Section bg="ink">
 *   <Container>…</Container>
 * </Section>
 */
export function Section({
  as: Tag = 'section',
  spacing = 'default',
  bg = 'none',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(spacings[spacing], backgrounds[bg], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Section
