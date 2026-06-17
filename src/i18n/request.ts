import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Aguarda o locale da request (pode ser undefined se não detectado)
  let locale = await requestLocale

  // Fallback para o default se o locale não for válido
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (
      await import(`../../messages/${locale}.json`)
    ).default,
  }
})
