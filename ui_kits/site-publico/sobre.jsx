// Admirata — página institucional "Sobre" (Quem somos)
// Reaproveita tokens, PropImg e NeonButton do kit site-publico.
const { useState: useStateSobre, useEffect: useEffectSobre, useRef: useRefSobre } = React;

/* ── wrapper simples (sem animação — visível e estável) ── */
function Reveal({ children, delay = 0, style = {} }) {
  return <div style={style}>{children}</div>;
}

function SobreScreen({ onNav }) {
  const NeonButton = window.NeonButton;
  const wa = waUrl(WA_RIO, 'Olá, gostaria de conhecer a Admirata.');

  const pilares = [
    { n: '01', t: 'Curadoria', d: 'Selecionamos um portfólio enxuto de imóveis que realmente importam. Cada propriedade passa por um crivo de localização, arquitetura e potencial — qualidade acima de volume.' },
    { n: '02', t: 'Discrição', d: 'Negociações conduzidas com sigilo e cuidado. Atendimento reservado para proprietários e compradores que valorizam privacidade em cada etapa.' },
    { n: '03', t: 'Alcance', d: 'Presença consolidada no Rio de Janeiro e na Serra Gaúcha — dois dos mercados de alto padrão mais desejados do país, com equipe local em cada região.' },
    { n: '04', t: 'Relacionamento', d: 'Acompanhamento próximo do primeiro contato à escritura. Assessoria completa em venda, locação e administração patrimonial.' },
  ];

  return (
    <main style={{ background: 'var(--color-stone)' }}>
      {/* ═══ HERO institucional ═══ */}
      <section style={{ position: 'relative', background: '#0d0d18', color: '#fff', overflow: 'hidden', paddingTop: 72 }}>
        <div style={{ position: 'absolute', inset: 0, background:
          'radial-gradient(120% 90% at 78% 10%, rgba(80,90,120,0.40) 0%, rgba(30,34,52,0.18) 38%, transparent 62%),' +
          'radial-gradient(80% 60% at 18% 4%, rgba(184,150,12,0.10) 0%, transparent 52%),' +
          'linear-gradient(180deg, #1b2030 0%, #14182a 48%, #0c0e1a 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: 'clamp(5rem,12vh,9rem) clamp(1.5rem,4vw,2.5rem) clamp(4rem,9vh,7rem)' }}>
          <Reveal>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--color-gold)', marginBottom: 28 }}>Quem somos</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, lineHeight: 1.04, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)', maxWidth: 920, textWrap: 'balance', marginBottom: 32 }}>
              Negócios imobiliários de alto padrão, conduzidos com <em style={{ fontStyle: 'italic', color: 'rgba(212,172,26,0.92)' }}>discrição e cuidado.</em>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'rgba(255,255,255,0.62)', maxWidth: 560 }}>
              A Admirata nasce do encontro entre dois mercados singulares — a orla do Rio de Janeiro e o refúgio da Serra Gaúcha — para oferecer uma curadoria exclusiva de imóveis a quem exige excelência.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ MANIFESTO editorial ═══ */}
      <section style={{ background: '#fff', padding: 'var(--section-padding) 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2.5rem)' }}>
          <Reveal>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 28 }}>Nossa filosofia</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.75rem, 3.6vw, 2.9rem)', lineHeight: 1.32, color: 'var(--color-ink)', textWrap: 'balance', letterSpacing: '-0.01em' }}>
              Acreditamos que comprar um imóvel de exceção é uma decisão íntima. Por isso trabalhamos com poucos imóveis e muita atenção — entendendo o estilo de vida antes de apresentar a planta. <span style={{ color: 'var(--color-gold)' }}>O imóvel certo, para a pessoa certa.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ PILARES ═══ */}
      <section style={{ background: 'var(--color-stone)', padding: 'var(--section-padding) 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2.5rem)' }}>
          <Reveal style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 12 }}>O que nos define</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--color-ink)', fontWeight: 300 }}>Quatro pilares</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: 'var(--color-stone)', border: '1px solid var(--color-stone)' }}>
            {pilares.map((p, idx) => (
              <Reveal key={p.n} delay={idx * 0.08} style={{ background: '#fff' }}>
                <div style={{ padding: 'clamp(28px,3vw,40px)', height: '100%' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--color-gold)' }}>{p.n}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-ink)', fontWeight: 400, margin: '16px 0 14px' }}>{p.t}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-text)' }}>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MERCADOS — Rio + Serra ═══ */}
      <section style={{ background: '#fff', padding: 'var(--section-padding) 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2.5rem)' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 12 }}>Onde atuamos</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--color-ink)', fontWeight: 300 }}>Dois mercados, uma assinatura</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {[
              { seed: 2, eyebrow: 'Rio de Janeiro', titulo: 'Da orla à lagoa', desc: 'Leblon, Ipanema, Barra da Tijuca e Recreio. Coberturas frente-mar, penthouses e apartamentos de alto padrão na cidade mais desejada do litoral brasileiro.', wa: WA_RIO },
              { seed: 3, eyebrow: 'Serra Gaúcha', titulo: 'O refúgio na montanha', desc: 'Gramado e Canela. Casas em condomínio, coberturas panorâmicas e residências de inverno em meio à arquitetura em pedra e madeira da Serra.', wa: WA_SERRA },
            ].map((m, idx) => (
              <Reveal key={m.eyebrow} delay={idx * 0.1}>
                <div>
                  <PropImg seed={m.seed} ratio="16 / 10">
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.55), transparent 55%)' }} />
                  </PropImg>
                  <div style={{ paddingTop: 24 }}>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold)', marginBottom: 10 }}>{m.eyebrow}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-ink)', fontWeight: 400, marginBottom: 14 }}>{m.titulo}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--color-text)', marginBottom: 22, maxWidth: 440 }}>{m.desc}</p>
                    <NeonButton variant="default" href={waUrl(m.wa, `Olá, gostaria de falar com a equipe ${m.eyebrow} da Admirata.`)} target="_blank" rel="noopener">WhatsApp {m.eyebrow}</NeonButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAIXA DE CREDENCIAIS ═══ */}
      <section style={{ background: 'var(--color-ink)', color: '#fff', padding: 'clamp(3.5rem,7vw,6rem) 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2.5rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 24px' }}>
            {[
              ['Mercados', 'Rio de Janeiro & Serra Gaúcha'],
              ['Atuação', 'Venda · Locação · Administração'],
              ['Registro', 'CRECI-F 58308'],
              ['Registro RJ', 'CRECI RJ-008553/O'],
            ].map(([t, s], idx) => (
              <Reveal key={t} delay={idx * 0.07}>
                <div style={{ borderTop: '1px solid rgba(184,150,12,0.4)', paddingTop: 20 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 10 }}>{t}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem,2vw,1.6rem)', color: '#fff', fontWeight: 400, lineHeight: 1.25 }}>{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA final ═══ */}
      <section style={{ background: '#fff', padding: 'var(--section-padding) 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2.5rem)', textAlign: 'center' }}>
          <Reveal>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 20 }}>Vamos conversar</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: 'var(--color-ink)', fontWeight: 300, lineHeight: 1.15, marginBottom: 20 }}>
              Encontre o imóvel certo com quem entende do assunto
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--color-muted)', marginBottom: 36, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Conte para a nossa equipe o que você procura. Cuidamos do resto com a discrição que o seu patrimônio merece.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <NeonButton variant="solid" size="lg" href={wa} target="_blank" rel="noopener">Fale conosco</NeonButton>
              <NeonButton variant="ghost" size="lg" onClick={() => onNav({ name: 'imoveis' })}>Ver imóveis</NeonButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

window.SobreScreen = SobreScreen;
