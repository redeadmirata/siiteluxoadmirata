'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import ElegantShape from '@/components/ui/ElegantShape'
import NeonButton from '@/components/ui/NeonButton'
import MarketSwitcher, { type Mercado } from '@/components/home/MarketSwitcher'
import MarketGate, { readMercado, writeMercado } from '@/components/home/MarketGate'

// WhatsApp
const WA_RIO   = '5521998079459'
const WA_SERRA = '5554992643070'
function waUrl(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

function getSub(mercado: Mercado): string {
  if (mercado === 'Rio de Janeiro')
    return 'Curadoria de coberturas e apartamentos no Rio de Janeiro - venda e locacao.'
  if (mercado === 'Serra Gaúcha')
    return 'Curadoria de casas e coberturas na Serra Gaucha - Gramado e Canela, venda e locacao.'
  return 'Curadoria de coberturas, apartamentos e casas exclusivas no Rio de Janeiro e Serra Gaucha.'
}

export default function HeroHome() {
  const locale = useLocale()

  const [mercado, setMercadoState] = useState<Mercado>('')
  const [showGate, setShowGate]   = useState(false)
  const [mounted, setMounted]     = useState(false)

  useEffect(() => {
    const v = readMercado()
    setMercadoState(v ?? '')
    setShowGate(v === null)
    setMounted(true)
  }, [])

  const setMercado = useCallback((v: Mercado) => {
    setMercadoState(v)
    writeMercado(v)
  }, [])

  const chooseMercado = useCallback((v: Mercado) => {
    setMercado(v)
    setShowGate(false)
  }, [setMercado])

  const waPhone = mercado === 'Serra Gaúcha' ? WA_SERRA : WA_RIO
  const waText  = locale === 'en'
    ? 'Hello, I would like to know more about Admirata properties.'
    : 'Ola, gostaria de conhecer imoveis da Admirata.'
  const wa = waUrl(waPhone, waText)

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })
  }

  return (
    <>
      {mounted && showGate && <MarketGate onChoose={chooseMercado} />}

      <section
        className="relative overflow-hidden"
        style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#0c0e1a' }}
        aria-label="Admirata Imoveis - imoveis de alto padrao"
      >
        {/* Fundo */}
        <div aria-hidden="true" className="absolute inset-0" style={{
          background:
            'radial-gradient(120% 80% at 70% 18%, rgba(80,90,120,0.45) 0%, rgba(30,34,52,0.2) 35%, transparent 60%),' +
            'radial-gradient(90% 60% at 30% 8%, rgba(184,150,12,0.10) 0%, transparent 50%),' +
            'linear-gradient(180deg, #1b2030 0%, #14182a 42%, #0c0e1a 78%, #090b15 100%)',
        }} />
        <div aria-hidden="true" className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{
          height: '46%',
          background:
            'radial-gradient(140% 100% at 82% 100%, #05060c 30%, transparent 72%),' +
            'radial-gradient(120% 100% at 18% 100%, #07080f 28%, transparent 70%)',
        }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(13,13,24,0.55) 0%, transparent 30%, transparent 55%, rgba(9,11,21,0.85) 100%)',
        }} />

        {/* Formas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <ElegantShape delay={0.3} width={600} height={140} rotate={12}  color="rgba(184,150,12,0.14)" pos={{ left: '-6%',  top: '18%' }} />
          <ElegantShape delay={0.5} width={500} height={120} rotate={-15} color="rgba(255,255,255,0.07)" pos={{ right: '-2%', top: '65%' }} />
          <ElegantShape delay={0.4} width={280} height={72}  rotate={-8}  color="rgba(184,150,12,0.10)" pos={{ left: '7%',  bottom: '8%' }} />
          <ElegantShape delay={0.6} width={190} height={52}  rotate={20}  color="rgba(255,255,255,0.06)" pos={{ right: '16%', top: '10%' }} />
          <ElegantShape delay={0.7} width={150} height={40}  rotate={-25} color="rgba(184,150,12,0.08)" pos={{ left: '22%', top: '5%' }} />
        </div>

        {/* Conteudo */}
        <div className="relative z-10 w-full mx-auto" style={{ maxWidth: 1440, padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(5rem, 12vh, 9rem)' }}>

          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--color-gold)', marginBottom: 24 }}>
            Negocios imobiliarios de alto padrao
          </p>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: '#fff', lineHeight: 1.02, marginBottom: 28, fontSize: 'clamp(3rem, 8vw, 6.5rem)', maxWidth: 900 }}>
            O imovel certo,
            <br />
            <em style={{ fontStyle: 'italic', color: 'rgba(212,172,26,0.92)' }}>
              com discricao e cuidado.
            </em>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40, minHeight: '3.4em' }}>
            {getSub(mercado)}
          </p>

          {mounted && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)' }}>
                Regiao
              </span>
              <MarketSwitcher value={mercado} onChange={setMercado} />
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
            <NeonButton variant="solid" size="lg" href={mercado === 'Serra Gaúcha' ? '/gramado' : '/imoveis'}>
              {mercado === 'Serra Gaúcha' ? 'Ver imoveis em Gramado' : 'Explorar imoveis'}
            </NeonButton>
            <NeonButton variant="ghost" size="lg" tone="onDark" href={wa} target="_blank" rel="noopener noreferrer">
              {mercado === 'Serra Gaúcha' ? 'Falar com Roberto' : 'Fale conosco'}
            </NeonButton>
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              ['Rio de Janeiro', 'Barra - Recreio - Zona Sul'],
              ['Serra Gaúcha',   'Gramado - Canela'],
              ['Atuacao',        'Venda - Locacao - Administracao'],
            ].map(([t, s]) => (
              <div key={t}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-gold)', textTransform: 'uppercase' }}>{t}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollDown}
          aria-label="Rolar para proxima secao"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', animation: 'adm-scroll-pulse 2s ease-in-out 1s infinite' }} />
          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.35)' }}>
            Scroll
          </span>
        </button>
      </section>
    </>
  )
}
