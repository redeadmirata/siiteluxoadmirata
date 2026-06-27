import { cn } from '@/utils/cn'

interface LoadingProps {
  /**
   * 'spinner' → círculo giratório
   * 'dots'    → três pontos pulsando
   * 'bar'     → barra de progresso superior
   * 'page'    → tela inteira com logo e spinner
   */
  variant?: 'spinner' | 'dots' | 'bar' | 'page'
  size?: 'sm' | 'md' | 'lg'
  /** Texto abaixo do indicador */
  label?: string
  className?: string
}

const spinnerSizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

/**
 * Loading — indicador de carregamento do design system.
 *
 * @example
 * <Loading />
 * <Loading variant="dots" label="Buscando imóveis…" />
 * <Loading variant="page" />
 */
export function Loading({
  variant = 'spinner',
  size = 'md',
  label,
  className,
}: LoadingProps) {
  if (variant === 'bar') {
    return (
      <div className={cn('fixed top-0 left-0 right-0 z-[200] h-0.5 bg-stone-200', className)}>
        <div className="h-full w-1/3 bg-gold animate-[loading-bar_1.5s_ease-in-out_infinite]" />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-gold animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {label && <p className="text-xs text-muted tracking-widest uppercase">{label}</p>}
      </div>
    )
  }

  if (variant === 'page') {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-stone">
        {/* Logo mark — A minimalista */}
        <div className="mb-8 text-2xl font-display font-light text-ink tracking-[0.3em] uppercase">
          Admirata
        </div>
        <div
          className={cn(
            'rounded-full border-gold/30 border-t-gold animate-spin',
            spinnerSizes[size]
          )}
        />
        {label && (
          <p className="mt-6 text-xs text-muted tracking-widest uppercase">{label}</p>
        )}
      </div>
    )
  }

  // default: spinner
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-gold/30 border-t-gold animate-spin',
          spinnerSizes[size]
        )}
      />
      {label && <p className="text-xs text-muted tracking-widest uppercase">{label}</p>}
    </div>
  )
}

export default Loading
