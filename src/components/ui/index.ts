/**
 * Barrel export — Componentes UI Admirata
 *
 * Ponto único de import para todos os componentes base:
 *   import { Button, Badge, Card } from '@/components/ui'
 *
 * Componentes com estado ('use client') são marcados internamente —
 * não é necessário declarar no ponto de uso.
 */

// ─── Ações ───────────────────────────────────────────────────────────────────
export { Button }     from './Button'
export { IconButton } from './IconButton'

// ─── Dados e status ──────────────────────────────────────────────────────────
export { Badge, badgeVariantFromFinalidade } from './Badge'
export type { BadgeVariant, BadgeSize }      from './Badge'
export { Chip }                              from './Chip'
export type { ChipVariant }                  from './Chip'

// ─── Overlays ────────────────────────────────────────────────────────────────
export { Modal }   from './Modal'
export { Drawer }  from './Drawer'
export { Tooltip } from './Tooltip'
export type { TooltipPosition } from './Tooltip'

// ─── Navegação e menus ───────────────────────────────────────────────────────
export { Tabs }     from './Tabs'
export { Dropdown } from './Dropdown'

// ─── Conteúdo expansível ─────────────────────────────────────────────────────
export { Accordion } from './Accordion'

// ─── Notificações ────────────────────────────────────────────────────────────
export { ToastProvider, useToast } from './Toast'
export type { Toast, ToastType, ToastPosition } from './Toast'

// ─── Layout e estrutura ──────────────────────────────────────────────────────
export { Card }      from './Card'
export { Section }   from './Section'
export { Container } from './Container'
export { Hero }      from './Hero'
export { CTA }       from './CTA'

// ─── Formulários ─────────────────────────────────────────────────────────────
export { Form }     from './Form'
export { Input }    from './Input'
export { Select }   from './Select'
export { Textarea } from './Textarea'

// ─── Galeria e mídia ─────────────────────────────────────────────────────────
export { Gallery } from './Gallery'
export type { GalleryImage } from './Gallery'

// ─── Loading states ──────────────────────────────────────────────────────────
export {
  Skeleton,
  ImovelCardSkeleton,
  ImovelGridSkeleton,
  HeroSkeleton,
  FichaTecnicaSkeleton,
  GaleriaSkeleton,
  CTASkeleton,
  BairroPageSkeleton,
} from './Skeleton'

// ─── Tipografia ──────────────────────────────────────────────────────────────
export { Heading } from './Heading'
export { Text }    from './Text'

// ─── Utilitários ─────────────────────────────────────────────────────────────
export { default as BreadcrumbNav }  from './BreadcrumbNav'
export { default as WhatsAppButton } from './WhatsAppButton'
