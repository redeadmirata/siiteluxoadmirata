/**
 * Configura Arte Design, Arte Jardim, Arte Wave e Arte Wood no Sanity.
 *
 * Simulação: npx sanity exec scripts/configurar-cidade-arte-restantes.mjs --with-user-token
 * Aplicar:   npx sanity exec scripts/configurar-cidade-arte-restantes.mjs --with-user-token -- --apply
 */
import sanityCli from 'sanity/cli'
import { createReadStream, existsSync } from 'fs'
import { extname, join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { getCliClient } = sanityCli
const client = getCliClient({ apiVersion: '2024-06-01' })
const APPLY = process.argv.includes('--apply')
const ROOT = join(__dirname, '..', 'drive-imagens', 'Calper')

const block = (key, text, style = 'normal') => ({
  _type: 'block', _key: key, style, markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
})

const commonPlants = [
  ['planta-tipo', 'planta-tipo.jpg', 'Apartamento tipo', 'Tipologia residencial'],
  ['planta-up-garden', 'planta-up-garden.jpg', 'Up Garden', 'Unidade com área externa'],
  ['planta-townhouse', 'planta-townhouse.jpg', 'Townhouse', 'Unidade com acesso e área externa'],
  ['planta-cobertura', 'planta-cobertura.jpg', 'Cobertura Dúplex', 'Cobertura'],
].map(([key, file, name, quartos]) => ({ key, file, name, quartos }))

const configs = [
  {
    slug: 'arte-design', name: 'Arte Design', folder: 'Arte Design', logo: 'logo.png',
    status: 'Grupo Fechado', units: 1554, towers: 4, totalArea: 15963.09, minArea: 34, maxArea: 135,
    types: ['1-quarto', 'cobertura'],
    description: 'Arquitetura, paisagem e espaços de convivência se encontram no Arte Design, com unidades compactas, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex.',
    seoTitle: 'Arte Design | Cidade Arte Barra',
    seoDescription: 'Conheça o Arte Design no Cidade Arte: arquitetura contemporânea, rooftop com piscina, unidades compactas, Up Gardens, Townhouses e Coberturas.',
    about: [
      block('design-manifesto', 'O design não está apenas nos traços. Ele organiza a paisagem, os encontros e a forma de viver.'),
      block('design-h2-1', 'Uma arquitetura que muda a perspectiva', 'h2'),
      block('design-p-1', 'No Arte Design, os quatro edifícios formam uma composição urbana de linhas marcantes, varandas e grandes aberturas. A arquitetura se conecta às alamedas arborizadas do Cidade Arte e cria diferentes enquadramentos da Barra Olímpica — da paisagem ao horizonte.'),
      block('design-h2-2', 'A rotina também acontece no alto', 'h2'),
      block('design-p-2', 'Piscina com borda infinita, sky lounge e áreas de convivência no rooftop transformam a vista em parte do lazer. No térreo e nas áreas comuns, restaurante, academia, spa, coworking, quadras, playgrounds e espaços para pets acompanham os vários ritmos do dia.'),
      block('design-h2-3', 'Plantas para novas formas de morar', 'h2'),
      block('design-p-3', 'As opções incluem apartamentos de 1 quarto, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 34 a 135 m². Há soluções compactas para uma rotina prática e unidades com terraços ou áreas externas para quem deseja mais espaço.'),
      block('design-p-4', 'Serviços compartilhados, fechadura inteligente, aplicativo do condomínio e transporte até o metrô Jardim Oceânico acrescentam conveniência a um projeto em que arquitetura e uso cotidiano foram pensados juntos.'),
    ],
    infrastructure: ['Piscina adulto', 'Piscina com borda infinita', 'Sky lounge', 'Academia', 'Fitness externo', 'Restaurante', 'Salão de festas com lounge externo', 'Churrasqueira', 'Coworking', 'Spa', 'Play Kids', 'Parque inclusivo', 'Quadra de areia / beach tennis', 'Quadra de grama', 'Brinquedoteca', 'Pet place', 'Pet care', 'Auditório', 'Lavanderia compartilhada'],
    photos: [['01-fachada.jpg','Vista do conjunto arquitetônico'],['02-piscina.jpg','Piscina com borda infinita'],['03-alameda.jpg','Alameda arborizada'],['04-lobby.jpg','Lobby'],['05-varanda.jpg','Vista da varanda'],['06-academia.jpg','Academia'],['07-sky-lounge.jpg','Sky lounge'],['08-salao-festas.jpg','Salão de festas'],['09-coworking.jpg','Coworking'],['10-restaurante.jpg','Restaurante'],['11-churrasqueira.jpg','Churrasqueira'],['12-spa.jpg','Spa'],['13-brinquedoteca.png','Brinquedoteca'],['14-pet-care.jpg','Pet care'],['15-quadra-areia.jpg','Quadra de areia'],['16-playground.jpg','Playground']],
    faqs: [['Quais são as tipologias do Arte Design?','O projeto reúne apartamentos de 1 quarto, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 34 a 135 m².'],['Quantas unidades fazem parte do Arte Design?','A ficha técnica informa 1.554 unidades distribuídas em quatro blocos residenciais, incluindo apartamentos, Townhouses e lojas.'],['O Arte Design possui lazer no rooftop?','Sim. O projeto apresenta piscina com borda infinita, sky lounge e áreas de convivência no rooftop, além de lazer e serviços nas áreas comuns.'],['Qual é o status atual do Arte Design?','A incorporadora Calper informa atualmente o empreendimento com status de Grupo Fechado.']],
  },
  {
    slug: 'arte-jardim', name: 'Arte Jardim', folder: 'Arte Jardim', logo: null,
    status: 'Em obras', units: 548, towers: 4, totalArea: 15963.09, minArea: 60, maxArea: 145,
    types: ['2-quartos', '3-quartos', '4-quartos', 'cobertura'],
    description: 'Fachadas verdes, alamedas e áreas de lazer aproximam arquitetura e natureza no Arte Jardim, com apartamentos, Up Gardens, Townhouses e Coberturas Dúplex.',
    seoTitle: 'Arte Jardim | Cidade Arte Barra',
    seoDescription: 'Conheça o Arte Jardim no Cidade Arte: fachadas verdes, lazer completo e plantas de 2 a 4 quartos, Up Gardens, Townhouses e Coberturas Dúplex.',
    about: [
      block('jardim-manifesto', 'O verde acompanha a arquitetura e transforma a paisagem em parte da rotina.'),
      block('jardim-h2-1', 'Uma casa aberta para o jardim', 'h2'),
      block('jardim-p-1', 'No Arte Jardim, fachadas verdes, varandas e alamedas arborizadas criam uma relação próxima entre os edifícios e a natureza. Os quatro blocos foram posicionados para valorizar vistas para a área de lazer, ruas, praças e parques do Cidade Arte.'),
      block('jardim-h2-2', 'Dias que podem seguir vários ritmos', 'h2'),
      block('jardim-p-2', 'O parque aquático reúne piscinas com raia, deck molhado e área infantil com toboágua. Academia, quadras, playgrounds, salão de festas, coworking, cinema, spa e espaços para crianças e pets permitem alternar movimento, descanso e convivência sem sair do condomínio.'),
      block('jardim-h2-3', 'Espaços que acompanham a vida', 'h2'),
      block('jardim-p-3', 'As plantas incluem apartamentos de 2 e 3 quartos, Up Gardens de 3 quartos, Townhouses de 4 e 5 quartos e Coberturas Dúplex de 3 e 4 quartos. As áreas residenciais variam de aproximadamente 60 a 145 m², com opções que incluem terraços e espaços externos privativos.'),
      block('jardim-p-4', 'Aplicativo do condomínio, fechadura inteligente, espaços compartilhados e ônibus condominial completam uma proposta em que o jardim não é cenário: é parte da experiência de morar.'),
    ],
    infrastructure: ['Piscinas com raia e deck molhado', 'Piscina infantil com toboágua', 'Academia', 'Espaço funcional', 'Quadra de areia', 'Quadra poliesportiva', 'Play Kids', 'Play Teen', 'Churrasqueira', 'Salão de festas com lounge externo', 'Coworking', 'Cinema', 'Brinquedoteca', 'Espaço gamer', 'Spa com sauna e repouso', 'Sala de massagem', 'Pet place', 'Pet care', 'Sala multiuso', 'Lavanderia compartilhada', 'Ferramentas compartilhadas'],
    photos: [['01-fachada.jpg','Fachada verde'],['02-aerea.jpg','Vista aérea do conjunto'],['03-piscina.jpg','Parque aquático'],['04-alameda.jpg','Alameda e paisagismo'],['05-churrasqueira.jpg','Churrasqueira'],['06-playground.jpg','Playground'],['07-academia.jpg','Academia'],['08-coworking.jpg','Coworking'],['09-salao-festas.jpg','Salão de festas'],['10-spa.jpg','Spa'],['11-townhouse.jpg','Townhouse'],['12-lobby.jpg','Lobby'],['13-home-cinema.jpg','Home cinema'],['14-brinquedoteca.jpg','Brinquedoteca'],['15-quadra-areia.jpg','Quadra de areia'],['16-onibus.jpg','Ônibus do condomínio']],
    faqs: [['Quais são as tipologias do Arte Jardim?','O projeto reúne apartamentos de 2 e 3 quartos, Up Gardens de 3 quartos, Townhouses de 4 e 5 quartos e Coberturas Dúplex de 3 e 4 quartos.'],['Quantas unidades e edifícios compõem o Arte Jardim?','O Arte Jardim possui 548 unidades e quatro blocos residenciais, conforme a ficha técnica do empreendimento.'],['Como é o lazer do Arte Jardim?','O condomínio apresenta parque aquático, academia, quadras, playgrounds, spa, cinema, salão de festas, coworking e diversos espaços de convivência.'],['Qual é o status atual do Arte Jardim?','A incorporadora Calper informa atualmente o Arte Jardim com status de obras.']],
  },
  {
    slug: 'arte-wave', name: 'Arte Wave', folder: 'Arte Wave', logo: 'logo.jpg',
    status: 'Grupo em formação', units: 1551, towers: 4, totalArea: 15963.09, minArea: 34, maxArea: 87,
    types: ['1-quarto', 'cobertura'],
    description: 'Água, esporte e arquitetura dão ritmo ao Arte Wave Surf Residences, com Studios, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex.',
    seoTitle: 'Arte Wave | Cidade Arte Barra',
    seoDescription: 'Conheça o Arte Wave Surf Residences: piscina de surf indoor, rooftop, lazer e plantas de Studios, Double Suítes, Up Gardens e Townhouses.',
    about: [
      block('wave-manifesto', 'Entre o movimento da água e a calma da paisagem, a rotina encontra outro ritmo.'),
      block('wave-h2-1', 'Arquitetura em movimento', 'h2'),
      block('wave-p-1', 'O Arte Wave reúne quatro edifícios com fachadas de volumes marcantes e tons mais profundos, cercados pelas alamedas e áreas verdes do Cidade Arte. A linguagem arquitetônica acompanha a ideia de movimento que dá identidade ao projeto.'),
      block('wave-h2-2', 'A água como experiência', 'h2'),
      block('wave-p-2', 'A proposta inclui piscina com borda infinita, piscina adulto e uma piscina de surf indoor com tecnologia internacional, apresentada como experiência opcional para moradores e convidados. Sky lounge, academia, spa, restaurante, quadras e espaços de convivência ampliam as possibilidades ao longo do dia.'),
      block('wave-h2-3', 'Compacto quando precisa. Amplo quando deseja.', 'h2'),
      block('wave-p-3', 'Studios, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex formam um conjunto de plantas residenciais de aproximadamente 34 a 87 m². Há opções objetivas para uma rotina dinâmica e unidades com áreas externas que prolongam a casa.'),
      block('wave-p-4', 'Serviços compartilhados, fechadura inteligente, aplicativo, Beach Point e transporte condominial conectam moradia, lazer e mobilidade em uma experiência pensada para quem gosta de viver a cidade sem abrir mão do próprio ritmo.'),
    ],
    infrastructure: ['Piscina adulto', 'Piscina com borda infinita', 'Piscina de surf indoor', 'Sky lounge', 'Academia', 'Fitness externo', 'Restaurante', 'Salão de festas com lounge externo', 'Churrasqueira', 'Coworking', 'Spa', 'Play Kids', 'Parque inclusivo', 'Quadra de areia / beach tennis', 'Quadra poliesportiva', 'Brinquedoteca', 'Pet place', 'Pet care', 'Auditório', 'Lavanderia compartilhada'],
    photos: [['01-fachada.jpg','Vista do Cidade Arte e do conjunto'],['02-piscina.jpg','Piscina com borda infinita'],['03-piscina-ondas.jpg','Piscina de surf indoor'],['04-alameda.jpg','Alameda do Cidade Arte'],['05-lobby.jpg','Lobby'],['06-up-garden.jpg','Up Garden'],['07-townhouse.jpg','Townhouse'],['08-sky-lounge.jpg','Sky lounge'],['09-salao-festas.jpg','Salão de festas'],['10-spa.jpg','Spa'],['11-restaurante.jpg','Restaurante'],['12-churrasqueira.jpg','Churrasqueira'],['13-playground.jpg','Playground'],['14-academia.jpg','Academia'],['15-coworking.jpg','Coworking'],['16-pet-place.jpg','Pet place']],
    faqs: [['Quais são as tipologias do Arte Wave?','O projeto reúne Studios, Double Suítes, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 34 a 87 m².'],['Quantas unidades fazem parte do Arte Wave?','A ficha técnica informa 1.551 unidades distribuídas em quatro blocos residenciais, incluindo apartamentos, Townhouses e lojas.'],['O Arte Wave terá piscina de surf indoor?','O material oficial apresenta uma piscina de surf indoor com tecnologia internacional como experiência opcional para moradores e convidados, sujeita às condições do projeto.'],['Qual é o status atual do Arte Wave?','A incorporadora Calper informa atualmente o empreendimento com status de Grupo em formação.']],
  },
  {
    slug: 'arte-wood', name: 'Arte Wood', folder: 'Arte Wood', logo: 'logo.png',
    status: 'Grupo em formação', units: 872, towers: 4, totalArea: 15963.09, minArea: 29.92, maxArea: 182.8,
    types: ['1-quarto', '2-quartos', '3-quartos', 'cobertura'],
    description: 'Tons de madeira, luz natural e áreas verdes criam uma atmosfera acolhedora no Arte Wood, com Studios, apartamentos, Up Gardens, Townhouses e Coberturas.',
    seoTitle: 'Arte Wood | Cidade Arte Barra',
    seoDescription: 'Conheça o Arte Wood no Cidade Arte: arquitetura de atmosfera natural, lazer completo e plantas de Studios a 3 quartos, Up Gardens e Townhouses.',
    about: [
      block('wood-manifesto', 'Madeira, luz e paisagem compõem uma arquitetura de presença mais quente e natural.'),
      block('wood-h2-1', 'Uma atmosfera que começa na fachada', 'h2'),
      block('wood-p-1', 'No Arte Wood, tons amadeirados, varandas e grandes aberturas criam uma identidade acolhedora para os quatro edifícios. O projeto se integra às áreas verdes e alamedas da quinta quadra do Cidade Arte, aproximando arquitetura, paisagem e vida cotidiana.'),
      block('wood-h2-2', 'Lazer para estar, mover e desacelerar', 'h2'),
      block('wood-p-2', 'Piscina adulto, raia, deck molhado, hidromassagem e piscina infantil formam o parque aquático. Academia, fitness externo, quadras, playground, pool house, salão de festas gourmet, spa, coworking e espaços para pets permitem escolher o ritmo de cada momento.'),
      block('wood-h2-3', 'Uma coleção ampla de plantas', 'h2'),
      block('wood-p-3', 'As opções incluem Studios, Double Suítes, apartamentos de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex. As áreas residenciais variam de aproximadamente 30 a 183 m², com soluções compactas, unidades familiares e espaços externos privativos.'),
      block('wood-p-4', 'Fechadura inteligente, aplicativo do condomínio, espaços compartilhados, Beach Point e transporte até o metrô Jardim Oceânico completam uma proposta em que conveniência e bem-estar aparecem de forma natural, sem interromper a experiência da casa.'),
    ],
    infrastructure: ['Piscina adulto', 'Piscina com raia', 'Deck molhado', 'Hidromassagem', 'Piscina infantil', 'Pool house', 'Academia', 'Fitness externo', 'Quadra de areia', 'Quadra poliesportiva', 'Playground', 'Churrasqueira', 'Salão de festas gourmet', 'Coworking', 'Salas de reunião', 'Spa com sauna e repouso', 'Sala de massagem', 'Brinquedoteca', 'Pet place', 'Pet care', 'Lavanderia compartilhada', 'Ferramentas compartilhadas', 'Guarda-entregas'],
    photos: [['01-fachada.jpg','Fachadas e paisagismo'],['02-piscina.jpg','Parque aquático'],['03-piscina-noturna.jpg','Parque aquático à noite'],['04-alameda.jpg','Alameda do Cidade Arte'],['05-raia.png','Piscina com raia'],['06-piscina-surf-indoor.png','Piscina de surf indoor do Cidade Arte'],['07-pista-skate.png','Pista de skate do Cidade Arte'],['08-academia.png','Academia'],['09-coworking.jpg','Coworking'],['10-salao-festas.jpg','Salão de festas gourmet'],['11-spa.jpg','Spa'],['12-up-garden.jpg','Up Garden'],['13-playground.jpg','Playground'],['14-pavilhao-artes.png','Pavilhão das Artes do Cidade Arte'],['15-lobby.jpg','Lobby'],['16-apartamento.jpg','Ambiente residencial']],
    faqs: [['Quais são as tipologias do Arte Wood?','O projeto reúne Studios, Double Suítes, apartamentos de 2 e 3 quartos, Up Gardens, Townhouses e Coberturas Dúplex, com áreas residenciais de aproximadamente 30 a 183 m².'],['Quantas unidades fazem parte do Arte Wood?','A ficha técnica datada de janeiro de 2026 informa 872 unidades distribuídas em quatro blocos residenciais, incluindo apartamentos, Townhouses e lojas.'],['Como é o lazer do Arte Wood?','O projeto apresenta parque aquático, academia, quadras, playground, pool house, salão de festas gourmet, spa, coworking e espaços para crianças e pets.'],['Qual é o status atual do Arte Wood?','A incorporadora Calper informa atualmente o empreendimento com status de Grupo em formação.']],
  },
]

const contentType = (file) => extname(file).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg'
const assetFilename = (slug, file) => `${slug}-${file}`

console.log(`Modo: ${APPLY ? 'APLICAR' : 'SIMULAÇÃO'}`)
const targetDocumentIds = []

for (const config of configs) {
  const folder = join(ROOT, config.folder, 'site-selecionadas')
  const plants = commonPlants
  const mediaFiles = [...config.photos.map(([file]) => file), ...plants.map((plant) => plant.file), ...(config.logo ? [config.logo] : [])]
  const missing = mediaFiles.filter((file) => !existsSync(join(folder, file)))
  if (missing.length) throw new Error(`${config.name}: arquivos ausentes: ${missing.join(', ')}`)

  const current = await client.fetch(
    `*[_type == "condominio" && (slug.current == $slug || slug.current match $pattern)][0]`,
    { slug: config.slug, pattern: `${config.slug}*` }
  )
  if (!current) throw new Error(`Documento não encontrado: ${config.slug}`)
  targetDocumentIds.push(current._id)

  console.log(`\n${config.name} (${current._id})`)
  console.log(`  capa: ${config.photos[0][0]} | galeria: ${config.photos.length - 1} | plantas: ${plants.length} | logo: ${config.logo || 'não disponível'}`)
  console.log(`  unidades: ${config.units} | torres: ${config.towers} | áreas: ${config.minArea}–${config.maxArea} m²`)
  if (!APPLY) continue

  const filenames = mediaFiles.map((file) => assetFilename(config.slug, file))
  const existingAssets = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename in $files]{originalFilename, _id}`, { files: filenames })
  const existing = new Map(existingAssets.map((asset) => [asset.originalFilename, asset._id]))
  const uploaded = new Map()

  for (const [index, file] of mediaFiles.entries()) {
    const filename = assetFilename(config.slug, file)
    let assetId = existing.get(filename)
    process.stdout.write(`  [${String(index + 1).padStart(2, '0')}/${mediaFiles.length}] ${file} ... `)
    if (!assetId) {
      const asset = await client.assets.upload('image', createReadStream(join(folder, file)), { filename, contentType: contentType(file) })
      assetId = asset._id
      console.log('ok')
    } else console.log('já existente')
    uploaded.set(file, assetId)
  }

  const [coverFile, coverCaption] = config.photos[0]
  const fotoCapa = { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(coverFile) }, alt: `${coverCaption} do ${config.name}` }
  const galeria = config.photos.slice(1).map(([file, caption], index) => ({
    _type: 'object', _key: `foto-${index + 1}`, asset: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(file) } }, alt: `${caption} — ${config.name}`, legenda: caption,
  }))
  const plantasBaixas = plants.map((plant) => ({
    _type: 'object', _key: plant.key, nome: plant.name, quartos: plant.quartos,
    imagem: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(plant.file) } },
  }))
  const faqs = config.faqs.map(([pergunta, resposta], index) => ({ _type: 'faq', _key: `faq-${index + 1}`, pergunta, resposta }))
  const patch = {
    tipo: 'vertical', construtora: 'Calper', status: config.status, forcarNoindex: false,
    numTorres: config.towers, numUnidades: config.units, areaTotal: config.totalArea,
    areaPrivativaMin: config.minArea, areaPrivativaMax: config.maxArea,
    tipologiasDisponiveis: config.types, descricao: config.description, sobre: config.about,
    infraestrutura: config.infrastructure, faqs, fotoCapa, galeria, plantasBaixas,
    ...(config.logo ? { logoEmpreendimento: { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(config.logo) }, alt: `Logo ${config.name}` } } : {}),
    seo: { ...(current.seo || {}), titulo: config.seoTitle, descricao: config.seoDescription },
  }

  const draftId = `drafts.${current._id}`
  const draft = await client.getDocument(draftId)
  for (const id of draft ? [current._id, draftId] : [current._id]) {
    await client.patch(id).set(patch).commit()
    console.log(`  atualizado: ${id}`)
  }
}

if (!APPLY) {
  console.log('\nNenhuma alteração foi gravada. Use --apply para confirmar.')
  process.exit(0)
}

const verified = await client.fetch(`*[_id in $ids]{nome, "slug": slug.current, status, numUnidades, "capa": fotoCapa.asset->url, "fotos": count(galeria), "plantas": count(plantasBaixas), "blocos": count(sobre)}`, { ids: targetDocumentIds })
console.log('\nVerificação final:')
console.log(JSON.stringify(verified, null, 2))
