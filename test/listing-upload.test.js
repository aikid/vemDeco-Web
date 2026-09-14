const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { validateListingImage, MAX_FILE_SIZE } = require('../src/middlewares/listing-upload.middleware')

test('aceita o padrão 3:2 usado nas imagens do catálogo', () => {
  const buffer = fs.readFileSync(path.resolve(__dirname, '../public/img/listings/apartamento-carapicuiba.png'))
  assert.ok(buffer.length <= MAX_FILE_SIZE)
  assert.equal(validateListingImage({ buffer }), null)
})

test('recusa imagem menor que a resolução mínima', () => {
  const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X6X7WQAAAABJRU5ErkJggg==', 'base64')
  assert.match(validateListingImage({ buffer: tinyPng }), /pelo menos 1200 × 800/)
})
