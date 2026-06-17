'use client'

import { useState, useEffect } from 'react'
import GoogleAnalytics from './GoogleAnalytics'
import MetaPixel from './MetaPixel'
import CookieBanner from './CookieBanner'

type ConsentState = 'granted' | 'denied' | null

const STORAGE_KEY = 'admirata_cookie_consent'

export default function AnalyticsProvider() {
  const [consent, setConsent] = useState<ConsentState>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
    if (stored === 'granted' || stored === 'denied') {
      setConsent(stored)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'granted')
    setConsent('granted')
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, 'denied')
    setConsent('denied')
  }

  const hasConsent = consent === 'granted'

  return (
    <>
      <GoogleAnalytics consent={hasConsent} />
      <MetaPixel consent={hasConsent} />
      {consent === null && (
        <CookieBanner onAccept={handleAccept} onDecline={handleDecline} />
      )}
    </>
  )
}
