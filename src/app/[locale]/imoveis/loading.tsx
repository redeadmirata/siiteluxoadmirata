import { ImovelGridSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-24">
      <div className="flex flex-col gap-10">
        {/* Header da listagem */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-72" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        {/* Filtros */}
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
        {/* Grid */}
        <ImovelGridSkeleton count={9} />
      </div>
    </div>
  )
}
