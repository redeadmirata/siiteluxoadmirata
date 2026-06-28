import Image from 'next/image'
import type { ClubeData } from '@/data/clube-verdant'

export default function ClubeHero({ data }: { data: ClubeData }) {
  return (
    <section
      aria-label="Grand Club Verdant"
      className="relative flex min-h-[82svh] items-end overflow-hidden bg-ink"
    >
      <Image
        src={data.hero.imagem}
        alt={data.hero.imagemAlt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070910] via-[#070910]/35 to-black/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="container-site relative z-10 pb-7 pt-32 sm:pb-9 lg:pb-11">
        <div className="max-w-2xl">
          <a
            href="#rotina-clube"
            className="mb-5 inline-flex items-center gap-3 border-b border-gold pb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold transition-colors hover:text-white"
          >
            {data.hero.ctaLabel}
            <span aria-hidden="true">↓</span>
          </a>
          <p className="max-w-2xl font-display text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.08] text-white drop-shadow-lg">
            {data.hero.subtitulo}
          </p>
        </div>
      </div>
    </section>
  )
}
