const multer = require('multer')
const { imageSize } = require('image-size')

const MAX_FILE_SIZE = 3 * 1024 * 1024
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('A foto deve estar em formato JPEG, PNG ou WebP.'))
    }
    callback(null, true)
  },
})

function listingImageUpload(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      req.uploadError = 'A foto deve ter no máximo 3 MB.'
    } else if (error) {
      req.uploadError = error.message || 'Não foi possível processar a foto.'
    }
    next()
  })
}

function validateListingImage(file) {
  if (!file) return null

  try {
    const { width, height, type } = imageSize(file.buffer)
    if (!['jpg', 'png', 'webp'].includes(type)) return 'O conteúdo da foto não corresponde a um formato permitido.'
    file.detectedMimeType = ({ jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' })[type]
    if (width < 1200 || height < 800) return 'A foto deve ter pelo menos 1200 × 800 pixels.'
    if (width > 3072 || height > 2048) return 'A foto deve ter no máximo 3072 × 2048 pixels.'
    if (Math.abs((width / height) - 1.5) > 0.02) return 'A foto deve usar a proporção horizontal 3:2, como 1536 × 1024 pixels.'
    return null
  } catch {
    return 'Não foi possível validar a foto enviada.'
  }
}

module.exports = { listingImageUpload, validateListingImage, MAX_FILE_SIZE }
