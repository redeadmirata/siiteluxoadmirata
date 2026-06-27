import { HeroSkeleton, ImovelGridSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <ImovelGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}
