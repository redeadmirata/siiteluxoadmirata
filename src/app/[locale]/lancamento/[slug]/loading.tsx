import { HeroSkeleton, GaleriaSkeleton, FichaTecnicaSkeleton, CTASkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-screen-xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <GaleriaSkeleton />
            <FichaTecnicaSkeleton />
          </div>
          <div className="flex flex-col gap-6 pt-2">
            <CTASkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
