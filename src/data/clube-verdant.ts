import {
  GRADE_WELLNESS_VERDANT,
  PROGRAMA_WELLNESS_VERDANT,
  type ClubeAula,
  type ClubeGradeProgramacao,
} from './clube-verdant-programacao'

/**
 * Clube Verdant — dados da landing imersiva (Grand Club Verdant / Verdant Valley).
 *
 * Conteúdo orientado a dados (sem hardcode em JSX). Os componentes da landing
 * leem deste arquivo. Estrutura pensada para migrar ao Sanity depois sem
 * retrabalho no front. Fonte: grade COLETIVAS (Wellness Grand Club, atual.
 * 10/04/2025) + briefing do empreendimento.
 *
 * Estratégia: o Clube é o principal diferencial competitivo do empreendimento —
 * vende estilo de vida, não só lazer. A programação alimenta SEO long-tail
 * ("condomínio com aulas de natação", "condomínio clube Jacarepaguá", etc.).
 */

export interface ClubeAtividade {
  nome: string
  /** Faixas etárias / turmas, quando houver */
  turmas?: string[]
  /** Palavra-chave de busca associada (long-tail) */
  keyword?: string
}

export interface ClubeCategoria {
  /** id usado como âncora (#aquaticas, #wellness, ...) */
  id: string
  /** rótulo curto do menu âncora */
  label: string
  /** H2 da seção (otimizado para busca) */
  titulo: string
  /** subtítulo / descrição da seção */
  descricao: string
  atividades: ClubeAtividade[]
}

export interface ClubeFAQ {
  pergunta: string
  resposta: string
}

export interface ClubeData {
  nome: string
  /** condomínio ao qual pertence */
  empreendimento: string
  /** slug do condomínio no Sanity (para link/voltar) */
  condominioSlug: string
  /** slug da landing do clube */
  slug: string
  /** área de lazer dedicada */
  areaLazerM2: number
  bairro: string
  cidade: string

  hero: {
    eyebrow: string
    titulo: string
    subtitulo: string
    /** imagem de fundo (1ª dobra, resort privativo) */
    imagem: string
    imagemAlt: string
    ctaLabel: string
    ctaHref: string
  }

  /** Bloco de abertura — SEO principal */
  intro: {
    titulo: string
    paragrafos: string[]
  }

  /** "Um clube que faz parte da rotina" */
  rotina: {
    titulo: string
    paragrafos: string[]
  }

  /** Programação completa por categoria */
  programacao: ClubeCategoria[]

  /** Grade estruturada para filtros por dia, categoria e público */
  programacaoSemanal?: ClubeAula[]

  /** Imagem oficial da grade, com suporte opcional a PDF */
  gradeProgramacao?: ClubeGradeProgramacao

  /** Galeria editorial do clube */
  galeria?: Array<{ src: string; alt: string }>

  /** Copy emocional / lifestyle (fechamento) */
  copyEmocional: {
    titulo: string
    paragrafos: string[]
  }

  /** Observações da grade */
  observacoes: string[]

  seo: {
    metaTitle: string
    metaDescription: string
    /** clusters de busca que a página mira */
    keywords: string[]
    faqs: ClubeFAQ[]
  }
}

export const clubeVerdant: ClubeData = {
  nome: 'Clube Verdant',
  empreendimento: 'Grand Club Verdant',
  condominioSlug: 'verdant-valley',
  slug: 'clube',
  areaLazerM2: 19000,
  bairro: 'Jacarepaguá',
  cidade: 'Rio de Janeiro',

  hero: {
    eyebrow: 'Grand Club Verdant',
    titulo: 'Clube Verdant',
    subtitulo:
      'Mais de 19.000 m² de lazer, esporte e bem-estar — um resort privativo dentro de casa.',
    imagem: '/images/clube-verdant/entrada-clube.jpg',
    imagemAlt: 'Entrada do Grand Club Verdant integrada ao paisagismo do condomínio',
    ctaLabel: 'Conhecer o clube',
    ctaHref: '#rotina',
  },

  intro: {
    titulo: 'Clube Verdant',
    paragrafos: [
      'O Grand Club Verdant é o coração do Verdant Valley e Verdant Village.',
      'Projetado para proporcionar qualidade de vida em todos os momentos do dia, reúne lazer, esportes, bem-estar, convivência e atividades para todas as idades em um único espaço exclusivo para moradores.',
      'Com mais de 19.000 m² dedicados ao lazer, o clube oferece uma estrutura comparável a resorts residenciais, proporcionando uma rotina mais saudável, ativa e integrada à natureza.',
      'Muito além da infraestrutura física, o Clube Verdant conta com uma programação permanente de atividades esportivas e wellness, transformando o lazer em um verdadeiro estilo de vida.',
    ],
  },

  rotina: {
    titulo: 'Um clube que faz parte da rotina',
    paragrafos: [
      'Enquanto muitos condomínios oferecem apenas espaços de lazer, o Clube Verdant oferece experiências.',
      'Ao longo da semana, moradores encontram aulas esportivas, atividades para crianças, programas de condicionamento físico, esportes coletivos e modalidades aquáticas conduzidas em uma programação organizada.',
      'É a possibilidade de sair do apartamento e, em poucos passos, encontrar um ambiente preparado para cuidar da saúde, estimular a convivência e criar momentos especiais em família.',
      'Mais do que um clube, é uma extensão da própria casa.',
    ],
  },

  programacao: [
    {
      id: 'aquaticas',
      label: 'Aquáticas',
      titulo: 'Atividades aquáticas para todas as idades',
      descricao:
        'Um programa completo de natação com turmas por faixa etária, do bebê ao adulto, além de hidroginástica ao longo da semana.',
      atividades: [
        {
          nome: 'Natação',
          turmas: ['Bebês (0 a 2 anos)', '3 a 5 anos', '6 a 8 anos', '9 a 13 anos', 'Adulto'],
          keyword: 'condomínio com aulas de natação',
        },
        { nome: 'Hidroginástica', turmas: ['Adulto'], keyword: 'condomínio com hidroginástica' },
      ],
    },
    {
      id: 'wellness',
      label: 'Wellness',
      titulo: 'Bem-estar e condicionamento físico',
      descricao:
        'O programa Wellness reúne atividades de fortalecimento muscular, mobilidade e condicionamento, para uma rotina mais saudável sem sair de casa.',
      atividades: [
        { nome: 'Pilates de Solo', keyword: 'condomínio com pilates' },
        { nome: 'Yoga', keyword: 'condomínio com yoga' },
        { nome: 'Treinamento Funcional', keyword: 'condomínio com treinamento funcional' },
        { nome: 'Cross Training', keyword: 'condomínio com cross training' },
        { nome: 'Localizada' },
        { nome: 'Abdominal + Alongamento' },
        { nome: 'T.F.M. — Treinamento Físico Militar' },
      ],
    },
    {
      id: 'esportes',
      label: 'Esportes',
      titulo: 'Esportes para todas as idades',
      descricao:
        'Da infância à vida adulta, o Clube Verdant incentiva a prática esportiva com modalidades coletivas e de quadra durante toda a semana.',
      atividades: [
        {
          nome: 'Futebol',
          turmas: ['Infantil (4 a 6 anos)', 'Teen (7 a 13 anos)'],
          keyword: 'condomínio com futebol infantil',
        },
        { nome: 'Futvôlei', turmas: ['Adulto'] },
        { nome: 'Vôlei', turmas: ['Teen', 'Adulto'], keyword: 'condomínio com vôlei' },
        {
          nome: 'Beach Tênis',
          turmas: ['Iniciante', 'Intermediária'],
          keyword: 'condomínio com beach tennis',
        },
      ],
    },
    {
      id: 'artes-marciais',
      label: 'Artes Marciais',
      titulo: 'Disciplina e desenvolvimento físico',
      descricao:
        'Modalidades voltadas ao desenvolvimento físico e comportamental, para crianças e adultos.',
      atividades: [
        { nome: 'Jiu-Jitsu', turmas: ['Kids', 'Adulto'], keyword: 'condomínio com jiu-jitsu' },
      ],
    },
    {
      id: 'danca',
      label: 'Dança',
      titulo: 'Movimento, ritmo e integração',
      descricao: 'Aulas de dança e ballet para diferentes públicos, do baby class ao adulto.',
      atividades: [
        { nome: 'Dance Mix', turmas: ['Kids', 'Adulto'], keyword: 'condomínio com dança' },
        { nome: 'Dança de Salão', turmas: ['Adulto'] },
        {
          nome: 'Ballet',
          turmas: ['Baby Class (3 a 6 anos)', 'Preliminar (7 a 12 anos)'],
          keyword: 'condomínio com ballet infantil',
        },
      ],
    },
  ],

  programacaoSemanal: PROGRAMA_WELLNESS_VERDANT,
  gradeProgramacao: GRADE_WELLNESS_VERDANT,
  galeria: [
    { src: '/images/clube-verdant/g1.jpg', alt: 'Piscinas do Clube Verdant integradas à natureza' },
    { src: '/images/clube-verdant/g2.jpg', alt: 'Área de lazer e convivência do Clube Verdant' },
    {
      src: '/images/clube-verdant/g3.jpg',
      alt: 'Paisagismo e espaços ao ar livre do Clube Verdant',
    },
    { src: '/images/clube-verdant/g4.jpg', alt: 'Estrutura esportiva do Clube Verdant' },
    { src: '/images/clube-verdant/g5.jpg', alt: 'Ambiente de convivência do Clube Verdant' },
    {
      src: '/images/clube-verdant/g6.jpg',
      alt: 'Lazer exclusivo para moradores do Grand Club Verdant',
    },
  ],

  copyEmocional: {
    titulo: 'Mais do que um condomínio, um estilo de vida',
    paragrafos: [
      'Mais do que um condomínio, o Verdant entrega um estilo de vida.',
      'Enquanto muitas pessoas precisam enfrentar trânsito para chegar à academia, levar os filhos às aulas de natação ou procurar um clube para praticar esportes, aqui tudo acontece a poucos passos de casa.',
      'Cada atividade foi pensada para incentivar uma rotina mais saudável, fortalecer os laços familiares e transformar o tempo livre em momentos de bem-estar.',
      'Morar no Verdant é viver em um lugar onde o lazer deixa de ser um compromisso do fim de semana e passa a fazer parte do cotidiano.',
    ],
  },

  observacoes: [
    'Programação Wellness Grand Club — grade atualizada em 10/04/2025.',
    'As atividades acontecem de terça a sábado; o clube fecha às segundas-feiras.',
    'A grade pode sofrer ajustes sazonais conforme a operação do clube.',
  ],

  seo: {
    metaTitle: 'Clube Verdant — condomínio clube em Jacarepaguá | Grand Club Verdant',
    metaDescription:
      'Clube Verdant: +19.000 m² de lazer com natação, hidroginástica, beach tennis, pilates, futebol infantil, dança e wellness. Condomínio clube em Jacarepaguá, RJ.',
    keywords: [
      'condomínio clube Jacarepaguá',
      'condomínio com clube exclusivo',
      'condomínio com aulas de natação',
      'condomínio com hidroginástica',
      'condomínio com beach tennis',
      'condomínio com pilates',
      'condomínio com futebol infantil',
      'condomínio com dança',
      'condomínio com treinamento funcional',
      'condomínio com atividades para crianças',
      'condomínio com lazer completo',
      'condomínio para família',
      'condomínio com wellness',
    ],
    faqs: [
      {
        pergunta: 'O Clube Verdant tem aulas de natação?',
        resposta:
          'Sim. O Clube Verdant oferece natação com turmas para bebês (0 a 2 anos), crianças de 3 a 5, 6 a 8 e 9 a 13 anos, além de natação adulto, ao longo da semana.',
      },
      {
        pergunta: 'Quais atividades para crianças o condomínio oferece?',
        resposta:
          'Natação infantil, futebol infantil e teen, ballet baby class e preliminar, jiu-jitsu kids, dance mix kids e vôlei teen — uma programação semanal pensada para todas as idades.',
      },
      {
        pergunta: 'O condomínio tem beach tennis?',
        resposta:
          'Sim. Há turmas de Beach Tênis (iniciante e intermediária) aos sábados, além de futvôlei, vôlei e futebol durante a semana.',
      },
      {
        pergunta: 'Que atividades de bem-estar (wellness) estão disponíveis?',
        resposta:
          'Pilates de solo, yoga, treinamento funcional, cross training, localizada, abdominal e alongamento, hidroginástica e T.F.M. (treinamento físico militar).',
      },
      {
        pergunta: 'Qual o tamanho da área de lazer do Clube Verdant?',
        resposta:
          'São mais de 19.000 m² dedicados ao lazer, com estrutura comparável a um resort residencial, dentro do condomínio Grand Club Verdant, em Jacarepaguá (RJ).',
      },
    ],
  },
}
