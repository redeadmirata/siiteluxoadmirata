import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/client'
import {
  IMOVEIS_DESTAQUE_QUERY,
  IMOVEIS_CARD_QUERY,
  BAIRROS_QUERY,
  CONDOMINIOS_DESTAQUE_QUERY,
} from '@/sanity/queries'
import type { ImovelCard, Bairro, CondominioCard } from '@/types/sanity'
import HeroHome from '@/components/home/HeroHome'
import ScrollExpandMedia from '@/components/home/ScrollExpandMedia'
import VideoHeroScroll from '@/components/home/VideoHeroScroll'
import CidadesDestaque from '@/components/home/CidadesDestaque'
import PropertyShowcase from '@/components/home/PropertyShowcase'
import ImoveisDestaque from '@/components/home/ImoveisDestaque'
import BarraDestaque from '@/components/home/BarraDestaque'
import BairrosGrid from '@/components/home/BairrosGrid'
import CondominiosDestaque from '@/components/home/CondominiosDestaque'

export const revalidate = 60

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  'pt-BR': {
    title: 'Admirata Imóveis | Imóveis de Alto Padrão — Rio de Janeiro e Serra Gaúcha',
    description: 'Imóveis de luxo e alto padrão na Barra da Tijuca, Recreio, Leblon, Ipanema, Jacarepaguá e Serra Gaúcha. Coberturas, apartamentos e casas exclusivas.',
  },
  en: {
    title: 'Admirata Properties | Luxury Real Estate — Rio de Janeiro & Serra Gaúcha',
    description: 'Luxury and premium real estate in Barra da Tijuca, Recreio, Leblon, Ipanema and Serra Gaúcha. Penthouses, apartments and exclusive homes.',
  },
  fr: {
    title: "Admirata Immobilier | Immobilier de Prestige — Rio de Janeiro & Serra Gaúcha",
    description: "Immobilier de luxe et de prestige à Barra da Tijuca, Recreio, Leblon, Ipanema et Serra Gaúcha. Penthouses, appartements et maisons exclusives.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const meta = META_BY_LOCALE[params.locale] ?? META_BY_LOCALE['pt-BR']
  return { title: { absolute: meta.title }, description: meta.description }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  setRequestLocale(params.locale)

  const [imoveisDestaque, bairros, condominios] = await Promise.all([
    client.fetch<ImovelCard[]>(IMOVEIS_DESTAQUE_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch<Bairro[]>(BAIRROS_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<CondominioCard[]>(CONDOMINIOS_DESTAQUE_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  // Fallback: se nenhum imóvel tem destaque=true, mostra os mais recentes
  let imoveis = imoveisDestaque
  if (imoveis.length === 0) {
    const recentes = await client.fetch<ImovelCard[]>(
      IMOVEIS_CARD_QUERY,
      {},
      { next: { revalidate: 60 } },
    )
    imoveis = recentes.slice(0, 6)
  }

  return (
    <main id="main-content">
      <HeroHome />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://www.youtube.com/embed/dvQXRyfHmTY"
        bgImageSrc="/images/background-luxo.jpg"
        title="ADMIRATA EXCLUSIVO"
        date="2026"
        scrollToExpand="Deslize para descobrir"
        textBlend
      >
        <div className="flex flex-col items-center justify-center text-center px-8">
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              color: 'var(--color-gold, #b8960c)',
              letterSpacing: '0.12em',
              marginBottom: '1.5rem',
            }}
          >
            A Essência do Luxo
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.72)',
              maxWidth: '38rem',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
              fontWeight: 300,
              lineHeight: 1.78,
            }}
          >
            Bem-vindo à Admirata. Mais do que imóveis, entregamos uma experiência
            desenhada sob medida para quem exige a perfeição em cada detalhe.
          </p>
        </div>
      </ScrollExpandMedia>
      <VideoHeroScroll />
      <CidadesDestaque />
      <PropertyShowcase />
      <ImoveisDestaque imoveis={imoveis} />
      <BarraDestaque />
      <CondominiosDestaque condominios={condominios} />
      <BairrosGrid bairros={bairros} />
    </main>
  )
}
