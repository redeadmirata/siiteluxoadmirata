'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@sanity/client'
import ImovelCard from '@/components/cards/ImovelCard'
import type { ImovelCard as ImovelCardType } from '@/types/sanity'

const STORAGE_KEY = 'admirata_favoritos'

const sanityClient = createClient({
  projectId: 'gvf51tpc',
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
})

function getFavoritosIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export default function FavoritosClient({ locale }: { locale: string }) {
  const t = useTranslations('favoritos')
  const [ids, setIds] = useState<string[]>([])
  const [imoveis, setImoveis] = useState<ImovelCardType[]>([])
  const [loading, setLoading] = useState(true)

  const localePrefix = locale === 'pt-BR' ? '' : `/${locale}`

  useEffect(() => {
    const current = getFavoritosIds()
    setIds(current)

    const onStorageChange = () => setIds(getFavoritosIds())
    window.addEventListener('admirata_favoritos_change', onStorageChange)
    return () => window.removeEventListener('admirata_favoritos_change', onStorageChange)
  }, [])

  useEffect(() => {
    if (ids.length === 0) {
      setImoveis([])
      setLoading(false)
      return
    }

    setLoading(true)
    sanityClient
      .fetch<ImovelCardType[]>(
        `*[_type == "imovel" && _id in $ids] {
          _id, titulo, slug, tipo, finalidade, mercado, status,
          exclusivo, permuta, novidade, precoSobConsulta,
          preco, areaUtil, quartos, suites, vagas, andar,
          bairro->{ _id, nome, slug, cidade, estado, mercado },
          "condominionome": condominioRef->nome,
          "imagemCapa": coalesce(imagens[arquivo.principal == true][0], imagens[0]).arquivo {
            asset->{ _id, url, metadata { lqip, dimensions } },
            hotspot, crop, alt
          }
        }`,
        { ids },
      )
      .then((data) => {
        setImoveis(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [ids])

  const limparTodos = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event('admirata_favoritos_change'))
    } catch {}
    setIds([])
    setImoveis([])
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
            {t('label')}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
            {t('title')}
          </h1>
          <div className="mt-4 w-12 h-px bg-gold" />
        </div>
        {ids.length > 0 && (
          <button
            onClick={limparTodos}
            className="text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors duration-200 self-start sm:self-end"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="aspect-card bg-stone" />
              <div className="pt-4 space-y-2">
                <div className="h-2 w-16 bg-stone rounded" />
                <div className="h-4 w-3/4 bg-stone rounded" />
                <div className="h-3 w-1/2 bg-stone rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : imoveis.length === 0 ? (
        <div className="text-center py-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="w-12 h-12 text-stone mx-auto mb-6"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="font-display text-xl text-ink mb-2">{t('empty')}</p>
          <p className="text-sm text-muted mb-8">{t('emptyDesc')}</p>
          <Link
            href={`${localePrefix}/imoveis`}
            className="inline-block text-[11px] uppercase tracking-[0.22em] border border-ink text-ink px-6 py-3 hover:bg-ink hover:text-white transition-colors duration-200"
          >
            {t('viewProperties')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {imoveis.map((imovel, i) => (
            <ImovelCard key={imovel._id} imovel={imovel} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  )
}
