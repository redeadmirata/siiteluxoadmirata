'use client'

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type ElementType,
  type ButtonHTMLAttributes,
} from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from '@/components/icons'

// ─── Context ─────────────────────────────────────────────────────────────────

interface DropdownContextValue {
  open:    boolean
  setOpen: (v: boolean) => void
  toggle:  () => void
}

const DropdownContext = createContext<DropdownContextValue>({
  open:    false,
  setOpen: () => {},
  toggle:  () => {},
})

// ─── Dropdown (raiz) ──────────────────────────────────────────────────────────

interface DropdownProps {
  children:   ReactNode
  className?: string
  /** Abre o menu à esquerda do trigger (padrão: direita) */
  alignLeft?: boolean
}

/**
 * Dropdown — menu suspenso composable.
 * Fecha ao clicar fora (click outside) e no Escape.
 *
 * @example
 * <Dropdown>
 *   <Dropdown.Trigger>Ordenar</Dropdown.Trigger>
 *   <Dropdown.Menu>
 *     <Dropdown.Item onClick={() => setSort('preco-asc')}>
 *       Menor preço
 *     </Dropdown.Item>
 *     <Dropdown.Item onClick={() => setSort('preco-desc')}>
 *       Maior preço
 *     </Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 */
export function Dropdown({ children, className, alignLeft }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggle }}>
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        data-align-left={alignLeft || undefined}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// ─── Dropdown.Trigger ─────────────────────────────────────────────────────────

interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  /** Exibe a seta chevron (padrão: true) */
  showChevron?: boolean
}

function DropdownTrigger({
  as,
  showChevron = true,
  className,
  children,
  ...props
}: DropdownTriggerProps) {
  const { toggle, open } = useContext(DropdownContext)
  const Tag = (as ?? 'button') as ElementType

  return (
    <Tag
      type={as ? undefined : 'button'}
      aria-haspopup="true"
      aria-expanded={open}
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-2',
        'font-body text-sm tracking-wide text-ink',
        'transition-colors duration-150 outline-none cursor-pointer',
        'hover:text-gold focus-visible:text-gold',
        className
      )}
      {...props}
    >
      {children}
      {showChevron && (
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-muted transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      )}
    </Tag>
  )
}

// ─── Dropdown.Menu ────────────────────────────────────────────────────────────

interface DropdownMenuProps {
  children:   ReactNode
  className?: string
  /** Alinha o menu à direita do trigger (padrão: esquerda) */
  alignRight?: boolean
}

function DropdownMenu({ children, className, alignRight }: DropdownMenuProps) {
  const { open } = useContext(DropdownContext)

  if (!open) return null

  return (
    <div
      role="menu"
      className={cn(
        // layout
        'absolute top-full z-[50] mt-2 min-w-[180px]',
        alignRight ? 'right-0' : 'left-0',
        // visual
        'bg-white border border-stone-200/80 shadow-lg',
        'py-1',
        // animação
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Dropdown.Item ────────────────────────────────────────────────────────────

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  href?: string
  /** Exibe linha divisória acima do item */
  divider?: boolean
  /** Item destrutivo (texto vermelho) */
  danger?: boolean
}

function DropdownItem({
  as,
  href,
  divider,
  danger,
  className,
  children,
  onClick,
  ...props
}: DropdownItemProps) {
  const { setOpen } = useContext(DropdownContext)
  const Tag = (as ?? (href ? 'a' : 'button')) as ElementType

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setOpen(false) // fecha ao selecionar
  }

  return (
    <>
      {divider && <hr className="my-1 border-stone-200/80" />}
      <Tag
        type={as || href ? undefined : 'button'}
        role="menuitem"
        href={href}
        onClick={handleClick}
        className={cn(
          // layout
          'flex w-full items-center gap-2 px-4 py-2.5',
          // tipografia
          'font-body text-sm text-left',
          danger ? 'text-red-600' : 'text-ink',
          // interação
          'transition-colors duration-100 outline-none cursor-pointer',
          'hover:bg-stone focus-visible:bg-stone',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    </>
  )
}

// ─── Dropdown.Separator ───────────────────────────────────────────────────────

function DropdownSeparator({ className }: { className?: string }) {
  return <hr className={cn('my-1 border-stone-200/80', className)} />
}

// ─── Composto ────────────────────────────────────────────────────────────────

Dropdown.Trigger   = DropdownTrigger
Dropdown.Menu      = DropdownMenu
Dropdown.Item      = DropdownItem
Dropdown.Separator = DropdownSeparator

export default Dropdown
