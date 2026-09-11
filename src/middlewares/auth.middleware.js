function exposeUser(req, res, next) {
  res.locals.user = req.session.user || null
  next()
}

function requireAuth(req, res, next) {
  if (req.session.user) return next()
  return res.redirect(303, `/login?returnTo=${encodeURIComponent(req.originalUrl)}`)
}

module.exports = { exposeUser, requireAuth }
