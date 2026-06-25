'use client'

/**
 * HeroMediaVideo — apenas a camada de vídeo para heróis customizados.
 *
 * Use quando a página já tem seu próprio hero (overlays, conteúdo, etc.)
 * e você só precisa adicionar suporte a vídeo de fundo imersivo.
 *
 * Exemplo:
 *   <section style={{ position:'relative', overflow:'hidden' }}>
 *     <HeroMediaVideo url={bairro.heroVideoUrl} fallbackImageUrl={...} />
 *     {/ sua imagem fallback e conteúdo aqui /}
 *   </section>
 *
 * Comportamento:
 *   - Se url for YouTube/Vimeo → iframe embed imersivo (autoplay, muted)
 *   - Se url for MP4 → <video autoPlay muted loop>
 *   - Se não houver url → renderiza null (sem alteração ao layout)
 */

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function isMp4(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

interface HeroMediaVideoProps {
  url?: string | null
}

export default function HeroMediaVideo({ url }: HeroMediaVideoProps) {
  if (!url) return null

  const ytId    = getYouTubeId(url)
  const vimeoId = getVimeoId(url)
  const mp4     = isMp4(url)

  if (!ytId && !vimeoId && !mp4) return null

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none',
  }

  if (mp4) {
    return (
      <div style={layerStyle}>
        <video
          src={url}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  const embedSrc = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&iv_load_policy=3`
    : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1&byline=0&title=0`

  return (
    <div style={layerStyle}>
      <iframe
        src={embedSrc}
        allow="autoplay; encrypted-media; fullscreen"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '177.78vh',
          height: '100vh',
          minWidth: '100%',
          minHeight: '56.25vw',
          transform: 'translate(-50%, -50%)',
          border: 'none',
        }}
        title="Hero video"
      />
    </div>
  )
}
