import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { cn } from '@/utils/cn'

interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt: string
  /**
   * 'cover'    → object-cover (padrão — preenche o container)
   * 'contain'  → object-contain
   * 'fill-abs' → position:absolute fill (requer parent com position:relative)
   */
  fit?: 'cover' | 'contain' | 'fill-abs'
  /** Aspecto fixo (container wrapper) */
  aspect?: 'square' | 'video' | 'card' | 'portrait' | 'cinema'
  /** Rounded */
  rounded?: boolean
  /** Mostra skeleton até carregar */
  withSkeleton?: boolean
  wrapperClassName?: string
}

const aspects = {
  square:   'aspect-square',
  video:    'aspect-video',
  card:     'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
  cinema:   'aspect-[21/9]',
}

const fits = {
  cover:    'object-cover',
  contain:  'object-contain',
  'fill-abs': '',
}

/**
 * Image — wrapper sobre next/image com defaults do design system.
 *
 * @example
 * <Image src={url} alt="Sala" aspect="card" quality={85} />
 * <Image src={url} alt="Hero" fit="fill-abs" fill />
 */
export function Image({
  alt,
  fit = 'cover',
  aspect,
  rounded = false,
  wrapperClassName,
  className,
  ...props
}: ImageProps) {
  const isFillMode = props.fill || fit === 'fill-abs'

  const img = (
    <NextImage
      alt={alt}
      quality={props.quality ?? 85}
      sizes={props.sizes ?? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'}
      className={cn(
        !isFillMode && fits[fit],
        isFillMode && 'absolute inset-0 h-full w-full object-cover',
        rounded && 'rounded-sm',
        className
      )}
      {...props}
    />
  )

  // Se aspect especificado, envolve em container com aspect-ratio
  if (aspect) {
    return (
      <div className={cn('relative overflow-hidden', aspects[aspect], rounded && 'rounded-sm', wrapperClassName)}>
        {isFillMode ? img : (
          <NextImage
            alt={alt}
            fill
            quality={props.quality ?? 85}
            sizes={props.sizes ?? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'}
            className={cn('object-cover', className)}
            {...props}
          />
        )}
      </div>
    )
  }

  return img
}

export default Image
