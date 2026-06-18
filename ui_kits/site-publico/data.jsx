// Admirata — dados de demonstração do site público (estrutura espelha o schema Sanity)
const { useState, useEffect, useRef } = React;

// ─── WhatsApp (números reais de produção) ────────────────────────────────────
const WA_RIO = '5521998079459';
const WA_SERRA = '5554992643070';
function waUrl(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// ─── formatadores (espelham src/lib/formatters) ──────────────────────────────
function formatPreco(v) {
  if (!v) return 'Sob consulta';
  return 'R$ ' + v.toLocaleString('pt-BR');
}
function formatArea(m2) { return m2 + ' m²'; }

// ─── Placeholder de imagem arquitetônico (sem foto inventada) ────────────────
// Duotone abstrato em tons da marca; determinístico por seed. Imagens reais
// vêm do Sanity em produção.
function PropImg({ seed = 0, label, ratio = '4 / 3', priority, style, children }) {
  const palettes = [
    ['#23233f', '#3a3a5c', '#1a1a2e'],
    ['#2b2538', '#4a3f52', '#1a1a2e'],
    ['#1e2a33', '#33454f', '#15202a'],
    ['#2e2a22', '#4a4234', '#1f1c16'],
    ['#252a30', '#3c454e', '#181c20'],
    ['#2a2433', '#433a4e', '#1c1826'],
  ];
  const p = palettes[seed % palettes.length];
  return (
    <div style={{
      position: 'relative', aspectRatio: ratio, overflow: 'hidden',
      background: `linear-gradient(150deg, ${p[1]} 0%, ${p[0]} 45%, ${p[2]} 100%)`,
      ...style,
    }}>
      {/* faixa de horizonte sutil */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 52%, rgba(184,150,12,0.06) 60%, transparent 68%)' }} />
      {/* marca d'água A */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', lineHeight: 1,
          color: 'rgba(255,255,255,0.045)', userSelect: 'none' }}>A</span>
      </div>
      {label && (
        <span style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'var(--font-mono)',
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

// ─── Imóveis (mercados Rio + Serra Gaúcha) ───────────────────────────────────
const IMOVEIS = [
  {
    id: 'cob-leblon', titulo: 'Cobertura duplex frente-mar', tipo: 'Cobertura duplex',
    bairro: 'Leblon', cidade: 'Rio de Janeiro', mercado: 'Rio de Janeiro',
    preco: 14500000, exclusivo: true, novidade: false, permuta: false,
    area: 380, areaTotal: 520, quartos: 4, suites: 4, banheiros: 6, vagas: 4, andar: 12,
    condominio: 8900, iptu: 42000,
    descricao: 'Cobertura duplex de exceção sobre a orla do Leblon. Vista-mar irrestrita, terraço com piscina privativa e acabamento assinado por escritório de arquitetura premiado.',
    caracteristicas: { 'Lazer': ['Piscina privativa', 'Spa', 'Adega climatizada'], 'Vista': ['Vista mar', 'Vista lagoa'], 'Estrutura': ['Elevador privativo', 'Gerador', 'Automação'] },
  },
  {
    id: 'apt-ipanema', titulo: 'Apartamento alto padrão vista mar', tipo: 'Apartamento',
    bairro: 'Ipanema', cidade: 'Rio de Janeiro', mercado: 'Rio de Janeiro',
    preco: 8900000, exclusivo: false, novidade: false, permuta: true,
    area: 220, areaTotal: 240, quartos: 3, suites: 3, banheiros: 4, vagas: 2, andar: 8,
    condominio: 5200, iptu: 24000,
    descricao: 'Apartamento amplo a uma quadra da praia de Ipanema, totalmente reformado, com varanda gourmet integrada e vista para o mar.',
    caracteristicas: { 'Lazer': ['Varanda gourmet', 'Academia'], 'Vista': ['Vista mar parcial'], 'Estrutura': ['Portaria 24h', '2 vagas'] },
  },
  {
    id: 'pent-barra', titulo: 'Penthouse com rooftop privativo', tipo: 'Penthouse',
    bairro: 'Barra da Tijuca', cidade: 'Rio de Janeiro', mercado: 'Rio de Janeiro',
    preco: 12000000, exclusivo: true, novidade: false, permuta: false,
    area: 410, areaTotal: 560, quartos: 4, suites: 4, banheiros: 5, vagas: 5, andar: 20,
    condominio: 9800, iptu: 38000,
    descricao: 'Penthouse no coração da Barra com rooftop privativo de 180m², piscina com borda infinita e vista panorâmica para a praia e a lagoa.',
    caracteristicas: { 'Lazer': ['Rooftop privativo', 'Piscina infinita', 'Churrasqueira'], 'Vista': ['Vista mar', 'Vista panorâmica'], 'Estrutura': ['5 vagas', 'Automação', 'Gerador'] },
  },
  {
    id: 'casa-gramado', titulo: 'Casa em condomínio na Serra', tipo: 'Casa em condomínio',
    bairro: 'Gramado', cidade: 'Gramado', mercado: 'Serra Gaúcha',
    preco: 6800000, exclusivo: false, novidade: true, permuta: false,
    area: 480, areaTotal: 1200, quartos: 5, suites: 4, banheiros: 6, vagas: 4, andar: null,
    condominio: 2400, iptu: 16000,
    descricao: 'Casa de alto padrão em condomínio fechado próximo ao centro de Gramado. Arquitetura em pedra e madeira, lareira, e amplo jardim com vista para o vale.',
    caracteristicas: { 'Lazer': ['Lareira', 'Spa', 'Jardim'], 'Vista': ['Vista vale', 'Vista mata'], 'Estrutura': ['Condomínio fechado', 'Aquecimento central'] },
  },
  {
    id: 'apt-recreio', titulo: 'Apartamento garden com lazer completo', tipo: 'Apartamento',
    bairro: 'Recreio dos Bandeirantes', cidade: 'Rio de Janeiro', mercado: 'Rio de Janeiro',
    preco: 2400000, exclusivo: false, novidade: true, permuta: false,
    area: 140, areaTotal: 160, quartos: 3, suites: 1, banheiros: 3, vagas: 2, andar: 2,
    condominio: 1800, iptu: 9800,
    descricao: 'Garden em condomínio-clube no Recreio, com área privativa externa e infraestrutura de lazer completa a poucos minutos da praia.',
    caracteristicas: { 'Lazer': ['Área privativa', 'Piscina (condomínio)', 'Quadra'], 'Estrutura': ['Condomínio-clube', '2 vagas'] },
  },
  {
    id: 'cob-canela', titulo: 'Cobertura panorâmica em Canela', tipo: 'Cobertura',
    bairro: 'Canela', cidade: 'Canela', mercado: 'Serra Gaúcha',
    preco: 4200000, exclusivo: false, novidade: false, permuta: false,
    area: 300, areaTotal: 340, quartos: 4, suites: 3, banheiros: 4, vagas: 3, andar: 7,
    condominio: 2100, iptu: 12000,
    descricao: 'Cobertura com terraço panorâmico no centro de Canela, lareira a lenha e acabamento sofisticado ideal para segunda residência na Serra.',
    caracteristicas: { 'Lazer': ['Lareira a lenha', 'Terraço panorâmico'], 'Vista': ['Vista serra'], 'Estrutura': ['3 vagas', 'Elevador'] },
  },
];

const BAIRROS = [
  { nome: 'Leblon', cidade: 'Rio de Janeiro', seed: 0, count: 8 },
  { nome: 'Ipanema', cidade: 'Rio de Janeiro', seed: 1, count: 6 },
  { nome: 'Barra da Tijuca', cidade: 'Rio de Janeiro', seed: 2, count: 14 },
  { nome: 'Recreio', cidade: 'Rio de Janeiro', seed: 4, count: 9 },
  { nome: 'Gramado', cidade: 'Serra Gaúcha', seed: 3, count: 7 },
  { nome: 'Canela', cidade: 'Serra Gaúcha', seed: 5, count: 5 },
];

const TIPOS = ['Apartamento', 'Cobertura', 'Cobertura duplex', 'Penthouse', 'Casa', 'Casa em condomínio'];
const MERCADOS = ['Rio de Janeiro', 'Serra Gaúcha'];

Object.assign(window, { useState, useEffect, useRef, WA_RIO, WA_SERRA, waUrl, formatPreco, formatArea, PropImg, IMOVEIS, BAIRROS, TIPOS, MERCADOS });
