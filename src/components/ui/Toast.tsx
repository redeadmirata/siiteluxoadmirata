'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { cn } from '@/utils/cn'
import { CheckCircle, Info, AlertCircle, X } from '@/components/icons'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ToastType     = 'success' | 'error' | 'info' | 'warning'
export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export interface Toast {
  id:          string
  type:        ToastType
  message:     string
  description?: string
  /** Duração em ms. 0 = permanente até fechar manualmente. */
  duration?:   number
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  toast:      () => '',
  dismiss:    () => {},
  dismissAll: () => {},
})

// ─── Helpers visuais ──────────────────────────────────────────────────────────

const toastStyles: Record<ToastType, {
  container: string
  icon:      ReactNode
  iconColor: string
}> = {
  success: {
    container: 'border-l-4 border-l-emerald-500',
    icon:      <CheckCircle className="h-5 w-5" aria-hidden />,
    iconColor: 'text-emerald-500',
  },
  error: {
    container: 'border-l-4 border-l-red-500',
    icon:      <AlertCircle className="h-5 w-5" aria-hidden />,
    iconColor: 'text-red-500',
  },
  info: {
    container: 'border-l-4 border-l-gold',
    icon:      <Info className="h-5 w-5" aria-hidden />,
    iconColor: 'text-gold',
  },
  warning: {
    container: 'border-l-4 border-l-amber-500',
    icon:      <AlertCircle className="h-5 w-5" aria-hidden />,
    iconColor: 'text-amber-500',
  },
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right':     'top-4 right-4',
  'top-center':    'top-4 left-1/2 -translate-x-1/2',
  'bottom-right':  'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

// ─── ToastItem ────────────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast:     Toast
  onDismiss: (id: string) => void
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const duration = toast.duration ?? 4000
  const styles   = toastStyles[toast.type]

  // Auto-dismiss
  useEffect(() => {
    if (duration === 0) return
    timerRef.current = setTimeout(() => onDismiss(toast.id), duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        // layout
        'flex items-start gap-3 min-w-[280px] max-w-sm w-full',
        // visual
        'bg-white shadow-lg px-4 py-3.5',
        // animação (slide-in da direita)
        'animate-[slide-in-from-right_300ms_ease-out]',
        // tipo
        styles.container
      )}
    >
      {/* Ícone */}
      <span className={cn('shrink-0 mt-0.5', styles.iconColor)}>
        {styles.icon}
      </span>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-ink leading-snug">
          {toast.message}
        </p>
        {toast.description && (
          <p className="font-body text-[12px] text-muted leading-relaxed mt-0.5">
            {toast.description}
          </p>
        )}
      </div>

      {/* Fechar */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="shrink-0 text-muted hover:text-ink transition-colors duration-100 outline-none mt-0.5"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

interface ToastProviderProps {
  children:   ReactNode
  /** Posição na viewport (padrão: top-right) */
  position?:  ToastPosition
  /** Máximo de toasts simultâneos (padrão: 3) */
  maxToasts?: number
}

/**
 * ToastProvider — adicionar no topo da árvore (dentro de AppProviders).
 * Renderiza os toasts em um portal acima de tudo.
 *
 * @example
 * // providers/index.tsx
 * <ToastProvider position="top-right">
 *   {children}
 * </ToastProvider>
 *
 * // Em qualquer componente filho:
 * const { toast } = useToast()
 * toast({ type: 'success', message: 'Mensagem enviada!' })
 */
export function ToastProvider({
  children,
  position  = 'top-right',
  maxToasts = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (options: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => {
        // Limitar máximo de toasts — remove o mais antigo se necessário
        const next = [...prev, { ...options, id }]
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next
      })
      return id
    },
    [maxToasts]
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => setToasts([]), [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}

      {/* Portal de toasts */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-label="Notificações"
          className={cn(
            'fixed z-[110] flex flex-col gap-2 pointer-events-none',
            positionClasses[position]
          )}
        >
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// ─── useToast hook ────────────────────────────────────────────────────────────

/**
 * Hook para disparar toasts de qualquer Client Component.
 *
 * @example
 * const { toast, dismiss } = useToast()
 *
 * // Sucesso após enviar formulário
 * toast({ type: 'success', message: 'Mensagem enviada com sucesso!' })
 *
 * // Erro de rede
 * toast({ type: 'error', message: 'Falha ao enviar', description: 'Tente novamente em instantes.' })
 *
 * // Informação com duração customizada
 * toast({ type: 'info', message: 'Tour virtual disponível', duration: 6000 })
 *
 * // Permanente (fecha apenas manualmente)
 * const id = toast({ type: 'warning', message: 'Atenção', duration: 0 })
 * dismiss(id)
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)

  if (!ctx.toast) {
    throw new Error(
      '[useToast] Nenhum ToastProvider encontrado na árvore. ' +
      'Adicione <ToastProvider> em AppProviders ou no layout.'
    )
  }

  return ctx
}

export default ToastProvider
