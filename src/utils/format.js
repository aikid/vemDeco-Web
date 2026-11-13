function currency(value) {
  if (value === null || value === undefined || value === '') return 'Preço sob consulta'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value))
}

function status(value) {
  return ({ DRAFT: 'Rascunho', PUBLISHED: 'Publicado', PENDING_REVIEW: 'Em análise' })[value] || value
}

function paymentStatus(providerStatus, checkoutStatus) {
  const providerLabels = {
    PENDING: 'Aguardando pagamento',
    CONFIRMED: 'Pagamento confirmado',
    RECEIVED: 'Pagamento recebido',
    OVERDUE: 'Pagamento vencido',
    REFUNDED: 'Pagamento estornado',
    PARTIALLY_REFUNDED: 'Parcialmente estornado',
    DELETED: 'Cobrança removida',
    CHARGEBACK_REQUESTED: 'Chargeback solicitado',
    AWAITING_RISK_ANALYSIS: 'Em análise de risco',
    APPROVED_BY_RISK_ANALYSIS: 'Aprovado na análise de risco',
    REPROVED_BY_RISK_ANALYSIS: 'Recusado na análise de risco',
    CREDIT_CARD_CAPTURE_REFUSED: 'Cartão recusado',
  }
  const checkoutLabels = {
    PENDING_PAYMENT: 'Aguardando pagamento',
    CONFIRMED: 'Pagamento confirmado',
    CANCELLED: 'Pedido cancelado',
  }
  return providerLabels[providerStatus] || checkoutLabels[checkoutStatus] || 'Status indisponível'
}

module.exports = { currency, status, paymentStatus }
