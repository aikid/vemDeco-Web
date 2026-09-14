const { demoMode, databaseUrl } = require('../config/env')
const demoListings = require('../services/demo-listing.service')
const listings = require('../repositories/listing.repository')
const interests = require('../repositories/interest.repository')

function render(view, pageTitle, description) {
  return (req, res) => res.render(view, { pageTitle, description })
}

function unavailable(view, pageTitle, description) {
  return (req, res) => res.render(view, {
    pageTitle,
    description,
    flash: {
      type: 'error',
      title: 'Envio ainda não ativado.',
      message: 'A interface está pronta; este fluxo será conectado com segurança na etapa de autenticação e banco de dados.',
    },
  })
}

const home = async (req, res, next) => {
  try {
    const search = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 120) : ''
    const requestedCategory = typeof req.query.categoria === 'string' ? req.query.categoria : ''
    const category = ['imoveis', 'servicos', 'produtos'].includes(requestedCategory) ? requestedCategory : ''
    const featuredListings = demoMode
      ? [demoListings.featured()]
      : databaseUrl ? await listings.findPublished({ search, category }) : []

    res.render('index', {
      pageTitle: 'Encontre imóveis, serviços e produtos',
      description: 'Encontre imóveis, profissionais e produtos em um só lugar.',
      search,
      category,
      featuredListings,
    })
  } catch (error) {
    next(error)
  }
}

const listingDetails = async (req, res, next) => {
  try {
    if (!databaseUrl || demoMode) return next()
    const listing = await listings.findPublishedBySlug(req.params.slug)
    if (!listing) return next()

    res.render('anuncios/detalhes', {
      pageTitle: listing.title,
      description: listing.description.slice(0, 150),
      listing,
    })
  } catch (error) {
    next(error)
  }
}

const dashboard = async (req, res, next) => {
  try {
    const interestCount = req.session.user.isDemo ? 0 : await interests.countNewForOwner(req.session.user.id)
    res.render('dashboard', {
      pageTitle: 'Minha área',
      description: 'Gerencie sua conta, anúncios e interesses recebidos.',
      interestCount,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  home,
  login: (req, res) => res.render('login', {
    pageTitle: 'Entrar',
    description: 'Acesse sua conta vemDeco.',
    returnTo: typeof req.query.returnTo === 'string' ? req.query.returnTo : '',
    values: {},
  }),
  register: (req, res) => res.render('cadastro', {
    pageTitle: 'Criar conta',
    description: 'Crie sua conta gratuita na vemDeco.',
    values: {},
  }),
  dashboard,
  confirmEmail: render('confirmaremail', 'Confirmar e-mail', 'Solicite um novo link de confirmação.'),
  forgotPassword: render('esquecisenha', 'Recuperar senha', 'Solicite a recuperação da sua senha.'),
  legacyListingDetails: render('produto', 'Apartamento em Carapicuíba', 'Detalhes do anúncio na vemDeco.'),
  listingDetails,
  contact: render('contato', 'Contato', 'Fale com a equipe vemDeco.'),
  confirmEmailUnavailable: unavailable('confirmaremail', 'Confirmar e-mail', 'Solicite um novo link de confirmação.'),
  forgotPasswordUnavailable: unavailable('esquecisenha', 'Recuperar senha', 'Solicite a recuperação da sua senha.'),
  contactUnavailable: unavailable('contato', 'Contato', 'Fale com a equipe vemDeco.'),
}
