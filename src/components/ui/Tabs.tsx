'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

// ─── Context ─────────────────────────────────────────────────────────────────

interface TabsContextValue {
  active: string
  setActive: (id: string) => void
  variant: 'underline' | 'pill'
}

const TabsContext = createContext<TabsContextValue>({
  active: '',
  setActive: () => {},
  variant: 'underline',
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface TabsProps {
  /** ID do tab ativo por padrão */
  defaultTab: string
  variant?: 'underline' | 'pill'
  children: ReactNode
  className?: string
}

/**
 * Tabs — navegação por abas editorial.
 *
 * @example
 * <Tabs defaultTab="detalhes">
 *   <Tabs.List>
 *     <Tabs.Tab id="detalhes">Detalhes</Tabs.Tab>
 *     <Tabs.Tab id="plantas">Plantas</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel id="detalhes"><FichaTecnica /></Tabs.Panel>
 *   <Tabs.Panel id="plantas"><PlantaViewer /></Tabs.Panel>
 * </Tabs>
 */
export function Tabs({ defaultTab, variant = 'underline', children, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div className={cn('flex flex-col gap-0', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// ─── Tabs.List ────────────────────────────────────────────────────────────────

function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  const { variant } = useContext(TabsContext)
  return (
    <div
      role="tablist"
      className={cn(
        'flex',
        variant === 'underline' && 'border-b border-stone-200/80 gap-0',
        variant === 'pill' && 'gap-2 flex-wrap',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Tabs.Tab ─────────────────────────────────────────────────────────────────

function TabsTab({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const { active, setActive, variant } = useContext(TabsContext)
  const isActive = active === id

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      onClick={() => setActive(id)}
      className={cn(
        'font-body text-sm tracking-widest uppercase transition-all duration-200 outline-none',
        variant === 'underline' && [
          'px-6 py-3 border-b-2 -mb-px',
          isActive
            ? 'border-gold text-ink font-medium'
            : 'border-transparent text-muted hover:text-ink hover:border-stone-300',
        ].join(' '),
        variant === 'pill' && [
          'px-5 py-2 border',
          isActive
            ? 'border-gold bg-gold text-white'
            : 'border-stone-300 text-muted hover:border-ink hover:text-ink',
        ].join(' '),
        className
      )}
    >
      {children}
    </button>
  )
}

// ─── Tabs.Panel ───────────────────────────────────────────────────────────────

function TabsPanel({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const { active } = useContext(TabsContext)
  if (active !== id) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      className={cn('pt-6 animate-fade-in', className)}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel

export default Tabs
