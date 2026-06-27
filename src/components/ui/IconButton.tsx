import type { ButtonHTMLAttributes, ElementType } from 'react'
import { cn } from '@/utils/cn'

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Variantes do IconButton — alinhadas ao Button.tsx.
 *
 * - `ghost`   → sem borda, cor muted com hover ink (default)
 * - `outline` → borda sutil, transparente
 * - `solid`   → fundo ink, ícone branco
 * - `gold`    → borda e ícone gold
 */
export type IconButtonVariant = 'ghost' | 'outline' | 'solid' | 'gold'
export type IconButtonSize    = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  href?: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  /**
   * OBRIGATÓRIO: descrição acessível do ícone para leitores de tela.
   * Nunca omitir — o botão sem texto visível precisa de rótulo.
   */
  'aria-label': string
  /** Ícone a ser renderizado (Lucide ou SVG custom) */
  icon: React.ReactNode
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: [
    'bg-transparent text-muted border border-transparent',
    'hover:text-ink hover:bg-stone/60',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1',
  ].join(' '),

  outline: [
    'bg-transparent text-ink border border-ink/25',
    'hover:border-ink/60',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1',
  ].join(' '),

  solid: [
    'bg-ink text-white border border-ink',
    'hover:bg-ink/85',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1',
  ].join(' '),

  gold: [
    'bg-transparent text-gold border border-gold/40',
    'hover:bg-gold hover:text-white',
    'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1',
  ].join(' '),
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8  w-8  [&>*]:h-4 [&>*]:w-4',
  md: 'h-10 w-10 [&>*]:h-5 [&>*]:w-5',
  lg: 'h-12 w-12 [&>*]:h-6 [&>*]:w-6',
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * IconButton — botão apenas com ícone, sem texto visível.
 * Acessível via aria-label obrigatório.
 *
 * @example
 * import { Heart } from '@/components/icons'
 *
 * <IconButton
 *   aria-label="Favoritar imóvel"
 *   icon={<Heart />}
 *   variant="ghost"
 *   onClick={toggleFavorite}
 * />
 *
 * // Como link
 * <IconButton
 *   as="a"
 *   href="/favoritos"
 *   aria-label="Ver favoritos"
 *   icon={<Heart />}
 * />
 */
export function IconButton({
  as,
  href,
  variant  = 'ghost',
  size     = 'md',
  icon,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const Tag = (as ?? (href ? 'a' : 'button')) as ElementType
  const tagProps = href
    ? { href, ...props }
    : { disabled, type: 'button' as const, ...props }

  return (
    <Tag
      className={cn(
        // base
        'inline-flex items-center justify-center shrink-0',
        'transition-all duration-150 ease-smooth',
        'cursor-pointer outline-none select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        // variante + tamanho
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...tagProps}
    >
      <span aria-hidden className="flex items-center justify-center">
        {icon}
      </span>
    </Tag>
  )
}

export default IconButton
