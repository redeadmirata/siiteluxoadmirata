import { ImovelGridSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
        <ImovelGridSkeleton count={6} />
      </div>
    </div>
  )
}
