/**
 * Breakpoints Admirata — fonte única de verdade.
 *
 * Esta constante é a origem de todos os breakpoints do projeto.
 * Qualquer alteração aqui reflete automaticamente em:
 *   - useBreakpoint (classificação de breakpoint atual)
 *   - useMediaQuery (helpers de media query)
 *   - useViewport (isMobile, isTablet, isDesktop)
 *
 * Os valores em px devem estar sincronizados com tailwind.config.ts > screens.
 *
 * @see tailwind.config.ts — screens: { xs, sm, md, lg, xl, '2xl', '3xl', '4xl', '5xl', '6xl' }
 */
export const BREAKPOINTS = {
  xs:   360,  // Smartphones compactos (Android entry-level)
  sm:   390,  // iPhone 14 / Pixel 8 — referência primária mobile
  md:   430,  // iPhone 14 Plus / Pro Max — large mobile
  lg:   768,  // iPad / tablet portrait
  xl:   1024, // iPad landscape / laptop small
  '2xl':1280, // Laptop standard
  '3xl':1440, // Desktop padrão — referência primária desktop
  '4xl':1600, // Desktop large
  '5xl':1920, // Full HD
  '6xl':2560, // 2K / QHD
} as const

/** União de todos os nomes de breakpoint */
export type Breakpoint = keyof typeof BREAKPOINTS

/** Limites de categoria semântica (mobile-first) */
export const VIEWPORT_THRESHOLDS = {
  /** < 768px → mobile (xs, sm, md) */
  mobileMax:  BREAKPOINTS.lg - 1,
  /** 768px–1023px → tablet (lg) */
  tabletMin:  BREAKPOINTS.lg,
  tabletMax:  BREAKPOINTS.xl - 1,
  /** ≥ 1024px → desktop (xl em diante) */
  desktopMin: BREAKPOINTS.xl,
} as const

/**
 * Retorna o breakpoint correspondente à largura fornecida.
 * Funciona no servidor (SSR): recebe a largura como argumento.
 */
export function resolveBreakpoint(width: number): Breakpoint {
  const entries = Object.entries(BREAKPOINTS) as [Breakpoint, number][]
  // Percorre do maior para o menor e retorna o primeiro que cabe
  for (const [name, minWidth] of [...entries].reverse()) {
    if (width >= minWidth) return name
  }
  return 'xs'
}
