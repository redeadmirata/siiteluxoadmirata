export const CLUBE_DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'] as const
export type ClubeDia = (typeof CLUBE_DIAS)[number]

export const CLUBE_PUBLICOS = ['bebês', 'crianças', 'adolescentes', 'adultos'] as const
export type ClubePublico = (typeof CLUBE_PUBLICOS)[number]

export type ClubeCategoriaId = 'aquaticas' | 'wellness' | 'esportes' | 'artes-marciais' | 'danca'

export interface ClubeAula {
  nome: string
  categoria: ClubeCategoriaId
  horario: string
  dias: ClubeDia[]
  publicos: ClubePublico[]
  turma?: string
}

export interface ClubeGradeProgramacao {
  src: string
  width: number
  height: number
  alt: string
  atualizadoEm: string
  downloadName: string
  pdfSrc?: string
}

export const PROGRAMA_WELLNESS_VERDANT: ClubeAula[] = [
  {
    nome: 'Yoga',
    categoria: 'wellness',
    horario: '07:00',
    dias: ['terça', 'quinta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Treinamento Funcional',
    categoria: 'wellness',
    horario: '07:00',
    dias: ['terça', 'quinta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Localizada',
    categoria: 'wellness',
    horario: '07:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Beach Tênis',
    categoria: 'esportes',
    horario: '07:00',
    dias: ['sábado'],
    publicos: ['adultos'],
    turma: 'Iniciante',
  },
  {
    nome: 'Pilates de Solo',
    categoria: 'wellness',
    horario: '08:00',
    dias: ['terça', 'quinta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Abdominal + Alongamento',
    categoria: 'wellness',
    horario: '08:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Beach Tênis',
    categoria: 'esportes',
    horario: '08:00',
    dias: ['sábado'],
    publicos: ['adultos'],
    turma: 'Intermediária',
  },
  {
    nome: 'Hidroginástica',
    categoria: 'aquaticas',
    horario: '09:00',
    dias: ['terça', 'quarta', 'quinta', 'sexta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '10:00',
    dias: ['terça', 'quinta'],
    publicos: ['crianças', 'adolescentes'],
    turma: '9 a 13 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '10:30',
    dias: ['terça', 'quinta'],
    publicos: ['crianças'],
    turma: '6 a 8 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '11:00',
    dias: ['terça', 'quinta'],
    publicos: ['crianças'],
    turma: '3 a 5 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '11:30',
    dias: ['terça', 'quinta'],
    publicos: ['bebês'],
    turma: '0 a 2 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '14:00',
    dias: ['quarta', 'sexta'],
    publicos: ['bebês'],
    turma: '0 a 2 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '14:30',
    dias: ['quarta', 'sexta'],
    publicos: ['crianças'],
    turma: '3 a 5 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '15:00',
    dias: ['quarta', 'sexta'],
    publicos: ['crianças'],
    turma: '6 a 8 anos',
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '15:30',
    dias: ['quarta', 'sexta'],
    publicos: ['crianças', 'adolescentes'],
    turma: '9 a 13 anos',
  },
  {
    nome: 'Hidroginástica',
    categoria: 'aquaticas',
    horario: '16:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Natação',
    categoria: 'aquaticas',
    horario: '17:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
    turma: 'Adulto',
  },
  {
    nome: 'Pilates de Solo',
    categoria: 'wellness',
    horario: '18:00',
    dias: ['terça', 'quinta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Dança de Salão',
    categoria: 'danca',
    horario: '18:00',
    dias: ['terça'],
    publicos: ['adultos'],
  },
  {
    nome: 'Ballet',
    categoria: 'danca',
    horario: '18:30',
    dias: ['terça', 'quinta'],
    publicos: ['crianças'],
    turma: 'Baby Class — 3 a 6 anos',
  },
  {
    nome: 'Futebol',
    categoria: 'esportes',
    horario: '18:30',
    dias: ['quarta', 'sexta'],
    publicos: ['crianças'],
    turma: 'Infantil — 4 a 6 anos',
  },
  {
    nome: 'Treinamento Funcional',
    categoria: 'wellness',
    horario: '19:00',
    dias: ['terça', 'quinta'],
    publicos: ['adultos'],
  },
  {
    nome: 'T.F.M.',
    categoria: 'wellness',
    horario: '19:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
    turma: 'Treinamento Físico Militar',
  },
  {
    nome: 'Voleibol',
    categoria: 'esportes',
    horario: '19:00',
    dias: ['quinta'],
    publicos: ['adolescentes'],
    turma: 'Teen',
  },
  {
    nome: 'Dance Mix',
    categoria: 'danca',
    horario: '19:20',
    dias: ['segunda', 'quarta'],
    publicos: ['crianças'],
    turma: 'Kids',
  },
  {
    nome: 'Jiu-Jitsu',
    categoria: 'artes-marciais',
    horario: '19:20',
    dias: ['segunda', 'quarta'],
    publicos: ['crianças'],
    turma: 'Kids',
  },
  {
    nome: 'Ballet',
    categoria: 'danca',
    horario: '19:30',
    dias: ['terça', 'quinta'],
    publicos: ['crianças', 'adolescentes'],
    turma: 'Preliminar — 7 a 12 anos',
  },
  {
    nome: 'Futebol',
    categoria: 'esportes',
    horario: '19:30',
    dias: ['quarta', 'sexta'],
    publicos: ['adolescentes'],
    turma: 'Teen — 7 a 13 anos',
  },
  {
    nome: 'Futevôlei',
    categoria: 'esportes',
    horario: '20:00',
    dias: ['terça'],
    publicos: ['adultos'],
    turma: 'Iniciante — treinamento',
  },
  {
    nome: 'Cross Training',
    categoria: 'wellness',
    horario: '20:00',
    dias: ['quarta', 'sexta'],
    publicos: ['adultos'],
  },
  {
    nome: 'Voleibol',
    categoria: 'esportes',
    horario: '20:00',
    dias: ['quinta'],
    publicos: ['adultos'],
    turma: 'Iniciante — treinamento',
  },
  {
    nome: 'Dance Mix',
    categoria: 'danca',
    horario: '20:10',
    dias: ['segunda', 'quarta'],
    publicos: ['adultos'],
    turma: 'Adulto',
  },
  {
    nome: 'Jiu-Jitsu',
    categoria: 'artes-marciais',
    horario: '20:10',
    dias: ['segunda', 'quarta'],
    publicos: ['adultos'],
    turma: 'Adulto',
  },
  {
    nome: 'Dança de Salão',
    categoria: 'danca',
    horario: '20:10',
    dias: ['terça'],
    publicos: ['adultos'],
  },
  {
    nome: 'Futevôlei',
    categoria: 'esportes',
    horario: '21:00',
    dias: ['terça'],
    publicos: ['adultos'],
    turma: 'Avançado — jogo',
  },
  {
    nome: 'Voleibol',
    categoria: 'esportes',
    horario: '21:00',
    dias: ['quinta'],
    publicos: ['adultos'],
    turma: 'Avançado — jogo',
  },
]

export const GRADE_WELLNESS_VERDANT: ClubeGradeProgramacao = {
  src: '/images/clube-verdant/programacao-wellness.jpg',
  width: 1313,
  height: 2019,
  alt: 'Programação Wellness oficial do Clube Verdant com aulas de natação infantil e adulta, hidroginástica, pilates, beach tennis, treinamento funcional, futebol, dança, jiu-jitsu e atividades esportivas para moradores do condomínio Grand Club Verdant.',
  atualizadoEm: '10/04/2025',
  downloadName: 'programacao-wellness-clube-verdant.jpg',
}
