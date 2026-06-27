import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Mensagem de erro — substitui o helper */
  error?: string
  /** Texto auxiliar abaixo do campo */
  helper?: string
  /** Ícone à esquerda */
  iconLeft?: React.ReactNode
  /** Ícone à direita */
  iconRight?: React.ReactNode
  /**
   * 'underline' → apenas borda inferior (estilo editorial — padrão)
   * 'box'       → borda em todos os lados
   */
  variant?: 'underline' | 'box'
}

/**
 * Input — campo de texto editorial Admirata.
 * Estilo underline por padrão: minimalista, linha dourada no foco.
 *
 * @example
 * <Input label="Nome completo" placeholder="Seu nome" />
 * <Input label="Email" type="email" error="Email inválido" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      iconLeft,
      iconRight,
      variant = 'underline',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    const baseInput = cn(
      'w-full bg-transparent font-body text-text placeholder:text-muted',
      'outline-none transition-colors duration-200',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variant === 'underline'
        ? [
            'border-0 border-b border-stone-300 rounded-none px-0 py-2',
            'focus:border-gold',
            error ? 'border-red-500' : '',
          ].join(' ')
        : [
            'border border-stone-300 px-4 py-3',
            'focus:border-gold focus:ring-1 focus:ring-gold',
            error ? 'border-red-500' : '',
          ].join(' '),
      iconLeft && 'pl-7',
      iconRight && 'pr-7',
      className
    )

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-body font-medium tracking-widest uppercase text-muted"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {iconLeft}
            </span>
          )}

          <input ref={ref} id={inputId} className={baseInput} {...props} />

          {iconRight && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>

        {(error || helper) && (
          <p className={cn('text-xs font-body', error ? 'text-red-500' : 'text-muted')}>
            {error ?? helper}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
