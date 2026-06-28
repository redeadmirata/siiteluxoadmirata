import Image from 'next/image'
import type { ClubeData } from '@/data/clube-verdant'

export function ClubeIntro({ data }: { data: ClubeData }) {
  return (
    <section className="bg-white py-24 text-ink sm:py-32">
      <div className="container-site grid items-start gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
        <div className="flex flex-col items-center lg:items-start">
          <Image
            src="/images/clube-verdant/logo-clube.png"
            alt="Grand Club Verdant"
            width={320}
            height={320}
            className="h-auto w-56 sm:w-64"
          />
          <div className="border-ink/10 mt-10 border-t pt-7 text-center lg:text-left">
            <p className="text-[10px] uppercase tracking-[0.38em] text-gold">Clube exclusivo</p>
            <p className="mt-4 font-display text-5xl font-light leading-none text-gold sm:text-6xl">
              +{data.areaLazerM2.toLocaleString('pt-BR')} m²
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#5f6372]">
              dedicados ao esporte, à convivência e ao bem-estar dos moradores.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {data.intro.paragrafos.map((paragrafo, index) => (
            <p
              key={paragrafo}
              className={
                index === 0
                  ? 'font-display text-3xl font-light leading-snug text-ink sm:text-4xl'
                  : 'max-w-3xl text-base leading-relaxed text-[#4f5363] sm:text-lg'
              }
            >
              {paragrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ClubeRotina({ data }: { data: ClubeData }) {
  return (
    <section id="rotina-clube" className="bg-[#070910] py-24 text-white sm:py-32">
      <div className="container-site grid grid-cols-1 gap-y-8 min-[901px]:grid-cols-[minmax(0,1fr)_1px_minmax(0,0.92fr)] min-[901px]:items-stretch min-[901px]:gap-x-[clamp(32px,4vw,64px)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.38em] text-gold">Todos os dias</p>
          <h3 className="mt-5 max-w-xl font-display text-4xl font-light leading-[0.98] text-white sm:text-5xl">
            {data.rotina.titulo}
          </h3>
          <figure className="relative mt-10 aspect-[16/10] overflow-hidden border border-white/10 bg-white/5">
            <Image
              src="/images/clube-verdant/vista-aerea-clube.jpg"
              alt="Vista aérea das piscinas, quadras esportivas e áreas verdes do Grand Club Verdant"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </figure>
        </div>
        <div
          aria-hidden="true"
          className="hidden min-h-[500px] w-px self-stretch bg-white/30 min-[901px]:block"
        />
        <div className="m-0 max-w-none space-y-5 py-0 min-[901px]:flex min-[901px]:max-w-[560px] min-[901px]:flex-col min-[901px]:justify-center min-[901px]:self-stretch min-[901px]:py-[clamp(24px,4vw,48px)]">
          {data.rotina.paragrafos.map((paragrafo) => (
            <p key={paragrafo} className="text-base leading-relaxed text-white/75 sm:text-lg">
              {paragrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ClubeFechamento({ data, whatsappHref }: { data: ClubeData; whatsappHref: string }) {
  return (
    <section className="relative overflow-hidden bg-[#070910] py-24 text-white sm:py-36">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(184,150,12,0.12),transparent_65%)]" />
      <div className="container-site relative">
        <p className="text-[10px] uppercase tracking-[0.38em] text-gold">Um estilo de vida</p>
        <h3 className="mt-5 max-w-4xl font-display text-5xl font-light leading-[0.98] sm:text-7xl">
          {data.copyEmocional.titulo}
        </h3>
        <div className="mt-10 grid max-w-5xl gap-5 text-base leading-relaxed text-white/60 md:grid-cols-2">
          {data.copyEmocional.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-[var(--color-gold-light)]"
        >
          Conhecer oportunidades no Verdant
        </a>
      </div>
    </section>
  )
}
