const express = require('express')
const { rateLimit } = require('express-rate-limit')
const auth = require('../controllers/auth.controller')

const router = express.Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
})

router.post('/login', authLimiter, auth.login)
router.post('/cadastro', authLimiter, auth.register)
router.post('/logout', auth.logout)
router.post('/demo/login', auth.demoLogin)

module.exports = router
