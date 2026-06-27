import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /**
   * 'default' → max-w-[1440px] com padding lateral responsivo
   * 'narrow'  → max-w-3xl  (artigos, textos longos)
   * 'wide'    → max-w-screen-2xl (imagens full-bleed com algum recuo)
   * 'fluid'   → sem max-width (ocupa toda a largura)
   */
  size?: 'default' | 'narrow' | 'wide' | 'fluid'
}

const sizes = {
  default: 'max-w-[1440px] px-[clamp(1.5rem,5vw,6rem)]',
  narrow: 'max-w-3xl px-6',
  wide: 'max-w-screen-2xl px-6',
  fluid: 'w-full px-6',
}

/**
 * Container — wrapper central de layout.
 * Centraliza conteúdo com padding responsivo e max-width do design system.
 *
 * @example
 * <Container>…</Container>
 * <Container size="narrow" as="article">…</Container>
 */
export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full', sizes[size], className)} {...props}>
      {children}
    </Tag>
  )
}

export default Container
