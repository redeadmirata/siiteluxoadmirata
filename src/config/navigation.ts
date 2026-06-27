/**
 * Itens de navegação do site Admirata.
 * Usar estes arrays para gerar o menu — não hardcodes nos componentes de layout.
 */

export interface NavItem {
  label: string
  href: string
  /** Se true, o link abre em nova aba */
  external?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Navegação principal (navbar) */
export const NAV_PRINCIPAL: NavItem[] = [
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'Condomínios', href: '/condominios' },
  { label: 'Bairros', href: '/bairros' },
  { label: 'Lançamentos', href: '/lancamentos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
] as const

/** Filtros rápidos de finalidade */
export const NAV_FINALIDADE: NavItem[] = [
  { label: 'Comprar', href: '/imoveis/venda' },
  { label: 'Alugar', href: '/imoveis/locacao' },
  { label: 'Temporada', href: '/imoveis/temporada' },
] as const

/** Links de rodapé agrupados por categoria */
export const FOOTER_GRUPOS: NavGroup[] = [
  {
    label: 'Buscar',
    items: [
      { label: 'Todos os imóveis', href: '/imoveis' },
      { label: 'À venda', href: '/imoveis/venda' },
      { label: 'Para alugar', href: '/imoveis/locacao' },
      { label: 'Frente-mar', href: '/imoveis/frente-mar' },
      { label: 'Vista-mar', href: '/imoveis/vista-mar' },
      { label: 'Coberturas', href: '/imoveis/cobertura' },
      { label: 'Na planta', href: '/imoveis/na-planta' },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { label: 'Condomínios', href: '/condominios' },
      { label: 'Bairros RJ', href: '/bairros' },
      { label: 'Lançamentos', href: '/lancamentos' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    label: 'Admirata',
    items: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Contato', href: '/contato' },
      { label: 'Favoritos', href: '/favoritos' },
      { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
      { label: 'Termos de Uso', href: '/termos-de-uso' },
    ],
  },
] as const
