import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  variant?: 'underline' | 'box'
  /** Auto-resize conforme conteúdo */
  autoResize?: boolean
}

/**
 * Textarea — campo de texto multilinha editorial.
 *
 * @example
 * <Textarea label="Mensagem" rows={4} placeholder="Descreva o que procura…" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, variant = 'box', autoResize, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-body font-medium tracking-widest uppercase text-muted"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={props.rows ?? 4}
          className={cn(
            'w-full bg-transparent font-body text-text placeholder:text-muted',
            'outline-none transition-colors duration-200 resize-none',
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
            autoResize && 'field-sizing-content',
            className
          )}
          {...props}
        />

        {(error || helper) && (
          <p className={cn('text-xs font-body', error ? 'text-red-500' : 'text-muted')}>
            {error ?? helper}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
