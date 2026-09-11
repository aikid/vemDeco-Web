const path = require('node:path')
const express = require('express')
const helmet = require('helmet')
const methodOverride = require('method-override')
const publicRoutes = require('./routes/public.routes')
const authRoutes = require('./routes/auth.routes')
const demoListingRoutes = require('./routes/demo-listing.routes')
const { notFound, errorHandler } = require('./middlewares/error.middleware')
const { createSessionMiddleware } = require('./config/session')
const { csrfToken, verifyCsrf } = require('./middlewares/csrf.middleware')
const { exposeUser } = require('./middlewares/auth.middleware')
const { isProduction, demoMode } = require('./config/env')
const format = require('./utils/format')

const app = express()
const rootDirectory = path.resolve(__dirname, '..')

app.disable('x-powered-by')
if (isProduction) app.set('trust proxy', 1)
app.locals.appName = 'vemDeco'
app.locals.currentYear = new Date().getFullYear()
app.locals.currentPath = '/'
app.locals.user = null
app.locals.flash = null
app.locals.csrfToken = ''
app.locals.demoMode = demoMode
app.locals.formatCurrency = format.currency
app.locals.formatStatus = format.status
app.set('views', path.join(rootDirectory, 'views'))
app.set('view engine', 'ejs')

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ['https://www.google.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

app.use(express.urlencoded({ extended: false, limit: '32kb' }))
app.use(express.json({ limit: '32kb' }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(rootDirectory, 'public'), {
  etag: true,
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
}))

app.use(createSessionMiddleware())
app.use(csrfToken)
app.use(exposeUser)
app.use((req, res, next) => {
  res.locals.appName = 'vemDeco'
  res.locals.currentPath = req.path
  res.locals.currentYear = new Date().getFullYear()
  res.locals.flash = req.session.flash || null
  delete req.session.flash
  res.locals.demoMode = demoMode
  next()
})

app.use(verifyCsrf)
app.use(authRoutes)
app.use(demoListingRoutes)
app.use(publicRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
