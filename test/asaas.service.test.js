const test = require('node:test')
const assert = require('node:assert/strict')

process.env.ASAAS_API_KEY = '$aact_hmlg_teste_local'
process.env.ASAAS_API_URL = 'https://api-sandbox.asaas.com/v3'

const asaas = require('../src/services/asaas.service')
const { checkoutSchema, validCpfCnpj } = require('../src/validators/checkout.validator')

test('valida CPF e CNPJ antes de enviar o checkout', () => {
  assert.equal(validCpfCnpj('249.715.637-92'), true)
  assert.equal(validCpfCnpj('11.111.111/1111-11'), false)
  assert.equal(validCpfCnpj('123'), false)
})

test('aceita cartão de crédito hospedado como forma de pagamento', () => {
  const result = checkoutSchema.safeParse({
    quantity: 1,
    recipientName: 'Cliente Teste',
    phone: '11999990000',
    addressLine: 'Rua de Teste, 100',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01001000',
    cpfCnpj: '24971563792',
    billingType: 'CREDIT_CARD',
  })
  assert.equal(result.success, true)
})

test('localiza ou cria cliente no Sandbox com autenticação do Asaas', async (context) => {
  const originalFetch = global.fetch
  context.after(() => { global.fetch = originalFetch })

  const captured = []
  global.fetch = async (url, options) => {
    captured.push({ url, options })
    if (options.method === 'GET') {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ id: 'cus_teste' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  const customer = await asaas.getOrCreateCustomer({
    user: { id: 'user-1', name: 'Cliente Teste', email: 'cliente@example.test' },
    cpfCnpj: '249.715.637-92',
    phone: '(11) 99999-0000',
  })

  assert.equal(customer.id, 'cus_teste')
  assert.match(captured[0].url, /^https:\/\/api-sandbox\.asaas\.com\/v3\/customers\?externalReference=user-1/)
  assert.equal(captured[1].url, 'https://api-sandbox.asaas.com/v3/customers')
  assert.equal(captured[1].options.headers.access_token, '$aact_hmlg_teste_local')
  assert.equal(captured[1].options.headers['user-agent'], 'vemDeco/1.0')
  assert.deepEqual(JSON.parse(captured[1].options.body), {
    name: 'Cliente Teste',
    cpfCnpj: '24971563792',
    email: 'cliente@example.test',
    mobilePhone: '11999990000',
    externalReference: 'user-1',
    notificationDisabled: true,
  })
})

test('atualiza CPF e endereço de cliente já existente antes da cobrança', async (context) => {
  const originalFetch = global.fetch
  context.after(() => { global.fetch = originalFetch })

  const calls = []
  global.fetch = async (url, options) => {
    calls.push({ url, options })
    if (options.method === 'GET') {
      return new Response(JSON.stringify({ data: [{ id: 'cus_existente', cpfCnpj: null }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ id: 'cus_existente', cpfCnpj: '24971563792' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  const customer = await asaas.getOrCreateCustomer({
    user: { id: 'user-1', name: 'Cliente Teste', email: 'cliente@example.test' },
    cpfCnpj: '249.715.637-92',
    phone: '(11) 99999-0000',
    addressLine: 'Rua de Teste, 100',
    postalCode: '01001-000',
  })

  assert.equal(customer.cpfCnpj, '24971563792')
  assert.equal(calls.length, 2)
  assert.equal(calls[1].url, 'https://api-sandbox.asaas.com/v3/customers/cus_existente')
  assert.equal(calls[1].options.method, 'PUT')
  assert.deepEqual(JSON.parse(calls[1].options.body), {
    name: 'Cliente Teste',
    cpfCnpj: '24971563792',
    email: 'cliente@example.test',
    mobilePhone: '11999990000',
    address: 'Rua de Teste, 100',
    postalCode: '01001000',
    externalReference: 'user-1',
    notificationDisabled: true,
  })
})

test('gera cobrança de cartão sem enviar dados sensíveis à API', async (context) => {
  const originalFetch = global.fetch
  context.after(() => { global.fetch = originalFetch })

  let requestBody
  global.fetch = async (url, options) => {
    requestBody = JSON.parse(options.body)
    assert.equal(url, 'https://api-sandbox.asaas.com/v3/payments')
    return new Response(JSON.stringify({
      id: 'pay_cartao_teste',
      billingType: 'CREDIT_CARD',
      status: 'PENDING',
      invoiceUrl: 'https://sandbox.asaas.com/i/pay_cartao_teste',
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  const payment = await asaas.createPayment({
    customerId: 'cus_teste',
    billingType: 'CREDIT_CARD',
    order: { id: 'order-1', total: '199.90', listing: { title: 'Produto de teste' } },
  })

  assert.equal(payment.invoiceUrl, 'https://sandbox.asaas.com/i/pay_cartao_teste')
  assert.equal(requestBody.billingType, 'CREDIT_CARD')
  assert.equal(requestBody.value, 199.9)
  assert.equal('creditCard' in requestBody, false)
  assert.equal('creditCardHolderInfo' in requestBody, false)
})

test('propaga uma mensagem compreensível quando o Asaas rejeita a cobrança', async (context) => {
  const originalFetch = global.fetch
  context.after(() => { global.fetch = originalFetch })

  global.fetch = async () => new Response(JSON.stringify({
    errors: [{ code: 'invalid_value', description: 'Valor inválido.' }],
  }), { status: 400, headers: { 'content-type': 'application/json' } })

  await assert.rejects(
    () => asaas.getPayment('pay_invalido'),
    (error) => error.code === 'ASAAS_API_ERROR' && error.message === 'Valor inválido.' && error.status === 422,
  )
})
