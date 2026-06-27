'use client'

/**
 * QueryProvider — TanStack React Query v5
 *
 * Configura o QueryClient com padrões otimizados para o projeto:
 * - staleTime alto (dados do Sanity mudam pouco)
 * - retry reduzido (falhas de rede não devem bloquear UX)
 * - refetchOnWindowFocus desabilitado (site de listagem, não dashboard)
 *
 * Instalar antes de usar:
 *   npm install @tanstack/react-query
 *
 * Uso:
 *   import { useQuery } from '@tanstack/react-query'
 *   const { data } = useQuery({ queryKey: ['imovel', slug], queryFn: () => getImovelPDI(slug) })
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

// ─── Config padrão ────────────────────────────────────────────────────────────

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * 5 minutos — dados do Sanity têm revalidação ISR, não mudam em tempo real.
         * Para busca/filtros em tempo real reduzir para 30_000.
         */
        staleTime: 5 * 60 * 1_000,
        /**
         * 10 minutos de cache antes de garbage collect.
         */
        gcTime: 10 * 60 * 1_000,
        /**
         * Retry só uma vez para falhas de rede genuínas.
         * Evita bloquear UX em caso de Sanity throttling.
         */
        retry: 1,
        retryDelay: 1_000,
        /**
         * Não refetch ao focar janela — UX de imobiliária, não dashboard.
         */
        refetchOnWindowFocus: false,
        /**
         * Refetch quando voltar online.
         */
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

// ─── Singleton para SSR — evita criar múltiplas instâncias durante streaming ──

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // SSR: sempre criar novo client por request
    return makeQueryClient()
  }
  // Client: reutilizar singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function QueryProvider({ children }: { children: ReactNode }) {
  /**
   * useState garante que o client não seja recriado em re-renders.
   * Inicialização lazy via função evita criação na renderização do servidor.
   */
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
