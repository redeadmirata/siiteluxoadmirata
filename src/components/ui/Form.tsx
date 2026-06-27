'use client'

import {
  createContext,
  useContext,
  type FormHTMLAttributes,
  type HTMLAttributes,
} from 'react'
import { cn } from '@/utils/cn'

// ─── Context ─────────────────────────────────────────────────────────────────

interface FormContextValue {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

const FormContext = createContext<FormContextValue>({
  isSubmitting: false,
  isSuccess: false,
  error: null,
})

export function useFormContext() {
  return useContext(FormContext)
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  isSubmitting?: boolean
  isSuccess?: boolean
  error?: string | null
  /** Mensagem de sucesso após envio */
  successMessage?: string
}

/**
 * Form — wrapper de formulário com context e feedback de estado.
 *
 * @example
 * <Form onSubmit={handleSubmit} isSubmitting={loading} error={error}>
 *   <Form.Field>
 *     <Input label="Nome" />
 *   </Form.Field>
 *   <Form.Actions>
 *     <Button type="submit" loading={loading}>Enviar</Button>
 *   </Form.Actions>
 * </Form>
 */
export function Form({
  isSubmitting = false,
  isSuccess = false,
  error = null,
  successMessage = 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
  className,
  children,
  ...props
}: FormProps) {
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center border border-gold/30">
          <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-body text-sm text-muted">{successMessage}</p>
      </div>
    )
  }

  return (
    <FormContext.Provider value={{ isSubmitting, isSuccess, error }}>
      <form
        className={cn('flex flex-col gap-6', className)}
        noValidate
        {...props}
      >
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs text-red-600 font-body">{error}</p>
          </div>
        )}
        {children}
      </form>
    </FormContext.Provider>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormField({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {children}
    </div>
  )
}

function FormRow({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', className)} {...props}>
      {children}
    </div>
  )
}

function FormActions({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-4 pt-2', className)} {...props}>
      {children}
    </div>
  )
}

Form.Field = FormField
Form.Row = FormRow
Form.Actions = FormActions

export default Form
