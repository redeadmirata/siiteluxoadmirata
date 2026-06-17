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

  return (
    <nav
      aria-label="Navegação estrutural"
      className={`flex items-center gap-1.5 text-xs tracking-wide ${baseText} ${className}`}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="opacity-40" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={`${hoverText} transition-colors duration-200 uppercase`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`${activeText} uppercase`} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
