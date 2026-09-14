const { demoMode } = require('../config/env')
const demoListings = require('../services/demo-listing.service')
const databaseListings = require('../repositories/listing.repository')
const { demoListingSchema } = require('../validators/listing.validator')
const { firstError } = require('../validators/auth.validator')
const { validateListingImage } = require('../middlewares/listing-upload.middleware')

function isDemoSession(req) {
  return demoMode && req.session.user?.isDemo
}

async function index(req, res, next) {
  try {
    const usingDemo = isDemoSession(req)
    const userListings = usingDemo
      ? demoListings.initialize(req.session)
      : await databaseListings.findByOwnerId(req.session.user.id)

    res.render('anuncios/index', {
      pageTitle: 'Meus anúncios',
      description: 'Acompanhe e gerencie seus anúncios.',
      listings: userListings,
      isDemoListingFlow: usingDemo,
    })
  } catch (error) {
    next(error)
  }
}

function newForm(req, res) {
  const usingDemo = isDemoSession(req)
  const initialKind = req.query.tipo === 'servico' ? 'SERVICE' : req.query.tipo === 'produto' ? 'PRODUCT' : 'PROPERTY'
  res.render('anuncios/form', {
    pageTitle: 'Criar anúncio',
    description: usingDemo ? 'Cadastre um anúncio temporário para testar o portal.' : 'Publique um imóvel, serviço ou produto.',
    values: { kind: initialKind, priceType: 'FIXED', purpose: 'SALE', state: 'SP' },
    isDemoListingFlow: usingDemo,
    isEditing: false,
    formAction: '/anuncios',
  })
}

async function create(req, res, next) {
  const usingDemo = isDemoSession(req)
  const result = demoListingSchema.safeParse(req.body)
  const imageError = req.uploadError || validateListingImage(req.file)

  if (!result.success || imageError) {
    return res.status(422).render('anuncios/form', {
      pageTitle: 'Criar anúncio',
      description: usingDemo ? 'Cadastre um anúncio temporário para testar o portal.' : 'Publique um imóvel, serviço ou produto.',
      values: req.body,
      isDemoListingFlow: usingDemo,
      isEditing: false,
      formAction: '/anuncios',
      flash: { type: 'error', title: 'Revise o formulário.', message: imageError || firstError(result) },
    })
  }

  try {
    if (usingDemo) {
      demoListings.create(req.session, result.data)
      req.session.flash = { type: 'success', title: 'Anúncio criado.', message: 'O anúncio foi salvo apenas nesta sessão de demonstração.' }
    } else {
      await databaseListings.createForOwner(req.session.user.id, result.data, req.file)
      req.session.flash = { type: 'success', title: 'Anúncio publicado.', message: 'O anúncio foi salvo no banco e já está disponível no portal.' }
    }
    res.redirect(303, '/meus-anuncios')
  } catch (error) {
    next(error)
  }
}

async function editForm(req, res, next) {
  try {
    const usingDemo = isDemoSession(req)
    const listing = usingDemo
      ? demoListings.find(req.session, req.params.id)
      : await databaseListings.findOwnedById(req.params.id, req.session.user.id)
    if (!listing) return next()

    res.render('anuncios/form', {
      pageTitle: 'Editar anúncio',
      description: 'Atualize as informações do anúncio.',
      values: listing,
      isDemoListingFlow: usingDemo,
      isEditing: true,
      formAction: `/anuncios/${listing.id}/editar`,
    })
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  const usingDemo = isDemoSession(req)
  const result = demoListingSchema.safeParse(req.body)
  const imageError = req.uploadError || validateListingImage(req.file)

  if (!result.success || imageError) {
    return res.status(422).render('anuncios/form', {
      pageTitle: 'Editar anúncio',
      description: 'Atualize as informações do anúncio.',
      values: { ...req.body, id: req.params.id },
      isDemoListingFlow: usingDemo,
      isEditing: true,
      formAction: `/anuncios/${req.params.id}/editar`,
      flash: { type: 'error', title: 'Revise o formulário.', message: imageError || firstError(result) },
    })
  }

  try {
    const listing = usingDemo
      ? demoListings.update(req.session, req.params.id, result.data)
      : await databaseListings.updateForOwner(req.params.id, req.session.user.id, result.data, req.file)
    if (!listing) return next()
    req.session.flash = { type: 'success', title: 'Anúncio atualizado.', message: 'As alterações já estão disponíveis no portal.' }
    res.redirect(303, '/meus-anuncios')
  } catch (error) {
    next(error)
  }
}

async function remove(req, res, next) {
  try {
    const removed = isDemoSession(req)
      ? demoListings.remove(req.session, req.params.id)
      : await databaseListings.archiveForOwner(req.params.id, req.session.user.id)
    if (!removed) return next()
    req.session.flash = { type: 'success', title: 'Anúncio removido.', message: 'O anúncio foi arquivado e não aparece mais no portal.' }
    res.redirect(303, '/meus-anuncios')
  } catch (error) {
    next(error)
  }
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

module.exports = { index, newForm, create, editForm, update, remove, details }
