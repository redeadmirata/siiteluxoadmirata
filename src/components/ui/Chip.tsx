'use client'

import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { X } from '@/components/icons'

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Variantes do Chip.
 *
 * - `default` → fundo stone, texto muted — chip inativo
 * - `active`  → fundo ink, texto branco — filtro aplicado
 * - `gold`    → borda e texto gold — filtro destacado
 */
export type ChipVariant = 'default' | 'active' | 'gold'

interface ChipProps {
  /** Conteúdo do chip */
  children: ReactNode
  variant?: ChipVariant
  /** Callback ao clicar no X de remoção. Se omitido, X não aparece. */
  onRemove?: () => void
  /** Callback ao clicar no chip inteiro (ex: ativar/desativar filtro) */
  onClick?: () => void
  className?: string
  disabled?: boolean
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const variantClasses: Record<ChipVariant, string> = {
  default: [
    'bg-stone border border-stone-300/60 text-muted',
    'hover:border-ink/30 hover:text-ink',
  ].join(' '),

  active: [
    'bg-ink border border-ink text-white',
    'hover:bg-ink/85',
  ].join(' '),

  gold: [
    'bg-gold/8 border border-gold/40 text-gold',
    'hover:bg-gold/15',
  ].join(' '),
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Chip — tag interativa para filtros ativos, seleções e etiquetas removíveis.
 * Diferente do Badge (estático), o Chip tem interação (clique e remoção).
 *
 * @example
 * // Filtro ativo removível
 * <Chip variant="active" onRemove={() => removeFilter('bairro')}>
 *   Barra da Tijuca
 * </Chip>
 *
 * // Chip clicável sem remoção
 * <Chip onClick={() => setFilter('quartos', 3)}>
 *   3 quartos
 * </Chip>
 *
 * // Lista de filtros ativos
 * {filters.map(f => (
 *   <Chip key={f.key} variant="active" onRemove={() => removeFilter(f.key)}>
 *     {f.label}
 *   </Chip>
 * ))}
 */
export function Chip({
  children,
  variant  = 'default',
  onRemove,
  onClick,
  className,
  disabled = false,
}: ChipProps) {
  const isInteractive = !!onClick || !!onRemove
  const Tag = onClick ? 'button' : 'span'

  return (
    <span
      className={cn(
        // base
        'inline-flex items-center gap-1.5',
        'font-body text-[11px] font-medium uppercase tracking-[0.10em]',
        'px-3 py-1.5',
        'transition-all duration-150 ease-smooth',
        'select-none',
        // interatividade
        isInteractive && !disabled && 'cursor-pointer',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        // variante
        variantClasses[variant],
        className
      )}
    >
      {/* Label — clicável se onClick fornecido */}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="outline-none focus-visible:underline"
        >
          {children}
        </button>
      ) : (
        <span>{children}</span>
      )}

      {/* Botão de remoção */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          disabled={disabled}
          aria-label="Remover filtro"
          className={cn(
            'ml-0.5 flex items-center justify-center',
            'rounded-full p-0.5',
            'transition-colors duration-100',
            'hover:bg-black/10 outline-none',
            'focus-visible:ring-1 focus-visible:ring-current'
          )}
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </span>
  )
}

export default Chip
