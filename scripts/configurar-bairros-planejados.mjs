/**
 * Cria os bairros planejados ausentes e normaliza sua ordem de exibição.
 *
 * Simulação: npx sanity exec scripts/configurar-bairros-planejados.mjs --with-user-token
 * Aplicar:   npx sanity exec scripts/configurar-bairros-planejados.mjs --with-user-token -- --apply
 */

import sanityCli from 'sanity/cli'

const { getCliClient } = sanityCli
const client = getCliClient({ apiVersion: '2024-06-01' })
const APPLY = process.argv.includes('--apply')

const block = (key, text, style = 'normal') => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
})

const amenity = (key, titulo, descricao, icone) => ({
  _type: 'object',
  _key: key,
  titulo,
  descricao,
  icone,
})

const faq = (key, pergunta, resposta) => ({
  _type: 'faq',
  _key: key,
  pergunta,
  resposta,
})

const missingNeighborhoods = [
  {
    _id: 'bairro-rio2',
    _type: 'bairro',
    nome: 'Rio2',
    slug: { _type: 'slug', current: 'rio2' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
    regiao: 'Sudoeste',
    zona: 'oeste',
    ordem: 3,
    bairroplanejado: true,
    areaTotal: 600000,
    introTexto:
      'Bairro planejado na Barra Olímpica, com parques, áreas verdes, esporte, conveniência, segurança e transporte próprio.',
    porQueMorar: [
      block('rio2-h2', 'Segurança, lazer e mobilidade', 'h2'),
      block(
        'rio2-p1',
        'O Rio2 foi um dos primeiros bairros planejados da Barra da Tijuca. Seus 600 mil m² reúnem moradia, áreas verdes, serviços e espaços de convivência.'
      ),
      block(
        'rio2-p2',
        'O bairro conta com mais de 100 mil m² de áreas verdes, praça central projetada por Burle Marx, parques, quadras, ciclovias, pet place e transporte próprio para diferentes pontos do Rio.'
      ),
    ],
    amenidades: [
      amenity('rio2-seguranca', 'Segurança', 'Monitoramento e gestão comunitária do bairro.', 'seguranca'),
      amenity('rio2-verde', 'Áreas verdes', 'Parques, praças, jardins e ciclovias.', 'parque'),
      amenity('rio2-lazer', 'Esporte e lazer', 'Quadras, campo, playgrounds e espaços de convivência.', 'esporte'),
      amenity('rio2-mobilidade', 'Mobilidade', 'Transporte próprio para diferentes pontos da cidade.', 'mobilidade'),
      amenity('rio2-servicos', 'Conveniência', 'Shopping, escolas, creches e serviços próximos.', 'servicos'),
    ],
    caracteristicas: ['Bairro planejado', 'Barra Olímpica', 'Parques', 'Mobilidade', 'Conveniência'],
    faqs: [
      faq('rio2-faq-local', 'Onde fica o Rio2?', 'O Rio2 fica na Barra Olímpica, na Zona Sudoeste do Rio de Janeiro.'),
      faq('rio2-faq-estrutura', 'O que o Rio2 oferece?', 'O bairro reúne parques, áreas esportivas, ciclovias, conveniência, segurança e transporte próprio.'),
    ],
    metaTitle: 'Rio2 | Bairro Planejado na Barra | Admirata',
    metaDescription:
      'Conheça o Rio2, bairro planejado na Barra Olímpica, com parques, esporte, conveniência, segurança e transporte próprio.',
  },
  {
    _id: 'bairro-cidade-jardim',
    _type: 'bairro',
    nome: 'Cidade Jardim',
    slug: { _type: 'slug', current: 'cidade-jardim' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
    regiao: 'Sudoeste',
    zona: 'oeste',
    ordem: 4,
    bairroplanejado: true,
    areaTotal: 512000,
    introTexto:
      'Bairro planejado na Barra Olímpica, cercado por áreas verdes e integrado a lazer, serviços, mobilidade e segurança.',
    porQueMorar: [
      block('cj-h2', 'Vida urbana cercada por áreas verdes', 'h2'),
      block(
        'cj-p1',
        'O Cidade Jardim ocupa uma área de 512 mil m² na Barra Olímpica. O planejamento reúne condomínios residenciais, parques, jardins, ciclovias e espaços para atividades ao ar livre.'
      ),
      block(
        'cj-p2',
        'O bairro possui mais de 100 mil m² de parques, milhares de árvores, quadras esportivas, pet place, mall de conveniência e transporte próprio para a praia.'
      ),
    ],
    amenidades: [
      amenity('cj-verde', 'Parques e jardins', 'Mais de 100 mil m² de áreas verdes e ruas arborizadas.', 'parque'),
      amenity('cj-lazer', 'Esporte e lazer', 'Quadras, ciclovias, estações de ginástica e espaços infantis.', 'esporte'),
      amenity('cj-servicos', 'Serviços', 'Mall de conveniência, escolas e creche.', 'servicos'),
      amenity('cj-seguranca', 'Segurança', 'Monitoramento e conservação coordenados pela associação de moradores.', 'seguranca'),
      amenity('cj-mobilidade', 'Mobilidade', 'Transporte próprio e acesso à Barra Olímpica.', 'mobilidade'),
    ],
    caracteristicas: ['Bairro planejado', 'Barra Olímpica', 'Áreas verdes', 'Ciclovias', 'Conveniência'],
    faqs: [
      faq('cj-faq-local', 'Onde fica o Cidade Jardim?', 'O Cidade Jardim fica na Barra Olímpica, na Zona Sudoeste do Rio de Janeiro.'),
      faq('cj-faq-estrutura', 'O que o Cidade Jardim oferece?', 'O bairro reúne parques, ciclovias, quadras, serviços, segurança e transporte próprio.'),
    ],
    metaTitle: 'Cidade Jardim | Bairro Planejado | Admirata',
    metaDescription:
      'Conheça o Cidade Jardim, bairro planejado na Barra Olímpica, com parques, ciclovias, esporte, serviços e segurança.',
  },
  {
    _id: 'bairro-pontal-oceanico',
    _type: 'bairro',
    nome: 'Pontal Oceânico',
    slug: { _type: 'slug', current: 'pontal-oceanico' },
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    mercado: 'Rio de Janeiro',
    regiao: 'Sudoeste',
    zona: 'oeste',
    ordem: 6,
    bairroplanejado: true,
    introTexto:
      'Bairro planejado no Recreio dos Bandeirantes, próximo à praia e cercado por natureza, com segurança, comércio, lazer e mobilidade.',
    porQueMorar: [
      block('po-h2', 'Planejamento entre o mar e a montanha', 'h2'),
      block(
        'po-p1',
        'O Pontal Oceânico é um bairro planejado no Recreio dos Bandeirantes, com acesso pela Avenida das Américas e localização próxima às praias do Pontal e do Recreio.'
      ),
      block(
        'po-p2',
        'Sua estrutura urbana reúne pórticos monitorados, ruas arborizadas, praça, ciclovia, áreas esportivas, espaços para pets, comércio e serviços.'
      ),
    ],
    amenidades: [
      amenity('po-seguranca', 'Segurança', 'Pórticos monitorados e controle de acesso ao bairro.', 'seguranca'),
      amenity('po-natureza', 'Natureza', 'Proximidade com praias, montanhas e áreas ao ar livre.', 'natureza'),
      amenity('po-lazer', 'Lazer', 'Praça, quadra, ciclovia e espaços para pets.', 'esporte'),
      amenity('po-servicos', 'Conveniência', 'Comércio e serviços dentro e no entorno do bairro.', 'servicos'),
      amenity('po-mobilidade', 'Mobilidade', 'Acesso pela Avenida das Américas e conexão com BRT.', 'mobilidade'),
    ],
    caracteristicas: ['Bairro planejado', 'Recreio dos Bandeirantes', 'Próximo à praia', 'Natureza', 'Conveniência'],
    faqs: [
      faq('po-faq-local', 'Onde fica o Pontal Oceânico?', 'O Pontal Oceânico fica no Recreio dos Bandeirantes, próximo à Avenida das Américas e às praias do Pontal e do Recreio.'),
      faq('po-faq-estrutura', 'O que o Pontal Oceânico oferece?', 'O bairro reúne segurança, comércio, áreas de lazer, ciclovia e proximidade com as praias.'),
    ],
    metaTitle: 'Pontal Oceânico | Bairro Planejado | Admirata',
    metaDescription:
      'Conheça o Pontal Oceânico, bairro planejado no Recreio próximo à praia, com natureza, segurança, comércio, lazer e acesso pela Av. das Américas.',
  },
]

const orderById = {
  'bairro-cidade-arte-barra': 1,
  'bairro-ilha-pura': 2,
  'bairro-rio2': 3,
  'bairro-cidade-jardim': 4,
  'bairro-peninsula': 5,
  'bairro-pontal-oceanico': 6,
}

const existing = await client.fetch(
  `*[_id in $ids]{_id, nome, "slug": slug.current}`,
  { ids: Object.keys(orderById) }
)
const existingIds = new Set(existing.map((document) => document._id))

console.log(`Modo: ${APPLY ? 'APLICAR' : 'SIMULAÇÃO'}`)
for (const document of missingNeighborhoods) {
  console.log(`${existingIds.has(document._id) ? 'preservar' : 'criar'}: ${document.nome} → /bairros-planejados/${document.slug.current}`)
}
console.log('Normalizar ordem dos seis bairros planejados.')

if (!APPLY) {
  console.log('\nNenhuma alteração foi gravada. Use --apply para confirmar.')
  process.exit(0)
}

for (const document of missingNeighborhoods) {
  await client.createIfNotExists(document)
}

for (const [id, ordem] of Object.entries(orderById)) {
  await client.patch(id).set({ bairroplanejado: true, ordem }).commit()
}

const verified = await client.fetch(
  `*[_id in $ids] | order(ordem asc){_id, nome, "slug": slug.current, ordem, bairroplanejado}`,
  { ids: Object.keys(orderById) }
)
console.log('\nVerificação final:')
console.log(JSON.stringify(verified, null, 2))
