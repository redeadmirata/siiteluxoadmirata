'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

// ─── Context ─────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  open: string | null
  toggle: (id: string) => void
  multiple: boolean
  openItems: Set<string>
}

const AccordionContext = createContext<AccordionContextValue>({
  open: null,
  toggle: () => {},
  multiple: false,
  openItems: new Set(),
})

// ─── Accordion ───────────────────────────────────────────────────────────────

interface AccordionProps {
  /** Permite múltiplos itens abertos simultaneamente */
  multiple?: boolean
  /** Item aberto por padrão */
  defaultOpen?: string
  children: ReactNode
  className?: string
}

/**
 * Accordion — seção expansível editorial (FAQ, características, etc).
 *
 * @example
 * <Accordion>
 *   <Accordion.Item id="localizacao">
 *     <Accordion.Trigger>Localização</Accordion.Trigger>
 *     <Accordion.Content>
 *       <Text>Barra da Tijuca, próximo ao Shopping…</Text>
 *     </Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
export function Accordion({
  multiple = false,
  defaultOpen,
  children,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpen ? [defaultOpen] : [])
  )

  const toggle = (id: string) => {
    if (multiple) {
      setOpenItems((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      setOpen((prev) => (prev === id ? null : id))
    }
  }

  return (
    <AccordionContext.Provider value={{ open, toggle, multiple, openItems }}>
      <div className={cn('flex flex-col divide-y divide-stone-200/80', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ─── Accordion.Trigger ────────────────────────────────────────────────────────

function AccordionTrigger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  // Trigger estático — o id é gerenciado pelo Item pai (AccordionItemSelfContained).
  // Para um accordion interativo, use Accordion.Item com trigger prop.
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between py-5 px-0',
        'font-body text-left text-sm font-medium tracking-wide text-ink',
        'hover:text-gold transition-colors duration-200 outline-none',
        className
      )}
    >
      <span>{children}</span>
      <svg
        className="h-4 w-4 shrink-0 text-muted transition-transform duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

// ─── Accordion.Content ────────────────────────────────────────────────────────

function AccordionContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('pb-5 text-sm text-muted leading-relaxed font-body', className)}>
      {children}
    </div>
  )
}

// ─── Composto simplificado com ID por Item ────────────────────────────────────

/**
 * Versão simplificada com ID gerenciado internamente.
 * Item é self-contained: gerencia seu próprio estado aberto/fechado.
 */
function AccordionItemSelfContained({
  id,
  trigger,
  children,
  className,
  defaultOpen: _defaultOpen = false,
}: {
  id: string
  trigger: ReactNode
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  const { open, toggle, multiple, openItems } = useContext(AccordionContext)
  const isOpen = multiple ? openItems.has(id) : open === id

  return (
    <div className={cn('', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        onClick={() => toggle(id)}
        className="flex w-full items-center justify-between py-5 px-0 font-body text-left text-sm font-medium tracking-wide text-ink hover:text-gold transition-colors duration-200 outline-none"
      >
        <span>{trigger}</span>
        <svg
          className={cn(
            'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={`accordion-content-${id}`}
          role="region"
          className="pb-5 text-sm text-muted leading-relaxed font-body animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  )
}

Accordion.Item = AccordionItemSelfContained
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

export default Accordion
