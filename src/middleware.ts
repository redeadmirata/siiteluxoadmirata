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
    // Exclui: studio, api, _next, _vercel, opengraph, arquivos estáticos
    // (.html, .xml, .txt, imagens, VÍDEOS, fontes). Sem excluir .mp4, a rota
    // /videos/*.mp4 cai na reescrita i18n e retorna HTML em vez do arquivo.
    '/((?!studio|api|_next|_vercel|opengraph-image|.*\\.html|.*\\.xml|.*\\.txt|.*\\.png|.*\\.jpe?g|.*\\.ico|.*\\.svg|.*\\.webp|.*\\.gif|.*\\.mp4|.*\\.webm|.*\\.mov|.*\\.woff2?).*)',
    '/',
  ],
}
