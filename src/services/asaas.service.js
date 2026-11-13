const AppError = require('../errors/app-error')
const { asaasApiUrl, asaasApiKey, asaasEnabled } = require('../config/env')

const REQUEST_TIMEOUT_MS = 15000

function ensureConfigured() {
  if (!asaasEnabled) {
    throw new AppError('O pagamento pelo Asaas ainda não foi configurado neste ambiente.', 503, 'ASAAS_NOT_CONFIGURED')
  }
}

function apiErrorMessage(body) {
  const descriptions = Array.isArray(body?.errors)
    ? body.errors.map((error) => error?.description).filter(Boolean)
    : []
  return descriptions.join(' ') || 'O Asaas não conseguiu processar a solicitação.'
}

async function request(path, { method = 'GET', body } = {}) {
  ensureConfigured()

  let response
  try {
    response = await fetch(`${asaasApiUrl}${path}`, {
      method,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'vemDeco/1.0',
        access_token: asaasApiKey,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new AppError('O Asaas demorou para responder. Tente novamente.', 504, 'ASAAS_TIMEOUT')
    }
    throw new AppError('Não foi possível conectar ao Asaas. Tente novamente.', 502, 'ASAAS_UNAVAILABLE')
  }

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      throw new AppError('O Asaas retornou uma resposta inválida.', 502, 'ASAAS_INVALID_RESPONSE')
    }
  }

  if (!response.ok) {
    throw new AppError(apiErrorMessage(payload), response.status >= 500 ? 502 : 422, 'ASAAS_API_ERROR')
  }

  return payload
}

function dueDate(days = 3) {
  const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(target)
}

function customerData({ user, cpfCnpj, phone, addressLine, postalCode }) {
  return {
    name: user.name,
    cpfCnpj: cpfCnpj.replace(/\D/g, ''),
    email: user.email,
    mobilePhone: phone.replace(/\D/g, ''),
    address: addressLine?.trim() || undefined,
    postalCode: postalCode?.replace(/\D/g, '') || undefined,
    externalReference: user.id,
    notificationDisabled: true,
  }
}

function createCustomer(input) {
  return request('/customers', {
    method: 'POST',
    body: customerData(input),
  })
}

function updateCustomer(customerId, input) {
  return request(`/customers/${encodeURIComponent(customerId)}`, {
    method: 'PUT',
    body: customerData(input),
  })
}

async function getOrCreateCustomer(input) {
  const query = new URLSearchParams({ externalReference: input.user.id, limit: '1' })
  const existing = await request(`/customers?${query}`)
  if (existing?.data?.[0]?.id) return updateCustomer(existing.data[0].id, input)
  return createCustomer(input)
}

function createPayment({ customerId, order, billingType }) {
  return request('/payments', {
    method: 'POST',
    body: {
      customer: customerId,
      billingType,
      value: Number(order.total),
      dueDate: dueDate(),
      description: `Pedido vemDeco ${order.id} - ${order.listing.title}`.slice(0, 500),
      externalReference: order.id,
    },
  })
}

function getPayment(paymentId) {
  return request(`/payments/${encodeURIComponent(paymentId)}`)
}

function getAccountStatus() {
  return request('/myAccount/status/')
}

async function ensurePaymentMethodAvailable(billingType) {
  ensureConfigured()
  if (billingType !== 'CREDIT_CARD') return

  const status = await getAccountStatus()
  if (status?.commercialInfo !== 'APPROVED') {
    throw new AppError(
      'O cadastro comercial da conta Asaas está pendente. Complete os dados comerciais no Sandbox, incluindo o faturamento mensal, antes de gerar cobranças por cartão.',
      422,
      'ASAAS_COMMERCIAL_INFO_PENDING',
    )
  }
}

async function deletePayment(paymentId) {
  try {
    await request(`/payments/${encodeURIComponent(paymentId)}`, { method: 'DELETE' })
  } catch {
    // Compensação de melhor esforço: o erro original deve continuar sendo reportado.
  }
}

module.exports = {
  createCustomer,
  updateCustomer,
  getOrCreateCustomer,
  createPayment,
  getPayment,
  getAccountStatus,
  ensurePaymentMethodAvailable,
  deletePayment,
  ensureConfigured,
}
