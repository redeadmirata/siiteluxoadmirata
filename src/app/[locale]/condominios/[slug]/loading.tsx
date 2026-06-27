import { HeroSkeleton, ImovelGridSkeleton, FichaTecnicaSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <FichaTecnicaSkeleton />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-40" />
              <ImovelGridSkeleton count={3} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
