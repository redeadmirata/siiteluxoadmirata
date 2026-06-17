import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Helpers de navegação locale-aware.
 * Use estes em vez de next/navigation para links internos.
 *
 * Importar:
 *   import { Link, redirect, usePathname, useRouter } from '@/i18n/navigation'
 */
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing)
