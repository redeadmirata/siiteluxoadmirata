'use client'

import { formatCurrency as formatPreco } from '@/utils'
import { buildImovelWhatsappUrl } from '@/lib/imovel'
import { trackPixelEvent } from '@/lib/pixel'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

interface CTACardProps {
  preco?: number
  titulo: string
  bairroNome?: string
  whatsappNumero?: string
}

export default function CTACard({
  preco,
  titulo,
  bairroNome,
  whatsappNumero = '5521998079459',
}: CTACardProps) {
  const whatsappUrl = buildImovelWhatsappUrl({ titulo, bairroNome, numero: whatsappNumero })

  return (
    <aside
      className="sticky top-24 bg-white border border-stone/60 p-8 space-y-8"
      aria-label="Contato e agendamento"
    >
      {/* ── Preço ─────────────────────────────────────────────────── */}
      {preco ? (
        <div>
          <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-muted mb-3">
            Valor
          </p>
          <p
            className="text-display-md text-ink leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {formatPreco(preco)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted italic">Valor sob consulta</p>
      )}

      {/* Linha ouro fina */}
      <div className="h-px bg-gold/30 w-full" />

      {/* ── WhatsApp ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full flex items-center justify-center gap-2.5 text-sm tracking-wide"
          aria-label="Entrar em contato pelo WhatsApp"
          onClick={() =>
            trackPixelEvent('Lead', { content_name: titulo, content_category: bairroNome })
          }
        >
          {/* WhatsApp icon */}
          <WhatsAppIcon />
          Falar pelo WhatsApp
        </a>

        {/* Agendar visita */}
        <button
          className="btn-outline w-full text-sm tracking-wide"
          onClick={() => {
            trackPixelEvent('Lead', { content_name: titulo, content_category: bairroNome })
            window.open(whatsappUrl, '_blank', 'noopener')
          }}
        >
          Agendar visita
        </button>
      </div>

      {/* ── Rodapé ────────────────────────────────────────────────── */}
      <p className="text-[10px] tracking-wide text-muted text-center leading-relaxed pt-2 border-t border-stone/60">
        Admirata Negócios Imobiliários
        <br />
        <span className="tracking-widest">CRECI — RJ / RS</span>
      </p>
    </aside>
  )
}
