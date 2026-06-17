'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

/**
 * Wrapper que oculta a Navbar em rotas do Sanity Studio.
 * Usado no root layout para não interferir com a UI do Studio.
 */
export default function NavbarWrapper() {
  const pathname = usePathname()

  // Não renderiza navbar dentro do Sanity Studio
  if (pathname?.startsWith('/studio')) return null

  return <Navbar />
}
