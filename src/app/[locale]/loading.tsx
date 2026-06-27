/**
 * Loading global — fallback para todas as rotas sem loading.tsx próprio.
 * Habilita Streaming SSR: o shell da página é enviado imediatamente,
 * o conteúdo é injetado via stream quando pronto.
 */
import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Placeholder de conteúdo genérico */}
      <div className="mx-auto w-full max-w-screen-xl px-6 py-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
