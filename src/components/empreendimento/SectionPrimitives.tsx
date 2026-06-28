'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { clipReveal, revealUp, VIEWPORT_ONCE } from './anim'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <m.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={{ delay }}
      className={className}
    >
      {children}
    </m.div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold">
      <span className="bg-gold/60 h-px w-8" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionTitle({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <m.h2
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className={`font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] ${light ? 'text-white' : 'text-ink'}`}
    >
      {children}
    </m.h2>
  )
}

export function SectionShell({
  id,
  children,
  dark = false,
  className = '',
}: {
  id: string
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 ${dark ? 'bg-ink text-white' : 'bg-stone/30'} ${className}`}
    >
      <div className="container-site">{children}</div>
    </section>
  )
}

export function ParallaxImage({ src, alt, lqip }: { src: string; alt: string; lqip?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <div ref={ref} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
      <m.div className="absolute inset-0" style={prefersReduced ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="scale-110 object-cover"
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
        />
      </m.div>
    </div>
  )
}
