// Legado — substituído por src/app/[locale]/imoveis/page.tsx
// Inacessível: o middleware next-intl reescreve /imoveis → /pt-BR/imoveis antes do roteador.
import { notFound } from 'next/navigation'
export default function Page() { notFound() }
