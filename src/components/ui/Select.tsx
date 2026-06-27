import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  variant?: 'underline' | 'box'
}

/**
 * Select — dropdown editorial Admirata.
 *
 * @example
 * <Select
 *   label="Tipo de imóvel"
 *   placeholder="Selecione…"
 *   options={[
 *     { value: 'apartamento', label: 'Apartamento' },
 *     { value: 'cobertura', label: 'Cobertura' },
 *   ]}
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helper, placeholder, options, variant = 'underline', className, id, ...props },
    ref
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-body font-medium tracking-widest uppercase text-muted"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-transparent font-body text-text',
              'outline-none transition-colors duration-200 cursor-pointer pr-8',
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
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
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

Select.displayName = 'Select'
export default Select
