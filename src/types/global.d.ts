// Declarações globais para scripts de terceiros carregados via <Script>

declare global {
  interface Window {
    fbq: (
      command: 'track' | 'init' | 'trackCustom',
      event: string,
      params?: Record<string, unknown>
    ) => void
    _fbq?: Window['fbq']
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export {}
