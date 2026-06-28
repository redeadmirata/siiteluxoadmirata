export function formatPreco(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumero(value: number) {
  return value.toLocaleString('pt-BR')
}
