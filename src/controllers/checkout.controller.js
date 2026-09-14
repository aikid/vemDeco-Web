const listings = require('../repositories/listing.repository')
const orders = require('../repositories/checkout.repository')
const { checkoutSchema } = require('../validators/checkout.validator')
const { firstError } = require('../validators/auth.validator')

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

    res.render('checkout/form', {
      pageTitle: `Comprar ${listing.title}`,
      description: 'Revise o produto e informe os dados de entrega.',
      listing,
      values: { quantity: 1, recipientName: req.session.user.name },
    })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
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
        flash: { type: 'error', title: 'Revise o checkout.', message: firstError(result) },
      })
    }

    const order = await orders.createOrder(req.session.user.id, listing.id, result.data)
    res.redirect(303, `/pedidos/${order.id}`)
  } catch (error) {
    if (error.status) {
      req.session.flash = { type: 'error', title: 'Não foi possível concluir.', message: error.message }
      return res.redirect(303, `/anuncios/${req.params.slug}`)
    }
    next(error)
  }
}

async function confirmation(req, res, next) {
  try {
    const order = await orders.findBuyerOrder(req.params.id, req.session.user.id)
    if (!order) return next()
    res.render('checkout/confirmation', {
      pageTitle: 'Pedido recebido',
      description: 'Seu pedido foi criado e aguarda a integração de pagamento.',
      order,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { show, create, confirmation }
