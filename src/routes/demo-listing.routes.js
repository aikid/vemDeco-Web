const express = require('express')
const listings = require('../controllers/demo-listing.controller')
const { requireAuth } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/meus-anuncios', requireAuth, listings.index)
router.get('/anuncios/novo', requireAuth, listings.newForm)
router.post('/anuncios', requireAuth, listings.create)
router.get('/anuncios/demo/:id', requireAuth, listings.details)

module.exports = router
