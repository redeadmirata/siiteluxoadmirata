'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface DrawerProps {
  open: boolean
  onClose: () => void
  /** Posição do drawer */
  side?: 'left' | 'right' | 'bottom'
  /** Largura (left/right) ou altura (bottom) */
  size?: 'sm' | 'md' | 'lg' | 'full'
  title?: string
  persistent?: boolean
  children: ReactNode
  className?: string
}

const sideSizes = {
  left:   { sm: 'w-72', md: 'w-80', lg: 'w-96', full: 'w-full' },
  right:  { sm: 'w-72', md: 'w-80', lg: 'w-96', full: 'w-full' },
  bottom: { sm: 'h-48', md: 'h-72', lg: 'h-[50vh]', full: 'h-[90vh]' },
}

const sideClasses = {
  left:   'inset-y-0 left-0',
  right:  'inset-y-0 right-0',
  bottom: 'inset-x-0 bottom-0',
}

const slideIn = {
  left:   'animate-[slide-in-from-left_300ms_ease-out]',
  right:  'animate-[slide-in-from-right_300ms_ease-out]',
  bottom: 'animate-[slide-in-from-bottom_300ms_ease-out]',
}

/**
 * Drawer — painel lateral deslizante.
 * Usado para filtros, menus mobile, formulários laterais.
 *
 * @example
 * <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filtros">
 *   <FiltrosSearch />
 * </Drawer>
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  persistent = false,
  children,
  className,
}: DrawerProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) onClose()
    },
    [onClose, persistent]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[80]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={!persistent ? onClose : undefined}
        aria-hidden
      />

      {/* Painel */}
      <div
        className={cn(
          'absolute z-10 flex flex-col bg-white shadow-2xl',
          sideClasses[side],
          sideSizes[side][size],
          slideIn[side],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4 shrink-0">
          {title ? (
            <h2 className="font-display font-light text-xl text-ink">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors duration-150"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Drawer
