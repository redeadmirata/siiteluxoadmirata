'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useState, useRef, useEffect } from 'react'

const LOCALE_LABELS: Record<string, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  es: 'ES',
}

const LOCALE_FULL: Record<string, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
}

export default function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
    setOpen(false)
  }

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-3 pt-2">
        {routing.locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
              loc === locale
                ? 'text-gold font-medium'
                : 'text-white/50 hover:text-white'
            }`}
            aria-label={LOCALE_FULL[loc]}
            aria-current={loc === locale ? 'true' : undefined}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {LOCALE_LABELS[locale]}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full mt-2 w-32 bg-ink border border-white/10 shadow-lg z-50"
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === locale}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${
                loc === locale
                  ? 'text-gold bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] font-mono opacity-50">
                {LOCALE_LABELS[loc]}
              </span>
              <span>{LOCALE_FULL[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
