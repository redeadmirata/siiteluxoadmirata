import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Tag semântica — padrão inferido do size, mas pode ser sobrescrito */
  as?: ElementType
  level?: HeadingLevel
  size?: HeadingSize
  /** Fonte display (Cormorant serif) ou body (Inter) */
  font?: 'display' | 'body'
  /** Cor */
  color?: 'ink' | 'gold' | 'white' | 'muted' | 'inherit'
}

const sizeClasses: Record<HeadingSize, string> = {
  xs:  'text-base leading-snug tracking-wide',
  sm:  'text-lg leading-snug tracking-wide',
  md:  'text-2xl leading-tight tracking-tight',
  lg:  'text-3xl md:text-4xl leading-tight tracking-tight',
  xl:  'text-4xl md:text-5xl leading-tight tracking-tight',
  '2xl': 'text-5xl md:text-6xl leading-[1.1] tracking-tight',
  '3xl': 'text-6xl md:text-7xl leading-[1.05] tracking-tighter',
}

const colorClasses: Record<NonNullable<HeadingProps['color']>, string> = {
  ink:     'text-ink',
  gold:    'text-gold',
  white:   'text-white',
  muted:   'text-muted',
  inherit: 'text-inherit',
}

const defaultLevel: Record<HeadingSize, HeadingLevel> = {
  '3xl': 1, '2xl': 1, xl: 1, lg: 2, md: 2, sm: 3, xs: 4,
}

/**
 * Heading — tipografia editorial Admirata.
 * Usa Cormorant (display) por padrão para headings principais.
 *
 * @example
 * <Heading size="2xl">Imóveis de Luxo no Rio</Heading>
 * <Heading as="h3" size="md" font="body" color="muted">Categoria</Heading>
 */
export function Heading({
  as,
  level,
  size = 'lg',
  font = 'display',
  color = 'ink',
  className,
  children,
  ...props
}: HeadingProps) {
  const resolvedLevel = level ?? defaultLevel[size]
  const Tag = (as ?? `h${resolvedLevel}`) as ElementType

  return (
    <Tag
      className={cn(
        font === 'display' ? 'font-display font-light' : 'font-body font-semibold',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Heading
