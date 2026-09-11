const express = require('express')
const pages = require('../controllers/page.controller')
const { requireAuth } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/', pages.home)
router.get('/login', pages.login)
router.get('/cadastro', pages.register)
router.get('/dashboard', requireAuth, pages.dashboard)
router.get('/confirmaremail', pages.confirmEmail)
router.get('/esquecisenha', pages.forgotPassword)
router.get('/produto', pages.listingDetails)
router.get('/contato', pages.contact)
router.post('/confirmaremail', pages.confirmEmailUnavailable)
router.post('/esquecisenha', pages.forgotPasswordUnavailable)
router.post('/contato', pages.contactUnavailable)

module.exports = router
