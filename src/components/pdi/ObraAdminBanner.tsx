/**
 * ObraAdminBanner
 * Bloco editorial para empreendimentos "Obra por Administração":
 * sem banco · sem juros · sem comprovação de renda.
 *
 * Exibir quando: novidade === true (lançamento em construção direta)
 */
export default function ObraAdminBanner() {
  const itens = [
    {
      num: '01',
      titulo: 'Sem banco',
      desc: 'Pagamento direto com o incorporador, sem intermediação financeira nem aprovação de crédito.',
    },
    {
      num: '02',
      titulo: 'Sem juros',
      desc: 'Preço máximo garantido em contrato. Nenhum reajuste de obra recai sobre o comprador.',
    },
    {
      num: '03',
      titulo: 'Sem comprovação de renda',
      desc: 'Acesso simplificado independente do perfil bancário. Apenas entrada e parcelas diretas.',
    },
  ] as const

  return (
    <section className="bg-ink text-white px-5 py-14 md:px-12 md:py-20">
      {/* Eyebrow */}
      <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-5">
        Forma de aquisição
      </p>

      {/* Título */}
      <h2 className="text-2xl md:text-3xl font-light text-white leading-snug mb-12 max-w-lg">
        Obra por Administração —<br className="hidden md:block" /> a forma mais inteligente de comprar
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px border-t border-white/10">
        {itens.map((item) => (
          <div key={item.num} className="border-b border-white/10 md:border-b-0 md:border-r md:border-white/10 pt-7 pb-8 md:px-8 first:md:pl-0 last:md:border-r-0">
            <span className="text-gold text-[11px] font-mono tracking-widest block mb-4">
              {item.num}
            </span>
            <h3 className="text-white text-xl font-light mb-3">{item.titulo}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Rodapé informativo */}
      <p className="mt-10 text-white/30 text-xs leading-relaxed max-w-lg">
        Empreendimentos Obra por Administração possuem prestações mensais de obra e balões
        programados em contrato. Consulte nosso corretor para simular o fluxo completo.
      </p>
    </section>
  )
}
