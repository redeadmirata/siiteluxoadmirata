'use client'

interface ElegantShapeProps {
  delay?: number
  width?: number
  height?: number
  rotate?: number
  color?: string
  pos?: React.CSSProperties
}

/**
 * Forma oval flutuante com entrada animada e flutuação contínua.
 * Adaptado do design HeroGeometric (Kokonut) para a identidade Admirata.
 * Respeita prefers-reduced-motion via CSS (@keyframes com fallback).
 */
export default function ElegantShape({
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  color = 'rgba(184,150,12,0.15)',
  pos = {},
}: ElegantShapeProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...pos,
        animation: `adm-shape-enter 2.4s cubic-bezier(.23,.86,.39,.96) ${delay}s both`,
      }}
    >
      <div
        style={{
          animation: `adm-shape-float ${10 + delay * 2}s ease-in-out ${delay * 1.5}s infinite`,
        }}
      >
        <div
          style={{
            width,
            height,
            transform: `rotate(${rotate}deg)`,
            borderRadius: '50%',
            background: `linear-gradient(to right, ${color}, transparent)`,
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 8px 32px rgba(255,255,255,0.04)',
          }}
        />
      </div>
    </div>
  )
}
