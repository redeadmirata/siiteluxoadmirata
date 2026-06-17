import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Admirata Imóveis — Imóveis de Alto Padrão'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1A1A2E',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Decorative grid — linhas douradas sutis */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(184,150,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Monograma A decorativo */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-60px',
            fontSize: '480px',
            fontFamily: 'serif',
            fontWeight: 300,
            color: 'rgba(184,150,12,0.04)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          A
        </div>

        {/* Linha dourada topo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, rgba(184,150,12,0.6), rgba(184,150,12,0.9), rgba(184,150,12,0.6), transparent)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '1px solid rgba(184,150,12,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
              fontSize: '20px',
              color: '#B8960C',
              fontWeight: 400,
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: '13px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'sans-serif',
              fontWeight: 400,
            }}
          >
            Admirata Imóveis
          </span>
        </div>

        {/* Corpo central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#B8960C',
              margin: 0,
              fontFamily: 'sans-serif',
            }}
          >
            Rio de Janeiro · Serra Gaúcha
          </p>
          <h1
            style={{
              fontSize: '72px',
              fontFamily: 'serif',
              fontWeight: 300,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            Imóveis de
            <br />
            Alto Padrão
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.45)',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: 400,
              maxWidth: '480px',
              lineHeight: 1.5,
            }}
          >
            Curadoria exclusiva de coberturas, apartamentos
            e casas para compradores e investidores exigentes.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.25)',
              margin: 0,
              fontFamily: 'sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            admirata.com.br
          </p>
          <div
            style={{
              width: '32px',
              height: '1px',
              backgroundColor: 'rgba(184,150,12,0.4)',
            }}
          />
        </div>

        {/* Linha dourada bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(184,150,12,0.3), transparent)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
