'use client'

/**
 * AnalyticsProvider — Meta Pixel + Google Analytics 4
 *
 * Migrado de components/analytics/AnalyticsProvider para providers/
 * para ficar na composição central de AppProviders.
 *
 * Funcionalidades:
 * - Cookie consent com estado persistido
 * - Ativa/desativa GA e Pixel conforme consent
 * - Expõe ConsentContext para componentes consultarem o estado
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import CookieBanner from '@/components/analytics/CookieBanner'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConsentState = 'granted' | 'denied' | 'pending'

interface ConsentContextValue {
  consent: ConsentState
  hasConsent: boolean
  grantConsent: () => void
  denyConsent: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'admirata_cookie_consent'

// ─── Context ──────────────────────────────────────────────────────────────────

const ConsentContext = createContext<ConsentContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>('pending')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'granted' | 'denied' | null
    if (stored === 'granted' || stored === 'denied') {
      setConsent(stored)
    }
  }, [])

  const grantConsent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'granted')
    setConsent('granted')
  }, [])

  const denyConsent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'denied')
    setConsent('denied')
  }, [])

  const hasConsent = consent === 'granted'

  return (
    <ConsentContext.Provider value={{ consent, hasConsent, grantConsent, denyConsent }}>
      {/* Scripts de tracking — só montam com consent */}
      <GoogleAnalytics consent={hasConsent} />
      <MetaPixel consent={hasConsent} />

      {/* Banner de cookies — só aparece enquanto pendente */}
      {consent === 'pending' && (
        <CookieBanner onAccept={grantConsent} onDecline={denyConsent} />
      )}

      {children}
    </ConsentContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent deve ser usado dentro de <AnalyticsProvider>')
  return ctx
}
