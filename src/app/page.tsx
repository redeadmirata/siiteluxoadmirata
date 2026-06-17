// Legado — substituído por src/app/[locale]/page.tsx
// O middleware next-intl reescreve / → /pt-BR/ internamente antes do roteador.
import { notFound } from 'next/navigation'
export default function Page() { notFound() }
