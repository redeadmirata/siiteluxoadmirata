/**
 * Design Tokens — Admirata
 *
 * Fonte única exportável de todos os tokens visuais do projeto.
 * Sincronizado com:
 *   - src/app/globals.css (CSS custom properties)
 *   - tailwind.config.ts (theme extension)
 *   - src/lib/breakpoints.ts (breakpoints)
 *
 * Uso:
 *   import { tokens } from '@/lib/tokens'
 *   tokens.colors.gold   // '#b8960c'
 *   tokens.easing.outExpo // 'cubic-bezier(0.16, 1, 0.3, 1)'
 *
 * @see globals.css — variáveis CSS correspondentes: --color-*, --ease-*, etc.
 */

// ─── Cores ────────────────────────────────────────────────────────────────────

export const colors = {
  /** Azul-marinho profundo — cor principal da marca */
  ink: '#1a1a2e',

  /** Dourado editorial — destaque e CTAs */
  gold: '#b8960c',
  goldLight: '#d4ac1a',
  goldDark: '#8a6e09',

  /** Areia quente — fundo premium */
  stone: '#f5f0e8',

  white: '#ffffff',

  /** Texto principal */
  text: '#2b2b2b',

  /** Texto secundário / labels */
  muted: '#8a8a9a',

  /** Overlay semitransparente para modais e heroes */
  overlay: 'rgba(26, 26, 46, 0.55)',

  // ── Dark mode ──────────────────────────────────────────────────────────────
  dark: {
    background:     '#0e0e1a',
    surface:        '#1a1a2e',
    surfaceElevated:'#232338',
    text:           '#e8e0d0',
    muted:          '#7a7a8a',
    gold:           '#c9a420',
    goldLight:      '#e8bc2a',
    overlay:        'rgba(0, 0, 0, 0.70)',
    border:         'rgba(255, 255, 255, 0.08)',
  },
} as const

// ─── Tipografia ───────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    /** Cormorant Garamond — headlines editoriais */
    display: "'Cormorant Garamond', Georgia, serif",
    /** Inter — corpo e UI */
    body:    "'Inter', system-ui, sans-serif",
    /** JetBrains Mono — preço, m², métricas */
    mono:    "'JetBrains Mono', Menlo, monospace",
  },

  /** Escala de tamanhos (rem) */
  fontSize: {
    '2xs': '0.625rem',  // 10px — labels, eyebrow
    xs:    '0.6875rem', // 11px — captions
    sm:    '0.875rem',  // 14px — corpo pequeno
    base:  '1rem',      // 16px — corpo padrão
    lg:    '1.125rem',  // 18px — corpo grande
    xl:    '1.25rem',   // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px — display
    '8xl': '6rem',      // 96px — hero
    '9xl': '8rem',      // 128px — statement
  },

  fontWeight: {
    light:   '300',
    regular: '400',
    medium:  '500',
    semibold:'600',
    bold:    '700',
  },

  lineHeight: {
    tight:   '1.05',
    snug:    '1.2',
    normal:  '1.5',
    relaxed: '1.6',
    loose:   '1.8',
  },

  letterSpacing: {
    tight:   '-0.02em',
    normal:  '0',
    wide:    '0.05em',
    wider:   '0.1em',
    widest:  '0.22em',
    display: '0.35em',
  },
} as const

// ─── Espaçamento ──────────────────────────────────────────────────────────────

/**
 * Escala de espaçamento em rem (base 4px = 0.25rem).
 * Mapeada diretamente para a escala padrão do Tailwind.
 */
export const spacing = {
  px:   '1px',
  '0':  '0',
  '0.5':'0.125rem',
  '1':  '0.25rem',
  '2':  '0.5rem',
  '3':  '0.75rem',
  '4':  '1rem',
  '5':  '1.25rem',
  '6':  '1.5rem',
  '8':  '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '64': '16rem',
} as const

// ─── Breakpoints ──────────────────────────────────────────────────────────────

/** Re-exporta BREAKPOINTS de lib/breakpoints para evitar import duplo */
export { BREAKPOINTS as breakpoints } from './breakpoints'

// ─── Easing ───────────────────────────────────────────────────────────────────

export const easing = {
  /** Padrão suave — transições de layout */
  smooth:  'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Spring — botões e elementos com bounce */
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Out expo — entradas de elementos da viewport */
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Out cubic — padrão Admirata para animações editoriais */
  editorial: [0.22, 1, 0.36, 1] as const,
} as const

// ─── Duração ──────────────────────────────────────────────────────────────────

export const duration = {
  instant:  0,
  fast:     150,  // micro-interações
  normal:   250,  // hover states
  smooth:   400,  // transições de layout
  slow:     600,  // entradas de viewport
  verySlow: 900,  // hero / parallax
} as const

// ─── Z-Index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  base:     0,
  raised:   10,
  dropdown: 40,
  sticky:   50,
  overlay:  70,
  modal:    80,
  ctaFixo:  90,
  navbar:   100,
  toast:    110,
} as const

// ─── Sombras ──────────────────────────────────────────────────────────────────

export const shadows = {
  sm:   '0 1px 2px rgba(26, 26, 46, 0.06)',
  md:   '0 4px 16px rgba(26, 26, 46, 0.10)',
  lg:   '0 8px 32px rgba(26, 26, 46, 0.14)',
  xl:   '0 16px 48px rgba(26, 26, 46, 0.18)',
  gold: '0 4px 24px rgba(184, 150, 12, 0.25)',
} as const

// ─── Bordas ───────────────────────────────────────────────────────────────────

export const borders = {
  gold:      '1px solid rgba(184, 150, 12, 0.30)',
  goldLight: '1px solid rgba(184, 150, 12, 0.15)',
  stone:     '1px solid rgba(245, 240, 232, 0.60)',
  ink:       '1px solid rgba(26, 26, 46, 0.15)',
  muted:     '1px solid rgba(138, 138, 154, 0.25)',
} as const

// ─── Aspect Ratios ────────────────────────────────────────────────────────────

export const aspectRatios = {
  /** Fotos de imóveis — padrão card */
  card:   '4 / 3',
  /** Vídeo e hero — full landscape */
  hero:   '16 / 9',
  /** Plantas — levemente quadrado */
  planta: '4 / 3',
  /** Hero cinematográfico */
  cinema: '21 / 9',
  /** Thumbnail quadrado */
  square: '1 / 1',
} as const

// ─── Border Radius ────────────────────────────────────────────────────────────

/**
 * Admirata usa bordas mínimas por padrão.
 * O design é retilíneo (editorial luxury), não arredondado.
 */
export const radii = {
  none: '0',
  xs:   '2px',
  sm:   '4px',
  md:   '6px',
  lg:   '8px',
  full: '9999px',
} as const

// ─── Token consolidado ────────────────────────────────────────────────────────

/**
 * Objeto consolidado — todos os tokens em um único import.
 *
 * @example
 * import { tokens } from '@/lib/tokens'
 * const gold = tokens.colors.gold
 */
export const tokens = {
  colors,
  typography,
  spacing,
  easing,
  duration,
  zIndex,
  shadows,
  borders,
  aspectRatios,
  radii,
} as const

export type Tokens = typeof tokens
