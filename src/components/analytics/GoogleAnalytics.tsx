'use client'

import Script from 'next/script'

interface Props {
  consent: boolean
}

// ID público do GA4 (stream admirata.com.br). Pode ser sobrescrito pela env.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-E5BR36BRDR'

export default function GoogleAnalytics({ consent }: Props) {
  const id = GA_ID
  if (!id || !consent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());
          gtag('config', '${id}', {
            page_path: window.location.pathname,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  )
}
