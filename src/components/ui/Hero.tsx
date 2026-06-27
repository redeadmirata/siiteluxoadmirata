import type { ReactNode } from 'react'
import NextImage from 'next/image'
import { cn } from '@/utils/cn'

interface HeroProps {
  /** URL da imagem de fundo */
  image?: string
  /** Altura do hero */
  height?: 'screen' | 'lg' | 'md' | 'sm'
  /** Sobreposição escura sobre a imagem */
  overlay?: boolean
  overlayIntensity?: 'light' | 'medium' | 'heavy'
  children?: ReactNode
  /** Alinhamento do conteúdo */
  align?: 'left' | 'center' | 'right'
  className?: string
}

const heights = {
  screen: 'min-h-screen',
  lg:     'min-h-[80vh]',
  md:     'min-h-[60vh]',
  sm:     'min-h-[40vh]',
}

const overlayIntensities = {
  light:  'bg-ink/30',
  medium: 'bg-ink/55',
  heavy:  'bg-ink/75',
}

const aligns = {
  left:   'items-start text-left',
  center: 'items-center text-center',
  right:  'items-end text-right',
}

/**
 * Hero — seção hero genérica com imagem de fundo, overlay e slot de conteúdo.
 * Para o hero cinematico da PDI, use HeroCinematico (GSAP).
 *
 * @example
 * <Hero image={urlCapa} height="screen" overlay>
 *   <Heading size="3xl" color="white">Imóveis de Luxo</Heading>
 *   <Button variant="white" size="lg">Explorar</Button>
 * </Hero>
 */
export function Hero({
  image,
  height = 'lg',
  overlay = true,
  overlayIntensity = 'medium',
  children,
  align = 'left',
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative flex w-full overflow-hidden',
        heights[height],
        !image && 'bg-ink',
        className
      )}
    >
      {/* Background Image */}
      {image && (
        <NextImage
          src={image}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className={cn('absolute inset-0', overlayIntensities[overlayIntensity])}
          aria-hidden
        />
      )}

      {/* Conteúdo */}
      {children && (
        <div
          className={cn(
            'relative z-10 flex flex-col justify-end w-full',
            'px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(3rem,6vw,6rem)]',
            aligns[align]
          )}
        >
          {children}
        </div>
      )}
    </section>
  )
}

export default Hero
