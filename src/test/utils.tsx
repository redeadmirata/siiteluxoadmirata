/**
 * Utilitários de teste — Admirata
 *
 * Re-exporta render do @testing-library/react com providers
 * globais pré-configurados (ThemeProvider, QueryProvider).
 *
 * Uso:
 *   import { render, screen } from '@/test/utils'
 *   render(<MeuComponente />)
 */
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ─── Providers mínimos para testes ────────────────────────────────────────────

function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = makeTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// ─── Custom render ────────────────────────────────────────────────────────────

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// ─── Setup userEvent ──────────────────────────────────────────────────────────

function setup(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return {
    user: userEvent.setup(),
    ...customRender(ui, options),
  }
}

export * from '@testing-library/react'
export { customRender as render, setup }
