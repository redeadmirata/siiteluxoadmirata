'use client'

/**
 * AppProviders — composição central de todos os providers da Admirata.
 *
 * Ordem de aninhamento (outer → inner):
 *   ThemeProvider      — aplica data-theme e classe .dark no <html>
 *     QueryProvider    — TanStack Query v5 para data fetching client-side
 *       MotionProvider — LazyMotion + AnimatePresence global
 *         AnalyticsProvider — consent state + cookie banner
 *           FavoritesProvider — estado de favoritos (localStorage)
 *             {children}
 *
 * Regras:
 * - NUNCA adicionar providers diretamente nos layouts.
 * - SEMPRE adicionar aqui e compor.
 * - A ordem importa: QueryProvider precisa estar acima de qualquer hook
 *   que use useQuery; MotionProvider acima de qualquer <m.div>.
 *
 * Para o ThemeScript (evita FOUC), adicionar no <head> do [locale]/layout.tsx:
 *   import { ThemeScript } from '@/providers/ThemeProvider'
 *   <head><ThemeScript /></head>
 */

import type { ReactNode } from 'react'
import { ThemeProvider }     from './ThemeProvider'
import { QueryProvider }     from './QueryProvider'
import { MotionProvider }    from './MotionProvider'
import { AnalyticsProvider } from './AnalyticsProvider'
import { FavoritesProvider } from './FavoritesProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MotionProvider>
          <AnalyticsProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </AnalyticsProvider>
        </MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

// Re-exports para facilitar imports nos componentes
export { useTheme, ThemeScript }        from './ThemeProvider'
export { useConsent }                   from './AnalyticsProvider'
export { useReducedMotion, VARIANTS, TRANSITION_DEFAULT, TRANSITION_FAST, STAGGER_CONTAINER } from './MotionProvider'
export { useFavoritesContext }          from './FavoritesProvider'
