import type { ButtonHTMLAttributes, ElementType } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  href?: string
  /**
   * 'primary'   → fundo ink, texto branco — ação principal
   * 'gold'      → borda e texto gold — ação de destaque
   * 'outline'   → borda ink, fundo transparente
   * 'ghost'     → sem borda, apenas texto
   * 'white'     → fundo branco, texto ink (para fundos escuros)
   */
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  /** Ícone à esquerda do texto */
  iconLeft?: React.ReactNode
  /** Ícone à direita do texto */
  iconRight?: React.ReactNode
}

const variantClasses = {
  primary: [
    'bg-ink text-white border border-ink',
    'hover:bg-ink/90',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
  ].join(' '),

  gold: [
    'bg-transparent text-gold border border-gold',
    'hover:bg-gold hover:text-white',
    'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
  ].join(' '),

  outline: [
    'bg-transparent text-ink border border-ink/30',
    'hover:border-ink/70',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
  ].join(' '),

  ghost: [
    'bg-transparent text-ink border border-transparent',
    'hover:text-gold',
    'focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
  ].join(' '),

  white: [
    'bg-white text-ink border border-white',
    'hover:bg-stone',
    'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
  ].join(' '),
}

const sizeClasses = {
  sm: 'h-8 px-4 text-xs tracking-widest',
  md: 'h-11 px-7 text-sm tracking-widest',
  lg: 'h-14 px-10 text-base tracking-widest',
}

/**
 * Button — botão editorial Admirata.
 * Sem border-radius — sharp corners alinhados à linguagem de luxo.
 *
 * @example
 * <Button variant="gold" size="lg">Ver Imóveis</Button>
 * <Button as="a" href="/imoveis" variant="primary">Explorar</Button>
 */
export function Button({
  as,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const Tag = (as ?? (href ? 'a' : 'button')) as ElementType
  const tagProps = href ? { href, ...props } : { disabled: disabled || loading, ...props }

  return (
    <Tag
      className={cn(
        // base
        'inline-flex items-center justify-center gap-2',
        'font-body uppercase font-medium tracking-widest',
        'transition-all duration-200 ease-smooth',
        'cursor-pointer select-none outline-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        // variant + size
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...tagProps}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {iconLeft && <span className="shrink-0">{iconLeft}</span>}
          {children}
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </>
      )}
    </Tag>
  )
}

export default Button
