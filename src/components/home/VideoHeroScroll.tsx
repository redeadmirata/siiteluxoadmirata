'use client'

import { useEffect, useRef } from 'react'

interface Slide {
  eyebrow: string
  headline: string
  sub: string
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'Curadoria exclusiva',
    headline: 'Cada imovel,\numa historia.',
    sub: 'Selecionamos apenas o que vale cada metro quadrado — sem concessoes.',
  },
  {
    eyebrow: 'Rio de Janeiro',
    headline: 'Da Barra ao\nLeblon.',
    sub: 'Coberturas, penthouses e apartamentos nas melhores localizacoes da cidade.',
  },
  {
    eyebrow: 'Serra Gaucha',
    headline: 'Gramado\ne Canela.',
    sub: 'Casas de alto padrao e coberturas em meio a natureza serrana.',
  },
  {
    eyebrow: 'Admirata',
    headline: 'Discricao\ne resultado.',
    sub: 'Negociamos com confidencialidade. Entregamos com precisao.',
  },
]

export default function VideoHeroScroll() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const outer  = outerRef.current
        const sticky = stickyRef.current
        if (!outer || !sticky) return

        const totalSlides = SLIDES.length
        // Each slide occupies 1 viewport height worth of scroll
        // outer is (totalSlides + 1) * 100vh so there's room to enter/exit

        slidesRef.current.forEach((el, i) => {
          if (!el) return

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: outer,
              start: `${(i / (totalSlides + 1)) * 100}% top`,
              end:   `${((i + 1) / (totalSlides + 1)) * 100}% top`,
              scrub: 1.2,
            },
          })

          if (i === 0) {
            // first slide fades in from below
            gsap.set(el, { opacity: 0, y: 40 })
            tl.to(el, { opacity: 1, y: 0, duration: 0.4 })
              .to(el, { opacity: 0, y: -40, duration: 0.4 }, '>0.2')
          } else {
            gsap.set(el, { opacity: 0, y: 40 })
            tl.to(el, { opacity: 1, y: 0, duration: 0.4 })
              .to(el, { opacity: 0, y: -40, duration: 0.4 }, '>0.2')
          }
        })

        // subtle background parallax
        gsap.to('.vhs-bg-layer', {
          y: '-18%',
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        // progress bar
        gsap.to('.vhs-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })

      }, outerRef.current!)
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <div ref={outerRef} style={{ position: 'relative', height: `${(SLIDES.length + 1) * 100}vh` }}>

      {/* sticky viewport */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090b15',
        }}
      >
        {/* background layers */}
        <div className="vhs-bg-layer" style={{ position: 'absolute', inset: '-20% 0', zIndex: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(184,150,12,0.07) 0%, transparent 65%),' +
              'radial-gradient(ellipse 60% 80% at 80% 60%, rgba(45,74,62,0.12) 0%, transparent 55%),' +
              'linear-gradient(180deg, #0c0e1a 0%, #090b15 50%, #07080f 100%)',
          }} />
          {/* grain overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
            opacity: 0.5,
          }} />
        </div>

        {/* gold line left accent */}
        <div style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 4vw, 3rem)',
          top: '20%',
          bottom: '20%',
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(184,150,12,0.5) 30%, rgba(184,150,12,0.5) 70%, transparent)',
          zIndex: 1,
        }} />

        {/* slides */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1440, padding: '0 clamp(3rem, 7vw, 8rem)' }}>
          {SLIDES.map((s, i) => (
            <div
              key={i}
              ref={el => { slidesRef.current[i] = el }}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: i === 0 ? 'auto' : 0,
                left: i === 0 ? 'auto' : 'clamp(3rem, 7vw, 8rem)',
                right: i === 0 ? 'auto' : 'clamp(3rem, 7vw, 8rem)',
                maxWidth: 720,
              }}
            >
              <p style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.45em',
                color: 'var(--color-gold)',
                marginBottom: 20,
              }}>
                {s.eyebrow}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                color: '#fff',
                lineHeight: 1.04,
                marginBottom: 24,
                whiteSpace: 'pre-line',
              }}>
                {s.headline}
              </h2>
              <p style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.75,
                maxWidth: 460,
              }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* slide counter */}
        <div style={{
          position: 'absolute',
          right: 'clamp(1.5rem, 4vw, 3rem)',
          bottom: '2rem',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: 1,
                height: 20,
                background: 'rgba(184,150,12,0.35)',
                transition: 'height .3s',
              }}
            />
          ))}
        </div>

        {/* scroll progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          zIndex: 3,
        }}>
          <div
            className="vhs-progress"
            style={{
              height: '100%',
              background: 'linear-gradient(to right, var(--color-gold), rgba(184,150,12,0.4))',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
