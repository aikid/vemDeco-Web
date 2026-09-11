const crypto = require('node:crypto')

function csrfToken(req, res, next) {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex')
  res.locals.csrfToken = req.session.csrfToken
  next()
}

function verifyCsrf(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next()

  const expected = req.session.csrfToken
  const received = req.body?._csrf || req.get('x-csrf-token')

  if (!expected || !received) return res.status(403).render('errors/403', {
    pageTitle: 'Sessão expirada',
    description: 'Atualize a página e tente novamente.',
  })

  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(String(received))

  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(403).render('errors/403', {
      pageTitle: 'Sessão expirada',
      description: 'Atualize a página e tente novamente.',
    })
  }

  next()
}

module.exports = { csrfToken, verifyCsrf }
