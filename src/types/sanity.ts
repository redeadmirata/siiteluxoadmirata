// ─── Tipos gerados das queries GROQ ───────────────────────────────
// Mantidos manualmente até o TypeGen estar configurado.

export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    lqip: string
    dimensions: { width: number; height: number; aspectRatio: number }
  }
}

export interface SanityImageFile {
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

/** Item de galeria retornado pela GROQ — {asset: {...}, alt, legenda} */
export interface GaleriaItem {
  asset: SanityImageAsset
  alt?: string
  legenda?: string
}

// ─── Bairro ───────────────────────────────────────────────────────

export type BairroRegiao = 'Centro' | 'Zona Sul' | 'Sudoeste' | 'Gramado' | 'Canela'

export interface BairroRef {
  _id: string
  nome: string
  slug: { current: string }
  cidade: string
  estado: 'RJ' | 'RS'
  mercado: 'Rio de Janeiro' | 'Serra Gaúcha'
}

export interface Bairro extends BairroRef {
  regiao?: BairroRegiao
  ordem: number
  fotoCapa?: SanityImageFile
  fotoAerea?: SanityImageFile
  descricao?: string
  geo?: { lat: number; lng: number }
  pontosDeInteresse?: Array<{
    nome: string
    categoria: string
    lat: number
    lng: number
  }>
  totalImoveis: number
}

// ─── Imovel ───────────────────────────────────────────────────────

export type ImovelTipo =
  | 'Apartamento'
  | 'Cobertura'
  | 'Cobertura duplex'
  | 'Penthouse'
  | 'Casa'
  | 'Casa em condomínio'
  | 'Terreno'

export type ImovelFinalidade = 'Venda' | 'Locação' | 'Temporada'
export type ImovelMercado = 'Rio de Janeiro' | 'Serra Gaúcha'
export type ImovelStatus = 'Disponível' | 'Vendido' | 'Locado' | 'Em negociação'

export interface ImovelImagem {
  arquivo: SanityImageFile & {
    principal?: boolean
    tour360?: boolean
    urlMatterport?: string
    isStaging?: boolean
    stagingPar?: string
  }
}

export interface ImovelAmbiente {
  nome: string
  tipo: string
  area?: number
  x?: number
  y?: number
}

export interface ImovelPlanta {
  arquivo: SanityImageFile
  titulo?: string
  ambientes?: ImovelAmbiente[]
}

export interface ImovelCaracteristica {
  grupo: string
  nome: string
}

/** Tipologia de imovel (slug da categoria) */
export type ImovelTipologia =
  | '1-quarto'
  | '2-quartos'
  | '3-quartos'
  | '4-quartos'
  | 'cobertura'
  | 'penthouse'
  | 'casa'
  | 'terreno'

/** Card resumido — listagem / destaque */
export interface ImovelCard {
  _id: string
  titulo: string
  slug: { current: string }
  tipo: ImovelTipo
  finalidade: ImovelFinalidade
  mercado: ImovelMercado
  status: ImovelStatus
  destaque?: boolean
  exclusivo?: boolean
  permuta?: boolean
  novidade?: boolean
  preco?: number
  precoSobConsulta?: boolean
  areaUtil?: number
  quartos?: number
  suites?: number
  vagas?: number
  andar?: number
  tipologia?: ImovelTipologia
  bairro?: BairroRef
  condominionome?: string
  imagemCapa?: SanityImageFile
}

/** PDI completa */
export interface ImovelPDI extends ImovelCard {
  condominioRef?: { slug?: string; bairroSlug?: string }
  /** Nome do condominio — campo calculado pelo GROQ (condominioRef->nome) */
  condominioNome?: string
  /** Ano de entrega do condominio — para badge "Pronto para morar" */
  condominioAnoEntrega?: number
  condominio?: number
  iptu?: number
  areaTotal?: number
  banheiros?: number
  endereco?: string
  imagens?: ImovelImagem[]
  plantas?: ImovelPlanta[]
  caracteristicas?: ImovelCaracteristica[]
  tourVirtual?: string
  videoUrl?: string
  descricaoPtBr?: string
  descricaoEnUs?: string
  descricaoFrFr?: string
  seo?: { titulo?: string; descricao?: string }
  publicadoEm?: string
}

// ─── Condominio ───────────────────────────────────────────────────

export type CondominioTipo = 'condominio-fechado' | 'bairro-planejado' | 'vertical' | 'resort'

export interface CondominioCard {
  _id: string
  nome: string
  slug: { current: string }
  tipo?: CondominioTipo
  destaque?: boolean
  descricao?: string
  infraestrutura?: string[]
  areaTotal?: number
  totalLotes?: number
  bairro?: BairroRef
  fotoCapa?: SanityImageAsset
  totalImoveis: number
}

/** Condominio detalhado — PDI de condominio (NIVEL 2) */
export interface CondominioDetalhe extends Omit<CondominioCard, 'fotoCapa'> {
  construtora?: string
  anoEntrega?: number
  numTorres?: number
  numUnidades?: number
  sobre?: unknown[]
  tipologiasDisponiveis?: ImovelTipologia[]
  forcarNoindex?: boolean
  faqs?: Array<{ pergunta: string; resposta: string }>
  geo?: {
    lat?: number
    lng?: number
    proximidades?: string[]
  }
  fotoCapa?: SanityImageFile
  galeria?: GaleriaItem[]
  condominiosProximos?: Array<{ nome: string; slug: { current: string } }>
  seo?: { titulo?: string; descricao?: string }
}

// ─── Bairro estendido (campos SEO adicionados) ────────────────────

export interface BairroFull extends Bairro {
  zona?: 'oeste' | 'sul' | 'centro'
  introTexto?: string
  porQueMorar?: unknown[]
  caracteristicas?: string[]
  faixaPreco?: {
    min?: number
    max?: number
    tipoPredominante?: string
  }
  faqs?: Array<{ pergunta: string; resposta: string }>
  bairrosProximos?: Array<{ _id: string; nome: string; slug: { current: string } }>
  destaque?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset?: { url: string } }
}

// ─── Corretor ─────────────────────────────────────────────────────

export interface Corretor {
  _id: string
  nome: string
  slug: { current: string }
  foto?: SanityImageFile
  creci?: string
  especialidade?: string[]
  whatsapp?: string
  email?: string
  instagram?: string
  bio?: string
  ativo?: boolean
}

// ─── Lancamento ───────────────────────────────────────────────────

export type StatusObra = 'na-planta' | 'em-obras' | 'pronto' | 'breve' | 'entregue'

/** imagemCapa de lancamento vem flat (sem wrapper arquivo) */
export interface LancamentoImagem {
  asset?: {
    _id?: string
    url: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number }
    }
  }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

export interface LancamentoCard {
  _id: string
  titulo: string
  slug: { current: string }
  statusObra?: StatusObra
  precoAPartirDe?: number
  destaque?: boolean
  bairro?: BairroRef
  construtora?: string
  imagemCapa?: LancamentoImagem
}

export interface LancamentoDetalhe extends LancamentoCard {
  precoAte?: number
  descricao?: string
  diferenciais?: string[]
  dataEntregaPrevista?: string
  galeria?: Array<{
    asset?: { _id?: string; url: string; metadata?: { lqip?: string } }
    alt?: string
  }>
  plantas?: Array<{
    asset?: { _id?: string; url: string; metadata?: { lqip?: string } }
    alt?: string
    titulo?: string
  }>
  faqs?: Array<{ pergunta: string; resposta: string }>
  metaTitle?: string
  metaDescription?: string
}

// ─── Blog ─────────────────────────────────────────────────────────

export type BlogCategoria =
  | 'mercado-imobiliario'
  | 'decoracao'
  | 'financiamento'
  | 'bairros'
  | 'lifestyle'
  | 'dicas'

export interface BlogPost {
  _id: string
  titulo: string
  slug: { current: string }
  categoria?: BlogCategoria
  resumo?: string
  publicadoEm?: string
  autor?: string
  conteudo?: unknown[]
  imagemCapa?: {
    asset?: { _id?: string; url: string; metadata?: { lqip?: string } }
    alt?: string
  }
  bairroRelacionado?: BairroRef
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { asset?: { url: string } }
  }
}

// ─── Condominio de Bairro Planejado ───────────────────────────────

export interface CondominioResumido {
  _id: string
  nome: string
  slug: { current: string }
  status?: string
  construtora?: string
  precoMinimo?: number
  precoMaximo?: number
  areaPrivativaMin?: number
  areaPrivativaMax?: number
  prazoEntrega?: string
  tipologiasDisponiveis?: string[]
  videoTour?: string
  comissao?: number
  vgv?: number
  whatsappCorretor?: string
  mensagemCorretorWhatsapp?: string
  visibilidadeCorretor?: boolean
  imagemCapa?: { url: string; metadata?: { lqip?: string } }
  plantasBaixas?: Array<{
    nome?: string
    quartos?: number
    area?: number
    imagem?: { asset?: { url: string; metadata?: { lqip?: string } } }
  }>
  tabelaPreco?: { asset?: { url: string } }
  materialMarketing?: Array<{
    titulo?: string
    tipo?: string
    url?: string
    arquivo?: { asset?: { url: string } }
  }>
}

// ─── Bairro Planejado ─────────────────────────────────────────────

export interface BairroPlaneado extends BairroFull {
  incorporadora?: string
  areaTotal?: number
  anoInauguracao?: number
  amenidades?: string[]
  condominios?: CondominioResumido[]
  totalCondominios?: number
}
