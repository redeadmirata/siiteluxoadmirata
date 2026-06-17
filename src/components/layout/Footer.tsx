import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import FooterNewsletter from './FooterNewsletter'

const NAV_IMOVEIS = [
  { href: '/imoveis', label: 'Todos os imóveis' },
  { href: '/lancamentos', label: 'Lançamentos' },
  { href: '/imoveis/cobertura', label: 'Coberturas e Penthouses' },
  { href: '/imoveis/frente-mar', label: 'Frente ao mar' },
  { href: '/imoveis/vista-mar', label: 'Vista mar' },
  { href: '/imoveis/na-planta', label: 'Na planta' },
  { href: '/condominios', label: 'Condomínios' },
]

const NAV_EMPRESA = [
  { href: '/sobre', label: 'Quem Somos' },
  { href: '/contato', label: 'Contato' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/blog', label: 'Blog' },
  { href: '/politica-de-privacidade', label: 'Privacidade' },
]

const MERCADOS = [
  { label: 'Barra da Tijuca', href: '/imoveis?bairro=barra-da-tijuca' },
  { label: 'Recreio dos Bandeirantes', href: '/imoveis?bairro=recreio-dos-bandeirantes' },
  { label: 'Leblon / Ipanema', href: '/imoveis?mercado=Rio+de+Janeiro' },
  { label: 'Jacarepaguá', href: '/imoveis?bairro=jacarepagua' },
  { label: 'Gramado / Canela', href: '/imoveis?mercado=Serra+Gaucha' },
]

const MAIS_BUSCADOS = [
  {
    titulo: 'Apartamentos',
    links: [
      { label: 'Apartamento Barra da Tijuca', href: '/imoveis?tipo=Apartamento&bairro=barra-da-tijuca' },
      { label: 'Apartamento Recreio', href: '/imoveis?tipo=Apartamento&bairro=recreio-dos-bandeirantes' },
      { label: 'Apartamento Leblon', href: '/imoveis?tipo=Apartamento&bairro=leblon' },
      { label: 'Apartamento Ipanema', href: '/imoveis?tipo=Apartamento&bairro=ipanema' },
      { label: 'Apartamento Gramado', href: '/imoveis?tipo=Apartamento&mercado=Serra+Gaucha' },
      { label: 'Apartamento alto padrão RJ', href: '/imoveis?tipo=Apartamento&mercado=Rio+de+Janeiro' },
    ],
  },
  {
    titulo: 'Coberturas',
    links: [
      { label: 'Cobertura Barra da Tijuca', href: '/imoveis?tipo=Cobertura&bairro=barra-da-tijuca' },
      { label: 'Cobertura duplex Recreio', href: '/imoveis?tipo=Cobertura&bairro=recreio-dos-bandeirantes' },
      { label: 'Cobertura Leblon', href: '/imoveis?tipo=Cobertura&bairro=leblon' },
      { label: 'Penthouse Barra da Tijuca', href: '/imoveis?tipo=Penthouse&bairro=barra-da-tijuca' },
      { label: 'Penthouse Recreio', href: '/imoveis?tipo=Penthouse&bairro=recreio-dos-bandeirantes' },
      { label: 'Cobertura de luxo RJ', href: '/imoveis?tipo=Cobertura&mercado=Rio+de+Janeiro' },
    ],
  },
  {
    titulo: 'Casas',
    links: [
      { label: 'Casa Barra da Tijuca', href: '/imoveis?tipo=Casa&bairro=barra-da-tijuca' },
      { label: 'Casa em condomínio Recreio', href: '/imoveis?tipo=Casa&bairro=recreio-dos-bandeirantes' },
      { label: 'Casa Gramado RS', href: '/imoveis?tipo=Casa&mercado=Serra+Gaucha' },
      { label: 'Casa de luxo Rio de Janeiro', href: '/imoveis?tipo=Casa&mercado=Rio+de+Janeiro' },
      { label: 'Casa Canela RS', href: '/imoveis?tipo=Casa&bairro=canela' },
      { label: 'Casa Jacarepaguá', href: '/imoveis?tipo=Casa&bairro=jacarepagua' },
    ],
  },
  {
    titulo: 'Condomínios',
    links: [
      { label: 'Condomínio fechado Barra da Tijuca', href: '/condominios' },
      { label: 'Bairro planejado Rio de Janeiro', href: '/condominios' },
      { label: 'Condomínio fechado Recreio', href: '/condominios' },
      { label: 'Condomínio de luxo Serra Gaúcha', href: '/condominios' },
      { label: 'Alphaville Rio de Janeiro', href: '/condominios' },
      { label: 'Empreendimento alto padrão RJ', href: '/condominios' },
    ],
  },
  {
    titulo: 'Bairros',
    links: [
      { label: 'Imóveis Barra da Tijuca', href: '/imoveis/barra-da-tijuca' },
      { label: 'Imóveis Recreio dos Bandeirantes', href: '/imoveis/recreio-dos-bandeirantes' },
      { label: 'Imóveis Leblon', href: '/imoveis/leblon' },
      { label: 'Imóveis Ipanema', href: '/imoveis/ipanema' },
      { label: 'Imóveis Gramado RS', href: '/imoveis/gramado' },
      { label: 'Imóveis Jacarepaguá', href: '/imoveis/jacarepagua' },
    ],
  },
  {
    titulo: 'Características',
    links: [
      { label: 'Imóveis frente ao mar', href: '/imoveis/frente-mar' },
      { label: 'Imóveis com vista mar', href: '/imoveis/vista-mar' },
      { label: 'Coberturas de luxo RJ', href: '/imoveis/cobertura' },
      { label: 'Imóveis na planta RJ', href: '/imoveis/na-planta' },
      { label: 'Lançamentos Barra da Tijuca', href: '/lancamentos' },
      { label: 'Penthouse Rio de Janeiro', href: '/imoveis/cobertura' },
    ],
  },
]

export default async function Footer() {
  const t = await getTranslations('footer')
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white/70" aria-label="Rodapé">
      {/* Newsletter */}
      <FooterNewsletter />

      {/* Divisor dourado */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />

      {/* Corpo principal */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-16">

          {/* Coluna 1: Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
              aria-label="Admirata Imóveis — início"
            >
              <span className="flex items-center justify-center w-10 h-10 border border-gold/50 font-display text-base text-gold group-hover:border-gold transition-colors">
                A
              </span>
              <span className="text-xs tracking-[0.22em] uppercase text-white/80 group-hover:text-white transition-colors">
                Admirata Imóveis
              </span>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed max-w-xs mb-6">
              {t('description')}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5521998079459?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20im%C3%B3veis%20da%20Admirata."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-gold hover:text-[#d4ac1a] transition-colors"
              >
                <span aria-hidden="true" className="text-base leading-none">+</span>
                WhatsApp Rio de Janeiro
              </a>
              <a
                href="https://wa.me/5554992643070?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20im%C3%B3veis%20da%20Admirata."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-gold hover:text-[#d4ac1a] transition-colors"
              >
                <span aria-hidden="true" className="text-base leading-none">+</span>
                WhatsApp Serra Gaúcha
              </a>
              <a
                href="mailto:atendimento@admirataimoveis.com.br"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-white/50 hover:text-white transition-colors"
              >
                <span aria-hidden="true" className="text-base leading-none">@</span>
                atendimento@admirataimoveis.com.br
              </a>
            </div>
          </div>

          {/* Coluna 2: Imóveis */}
          <nav aria-label="Links de imóveis">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-5">
              {t('imoveis')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_IMOVEIS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 3: Empresa */}
          <nav aria-label="Links da empresa">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-5">
              {t('empresa')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_EMPRESA.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 4: Mercados */}
          <nav aria-label="Mercados e localizações">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-5">
              {t('localizacoes')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {MERCADOS.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divisor */}
        <div className="h-px bg-white/8 mb-12" aria-hidden="true" />

        {/* Mais buscados — SEO section (kept in PT for SEO value) */}
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-8">
            {t('maisBuscados')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
            {MAIS_BUSCADOS.map(({ titulo, links }) => (
              <nav key={titulo} aria-label={`Links: ${titulo}`}>
                <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/35 mb-3">
                  {titulo}
                </h3>
                <ul className="flex flex-col gap-2" role="list">
                  {links.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-[11px] text-white/30 hover:text-white/70 leading-relaxed transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-white/8 mb-8" aria-hidden="true" />

        {/* Rodapé inferior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-white/30">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{t('copyright', { year: ano })}</span>
            <span aria-hidden="true" className="hidden sm:inline">|</span>
            <span>{t('creci')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-white/60 transition-colors">
              {t('privacy')}
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/termos-de-uso" className="hover:text-white/60 transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
