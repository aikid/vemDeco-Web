function notFound(req, res) {
  res.status(404).render('errors/404', {
    pageTitle: 'Página não encontrada',
    description: 'O endereço informado não existe ou foi movido.',
  })
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  console.error(error)

  res.locals.currentPath = req.path || '/'
  res.locals.currentYear ||= new Date().getFullYear()

  res.status(error.status || 500).render('errors/500', {
    pageTitle: 'Não foi possível concluir',
    description: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
  })
}

module.exports = { notFound, errorHandler }
