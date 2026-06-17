import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Locales suportados — pt-BR é o default (sem prefixo na URL)
  locales: ['pt-BR', 'en', 'es'] as const,
  defaultLocale: 'pt-BR',
  // 'as-needed': default locale não tem prefixo → admirata.com.br/imoveis
  // outros locales têm prefixo → admirata.com.br/en/imoveis
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
