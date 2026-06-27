import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  color?: 'text' | 'muted' | 'ink' | 'gold' | 'white' | 'inherit'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  tracking?: 'tight' | 'normal' | 'wide' | 'widest'
  /** Limita número de linhas com line-clamp */
  clamp?: 2 | 3 | 4 | 6
}

const sizes = {
  xs:   'text-xs',
  sm:   'text-sm',
  base: 'text-base',
  lg:   'text-lg',
  xl:   'text-xl',
}

const colors = {
  text:    'text-text',
  muted:   'text-muted',
  ink:     'text-ink',
  gold:    'text-gold',
  white:   'text-white',
  inherit: 'text-inherit',
}

const weights = {
  light:    'font-light',
  normal:   'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
}

const trackings = {
  tight:   'tracking-tight',
  normal:  'tracking-normal',
  wide:    'tracking-wide',
  widest:  'tracking-widest',
}

const clamps = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  6: 'line-clamp-6',
}

/**
 * Text — componente de texto corpo. Usa font-body (Inter) por padrão.
 *
 * @example
 * <Text size="sm" color="muted">Barra da Tijuca, Rio de Janeiro</Text>
 * <Text as="span" tracking="widest" size="xs" color="gold">EXCLUSIVO</Text>
 */
export function Text({
  as: Tag = 'p',
  size = 'base',
  color = 'text',
  weight = 'normal',
  tracking = 'normal',
  clamp,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        'font-body leading-relaxed',
        sizes[size],
        colors[color],
        weights[weight],
        trackings[tracking],
        clamp && clamps[clamp],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Text
