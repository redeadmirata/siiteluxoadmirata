// Admirata — site público (recriação fiel do site em produção Next.js + Sanity)
const {
  useState, useEffect, useRef, WA_RIO, WA_SERRA, waUrl,
  formatPreco, formatArea, PropImg, IMOVEIS, BAIRROS, TIPOS, MERCADOS,
} = window;

/* ════════════════════════════════════════════════════════════════════════
   NEON BUTTON — pill com hairline dourado no hover (Admirata)
   Adaptado do design enviado (cva neon button), trocando azul → ouro.
   ═══════════════════════════════════════════════════════════════════════ */
function NeonButton({ variant = 'default', size = 'default', neon = true, tone = 'light',
                      children, href, target, rel, onClick, title, style = {} }) {
  const [hover, setHover] = useState(false);
  const sizes = {
    sm: { padding: '5px 18px', fontSize: 10 },
    default: { padding: '9px 28px', fontSize: 11 },
    lg: { padding: '13px 40px', fontSize: 12 },
  };
  const onDark = tone === 'onDark';
  const variantStyle = {
    default: {
      background: hover ? 'rgba(184,150,12,0)' : 'rgba(184,150,12,0.06)',
      border: '1px solid rgba(184,150,12,0.3)',
      color: onDark ? '#fff' : 'var(--color-ink)',
    },
    solid: {
      background: hover ? 'var(--color-gold-light)' : 'var(--color-gold)',
      border: '1px solid transparent',
      color: '#fff',
    },
    ghost: {
      background: hover ? (onDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.04)') : 'transparent',
      border: `1px solid ${hover ? (onDark ? 'rgba(255,255,255,0.5)' : 'var(--color-gold)') : (onDark ? 'rgba(255,255,255,0.35)' : 'rgba(26,26,46,0.25)')}`,
      color: onDark ? '#fff' : 'var(--color-ink)',
    },
  }[variant];

  const base = {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 500,
    cursor: 'pointer', textAlign: 'center', transition: 'all .25s var(--ease-smooth)',
    fontFamily: 'var(--font-body)', textDecoration: 'none', ...sizes[size], ...variantStyle, ...style,
  };
  const line = {
    position: 'absolute', height: 1, left: 0, right: 0, width: '75%', margin: '0 auto',
    background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
    transition: 'opacity .5s ease-in-out', pointerEvents: 'none',
  };
  const Tag = href ? 'a' : 'button';
  const tagProps = href ? { href, target, rel } : { type: 'button' };
  return (
    <Tag {...tagProps} title={title} onClick={onClick} style={base}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {neon && variant !== 'solid' && <span style={{ ...line, top: 0, opacity: hover ? 1 : 0 }} />}
      {children}
      {neon && variant !== 'solid' && <span style={{ ...line, bottom: -1, opacity: hover ? 0.3 : 0 }} />}
    </Tag>
  );
}

/* ── Ícones sociais ── */
function SocialIcon({ kind }) {
  const p = {
    instagram: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM17.4 6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z',
    youtube: 'M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C19.3 5 12 5 12 5s-7.3 0-8.9.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8C4.7 19 12 19 12 19s7.3 0 8.9-.5a2.5 2.5 0 0 0 1.7-1.8C23 15.2 23 12 23 12ZM9.7 15.1V8.9l5.4 3.1-5.4 3.1Z',
    tiktok: 'M16.5 2c.3 2.2 1.5 3.7 3.5 4v2.6c-1.3 0-2.5-.4-3.5-1v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2.1 2.9V2h2.7Z',
  }[kind];
  return <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d={p} /></svg>;
}

/* ── Dock estilo macOS: magnificação por proximidade do cursor ── */
function DockIcon({ children, href, onClick, title, mx }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    if (mx == null) { setScale(1); return; }
    const r = ref.current.getBoundingClientRect();
    const dist = Math.abs(mx - (r.left + r.width / 2));
    const range = 90; // alcance da magnificação (px)
    setScale(Math.max(1, 1.7 - (dist / range) * 0.7));
  }, [mx]);
  const Tag = href ? 'a' : 'button';
  const tagProps = href ? { href } : { type: 'button' };
  return (
    <Tag {...tagProps} ref={ref} title={title} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none',
      padding: 0, cursor: 'pointer', color: scale > 1.06 ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
      transform: `scale(${scale}) translateY(${-(scale - 1) * 12}px)`,
      transformOrigin: 'center bottom', transition: 'transform .15s var(--ease-smooth), color .2s',
    }}>{children}</Tag>
  );
}

function SocialDock({ onFav }) {
  const [mx, setMx] = useState(null);
  return (
    <div onMouseMove={e => setMx(e.clientX)} onMouseLeave={() => setMx(null)}
         style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 30 }}>
      {['instagram', 'youtube', 'tiktok'].map(k => (
        <DockIcon key={k} href="#" title={k} mx={mx}><SocialIcon kind={k} /></DockIcon>
      ))}
      <DockIcon title="Favoritos" onClick={onFav} mx={mx}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </DockIcon>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   NAVBAR — arquitetura estilo portal imobiliário (logo · nav central · ações)
   ═══════════════════════════════════════════════════════════════════════ */
function Navbar({ route, onNav, scrolled }) {
  const [menu, setMenu] = useState(false);
  const isHome = route.name === 'home';
  const transparente = isHome && !scrolled;
  const links = [
    { key: 'home', label: 'Home' },
    { key: 'venda', label: 'Venda' },
    { key: 'imoveis', label: 'Locação' },
    { key: 'lancamentos', label: 'Lançamentos' },
    { key: 'videos', label: 'Vídeos' },
    { key: 'condominios', label: 'Condomínios' },
    { key: 'anuncie', label: 'Anuncie' },
    { key: 'sobre', label: 'Sobre' },
    { key: 'contato', label: 'Contato' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: transparente ? 88 : 72,
      background: transparente ? 'transparent' : 'rgba(26,26,46,0.92)',
      backdropFilter: transparente ? 'none' : 'blur(14px)',
      borderBottom: transparente ? 'none' : '1px solid rgba(184,150,12,0.18)',
      transition: 'all .4s var(--ease-smooth)',
    }}>
      <nav style={{
        maxWidth: 1440, margin: '0 auto', height: '100%',
        padding: '0 clamp(1.5rem, 4vw, 3rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        {/* Logo */}
        <a onClick={() => onNav({ name: 'home' })} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <img src="logo-horizontal.png" alt="Admirata Imóveis" style={{ height: 60, width: 'auto', display: 'block', transform: 'translateY(6px)' }} />
        </a>

        {/* Links centrais */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 26, listStyle: 'none', flex: 1, justifyContent: 'center' }} className="adm-nav-links">
          {links.map(({ key, label }) => {
            const ativo = route.name === key;
            return (
              <li key={key}>
                <a onClick={() => onNav({ name: key })} style={{
                  fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
                  paddingBottom: 3, transition: 'color .2s', whiteSpace: 'nowrap',
                  color: ativo ? 'var(--color-gold)' : 'rgba(255,255,255,0.78)',
                  borderBottom: ativo ? '1px solid var(--color-gold)' : '1px solid transparent',
                }} onMouseEnter={e => { if (!ativo) e.currentTarget.style.color = '#fff'; }}
                   onMouseLeave={e => { if (!ativo) e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}>{label}</a>
              </li>
            );
          })}
        </ul>

        {/* Ações à direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div className="adm-hide-mobile" style={{ display: 'flex', alignItems: 'center' }}>
            <SocialDock onFav={() => onNav({ name: 'favoritos' })} />
          </div>
          <div className="adm-hide-mobile">
            <NeonButton variant="ghost" size="default" tone="onDark" onClick={() => onNav({ name: 'cliente' })}>Cliente</NeonButton>
          </div>
          {/* Hamburger */}
          <button onClick={() => setMenu(v => !v)} className="adm-show-mobile" aria-label="Menu" style={{
            background: 'none', border: 'none', width: 32, height: 32, display: 'none',
            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, color: '#fff',
          }}>
            <span style={{ width: 24, height: 1, background: 'currentColor' }} />
            <span style={{ width: 24, height: 1, background: 'currentColor' }} />
            <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          </button>
        </div>
      </nav>

      {/* Drawer mobile */}
      {menu && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--color-ink)', zIndex: 99, padding: '80px 40px 40px' }}>
          <button onClick={() => setMenu(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 28 }}>×</button>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 40 }}>
            {links.map(({ key, label }) => (
              <li key={key}><a onClick={() => { onNav({ name: key }); setMenu(false); }} style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>{label}</a></li>
            ))}
          </ul>
          <NeonButton variant="ghost" tone="onDark" onClick={() => { onNav({ name: 'cliente' }); setMenu(false); }}>Cliente</NeonButton>
        </div>
      )}
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO — foto full-bleed escura (arquitetura estilo portal)
   ═══════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════
   ELEGANT SHAPE — forma oval flutuante (adaptação Admirata do Kokonut HeroGeometric)
   ═══════════════════════════════════════════════════════════════════════ */
function ElegantShape({ delay = 0, width = 400, height = 100, rotate = 0, color = 'rgba(184,150,12,0.15)', pos = {} }) {
  return (
    <div style={{ position: 'absolute', ...pos, animation: `adm-shape-enter 2.4s cubic-bezier(.23,.86,.39,.96) ${delay}s both` }}>
      <div style={{ animation: `adm-shape-float ${10 + delay * 2}s ease-in-out ${delay * 1.5}s infinite` }}>
        <div style={{
          width, height,
          transform: `rotate(${rotate}deg)`,
          borderRadius: '50%',
          background: `linear-gradient(to right, ${color}, transparent)`,
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(255,255,255,0.04)',
        }} />
      </div>
    </div>
  );
}

function HeroHome({ onNav, mercado, setMercado, scrollRef }) {
  const wa = waUrl(WA_RIO, 'Olá, gostaria de conhecer imóveis da Admirata.');
  const sub = mercado === 'Rio de Janeiro'
    ? 'Curadoria de coberturas e apartamentos de alto padrão no Rio de Janeiro — venda e locação.'
    : mercado === 'Serra Gaúcha'
    ? 'Curadoria de casas e coberturas na Serra Gaúcha — Gramado e Canela, venda e locação.'
    : 'Curadoria de coberturas, apartamentos e casas exclusivas no Rio de Janeiro e na Serra Gaúcha — venda e locação.';
  const scrollDown = () => { if (scrollRef && scrollRef.current) scrollRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); };
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: '#0c0e1a' }}>
      {/* Fundo cinematográfico (placeholder — foto real entra aqui) */}
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(120% 80% at 70% 18%, rgba(80,90,120,0.45) 0%, rgba(30,34,52,0.2) 35%, transparent 60%),' +
        'radial-gradient(90% 60% at 30% 8%, rgba(184,150,12,0.10) 0%, transparent 50%),' +
        'linear-gradient(180deg, #1b2030 0%, #14182a 42%, #0c0e1a 78%, #090b15 100%)' }} />
      {/* silhueta de relevo (serra) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%', background:
        'radial-gradient(140% 100% at 82% 100%, #05060c 30%, transparent 72%),' +
        'radial-gradient(120% 100% at 18% 100%, #07080f 28%, transparent 70%)' }} />
      {/* protection gradient para legibilidade do texto */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,24,0.55) 0%, transparent 30%, transparent 55%, rgba(9,11,21,0.85) 100%)' }} />

      {/* ── Formas geométricas flutuantes ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <ElegantShape delay={0.3} width={600} height={140} rotate={12}  color="rgba(184,150,12,0.14)" pos={{ left:'-6%',  top:'18%' }} />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} color="rgba(255,255,255,0.07)" pos={{ right:'-2%', top:'65%' }} />
        <ElegantShape delay={0.4} width={280} height={72}  rotate={-8}  color="rgba(184,150,12,0.10)" pos={{ left:'7%',  bottom:'8%' }} />
        <ElegantShape delay={0.6} width={190} height={52}  rotate={20}  color="rgba(255,255,255,0.06)" pos={{ right:'16%', top:'10%' }} />
        <ElegantShape delay={0.7} width={150} height={40}  rotate={-25} color="rgba(184,150,12,0.08)" pos={{ left:'22%', top:'5%'  }} />
      </div>

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1440, width: '100%', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(5rem, 12vh, 9rem)' }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--color-gold)', marginBottom: 24 }}>Negócios imobiliários de alto padrão</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: '#fff', lineHeight: 1.02, marginBottom: 28, fontSize: 'clamp(3rem, 8vw, 6.5rem)', maxWidth: 900, textWrap: 'balance' }}>
          O imóvel certo,<br /><em style={{ fontStyle: 'italic', color: 'rgba(212,172,26,0.92)' }}>com discrição e cuidado.</em>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
          {sub}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)' }}>Região</span>
          {window.MarketSwitcher && <window.MarketSwitcher value={mercado} onChange={setMercado} />}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <NeonButton variant="solid" size="lg" onClick={() => onNav({ name: 'imoveis' })}>Explorar imóveis</NeonButton>
          <NeonButton variant="ghost" size="lg" tone="onDark" href={wa} target="_blank" rel="noopener">Fale conosco</NeonButton>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
          {[['Rio de Janeiro', 'Barra · Recreio · Zona Sul'], ['Serra Gaúcha', 'Gramado · Canela'], ['Atuação', 'Venda · Locação · Administração']].map(([t, s]) => (
            <div key={t}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-gold)', textTransform: 'uppercase' }}>{t}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div onClick={scrollDown} style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', animation: 'adm-scroll-pulse 2s ease-in-out 1s infinite' }} />
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.35)' }}>Scroll</span>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CARD DE IMÓVEL
   ═══════════════════════════════════════════════════════════════════════ */
function ImovelCard({ imovel, onOpen }) {
  const [hover, setHover] = useState(false);
  const i = imovel;
  return (
    <a onClick={() => onOpen(i)} style={{ display: 'block', cursor: 'pointer' }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <PropImg seed={i.seedIdx} label={i.tipo} ratio="4 / 3" style={{ transition: 'transform .7s var(--ease-smooth)' }}>
        {/* badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {i.exclusivo && <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', background: 'var(--color-gold)', color: '#fff', padding: '4px 10px', fontWeight: 500 }}>Exclusivo</span>}
          {i.novidade && !i.exclusivo && <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', background: 'var(--color-ink)', color: '#fff', padding: '4px 10px', fontWeight: 500 }}>Novo</span>}
          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', color: 'var(--color-ink)', padding: '4px 10px' }}>{i.tipo}</span>
        </div>
        {i.permuta && <div style={{ position: 'absolute', top: 12, right: 12 }}><span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', color: 'var(--color-ink)', padding: '2px 8px' }}>Permuta</span></div>}
        {/* overlay hover */}
        <div style={{ position: 'absolute', inset: 0, background: hover ? 'rgba(26,26,46,0.1)' : 'transparent', transition: 'background .5s' }} />
      </PropImg>

      <div style={{ paddingTop: 16 }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold)', marginBottom: 6 }}>
          {i.bairro} · {i.cidade}
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: hover ? 'var(--color-gold)' : 'var(--color-ink)', lineHeight: 1.3, transition: 'color .2s', fontWeight: 400 }}>{i.titulo}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8, fontSize: 11, color: 'var(--color-muted)' }}>
          <span>{formatArea(i.area)}</span>
          <span>{i.quartos} quartos{i.suites ? ` · ${i.suites} suíte${i.suites > 1 ? 's' : ''}` : ''}</span>
          <span>{i.vagas} vagas</span>
        </div>
        <p style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>{formatPreco(i.preco)}</p>
      </div>
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SEÇÃO IMÓVEIS EM DESTAQUE (home)
   ═══════════════════════════════════════════════════════════════════════ */
function ImoveisDestaque({ onOpen, onNav, mercado }) {
  const base = IMOVEIS.map((im, idx) => ({ ...im, seedIdx: idx }));
  const lista = mercado ? base.filter(im => im.mercado === mercado) : base;
  return (
    <section style={{ padding: 'var(--section-padding) 0', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, gap: 32 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 12 }}>{mercado || 'Seleção exclusiva'}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-ink)', fontWeight: 300 }}>Imóveis em destaque</h2>
          </div>
          <a onClick={() => onNav({ name: 'imoveis' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', cursor: 'pointer', flexShrink: 0 }}>Ver todos <span>→</span></a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 32px' }}>
          {lista.map(im => <ImovelCard key={im.id} imovel={im} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   REVEAL TEXT — letras revelam imagem no hover + varredura dourada (Admirata)
   Reimplementação em CSS/React do componente reveal-text (sem framer-motion).
   ═══════════════════════════════════════════════════════════════════════ */
const REVEAL_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1400&q=80',
];

function RevealText({ text = 'BARRA', images = REVEAL_IMGS }) {
  const [hover, setHover] = useState(null);
  const [sweep, setSweep] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSweep(true), 400);
    return () => clearTimeout(t);
  }, []);
  const letterStyle = {
    position: 'relative', display: 'inline-block', cursor: 'pointer', overflow: 'hidden',
    fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'clamp(2.75rem, 11vw, 9rem)',
    lineHeight: 1.02, letterSpacing: '-0.03em',
  };
  let imgIdx = 0;
  let gi = 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.32em' }}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
          {word.split('').map((ch) => {
            const i = gi++;
            const img = images[imgIdx++ % images.length];
            const on = hover === i;
            return (
              <span key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={letterStyle}>
                {/* base */}
                <span style={{ color: on ? 'transparent' : '#fff', transition: 'color .12s' }}>{ch}</span>
                {/* preenchimento por imagem */}
                <span style={{
                  position: 'absolute', inset: 0, backgroundImage: `url('${img}')`, backgroundSize: 'cover',
                  backgroundPosition: on ? '12% center' : '0% center', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', color: 'transparent', opacity: on ? 1 : 0,
                  transition: 'opacity .15s, background-position 3s ease-in-out',
                }}>{ch}</span>
                {/* varredura dourada única */}
                {sweep && <span style={{
                  position: 'absolute', inset: 0, color: 'var(--color-gold)', pointerEvents: 'none',
                  animation: `adm-sweep .5s ease-in-out ${i * 0.05}s both`,
                }}>{ch}</span>}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

/* ── Seção: bairro em destaque (Barra da Tijuca) ── */
function BarraDestaque({ onNav, mercado }) {
  const reg = mercado === 'Serra Gaúcha'
    ? { text: 'GRAMADO', copy: 'O destino de serra mais charmoso do Brasil — arquitetura em pedra e madeira, ruas arborizadas e gastronomia premiada. Casas em condomínio e coberturas para morar ou para a temporada de inverno.', btn: 'Ver imóveis em Gramado' }
    : { text: 'BARRA DA TIJUCA', copy: 'Orla de 18 km, condomínios planejados e a maior concentração de imóveis de alto padrão do Rio. Da praia à lagoa, a Barra reúne segurança, lazer completo e arquitetura contemporânea.', btn: 'Ver imóveis na Barra' };
  return (
    <section style={{ background: 'var(--color-ink)', padding: 'var(--section-padding) 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 2.5rem)', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--color-gold)', marginBottom: 8 }}>Bairro em destaque</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>Passe o mouse sobre o nome</p>
        <RevealText text={reg.text} />
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: 620, margin: '40px auto 32px' }}>
          {reg.copy}
        </p>
        <NeonButton variant="solid" size="lg" onClick={() => onNav({ name: 'imoveis' })}>{reg.btn}</NeonButton>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   GRADE DE BAIRROS (home)
   ═══════════════════════════════════════════════════════════════════════ */
function BairrosGrid({ onNav, mercado }) {
  const lista = mercado ? BAIRROS.filter(b => b.cidade === mercado) : BAIRROS;
  return (
    <section style={{ padding: 'var(--section-padding) 0', background: 'var(--color-stone)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 12 }}>Localidades</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-ink)', fontWeight: 300 }}>Nossos bairros</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {lista.map(b => (
            <a key={b.nome} onClick={() => onNav({ name: 'imoveis' })} style={{ display: 'block', cursor: 'pointer', position: 'relative' }} className="adm-bairro-card">
              <PropImg seed={b.seed} ratio="3 / 2">
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.75), transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', lineHeight: 1.1 }}>{b.nome}</p>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{b.count} imóveis · {b.cidade}</p>
                </div>
              </PropImg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FILTROS (tela imóveis)
   ═══════════════════════════════════════════════════════════════════════ */
function FiltrosSearch({ filtros, setFiltros, total }) {
  const chip = (active) => ({
    display: 'inline-flex', alignItems: 'center', padding: '6px 14px', fontSize: 11,
    fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    border: active ? '1px solid var(--color-ink)' : '1px solid rgba(138,138,154,0.25)',
    background: active ? 'var(--color-ink)' : 'transparent',
    color: active ? '#fff' : 'var(--color-muted)', transition: 'all .18s', whiteSpace: 'nowrap',
  });
  const tem = Boolean(filtros.tipo || filtros.mercado || filtros.quartos);
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        <button style={chip(!filtros.tipo)} onClick={() => setFiltros({ ...filtros, tipo: '' })}>Todos</button>
        {TIPOS.map(t => <button key={t} style={chip(filtros.tipo === t)} onClick={() => setFiltros({ ...filtros, tipo: filtros.tipo === t ? '' : t })}>{t}</button>)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-muted)', marginRight: 4 }}>Mercado</span>
          {MERCADOS.map(m => <button key={m} style={chip(filtros.mercado === m)} onClick={() => setFiltros({ ...filtros, mercado: filtros.mercado === m ? '' : m })}>{m === 'Rio de Janeiro' ? 'Rio' : 'Serra Gaúcha'}</button>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-muted)', marginRight: 4 }}>Quartos</span>
          {[1, 2, 3, 4].map(q => <button key={q} style={chip(filtros.quartos === q)} onClick={() => setFiltros({ ...filtros, quartos: filtros.quartos === q ? 0 : q })}>{q}+</button>)}
        </div>
        {tem && <button onClick={() => setFiltros({ tipo: '', mercado: '', quartos: 0 })} style={{ fontSize: 11, color: 'var(--color-muted)', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: 2, marginLeft: 'auto' }}>Limpar filtros</button>}
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--color-stone)' }}>
        {total === 0 ? 'Nenhum imóvel encontrado para os filtros selecionados.' : total === 1 ? '1 imóvel disponível' : `${total} imóveis disponíveis`}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   TELA IMÓVEIS (listagem)
   ═══════════════════════════════════════════════════════════════════════ */
function ImoveisScreen({ onOpen, mercado }) {
  const [filtros, setFiltros] = useState({ tipo: '', mercado: mercado || '', quartos: 0 });
  const lista = IMOVEIS.map((im, idx) => ({ ...im, seedIdx: idx })).filter(i =>
    (!filtros.tipo || i.tipo === filtros.tipo) &&
    (!filtros.mercado || i.mercado === filtros.mercado) &&
    (!filtros.quartos || i.quartos >= filtros.quartos)
  );
  return (
    <main style={{ paddingTop: 72, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 2.5rem) 6rem' }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 12 }}>Admirata Imóveis</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-ink)', fontWeight: 300, marginBottom: 8 }}>Imóveis</h1>
        <p style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginBottom: 48 }}>Rio de Janeiro · Gramado · Canela</p>
        <FiltrosSearch filtros={filtros} setFiltros={setFiltros} total={lista.length} />
        {lista.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 32px' }}>
            {lista.map(im => <ImovelCard key={im.id} imovel={im} onOpen={onOpen} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-ink)', marginBottom: 8 }}>Nenhum imóvel corresponde aos filtros</p>
            <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Tente ampliar os critérios de busca ou remover alguns filtros.</p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   TELA DETALHE — PDI
   ═══════════════════════════════════════════════════════════════════════ */
function DetalheScreen({ imovel, onNav, onOpen }) {
  const i = imovel;
  const wa = waUrl(i.mercado === 'Serra Gaúcha' ? WA_SERRA : WA_RIO, `Olá, tenho interesse no imóvel: ${i.titulo} (${i.bairro}).`);
  const especs = [
    ['Área útil', formatArea(i.area)], ['Área total', formatArea(i.areaTotal)],
    ['Quartos', String(i.quartos)], ['Suítes', String(i.suites)],
    ['Banheiros', String(i.banheiros)], ['Vagas', String(i.vagas)],
    i.andar ? ['Andar', `${i.andar}º`] : null, ['Tipo', i.tipo],
    ['Condomínio', formatPreco(i.condominio)], ['IPTU/ano', formatPreco(i.iptu)],
  ].filter(Boolean);
  const relacionados = IMOVEIS.map((im, idx) => ({ ...im, seedIdx: idx })).filter(x => x.id !== i.id).slice(0, 3);

  return (
    <main style={{ paddingTop: 72, background: '#fff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px clamp(1.5rem, 4vw, 2.5rem) 0', fontSize: 11, color: 'var(--color-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <a onClick={() => onNav({ name: 'home' })} style={{ cursor: 'pointer' }}>Início</a><span>/</span>
        <a onClick={() => onNav({ name: 'imoveis' })} style={{ cursor: 'pointer' }}>Imóveis</a><span>/</span>
        <span style={{ color: 'var(--color-ink)' }}>{i.titulo}</span>
      </div>

      {/* Galeria hero */}
      <section style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, aspectRatio: '16 / 7' }}>
          <PropImg seed={i.seedIdx} label="Foto 1" ratio="auto" style={{ gridRow: '1 / 3', height: '100%' }} />
          <PropImg seed={i.seedIdx + 1} label="Foto 2" ratio="auto" style={{ height: '100%' }} />
          <PropImg seed={i.seedIdx + 2} label="Foto 3" ratio="auto" style={{ height: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,46,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff' }}>+ 12 fotos</span>
            </div>
          </PropImg>
        </div>
      </section>

      {/* Corpo: 2 colunas */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 2.5rem) 6rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start' }} className="adm-pdi-grid">
        {/* Esquerda */}
        <div>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold)', marginBottom: 12 }}>{i.bairro} · {i.cidade}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--color-ink)', fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>{i.titulo}</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 40 }}>{formatPreco(i.preco)}</p>

          {/* descrição */}
          <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: 16 }}>Sobre o imóvel</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text)', maxWidth: 620, marginBottom: 56 }}>{i.descricao}</p>

          {/* Ficha técnica */}
          <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: 24 }}>Ficha técnica</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1, background: 'var(--color-stone)', marginBottom: 40 }}>
            {especs.map(([label, val]) => (
              <div key={label} style={{ background: '#fff', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--color-ink)', fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Características por grupo */}
          {Object.entries(i.caracteristicas).map(([grupo, nomes]) => (
            <div key={grupo} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginBottom: 12 }}>{grupo}</h3>
              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px 24px' }}>
                {nomes.map(n => (
                  <li key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--color-ink)' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-gold)', flexShrink: 0 }} />{n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Direita: CTA sticky */}
        <aside style={{ position: 'sticky', top: 96 }} className="adm-pdi-aside">
          <div style={{ border: '1px solid var(--color-stone)', padding: 28 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-ink)', lineHeight: 1.25, marginBottom: 6 }}>Fale com um especialista</p>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 24 }}>Atendimento exclusivo Admirata para este imóvel.</p>
            <NeonButton variant="solid" href={wa} target="_blank" rel="noopener" style={{ width: '100%', marginBottom: 12 }}>WhatsApp</NeonButton>
            <NeonButton variant="ghost" style={{ width: '100%' }}>Agendar visita</NeonButton>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-stone)', fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.8 }}>
              <p>Ref. {i.id.toUpperCase()}</p>
              <p>{i.mercado === 'Serra Gaúcha' ? 'Roberto Barros · Serra Gaúcha' : 'Equipe Admirata · Rio de Janeiro'}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Relacionados */}
      <section style={{ background: 'var(--color-stone)', padding: 'var(--section-padding) 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 2.5rem)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-ink)', fontWeight: 300, marginBottom: 40 }}>Imóveis semelhantes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px 32px' }}>
            {relacionados.map(im => <ImovelCard key={im.id} imovel={im} onOpen={onOpen} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════ */
function Footer({ onNav }) {
  const cols = [
    { h: 'Imóveis', links: ['Todos os imóveis', 'Lançamentos', 'Coberturas e Penthouses', 'Frente ao mar', 'Vista mar', 'Na planta', 'Condomínios'] },
    { h: 'Empresa', links: ['Quem Somos', 'Contato', 'Favoritos', 'Blog', 'Privacidade'] },
    { h: 'Localizações', links: ['Barra da Tijuca', 'Recreio dos Bandeirantes', 'Leblon / Ipanema', 'Jacarepaguá', 'Gramado / Canela'] },
  ];
  return (
    <footer style={{ background: 'var(--color-ink)', color: 'rgba(255,255,255,0.7)' }}>
      {/* newsletter */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(3rem,5vw,4.5rem) clamp(1.5rem,4vw,2.5rem)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', color: '#fff', fontWeight: 300, marginBottom: 8 }}>Receba imóveis selecionados</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>Curadoria mensal de oportunidades exclusivas no Rio e na Serra.</p>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input type="email" placeholder="Seu e-mail" style={{ flex: 1, minWidth: 200, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 16px', fontSize: 13, fontFamily: 'var(--font-body)' }} />
          <button style={{ background: 'var(--color-gold)', color: '#fff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '12px 24px', border: 'none' }}>Assinar</button>
        </form>
      </div>
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(184,150,12,0.4), transparent)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px clamp(1.5rem,4vw,2.5rem) 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }} className="adm-footer-grid">
          <div>
            <a onClick={() => onNav({ name: 'home' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, cursor: 'pointer' }}>
              <span style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(184,150,12,0.5)', fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--color-gold)' }}>A</span>
              <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.8)' }}>Admirata Imóveis</span>
            </a>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 320, marginBottom: 24 }}>Especialistas em imóveis de alto padrão no Rio de Janeiro e Serra Gaúcha. Curadoria exclusiva para compradores e investidores exigentes.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={waUrl(WA_RIO, 'Olá, tenho interesse em imóveis da Admirata.')} target="_blank" rel="noopener" style={{ fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-gold)' }}>+ WhatsApp Rio de Janeiro</a>
              <a href={waUrl(WA_SERRA, 'Olá, tenho interesse em imóveis da Admirata.')} target="_blank" rel="noopener" style={{ fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-gold)' }}>+ WhatsApp Serra Gaúcha</a>
              <a href="mailto:atendimento@admirataimoveis.com.br" style={{ fontSize: 12, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>@ atendimento@admirataimoveis.com.br</a>
            </div>
          </div>
          {cols.map(c => (
            <nav key={c.h}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--color-gold)', marginBottom: 20 }}>{c.h}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {c.links.map(l => <li key={l}><a onClick={() => onNav({ name: 'imoveis' })} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{l}</a></li>)}
              </ul>
            </nav>
          ))}
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <span>Copyright {new Date().getFullYear()} Admirata Negócios Imobiliários Ltda</span>
            <span>CRECI-F 58308 · CRECI RJ-008553/O</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}><span>Privacidade</span><span>|</span><span>Termos</span></div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   WHATSAPP FLUTUANTE
   ═══════════════════════════════════════════════════════════════════════ */
function WhatsAppFab() {
  return (
    <a href={waUrl(WA_RIO, 'Olá, tenho interesse em imóveis da Admirata.')} target="_blank" rel="noopener"
       title="WhatsApp" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 90, width: 56, height: 56, borderRadius: '50%',
        background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
      <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 28, height: 28 }}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.24-3.27-.68-2.77-1.09-4.54-3.92-4.68-4.1-.14-.18-1.13-1.5-1.13-2.86s.71-2.03.97-2.31c.24-.27.53-.34.71-.34l.51.01c.16.01.39-.06.6.46.24.58.81 2 .88 2.15.07.14.12.31.02.49-.09.18-.14.29-.27.45-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.14.45.2.51.31.07.12.07.66-.17 1.34Z"/>
      </svg>
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   APP SHELL
   ═══════════════════════════════════════════════════════════════════════ */
function App() {
  const [route, setRoute] = useState({ name: 'home' });
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  // Preferência de mercado (persistente — localStorage). '' = ver tudo.
  const [mercado, setMercadoState] = useState(() => { const v = window.readMercado(); return v === null ? '' : v; });
  const [showGate, setShowGate] = useState(() => window.readMercado() === null);
  const setMercado = (v) => { setMercadoState(v); window.writeMercado(v); };
  const chooseMercado = (v) => { setMercado(v); setShowGate(false); };

  const onNav = (r) => { setRoute(r); if (scrollRef.current) scrollRef.current.scrollTop = 0; };
  const onOpen = (imovel) => { setRoute({ name: 'detalhe', imovel }); if (scrollRef.current) scrollRef.current.scrollTop = 0; };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 48);
    h();
    el.addEventListener('scroll', h, { passive: true });
    return () => el.removeEventListener('scroll', h);
  }, []);

  const placeholder = (titulo, sub) => (
    <main style={{ paddingTop: 72, minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,4vw,2.5rem)', textAlign: 'center' }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--color-gold)', marginBottom: 16 }}>{sub}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--color-ink)', fontWeight: 300, marginBottom: 16 }}>{titulo}</h1>
        <p style={{ fontSize: 15, color: 'var(--color-muted)', maxWidth: 480, margin: '0 auto' }}>Esta seção existe no site em produção. Conteúdo carregado via Sanity — recriação foca em Home, Imóveis e Detalhe.</p>
      </div>
    </main>
  );

  const PLACEHOLDERS = {
    venda: ['Imóveis à Venda', 'Coberturas · Casas · Apartamentos'],
    lancamentos: ['Lançamentos', 'Empreendimentos na planta'],
    videos: ['Vídeos', 'Tours e apresentações'],
    condominios: ['Condomínios', 'Referências em exclusividade'],
    anuncie: ['Anuncie seu imóvel', 'Administração e captação'],
    sobre: ['Sobre a Admirata', 'Quem somos'],
    contato: ['Contato', 'Fale com a Admirata'],
    bairros: ['Bairros & Localizações', 'Curadoria exclusiva'],
    blog: ['Lifestyle & Mercado', 'Curadoria editorial'],
    favoritos: ['Imóveis Favoritos', 'Sua lista pessoal'],
    cliente: ['Área do Cliente', 'Acesso restrito'],
  };
  const known = ['home', 'imoveis', 'detalhe', 'sobre'];
  const ph = !known.includes(route.name) ? PLACEHOLDERS[route.name] : null;

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: 'var(--color-stone)' }}>
      <Navbar route={route} onNav={onNav} scrolled={scrolled} />
      {showGate && window.MarketGate && <window.MarketGate onChoose={chooseMercado} />}
      {route.name === 'home' && (<><HeroHome onNav={onNav} mercado={mercado} setMercado={setMercado} scrollRef={scrollRef} /><ImoveisDestaque onOpen={onOpen} onNav={onNav} mercado={mercado} /><BarraDestaque onNav={onNav} mercado={mercado} /><BairrosGrid onNav={onNav} mercado={mercado} /></>)}
      {route.name === 'imoveis' && <ImoveisScreen onOpen={onOpen} mercado={mercado} />}
      {route.name === 'detalhe' && <DetalheScreen imovel={route.imovel} onNav={onNav} onOpen={onOpen} />}
      {route.name === 'sobre' && window.SobreScreen && <window.SobreScreen onNav={onNav} />}
      {ph && placeholder(ph[0], ph[1])}
      <Footer onNav={onNav} />
      <WhatsAppFab />
    </div>
  );
}

window.NeonButton = NeonButton;
window.AdmirataSiteApp = App;
