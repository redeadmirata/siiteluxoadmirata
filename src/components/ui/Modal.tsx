'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Tamanho do painel */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Impede fechar ao clicar no overlay */
  persistent?: boolean
  /** Título do modal (acessibilidade) */
  title?: string
  children: ReactNode
  className?: string
}

const sizes = {
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
}

/**
 * Modal — diálogo sobreposto com foco preso e acessibilidade.
 * Animação: fade + scale sutil (sem bounce — luxo é contido).
 *
 * @example
 * const [open, setOpen] = useState(false)
 * <Modal open={open} onClose={() => setOpen(false)} title="Contato">
 *   <ContatoForm />
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  size = 'md',
  persistent = false,
  title,
  children,
  className,
}: ModalProps) {
  // Fechar com Escape
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={!persistent ? onClose : undefined}
        aria-hidden
      />

      {/* Painel */}
      <div
        className={cn(
          'relative z-10 w-full bg-white shadow-2xl',
          'animate-scale-in',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4">
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

        {/* Conteúdo */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
