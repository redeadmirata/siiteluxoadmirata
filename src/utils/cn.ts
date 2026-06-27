import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Mescla classes Tailwind sem conflitos.
 * Substitui as concatenações manuais de template string nos componentes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-gold', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
