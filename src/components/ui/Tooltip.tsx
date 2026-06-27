import type { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Texto exibido no tooltip */
  content: string
  /** Posição em relação ao elemento filho */
  position?: TooltipPosition
  children: ReactNode
}

// ─── Estilos por posição ──────────────────────────────────────────────────────

/**
 * Posicionamento + seta do tooltip.
 * Implementação 100% CSS — sem JS, sem estado, zero re-renders.
 * Usa grupo `group` no wrapper e `group-hover:` no tooltip.
 */
const positionClasses: Record<TooltipPosition, {
  tooltip: string
  arrow:   string
}> = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow:   'top-full left-1/2 -translate-x-1/2 border-t-ink',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow:   'bottom-full left-1/2 -translate-x-1/2 border-b-ink',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow:   'left-full top-1/2 -translate-y-1/2 border-l-ink',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow:   'right-full top-1/2 -translate-y-1/2 border-r-ink',
  },
}

// Setas por posição (border trick CSS)
const arrowBorderClasses: Record<TooltipPosition, string> = {
  top:    'border-l-transparent border-r-transparent border-b-transparent border-t-ink border-4',
  bottom: 'border-l-transparent border-r-transparent border-t-transparent border-b-ink border-4',
  left:   'border-t-transparent border-b-transparent border-r-transparent border-l-ink border-4',
  right:  'border-t-transparent border-b-transparent border-l-transparent border-r-ink border-4',
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tooltip — overlay de texto no hover, implementação CSS pura.
 * Aparece em 200ms, sem flicker de JS, sem portal.
 * Ideal para IconButton, ícones de amenidade e métricas.
 *
 * @example
 * // Tooltip em IconButton de favorito
 * <Tooltip content="Favoritar imóvel" position="top">
 *   <IconButton aria-label="Favoritar" icon={<Heart />} />
 * </Tooltip>
 *
 * // Tooltip em ícone de amenidade
 * <Tooltip content="Piscina aquecida">
 *   <Waves className="h-5 w-5 text-muted" />
 * </Tooltip>
 */
export function Tooltip({
  content,
  position = 'top',
  children,
  className,
  ...props
}: TooltipProps) {
  const { tooltip, arrow } = positionClasses[position]

  return (
    <span
      className={cn('relative inline-flex group', className)}
      {...props}
    >
      {/* Trigger */}
      {children}

      {/* Tooltip bubble */}
      <span
        role="tooltip"
        className={cn(
          // layout
          'absolute z-[60] whitespace-nowrap pointer-events-none',
          // visual
          'bg-ink text-white text-[10px] font-body font-medium tracking-wide uppercase',
          'px-2.5 py-1.5',
          // animação via group-hover
          'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100',
          'transition-all duration-200 ease-smooth',
          // posição
          tooltip
        )}
      >
        {content}

        {/* Seta */}
        <span
          aria-hidden
          className={cn(
            'absolute w-0 h-0',
            arrow,
            arrowBorderClasses[position]
          )}
        />
      </span>
    </span>
  )
}

export default Tooltip
