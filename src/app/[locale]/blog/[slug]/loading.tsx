import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="flex flex-col gap-8">
        {/* Meta */}
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-28" />
        </div>
        {/* Title */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-4/5" />
        </div>
        {/* Subtitle */}
        <Skeleton className="h-5 w-3/4" />
        {/* Cover */}
        <Skeleton className="aspect-video w-full" />
        {/* Body */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 w-${i % 3 === 2 ? '3/4' : 'full'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
