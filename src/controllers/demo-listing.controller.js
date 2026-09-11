const { demoMode } = require('../config/env')
const demoListings = require('../services/demo-listing.service')
const { demoListingSchema } = require('../validators/listing.validator')
const { firstError } = require('../validators/auth.validator')

function ensureDemo(req, res) {
  if (demoMode && req.session.user?.isDemo) return true
  res.status(503).render('errors/500', {
    pageTitle: 'Recurso indisponível',
    description: 'A criação de anúncios será liberada após a conexão com o banco de dados.',
  })
  return false
}

function index(req, res) {
  if (!ensureDemo(req, res)) return
  res.render('anuncios/index', {
    pageTitle: 'Meus anúncios',
    description: 'Acompanhe os anúncios da demonstração.',
    listings: demoListings.initialize(req.session),
  })
}

function newForm(req, res) {
  if (!ensureDemo(req, res)) return
  res.render('anuncios/form', {
    pageTitle: 'Criar anúncio de demonstração',
    description: 'Cadastre um anúncio temporário para testar o portal.',
    values: { kind: 'PROPERTY', priceType: 'FIXED', purpose: 'SALE', state: 'SP' },
  })
}

function create(req, res) {
  if (!ensureDemo(req, res)) return
  const result = demoListingSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(422).render('anuncios/form', {
      pageTitle: 'Criar anúncio de demonstração',
      description: 'Cadastre um anúncio temporário para testar o portal.',
      values: req.body,
      flash: { type: 'error', title: 'Revise o formulário.', message: firstError(result) },
    })
  }

  demoListings.create(req.session, result.data)
  req.session.flash = { type: 'success', title: 'Anúncio criado.', message: 'O anúncio foi salvo apenas nesta sessão de demonstração.' }
  res.redirect(303, '/meus-anuncios')
}

function details(req, res) {
  if (!demoMode) return res.status(404).render('errors/404', {
    pageTitle: 'Anúncio não encontrado',
    description: 'Este anúncio não está disponível.',
  })

  const listing = demoListings.find(req.session, req.params.id)
  if (!listing) return res.status(404).render('errors/404', {
    pageTitle: 'Anúncio não encontrado',
    description: 'Este anúncio não existe na sessão atual.',
  })

  res.render('anuncios/detalhes', {
    pageTitle: listing.title,
    description: listing.description.slice(0, 150),
    listing,
  })
}

module.exports = { index, newForm, create, details }
