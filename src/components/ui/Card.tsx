import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 'default' → fundo branco, borda sutil, hover elevação
   * 'stone'   → fundo pedra, tom editorial
   * 'ink'     → fundo escuro (cards de destaque)
   * 'ghost'   → sem fundo, apenas borda
   */
  variant?: 'default' | 'stone' | 'ink' | 'ghost'
  /** Remove o padding interno */
  noPadding?: boolean
  /** Ativa estado de hover com elevação */
  hoverable?: boolean
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>
type CardBodyProps   = HTMLAttributes<HTMLDivElement>
type CardFooterProps = HTMLAttributes<HTMLDivElement>

const variants = {
  default: 'bg-white border border-stone-200/80',
  stone:   'bg-stone border border-stone-200/50',
  ink:     'bg-ink text-white border border-ink',
  ghost:   'bg-transparent border border-stone-200/80',
}

/**
 * Card — container genérico editorial.
 * Composto por Card + Card.Header + Card.Body + Card.Footer.
 *
 * @example
 * <Card hoverable>
 *   <Card.Header>
 *     <Heading size="md">Título</Heading>
 *   </Card.Header>
 *   <Card.Body>
 *     <Text>Conteúdo</Text>
 *   </Card.Body>
 * </Card>
 */
export function Card({
  variant = 'default',
  noPadding = false,
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        variants[variant],
        !noPadding && 'p-6',
        hoverable && 'transition-shadow duration-200 hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-stone-200/80', className)} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
