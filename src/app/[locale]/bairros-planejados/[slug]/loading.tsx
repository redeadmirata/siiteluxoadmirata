import { HeroSkeleton, ImovelGridSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-4/5 max-w-xl" />
          <ImovelGridSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
