import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import FavoritosClient from './FavoritosClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function FavoritosPage({
  params,
}: {
  params: { locale: string }
}) {
  setRequestLocale(params.locale)

  return (
    <main id="main-content">
      <FavoritosClient locale={params.locale} />
    </main>
  )
}
