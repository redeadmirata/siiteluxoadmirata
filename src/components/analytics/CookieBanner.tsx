'use client'

import { useTranslations } from 'next-intl'

interface Props {
  onAccept: () => void
  onDecline: () => void
}

export default function CookieBanner({ onAccept, onDecline }: Props) {
  const t = useTranslations('cookie')

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('label')}
      className="fixed bottom-0 inset-x-0 z-[150] bg-ink/95 backdrop-blur-sm border-t border-white/10"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <p className="text-[11px] text-white/60 leading-relaxed flex-1">
          {t('message')}{' '}
          <a
            href="/politica-de-privacidade"
            className="text-gold underline underline-offset-2 hover:text-white transition-colors"
          >
            {t('privacy')}
          </a>
          .
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDecline}
            className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors px-4 py-2"
          >
            {t('decline')}
          </button>
          <button
            onClick={onAccept}
            className="text-[10px] uppercase tracking-[0.2em] bg-gold text-white px-5 py-2.5 hover:bg-[#d4ac1a] transition-colors duration-200"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
