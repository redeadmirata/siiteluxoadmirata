'use client'

import { useState } from 'react'

type NeonVariant = 'default' | 'solid' | 'ghost'
type NeonSize = 'sm' | 'default' | 'lg'
type NeonTone = 'light' | 'onDark'

interface NeonButtonProps {
  variant?: NeonVariant
  size?: NeonSize
  neon?: boolean
  tone?: NeonTone
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  title?: string
  className?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

const sizes: Record<NeonSize, React.CSSProperties> = {
  sm:      { padding: '5px 18px',  fontSize: 10 },
  default: { padding: '9px 28px',  fontSize: 11 },
  lg:      { padding: '13px 40px', fontSize: 12 },
}

export default function NeonButton({
  variant = 'default',
  size = 'default',
  neon = true,
  tone = 'light',
  children,
  href,
  target,
  rel,
  onClick,
  title,
  style = {},
  type = 'button',
}: NeonButtonProps) {
  const [hover, setHover] = useState(false)
  const onDark = tone === 'onDark'

  const variantStyle: React.CSSProperties = {
    default: {
      background: hover ? 'rgba(184,150,12,0)' : 'rgba(184,150,12,0.06)',
      border: '1px solid rgba(184,150,12,0.3)',
      color: onDark ? '#fff' : 'var(--color-ink)',
    },
    solid: {
      background: hover ? 'var(--color-gold-light)' : 'var(--color-gold)',
      border: '1px solid transparent',
      color: '#fff',
    },
    ghost: {
      background: hover
        ? onDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.04)'
        : 'transparent',
      border: `1px solid ${
        hover
          ? onDark ? 'rgba(255,255,255,0.5)' : 'var(--color-gold)'
          : onDark ? 'rgba(255,255,255,0.35)' : 'rgba(26,26,46,0.25)'
      }`,
      color: onDark ? '#fff' : 'var(--color-ink)',
    },
  }[variant]

  const base: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all .25s var(--ease-smooth)',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none',
    ...sizes[size],
    ...variantStyle,
    ...style,
  }

  const line: React.CSSProperties = {
    position: 'absolute',
    height: 1,
    left: 0,
    right: 0,
    width: '75%',
    margin: '0 auto',
    background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
    transition: 'opacity .5s ease-in-out',
    pointerEvents: 'none',
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        title={title}
        style={base}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {neon && variant !== 'solid' && (
          <span style={{ ...line, top: 0, opacity: hover ? 1 : 0 }} />
        )}
        {children}
        {neon && variant !== 'solid' && (
          <span style={{ ...line, bottom: -1, opacity: hover ? 0.3 : 0 }} />
        )}
      </a>
    )
  }

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      style={base}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {neon && variant !== 'solid' && (
        <span style={{ ...line, top: 0, opacity: hover ? 1 : 0 }} />
      )}
      {children}
      {neon && variant !== 'solid' && (
        <span style={{ ...line, bottom: -1, opacity: hover ? 0.3 : 0 }} />
      )}
    </button>
  )
}
