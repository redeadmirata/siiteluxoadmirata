import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Container } from './Container'
import { Heading } from './Heading'
import { Text } from './Text'
import { Button } from './Button'

interface CTAProps {
  /** Título principal */
  title: string
  /** Subtítulo ou descrição */
  description?: string
  /** Label do botão primário */
  primaryLabel?: string
  /** Href do botão primário */
  primaryHref?: string
  /** Label do botão secundário */
  secondaryLabel?: string
  /** Href do botão secundário */
  secondaryHref?: string
  /** Callback para onClick no botão primário */
  onPrimary?: () => void
  /** Callback para onClick no botão secundário */
  onSecondary?: () => void
  /**
   * 'dark'  → fundo ink, textos brancos (padrão — impactante)
   * 'light' → fundo stone, textos ink
   * 'gold'  → fundo gradiente com acento dourado
   */
  variant?: 'dark' | 'light' | 'gold'
  /** Conteúdo extra abaixo dos botões */
  children?: ReactNode
  className?: string
}

const variants = {
  dark:  'bg-ink text-white',
  light: 'bg-stone text-ink',
  gold:  'bg-gradient-to-br from-ink to-ink/90 text-white',
}

/**
 * CTA — seção Call-to-Action editorial.
 * Usada no rodapé de páginas, entre seções, em overlays.
 *
 * @example
 * <CTA
 *   title="Encontre seu imóvel ideal"
 *   description="Mais de 200 imóveis exclusivos no Rio de Janeiro."
 *   primaryLabel="Ver imóveis"
 *   primaryHref="/imoveis"
 *   secondaryLabel="Falar com consultor"
 *   secondaryHref="/contato"
 * />
 */
export function CTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onPrimary,
  onSecondary,
  variant = 'dark',
  children,
  className,
}: CTAProps) {
  const isLight = variant === 'light'

  return (
    <section className={cn(variants[variant], 'py-[clamp(4rem,8vw,8rem)]', className)}>
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Ornamento dourado */}
          <div className="h-px w-12 bg-gold/60" aria-hidden />

          <div className="flex flex-col gap-4 max-w-2xl">
            <Heading
              size="2xl"
              color={isLight ? 'ink' : 'white'}
              font="display"
            >
              {title}
            </Heading>

            {description && (
              <Text
                size="lg"
                color={isLight ? 'muted' : 'inherit'}
                className={!isLight ? 'text-white/70' : ''}
              >
                {description}
              </Text>
            )}
          </div>

          {(primaryLabel || secondaryLabel) && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {primaryLabel && (
                <Button
                  as={primaryHref ? 'a' : 'button'}
                  href={primaryHref}
                  onClick={onPrimary}
                  variant={isLight ? 'primary' : 'white'}
                  size="lg"
                >
                  {primaryLabel}
                </Button>
              )}
              {secondaryLabel && (
                <Button
                  as={secondaryHref ? 'a' : 'button'}
                  href={secondaryHref}
                  onClick={onSecondary}
                  variant={isLight ? 'outline' : 'gold'}
                  size="lg"
                >
                  {secondaryLabel}
                </Button>
              )}
            </div>
          )}

          {children}
        </div>
      </Container>
    </section>
  )
}

export default CTA
