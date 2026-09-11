const authService = require('../services/auth.service')
const { registerSchema, loginSchema, firstError } = require('../validators/auth.validator')
const { demoMode } = require('../config/env')
const demoListings = require('../services/demo-listing.service')

function renderError(res, view, pageTitle, description, message, status = 422, values = {}) {
  return res.status(status).render(view, {
    pageTitle,
    description,
    values,
    returnTo: values.returnTo || '',
    flash: { type: 'error', title: 'Não foi possível continuar.', message },
  })
}

async function register(req, res, next) {
  const result = registerSchema.safeParse(req.body)
  if (!result.success) {
    return renderError(res, 'cadastro', 'Criar conta', 'Crie sua conta gratuita na vemDeco.', firstError(result), 422, {
      name: req.body.name || '', email: req.body.email || '', phone: req.body.phone || '', document: req.body.document || '',
    })
  }

  try {
    const user = await authService.register(result.data)
    req.session.regenerate((error) => {
      if (error) return next(error)
      req.session.user = user
      return res.redirect(303, '/dashboard')
    })
  } catch (error) {
    if (error.status) return renderError(res, 'cadastro', 'Criar conta', 'Crie sua conta gratuita na vemDeco.', error.message, error.status, result.data)
    throw error
  }
}

async function login(req, res, next) {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) return renderError(res, 'login', 'Entrar', 'Acesse sua conta vemDeco.', firstError(result), 422, { email: req.body.email || '', returnTo: req.body.returnTo || '' })

  try {
    const user = await authService.authenticate(result.data)
    const returnTo = safeReturnTo(result.data.returnTo)

    req.session.regenerate((error) => {
      if (error) return next(error)
      req.session.user = user
      return res.redirect(303, returnTo)
    })
  } catch (error) {
    if (error.status) return renderError(res, 'login', 'Entrar', 'Acesse sua conta vemDeco.', error.message, error.status, { email: result.data.email, returnTo: result.data.returnTo })
    throw error
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error)
    res.clearCookie('vemdeco.sid')
    return res.redirect(303, '/')
  })
}

function demoLogin(req, res, next) {
  if (!demoMode) return res.status(404).render('errors/404', {
    pageTitle: 'Página não encontrada',
    description: 'O modo de demonstração não está disponível.',
  })

  req.session.regenerate((error) => {
    if (error) return next(error)
    req.session.user = {
      id: 'demo-user',
      name: 'Visitante Demo',
      email: 'demo@vemdeco.local',
      role: 'USER',
      isDemo: true,
    }
    demoListings.initialize(req.session)
    return res.redirect(303, '/dashboard')
  })
}

function safeReturnTo(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'
}

module.exports = { register, login, logout, demoLogin }
