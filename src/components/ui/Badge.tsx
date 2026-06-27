import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Variantes semânticas do Badge.
 *
 * - `default`  → cinza neutro — status genérico, categorias
 * - `gold`     → dourado — destaque, disponível, premium
 * - `ink`      → azul-marinho — em construção, lançamento
 * - `success`  → verde suave — vendido, disponível
 * - `warning`  → âmbar — últimas unidades, oportunidade
 * - `danger`   → vermelho suave — locação, urgência
 * - `outline`  → borda sem fundo — tags secundárias
 */
export type BadgeVariant = 'default' | 'gold' | 'ink' | 'success' | 'warning' | 'danger' | 'outline'
export type BadgeSize    = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?:    BadgeSize
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone text-muted border border-stone-300/60',
  gold:    'bg-gold/10 text-gold border border-gold/30',
  ink:     'bg-ink text-white border border-ink',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger:  'bg-red-50 text-red-600 border border-red-200',
  outline: 'bg-transparent text-muted border border-stone-300/80',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] tracking-[0.12em]',
  md: 'px-3 py-1 text-[11px] tracking-[0.10em]',
}

// ─── Mapeamento de finalidade → variante ──────────────────────────────────────

/** Helper para mapear finalidade de imóvel ao badge correto. */
export function badgeVariantFromFinalidade(
  finalidade: string | undefined
): BadgeVariant {
  switch (finalidade) {
    case 'Venda':     return 'ink'
    case 'Locação':   return 'gold'
    case 'Temporada': return 'warning'
    default:          return 'default'
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Badge — etiqueta inline para status, categoria e tipo de imóvel.
 * Server Component puro (sem estado, sem eventos).
 *
 * @example
 * // Status de finalidade
 * <Badge variant="gold">Locação</Badge>
 *
 * // Tipo de imóvel
 * <Badge variant="default" size="sm">Cobertura</Badge>
 *
 * // Usando helper
 * <Badge variant={badgeVariantFromFinalidade(imovel.finalidade)}>
 *   {imovel.finalidade}
 * </Badge>
 */
export function Badge({
  variant = 'default',
  size    = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // base
        'inline-flex items-center font-body font-medium uppercase',
        // variante + tamanho
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
