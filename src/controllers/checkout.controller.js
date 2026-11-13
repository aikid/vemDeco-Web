const listings = require('../repositories/listing.repository')
const orders = require('../repositories/checkout.repository')
const asaas = require('../services/asaas.service')
const { asaasEnabled, asaasSandbox } = require('../config/env')
const { checkoutSchema } = require('../validators/checkout.validator')
const { firstError } = require('../validators/auth.validator')
const AppError = require('../errors/app-error')

async function loadProduct(slug) {
  const listing = await listings.findPublishedBySlug(slug)
  return listing?.kind === 'PRODUCT' ? listing : null
}

async function show(req, res, next) {
  try {
    const listing = await loadProduct(req.params.slug)
    if (!listing) return next()
    if (listing.ownerId === req.session.user.id) {
      return res.status(403).render('errors/403', {
        pageTitle: 'Checkout indisponível',
        description: 'Você não pode comprar o próprio produto.',
      })
    }

    const profile = await orders.findBuyerPaymentProfile(req.session.user.id)
    res.render('checkout/form', {
      pageTitle: `Comprar ${listing.title}`,
      description: 'Revise o produto e informe os dados de entrega.',
      listing,
      values: {
        quantity: 1,
        recipientName: req.session.user.name,
        cpfCnpj: profile?.document || '',
        billingType: 'PIX',
      },
      asaasEnabled,
      asaasSandbox,
    })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  let order = null
  let payment = null

  try {
    const listing = await loadProduct(req.params.slug)
    if (!listing) return next()
    const result = checkoutSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(422).render('checkout/form', {
        pageTitle: `Comprar ${listing.title}`,
        description: 'Revise o produto e informe os dados de entrega.',
        listing,
        values: req.body,
        asaasEnabled,
        asaasSandbox,
        flash: { type: 'error', title: 'Revise o checkout.', message: firstError(result) },
      })
    }

    asaas.ensureConfigured()
    order = await orders.createOrder(req.session.user.id, listing.id, result.data)
    const profile = await orders.findBuyerPaymentProfile(req.session.user.id)
    if (!profile) throw new AppError('Não foi possível localizar o comprador.', 404, 'BUYER_NOT_FOUND')

    const customer = await asaas.getOrCreateCustomer({
      user: profile,
      cpfCnpj: result.data.cpfCnpj,
      phone: result.data.phone,
    })

    payment = await asaas.createPayment({
      customerId: customer.id,
      order,
      billingType: result.data.billingType,
    })
    await orders.attachPayment(order.id, req.session.user.id, payment)

    res.redirect(303, `/pedidos/${order.id}`)
  } catch (error) {
    if (payment?.id) await asaas.deletePayment(payment.id)
    if (order?.id) await orders.cancelOrderAndRestoreStock(order.id, req.session.user.id)

    if (error.status) {
      req.session.flash = { type: 'error', title: 'Não foi possível concluir.', message: error.message }
      return res.redirect(303, `/anuncios/${req.params.slug}/checkout`)
    }
    next(error)
  }
}

async function confirmation(req, res, next) {
  try {
    const order = await orders.findBuyerOrder(req.params.id, req.session.user.id)
    if (!order) return next()
    res.render('checkout/confirmation', {
      pageTitle: order.status === 'CONFIRMED' ? 'Pagamento confirmado' : 'Pedido recebido',
      description: order.status === 'CONFIRMED'
        ? 'O pagamento do pedido foi confirmado.'
        : 'Seu pedido foi criado e aguarda pagamento.',
      order,
      asaasSandbox,
    })
  } catch (error) {
    next(error)
  }
}

async function syncPayment(req, res, next) {
  try {
    const order = await orders.findBuyerOrder(req.params.id, req.session.user.id)
    if (!order) return next()
    if (!order.paymentExternalId) {
      req.session.flash = { type: 'error', title: 'Pagamento indisponível.', message: 'Este pedido não possui uma cobrança vinculada.' }
      return res.redirect(303, `/pedidos/${order.id}`)
    }

    const payment = await asaas.getPayment(order.paymentExternalId)
    const result = await orders.applyPaymentUpdate({ payment })
    req.session.flash = result.status === 'CONFIRMED'
      ? { type: 'success', title: 'Pagamento confirmado.', message: 'O pedido foi atualizado com o status informado pelo Asaas.' }
      : { type: 'info', title: 'Status atualizado.', message: `A cobrança está com status ${payment.status}.` }
    res.redirect(303, `/pedidos/${order.id}`)
  } catch (error) {
    if (error.status) {
      req.session.flash = { type: 'error', title: 'Não foi possível sincronizar.', message: error.message }
      return res.redirect(303, `/pedidos/${req.params.id}`)
    }
    next(error)
  }
}

module.exports = { show, create, confirmation, syncPayment }
