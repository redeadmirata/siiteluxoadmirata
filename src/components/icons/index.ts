/**
 * Sistema de ícones — Admirata
 *
 * Organizado por contexto imobiliário. Todos os ícones são re-exports
 * de Lucide React (tree-shakeable) com aliases semânticos para o domínio.
 *
 * Ícones SVG custom ficam em arquivos separados nesta pasta:
 *   WhatsAppIcon.tsx — logomarca WhatsApp (não disponível no Lucide)
 *
 * Uso:
 *   import { BedDouble, Bath, Car } from '@/components/icons'
 *   import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
 *
 * @see https://lucide.dev/icons — referência completa Lucide v0.468
 */

// ─── UI — Navegação e ações gerais ────────────────────────────────────────────

export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  Search,
  SlidersHorizontal as Filters,
  Heart,
  HeartOff,
  Share2 as Share,
  ExternalLink,
  Copy,
  Check,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Info,
  LoaderCircle as Loader,
  Ellipsis as More,
  Plus,
  Minus,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2 as Fullscreen,
  Minimize2 as ExitFullscreen,
  RotateCcw as Reset,
  RefreshCcw as Refresh,
  Download,
  Upload,
  Link,
} from 'lucide-react'

// ─── Imóvel — características físicas ────────────────────────────────────────

export {
  BedDouble,
  Bath,
  Car,
  LayoutGrid as Blueprints,
  Maximize as Area,
  Building2 as Building,
  House as Home,
  Hotel,
  Landmark,
  Trees as Garden,
  Waves as Pool,
} from 'lucide-react'

// ─── Amenidades ───────────────────────────────────────────────────────────────

export {
  Dumbbell as Gym,
  Bike,
  PersonStanding as Yoga,
  Gamepad2 as GameRoom,
  Utensils as Gourmet,
  Wine as WineRoom,
  Flame as Sauna,
  Sparkles as Spa,
  ShieldCheck as Security,
  Camera as CCTV,
  Dog as PetFriendly,
  Wifi,
  Zap as EletricCharger,
  Leaf as Sustainable,
  Sun as Solar,
  Droplets as WaterTreatment,
  Recycle,
  CircleParking as Parking,
  Bus as Shuttle,
  Package as Storage,
  ConciergeBell as Concierge,
  MailOpen as Mailroom,
  ShoppingBag as Commerce,
} from 'lucide-react'

// ─── Localização ──────────────────────────────────────────────────────────────

export {
  MapPin,
  Map,
  Navigation,
  Compass,
  Globe,
  Mountain,
  Waves as Beach,
  TreePine as Forest,
  MapPin as City,
} from 'lucide-react'

// ─── Contato e comunicação ────────────────────────────────────────────────────

export {
  Phone,
  Mail,
  MessageCircle as Chat,
  Send,
  Calendar,
  Clock,
  Clock as Schedule,
  UserRound as Agent,
  Users as Team,
} from 'lucide-react'

// ─── Mídia e conteúdo ─────────────────────────────────────────────────────────

export {
  Play,
  Pause,
  Volume2 as Volume,
  VolumeX as Mute,
  Image as ImageIcon,
  Images as Gallery,
  Video,
  Film,
  Expand,
  PanelLeft as FloorPlan,
  Cuboid as Tour360,
} from 'lucide-react'

// ─── Negócio ──────────────────────────────────────────────────────────────────

export {
  TrendingUp,
  ChartBar as Chart,
  BadgeDollarSign as Price,
  Tag,
  Percent,
  Receipt,
  FileText as Contract,
  ClipboardList as Checklist,
  Star,
  Award,
  Trophy,
  BadgeCheck as Verified,
  Gem,
} from 'lucide-react'

// ─── SVGs custom ─────────────────────────────────────────────────────────────
// Exportações nomeadas para manter consistência no import único.
// Import default ainda disponível: import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

export { default as WhatsAppIcon } from './WhatsAppIcon'

// ─── Tipo auxiliar para ícones Lucide ────────────────────────────────────────

import type { LucideProps } from 'lucide-react'

/** Props padrão aceitas por qualquer ícone deste sistema */
export type IconProps = LucideProps
