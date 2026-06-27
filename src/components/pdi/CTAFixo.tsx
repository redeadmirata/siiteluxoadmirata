'use client'

import { formatCurrency as formatPreco } from '@/utils'
import { buildImovelWhatsappUrl } from '@/lib/imovel'
import { trackPixelEvent } from '@/lib/pixel'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

interface CTAFixoProps {
  preco?: number
  titulo: string
  bairroNome?: string
  whatsappNumero?: string
}

export default function CTAFixo({
  preco,
  titulo,
  bairroNome,
  whatsappNumero = '5521998079459',
}: CTAFixoProps) {
  const whatsappUrl = buildImovelWhatsappUrl({ titulo, bairroNome, numero: whatsappNumero })

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-cta-fixo lg:hidden bg-white border-t border-stone px-5 py-3 flex items-center justify-between gap-3"
      role="complementary"
      aria-label="Ação rápida"
    >
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted truncate">
          {bairroNome}
        </p>
        <p className="text-price text-base text-ink font-medium">
          {preco ? formatPreco(preco) : 'Consulte'}
        </p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-sm px-5 py-2.5 flex-shrink-0 flex items-center gap-2"
        aria-label="Entrar em contato pelo WhatsApp"
        onClick={() =>
          trackPixelEvent('Lead', { content_name: titulo, content_category: bairroNome })
        }
      >
        <WhatsAppIcon size={14} />
        WhatsApp
      </a>
    </div>
  )
}
