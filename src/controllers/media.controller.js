const listings = require('../repositories/listing.repository')

async function listingImage(req, res, next) {
  try {
    const image = await listings.findPublicImage(req.params.id)
    if (!image?.data || !image.mimeType) return next()
    res.set('Content-Type', image.mimeType)
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(image.data)
  } catch (error) {
    next(error)
  }
}

module.exports = { listingImage }
