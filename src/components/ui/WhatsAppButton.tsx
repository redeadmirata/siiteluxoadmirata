'use client'

import { trackPixelEvent } from '@/lib/pixel'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

const WHATSAPP_NUMBER = '5521998079459'

interface WhatsAppButtonProps {
  /** Mensagem pré-preenchida no WhatsApp */
  mensagem?: string
}

/**
 * WhatsAppButton — botão flutuante de contato no canto inferior direito.
 *
 * Tooltip visível apenas em desktop (≥768px) via CSS group-hover.
 * Não usa estado local — hover é tratado inteiramente com Tailwind.
 */
export default function WhatsAppButton({
  mensagem = 'Olá! Gostaria de informações sobre imóveis da Admirata.',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      onClick={() => trackPixelEvent('Contact')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group"
    >
      {/* Tooltip — só aparece em desktop no hover */}
      <span
        className={[
          'hidden lg:block',
          'text-[11px] tracking-wide bg-ink text-white px-3 py-1.5 rounded-sm',
          'shadow-lg whitespace-nowrap',
          'opacity-0 translate-x-2 pointer-events-none',
          'group-hover:opacity-100 group-hover:translate-x-0',
          'transition-all duration-200',
        ].join(' ')}
        aria-hidden="true"
      >
        Falar com um consultor
      </span>

      {/* Botão circular verde */}
      <div
        className={[
          'w-14 h-14 rounded-full bg-[#25D366]',
          'shadow-lg shadow-black/20',
          'flex items-center justify-center',
          'group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/30',
          'transition-all duration-200',
        ].join(' ')}
      >
        <WhatsAppIcon size={28} className="text-white" />
      </div>
    </a>
  )
}
