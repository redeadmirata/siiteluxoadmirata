'use client'

import HeroEmpreendimento from './HeroEmpreendimento'
import type { EmpreendimentoData } from './types'
import {
  ArquiteturaSection,
  LifestyleSection,
  LocalizacaoSection,
  ManifestoSection,
} from './StorySections'
import {
  CTAFinalSection,
  DiferenciaisSection,
  GaleriaSection,
  LazerSection,
  PlantasSection,
} from './DetailSections'

export type { EmpreendimentoData } from './types'

export default function EmpreendimentoLanding({ data }: { data: EmpreendimentoData }) {
  const temArquitetura = Boolean(
    data.construtora ||
    data.numTorres ||
    data.anoEntrega ||
    data.areaTotal ||
    data.sobreParagrafos?.[0]
  )
  const temLifestyle = (data.sobreParagrafos?.length ?? 0) > 1
  const temLocalizacao = Boolean(data.bairroNome || (data.proximidades?.length ?? 0) > 0)
  const temDiferenciais = Boolean(
    data.precoMinimo ||
    data.numUnidades ||
    data.prazoEntrega ||
    data.status ||
    data.areaPrivativaMin
  )
  const temGaleria = (data.galeria?.length ?? 0) > 0
  const temPlantas = (data.plantas?.length ?? 0) > 0
  const temLazer = (data.infraestrutura?.length ?? 0) > 0

  let proximaSecaoId = 'galeria'
  if (data.manifesto) proximaSecaoId = 'manifesto'
  else if (temArquitetura) proximaSecaoId = 'arquitetura'

  return (
    <>
      <HeroEmpreendimento
        nome={data.nome}
        tipoLabel={data.tipoLabel}
        status={data.status}
        bairroNome={data.bairroNome}
        cidade={data.cidade}
        estado={data.estado}
        imageSrc={data.heroImageSrc}
        imageLqip={data.heroImageLqip}
        videoMp4={data.heroVideoMp4}
        proximaSecaoId={proximaSecaoId}
      />

      {data.manifesto && <ManifestoSection texto={data.manifesto} nome={data.nome} />}
      {temArquitetura && <ArquiteturaSection data={data} />}
      {temLifestyle && <LifestyleSection data={data} />}
      {temLocalizacao && <LocalizacaoSection data={data} />}
      {temDiferenciais && <DiferenciaisSection data={data} />}
      {temGaleria && data.galeria && <GaleriaSection galeria={data.galeria} />}
      {temPlantas && data.plantas && <PlantasSection plantas={data.plantas} />}
      {temLazer && data.infraestrutura && <LazerSection itens={data.infraestrutura} />}
      <CTAFinalSection data={data} />
    </>
  )
}
