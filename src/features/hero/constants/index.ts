/**
 * Constantes da feature Hero.
 */

/** Duração do crossfade entre imagens no slider (ms) */
export const HERO_SLIDE_DURATION = 5000
export const HERO_SLIDE_TRANSITION = 800

/** Parallax ratio — quantos px a imagem move por px de scroll */
export const HERO_PARALLAX_RATIO = 0.3

/** Altura padrão do hero cinematico em vh */
export const HERO_HEIGHT_VH = 100

/** Animações GSAP */
export const HERO_GSAP = {
  titleDelay: 0.4,
  titleDuration: 1.1,
  badgeDelay: 0.2,
  scrollIndicatorDelay: 1.2,
  ease: 'power3.out',
} as const
