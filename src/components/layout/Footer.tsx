import Image from 'next/image'
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
  { label: 'Barra da Tijuca', href: '/imoveis?bairroSlug=barra-da-tijuca' },
  { label: 'Recreio dos Bandeirantes', href: '/imoveis?bairroSlug=recreio-dos-bandeirantes' },
  { label: 'Leblon / Ipanema', href: '/imoveis?mercado=Rio+de+Janeiro' },
  { label: 'Jacarepaguá', href: '/imoveis?bairroSlug=jacarepagua' },
  { label: 'Gramado / Canela', href: '/gramado' },
]

const MAIS_BUSCADOS = [
  {
    titulo: 'Apartamentos',
    links: [
      {
        label: 'Apartamento Barra da Tijuca',
        href: '/imoveis?tipo=Apartamento&bairroSlug=barra-da-tijuca',
      },
      {
        label: 'Apartamento Recreio',
        href: '/imoveis?tipo=Apartamento&bairroSlug=recreio-dos-bandeirantes',
      },
      { label: 'Apartamento Leblon', href: '/imoveis?tipo=Apartamento&bairroSlug=leblon' },
      { label: 'Apartamento Ipanema', href: '/imoveis?tipo=Apartamento&bairroSlug=ipanema' },
      { label: 'Apartamento Gramado', href: '/imoveis?tipo=Apartamento&bairroSlug=gramado' },
      {
        label: 'Apartamento alto padrão RJ',
        href: '/imoveis?tipo=Apartamento&mercado=Rio+de+Janeiro',
      },
    ],
  },
  {
    titulo: 'Coberturas',
    links: [
      {
        label: 'Cobertura Barra da Tijuca',
        href: '/imoveis?tipo=Cobertura&bairroSlug=barra-da-tijuca',
      },
      {
        label: 'Cobertura duplex Recreio',
        href: '/imoveis?tipo=Cobertura&bairroSlug=recreio-dos-bandeirantes',
      },
      { label: 'Cobertura Leblon', href: '/imoveis?tipo=Cobertura&bairroSlug=leblon' },
      {
        label: 'Penthouse Barra da Tijuca',
        href: '/imoveis?tipo=Penthouse&bairroSlug=barra-da-tijuca',
      },
      {
        label: 'Penthouse Recreio',
        href: '/imoveis?tipo=Penthouse&bairroSlug=recreio-dos-bandeirantes',
      },
      { label: 'Cobertura de luxo RJ', href: '/imoveis?tipo=Cobertura&mercado=Rio+de+Janeiro' },
    ],
  },
  {
    titulo: 'Casas',
    links: [
      { label: 'Casa Barra da Tijuca', href: '/imoveis?tipo=Casa&bairroSlug=barra-da-tijuca' },
      {
        label: 'Casa em condomínio Recreio',
        href: '/imoveis?tipo=Casa&bairroSlug=recreio-dos-bandeirantes',
      },
      { label: 'Casa Gramado RS', href: '/imoveis?tipo=Casa&bairroSlug=gramado' },
      { label: 'Casa de luxo Rio de Janeiro', href: '/imoveis?tipo=Casa&mercado=Rio+de+Janeiro' },
      { label: 'Casa Canela RS', href: '/imoveis?tipo=Casa&bairroSlug=canela' },
      { label: 'Casa Jacarepaguá', href: '/imoveis?tipo=Casa&bairroSlug=jacarepagua' },
    ],
  },
  {
    titulo: 'Condomínios',
    links: [
      { label: 'Condomínio fechado Barra da Tijuca', href: '/condominios' },
      { label: 'Bairro planejado Rio de Janeiro', href: '/condominios' },
      { label: 'Condomínio fechado Recreio', href: '/condominios' },
      { label: 'Ilha Pura Barra da Tijuca', href: '/condominios' },
      { label: 'Empreendimento alto padrão RJ', href: '/condominios' },
      { label: 'Lançamentos Ilha Pura', href: '/lancamentos' },
    ],
  },
  {
    titulo: 'Bairros',
    links: [
      { label: 'Imóveis Barra da Tijuca', href: '/imoveis?bairroSlug=barra-da-tijuca' },
      {
        label: 'Imóveis Recreio dos Bandeirantes',
        href: '/imoveis?bairroSlug=recreio-dos-bandeirantes',
      },
      { label: 'Imóveis Leblon', href: '/imoveis?bairroSlug=leblon' },
      { label: 'Imóveis Ipanema', href: '/imoveis?bairroSlug=ipanema' },
      { label: 'Imóveis Gramado RS', href: '/gramado' },
      { label: 'Imóveis Jacarepaguá', href: '/imoveis?bairroSlug=jacarepagua' },
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
    <footer className="bg-ink text-white/80" aria-label="Rodapé">
      {/* Newsletter */}
      <FooterNewsletter />

      {/* Divisor dourado */}
      <div
        className="via-gold/40 h-px bg-gradient-to-r from-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Corpo principal */}
      <div className="mx-auto max-w-screen-xl px-6 pb-10 pt-16 lg:px-10">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
          {/* Coluna 1: Brand */}
          <div>
            <Link
              href="/"
              className="group mb-6 inline-flex items-center"
              aria-label="Admirata Imóveis — início"
            >
              <Image
                src="/logo-horizontal.png"
                alt="Admirata Imóveis"
                width={250}
                height={86}
                sizes="220px"
                className="h-auto w-[220px] transition-opacity group-hover:opacity-85"
              />
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/65">
              {t('description')}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5521998079459?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20im%C3%B3veis%20da%20Admirata."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-gold transition-colors hover:text-[#d4ac1a]"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  +
                </span>
                WhatsApp Rio de Janeiro
              </a>
              <a
                href="https://wa.me/5554992643070?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20im%C3%B3veis%20da%20Admirata."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-gold transition-colors hover:text-[#d4ac1a]"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  +
                </span>
                WhatsApp Serra Gaúcha
              </a>
              <a
                href="mailto:atendimento@admirataimoveis.com.br"
                className="inline-flex items-center gap-2 text-xs tracking-wider text-white/70 transition-colors hover:text-white"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  @
                </span>
                atendimento@admirataimoveis.com.br
              </a>
            </div>
          </div>

          {/* Coluna 2: Imóveis */}
          <nav aria-label="Links de imóveis">
            <h3 className="mb-5 text-[10px] uppercase tracking-[0.3em] text-gold">
              {t('imoveis')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_IMOVEIS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 3: Empresa */}
          <nav aria-label="Links da empresa">
            <h3 className="mb-5 text-[10px] uppercase tracking-[0.3em] text-gold">
              {t('empresa')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_EMPRESA.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 4: Mercados */}
          <nav aria-label="Mercados e localizações">
            <h3 className="mb-5 text-[10px] uppercase tracking-[0.3em] text-gold">
              {t('localizacoes')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {MERCADOS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divisor */}
        <div className="bg-white/8 mb-12 h-px" aria-hidden="true" />

        {/* Mais buscados — SEO section (kept in PT for SEO value) */}
        <div className="mb-12">
          <p className="mb-8 text-[9px] uppercase tracking-[0.35em] text-white/55">
            {t('maisBuscados')}
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3 xl:grid-cols-5">
            {MAIS_BUSCADOS.map(({ titulo, links }) => (
              <nav key={titulo} aria-label={`Links: ${titulo}`}>
                <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-white/65">
                  {titulo}
                </h3>
                <ul className="flex flex-col gap-2" role="list">
                  {links.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-[11px] leading-relaxed text-white/55 transition-colors duration-150 hover:text-white/85"
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
        <div className="bg-white/8 mb-8 h-px" aria-hidden="true" />

        {/* Rodapé inferior */}
        <div className="flex flex-col items-start justify-between gap-4 text-[11px] text-white/55 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{t('copyright', { year: ano })}</span>
            <span aria-hidden="true" className="hidden lg:inline">
              |
            </span>
            <span>{t('creci')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/politica-de-privacidade" className="transition-colors hover:text-white/60">
              {t('privacy')}
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/termos-de-uso" className="transition-colors hover:text-white/60">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
