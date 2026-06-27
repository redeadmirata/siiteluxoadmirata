import { ImageResponse } from 'next/og'
import { client } from '@/sanity/client'
import { IMOVEL_PDI_QUERY } from '@/sanity/queries'
import type { ImovelPDI } from '@/types/sanity'
import { formatPreco, formatArea } from '@/lib/formatters'

export const runtime = 'edge'
export const alt = 'Admirata Imóveis'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Cores Admirata
const GOLD = '#B8960C'
const DARK = '#1A1A2E'
const WHITE = '#FFFFFF'
const MUTED = 'rgba(255,255,255,0.5)'

export default async function Image({ params }: { params: { slug: string } }) {
  const imovel = await client.fetch<ImovelPDI | null>(IMOVEL_PDI_QUERY, {
    slug: params.slug,
  })

  const imagemUrl =
    imovel?.imagens?.find((i) => i.arquivo.principal)?.arquivo.asset?.url ??
    imovel?.imagens?.[0]?.arquivo.asset?.url

  const titulo = imovel?.titulo ?? 'Imóvel de Alto Padrão'
  const bairro = imovel?.bairro?.nome ?? ''
  const cidade = imovel?.bairro?.cidade ?? ''
  const preco = imovel?.preco && !imovel?.precoSobConsulta
    ? formatPreco(imovel.preco)
    : null
  const area = imovel?.areaUtil ? formatArea(imovel.areaUtil) : null
  const quartos = imovel?.quartos
  const tipo = imovel?.tipo ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: DARK,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Foto do imóvel como background com overlay */}
        {imagemUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${imagemUrl}?w=1200&h=630&fit=crop&auto=format`}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Gradiente escuro sobre a foto */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, rgba(26,26,46,0.92) 0%, rgba(26,26,46,0.75) 50%, rgba(26,26,46,0.4) 100%)',
              }}
            />
          </>
        )}

        {/* Linha dourada topo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        {/* Conteúdo */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 64px',
            width: '100%',
          }}
        >
          {/* Topo — Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: `1px solid ${GOLD}80`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'serif',
                fontSize: '18px',
                color: GOLD,
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: MUTED,
                fontFamily: 'sans-serif',
              }}
            >
              Admirata Imóveis
            </span>
          </div>

          {/* Centro — Dados do imóvel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '620px' }}>
            {/* Tag tipo */}
            {tipo && (
              <div
                style={{
                  display: 'flex',
                  width: 'fit-content',
                  padding: '4px 12px',
                  border: `1px solid ${GOLD}50`,
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: GOLD,
                  fontFamily: 'sans-serif',
                }}
              >
                {tipo}
              </div>
            )}

            {/* Título */}
            <h1
              style={{
                fontSize: titulo.length > 40 ? '44px' : '56px',
                fontFamily: 'serif',
                fontWeight: 300,
                color: WHITE,
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              {titulo}
            </h1>

            {/* Localização */}
            {(bairro || cidade) && (
              <p
                style={{
                  fontSize: '16px',
                  color: MUTED,
                  margin: 0,
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                {[bairro, cidade].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>

          {/* Bottom — Specs + Preço */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Specs */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {area && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '20px', color: WHITE, fontFamily: 'sans-serif', fontWeight: 500 }}>
                    {area}
                  </span>
                  <span style={{ fontSize: '10px', color: MUTED, fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
                    ÁREA
                  </span>
                </div>
              )}
              {quartos && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '20px', color: WHITE, fontFamily: 'sans-serif', fontWeight: 500 }}>
                    {quartos}
                  </span>
                  <span style={{ fontSize: '10px', color: MUTED, fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
                    {quartos === 1 ? 'QUARTO' : 'QUARTOS'}
                  </span>
                </div>
              )}
            </div>

            {/* Preço */}
            {preco && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '11px', color: MUTED, fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
                  A PARTIR DE
                </span>
                <span style={{ fontSize: '26px', color: GOLD, fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {preco}
                </span>
              </div>
            )}
            {imovel?.precoSobConsulta && (
              <span style={{ fontSize: '18px', color: GOLD, fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.05em' }}>
                Valor sob consulta
              </span>
            )}
          </div>
        </div>

        {/* Linha dourada bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
