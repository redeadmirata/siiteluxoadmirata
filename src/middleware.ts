import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Redireciona todos os paths EXCETO:
  // - /studio (Sanity Studio)
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /sitemap.xml, /robots.txt (arquivos estáticos com extensão)
  // - /opengraph-image (Next.js image generation)
  // - Google Search Console verification
  matcher: [
    '/((?!studio|api|_next|_vercel|opengraph-image|google[0-9a-f]+\\.html).*)',
    '/',
  ],
}
