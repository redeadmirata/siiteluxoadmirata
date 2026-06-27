/**
 * Skeleton — componente base para loading states.
 * Uso: <Skeleton className="h-10 w-full" />
 */
import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-stone-200/70',
        className
      )}
    />
  )
}

/** Skeleton de card de imóvel */
export function ImovelCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

/** Grid de cards skeleton */
export function ImovelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ImovelCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Skeleton do hero cinematico */
export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute bottom-12 left-12 flex flex-col gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-14 w-[500px]" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
  )
}

/** Skeleton da ficha técnica */
export function FichaTecnicaSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Skeleton da galeria */
export function GaleriaSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className={cn('w-full', i === 0 ? 'aspect-[16/9] col-span-2 md:col-span-2' : 'aspect-square')} />
      ))}
    </div>
  )
}

/** Skeleton da sidebar CTA */
export function CTASkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 border border-stone-200">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-10 w-full mt-2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

/** Skeleton de página de bairro (hero + grid) */
export function BairroPageSkeleton() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <ImovelGridSkeleton count={9} />
      </div>
    </div>
  )
}
