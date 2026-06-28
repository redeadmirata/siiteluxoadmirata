import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import ClubeSection from '@/components/clube/ClubeSection'
import CondominioFaqs from '@/components/empreendimento/CondominioFaqs'
import EmpreendimentoLanding from '@/components/empreendimento/EmpreendimentoLanding'
import CondominioUnits from '@/components/empreendimento/CondominioUnits'
import { getClubePorCondominio } from '@/data/condominios'
import { routing } from '@/i18n/routing'
import {
  buildCondominioJsonLd,
  buildCondominioMetadata,
  buildEmpreendimentoData,
} from '@/lib/condominios/presentation'
import {
  getCondominioBySlug,
  getCondominioPageData,
  getCondominioSlugs,
} from '@/services/condominios'

export const revalidate = 3600
export const dynamicParams = true

interface PageProps {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  const slugs = await getCondominioSlugs()

  return routing.locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const condominio = await getCondominioBySlug(params.slug)
  return condominio ? buildCondominioMetadata(condominio, params.locale, params.slug) : {}
}

export default async function CondominioPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const { condominio, imoveis } = await getCondominioPageData(params.slug)
  if (!condominio) notFound()

  const clube = getClubePorCondominio(params.slug)
  const landingData = buildEmpreendimentoData(condominio, params.locale)
  const jsonLd = buildCondominioJsonLd(condominio, params.locale, params.slug, clube)

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EmpreendimentoLanding data={landingData} />
      {clube && <ClubeSection data={clube} whatsappHref={landingData.whatsappHref} />}
      <CondominioUnits imoveis={imoveis} />
      <CondominioFaqs faqs={condominio.faqs} condominiosProximos={condominio.condominiosProximos} />
    </main>
  )
}
