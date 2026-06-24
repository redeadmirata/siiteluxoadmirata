import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
  /** Modo escuro — texto claro para uso sobre fundos dark */
  dark?: boolean
}

export default function BreadcrumbNav({ items, className = '', dark = false }: BreadcrumbNavProps) {
  const baseText = dark ? 'text-white/60' : 'text-muted'
  const activeText = dark ? 'text-white/90' : 'text-foreground'
  const hoverText = dark ? 'hover:text-gold' : 'hover:text-gold'

  // No mobile mostra só: Início / ... / [último item]
  const mobileItems = items.length > 2
    ? [items[0], { label: '…' }, items[items.length - 1]]
    : items

  return (
    <nav
      aria-label="Navegação estrutural"
      className={`text-xs tracking-wide ${baseText} ${className}`}
    >
      {/* Desktop: todos os itens */}
      <span className="hidden md:flex items-center gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-40" aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className={`${hoverText} transition-colors duration-200 uppercase`}>
                {item.label}
              </Link>
            ) : (
              <span className={`${activeText} uppercase truncate max-w-[240px]`} aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </span>

      {/* Mobile: início / … / título truncado */}
      <span className="flex md:hidden items-center gap-1.5 overflow-hidden">
        {mobileItems.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span className="opacity-40 flex-shrink-0" aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className={`${hoverText} transition-colors uppercase flex-shrink-0`}>
                {item.label}
              </Link>
            ) : (
              <span className={`${activeText} uppercase truncate`} aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </span>
    </nav>
  )
}
