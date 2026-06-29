import Image from 'next/image'
import type { ClubeData } from '@/data/clube-verdant'

export default function ClubeGallery({ galeria = [] }: { galeria?: ClubeData['galeria'] }) {
  if (galeria.length === 0) return null

  return (
    <section
      aria-labelledby="clube-gallery-title"
      className="bg-[#070910] py-24 text-white sm:py-32"
    >
      <div className="container-site">
        <p className="text-[10px] uppercase tracking-[0.38em] text-gold">Atmosfera</p>
        <h3
          id="clube-gallery-title"
          className="mt-5 font-display text-5xl font-light text-white sm:text-6xl"
        >
          Um resort à porta de casa
        </h3>
        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {galeria.map((imagem, index) => {
            const destaque = index === 0 || index === 3
            return (
              <figure
                key={imagem.src}
                className={`group relative overflow-hidden rounded-sm ${destaque ? 'lg:col-span-8 lg:row-span-2' : 'lg:col-span-4'}`}
              >
                <Image
                  src={imagem.src}
                  alt={imagem.alt}
                  fill
                  loading="lazy"
                  sizes={
                    destaque ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-50" />
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
