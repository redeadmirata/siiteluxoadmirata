/**
 * Loading PDI — skeleton do imóvel individual.
 * Renderiza enquanto o Server Component busca dados do Sanity.
 */
import { HeroSkeleton, GaleriaSkeleton, FichaTecnicaSkeleton, CTASkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <HeroSkeleton />

      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-screen-xl px-6 py-4">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Conteúdo principal + sidebar */}
      <div className="mx-auto w-full max-w-screen-xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-12">
            {/* Título */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Galeria */}
            <GaleriaSkeleton />

            {/* Ficha técnica */}
            <FichaTecnicaSkeleton />

            {/* Storytelling */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <CTASkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
