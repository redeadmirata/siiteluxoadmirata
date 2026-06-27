/**
 * Feature: Hero
 * Seção hero reutilizável em PDI, condominios, bairros e home.
 */

export type {
  HeroVariant,
  HeroMediaType,
  HeroMedia,
  HeroData,
  HeroProps,
  HeroCinematicoProps,
} from './types'

export {
  HERO_SLIDE_DURATION,
  HERO_SLIDE_TRANSITION,
  HERO_PARALLAX_RATIO,
  HERO_HEIGHT_VH,
  HERO_GSAP,
} from './constants'

export { useHeroScroll } from './hooks/useHeroScroll'
