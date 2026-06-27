import { ImageResponse } from 'next/og'
import { client } from '@/sanity/client'
import type { BairroFull } from '@/types/sanity'

export const runtime = 'edge'
export const alt = 'Admirata Imóveis'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const GOLD = '#B8960C'
const DARK = '#1A1A2E'
const WHITE = '#FFFFFF'
const MUTED = 'rgba(255,255,255,0.5)'

const BAIRRO_OG_QUERY = `*[_type == "bairro" && slug.current == $slug][0]{
  nome,
  cidade,
  estado,
  "imagemUrl": imagemCapa.asset->url,
  descricao,
  "totalImoveis": count(*[_type == "imovel" && referencias[_ref == ^._id]])
}`

export default async function Image({ params }: { params: { slug: string } }) {
  const bairro = await client.fetch<(BairroFull & { imagemUrl?: string; totalImoveis?: number }) | null>(
    BAIRRO_OG_QUERY,
    { slug: params.slug }
  )

  const nome = bairro?.nome ?? 'Bairro'
  const cidade = bairro?.cidade ?? 'Rio de Janeiro'
  const total = bairro?.totalImoveis ?? null
  const imagemUrl = bairro?.imagemUrl ?? null

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
        {/* Foto do bairro */}
        {imagemUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${imagemUrl}?w=1200&h=630&fit=crop&auto=format`}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, rgba(26,26,46,0.90) 0%, rgba(26,26,46,0.60) 60%, rgba(26,26,46,0.3) 100%)',
              }}
            />
          </>
        )}

        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

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
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px', height: '40px', border: `1px solid ${GOLD}80`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'serif', fontSize: '18px', color: GOLD,
              }}
            >
              A
            </div>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, fontFamily: 'sans-serif' }}>
              Admirata Imóveis
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, margin: 0, fontFamily: 'sans-serif' }}>
              Imóveis em
            </p>
            <h1 style={{ fontSize: '72px', fontFamily: 'serif', fontWeight: 300, color: WHITE, margin: 0, lineHeight: 1.0, letterSpacing: '-0.01em' }}>
              {nome}
            </h1>
            <p style={{ fontSize: '18px', color: MUTED, margin: 0, fontFamily: 'sans-serif' }}>
              {cidade}
            </p>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: `${WHITE}40`, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
              admirata.com.br
            </span>
            {total && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontSize: '28px', color: GOLD, fontFamily: 'sans-serif', fontWeight: 600 }}>
                  {total}
                </span>
                <span style={{ fontSize: '10px', color: MUTED, fontFamily: 'sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {total === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
