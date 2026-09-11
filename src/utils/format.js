function currency(value) {
  if (value === null || value === undefined || value === '') return 'Preço sob consulta'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value))
}

function status(value) {
  return ({ DRAFT: 'Rascunho', PUBLISHED: 'Publicado', PENDING_REVIEW: 'Em análise' })[value] || value
}

module.exports = { currency, status }
