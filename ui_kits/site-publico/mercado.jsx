// Admirata — preferência de mercado (Rio de Janeiro × Serra Gaúcha)
// Gate de boas-vindas (1ª visita) + seletor persistente + detecção por geolocalização.
// Persistência via localStorage (chave 'admirata_mercado'): 'Rio de Janeiro' | 'Serra Gaúcha' | '' (ver tudo).
const { useState: useStateMkt, useEffect: useEffectMkt } = React;

const MKT_KEY = 'admirata_mercado';

// Coordenadas-âncora de cada mercado
const MKT_GEO = {
  'Rio de Janeiro': { lat: -22.9068, lon: -43.1729 },
  'Serra Gaúcha': { lat: -29.3789, lon: -50.8741 },
};

// Mercado mais próximo de uma coordenada (distância euclidiana — suficiente p/ 2 pontos distantes)
function nearestMercado(lat, lon) {
  let best = 'Rio de Janeiro', bestD = Infinity;
  for (const [nome, g] of Object.entries(MKT_GEO)) {
    const d = (g.lat - lat) ** 2 + (g.lon - lon) ** 2;
    if (d < bestD) { bestD = d; best = nome; }
  }
  return best;
}

// Leitura/escrita da preferência
function readMercado() {
  try { return localStorage.getItem(MKT_KEY); } catch { return null; }
}
function writeMercado(v) {
  try { localStorage.setItem(MKT_KEY, v); } catch {}
}

/* ─────────────────────────────────────────────────────────────────────────
   SELETOR SEGMENTADO — Rio · Serra · Ver tudo  (para usar no hero, tom claro)
   ───────────────────────────────────────────────────────────────────────── */
function MarketSwitcher({ value, onChange }) {
  const opts = [
    { v: 'Rio de Janeiro', label: 'Rio de Janeiro' },
    { v: 'Serra Gaúcha', label: 'Serra Gaúcha' },
    { v: '', label: 'Ver tudo' },
  ];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'stretch',
      border: '1px solid rgba(255,255,255,0.22)', borderRadius: 2, overflow: 'hidden',
      background: 'rgba(13,13,24,0.35)', backdropFilter: 'blur(6px)',
    }}>
      {opts.map((o, idx) => {
        const active = value === o.v;
        return (
          <button key={(o.v || 'all') + (active ? '-on' : '')} onClick={() => onChange(o.v)} className={active ? '' : 'adm-mkt-btn'} style={{
            backgroundColor: active ? '#b8960c' : 'transparent',
            color: active ? '#fff' : 'rgba(255,255,255,0.7)',
            border: 'none', borderLeft: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.14)',
            padding: '9px 16px', fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   GATE DE BOAS-VINDAS — 1ª visita: escolha de região (manual ou geo)
   ───────────────────────────────────────────────────────────────────────── */
function MarketGate({ onChoose }) {
  const [closing, setClosing] = useStateMkt(false);
  const [geoState, setGeoState] = useStateMkt('idle'); // idle | loading | error
  const PropImg = window.PropImg;

  const pick = (v) => onChoose(v);

  const useLocation = () => {
    if (!navigator.geolocation) { setGeoState('error'); return; }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => pick(nearestMercado(pos.coords.latitude, pos.coords.longitude)),
      () => setGeoState('error'),
      { timeout: 8000, maximumAge: 600000 }
    );
  };

  const regioes = [
    { v: 'Rio de Janeiro', seed: 2, sub: 'Barra · Recreio · Zona Sul' },
    { v: 'Serra Gaúcha', seed: 3, sub: 'Gramado · Canela' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(8,9,17,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(1.25rem, 4vw, 3rem)',
      opacity: closing ? 0 : 1, transition: 'opacity .36s var(--ease-smooth)',
      overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 860, textAlign: 'center', margin: 'auto' }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--color-gold)', marginBottom: 18 }}>Bem-vindo à Admirata</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.1, marginBottom: 14, textWrap: 'balance' }}>
          Onde você procura seu imóvel?
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 460, margin: '0 auto 40px' }}>
          Escolha a região para ver uma curadoria sob medida. Você pode mudar a qualquer momento.
        </p>

        <div className="adm-gate-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
          {regioes.map(r => (
            <button key={r.v} onClick={() => pick(r.v)} className="adm-gate-card" style={{
              position: 'relative', border: '1px solid rgba(184,150,12,0.35)', background: 'none',
              padding: 0, cursor: 'pointer', overflow: 'hidden', textAlign: 'left',
              transition: 'transform .35s var(--ease-smooth), border-color .35s',
            }}>
              {PropImg && <PropImg seed={r.seed} ratio="16 / 10" />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,17,0.82), rgba(8,9,17,0.15) 70%)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'clamp(16px,2.5vw,24px)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', lineHeight: 1.1, marginBottom: 6 }}>{r.v}</p>
                <p style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)' }}>{r.sub}</p>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px 24px' }}>
          <button onClick={() => pick('')} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.78)', cursor: 'pointer',
            fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: 4,
          }}>Ver as duas regiões</button>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} className="adm-hide-mobile" />
          <button onClick={useLocation} disabled={geoState === 'loading'} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: geoState === 'loading' ? 'wait' : 'pointer',
            color: geoState === 'error' ? '#e0a3a3' : 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: '0.08em',
          }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" />
            </svg>
            {geoState === 'loading' ? 'Detectando…' : geoState === 'error' ? 'Não foi possível detectar — escolha acima' : 'Usar minha localização'}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { nearestMercado, readMercado, writeMercado, MarketSwitcher, MarketGate });
