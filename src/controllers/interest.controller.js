const listings = require('../repositories/listing.repository')
const interests = require('../repositories/interest.repository')
const { interestSchema } = require('../validators/interest.validator')
const { firstError } = require('../validators/auth.validator')

async function loadContactListing(slug) {
  const listing = await listings.findPublishedBySlug(slug)
  return listing && ['PROPERTY', 'SERVICE'].includes(listing.kind) ? listing : null
}

async function show(req, res, next) {
  try {
    const listing = await loadContactListing(req.params.slug)
    if (!listing) return next()
    if (listing.ownerId === req.session.user.id) {
      return res.status(403).render('errors/403', {
        pageTitle: 'Interesse indisponível',
        description: 'Você não pode demonstrar interesse no próprio anúncio.',
      })
    }

    res.render('interesses/form', {
      pageTitle: `Tenho interesse em ${listing.title}`,
      description: 'Envie uma mensagem ao anunciante.',
      listing,
      values: {},
    })
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const listing = await loadContactListing(req.params.slug)
    if (!listing) return next()
    const result = interestSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(422).render('interesses/form', {
        pageTitle: `Tenho interesse em ${listing.title}`,
        description: 'Envie uma mensagem ao anunciante.',
        listing,
        values: req.body,
        flash: { type: 'error', title: 'Revise sua mensagem.', message: firstError(result) },
      })
    }

    const interest = await interests.create(listing.id, req.session.user, result.data)
    res.redirect(303, `/interesses/enviado/${interest.id}`)
  } catch (error) {
    if (error.status) {
      req.session.flash = { type: 'error', title: 'Não foi possível enviar.', message: error.message }
      return res.redirect(303, `/anuncios/${req.params.slug}`)
    }
    next(error)
  }
}

async function confirmation(req, res, next) {
  try {
    const interest = await interests.findSentByUser(req.params.id, req.session.user.id)
    if (!interest) return next()
    res.render('interesses/confirmation', {
      pageTitle: 'Interesse enviado',
      description: 'O anunciante recebeu uma nova notificação.',
      interest,
    })
  } catch (error) {
    next(error)
  }
}

async function received(req, res, next) {
  try {
    if (req.session.user.isDemo) {
      return res.render('interesses/index', {
        pageTitle: 'Interesses recebidos',
        description: 'Acompanhe pessoas interessadas em seus anúncios.',
        interests: [],
      })
    }
    const receivedInterests = await interests.findReceivedByOwner(req.session.user.id)
    res.render('interesses/index', {
      pageTitle: 'Interesses recebidos',
      description: 'Acompanhe pessoas interessadas em seus anúncios.',
      interests: receivedInterests,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { show, create, confirmation, received }
