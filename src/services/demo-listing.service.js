const crypto = require('node:crypto')

const initialListing = Object.freeze({
  id: 'demo-apartamento-carapicuiba',
  kind: 'PROPERTY',
  title: 'Apartamento com garagem em boa localização',
  description: 'Apartamento na Cohab 5 com dois dormitórios e garagem fechada. Quinto andar, próximo à Praça da Árvore, em prédio bem cuidado.',
  price: '265000',
  priceType: 'FIXED',
  city: 'Carapicuíba',
  state: 'SP',
  propertyType: 'Apartamento',
  purpose: 'SALE',
  bedrooms: 2,
  bathrooms: 2,
  parkingSpaces: 1,
  area: 56,
  status: 'PUBLISHED',
  createdAt: '2026-09-11T12:00:00.000Z',
})

function initialize(session) {
  if (!Array.isArray(session.demoListings)) session.demoListings = [{ ...initialListing }]
  return session.demoListings
}

function featured() {
  return { ...initialListing }
}

function create(session, input) {
  const listing = {
    id: crypto.randomUUID(),
    ...input,
    price: input.price || null,
    bedrooms: numberOrNull(input.bedrooms),
    bathrooms: numberOrNull(input.bathrooms),
    parkingSpaces: numberOrNull(input.parkingSpaces),
    area: numberOrNull(input.area),
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  }
  initialize(session).unshift(listing)
  return listing
}

function find(session, id) {
  return initialize(session).find((listing) => listing.id === id)
}

function update(session, id, input) {
  const listing = find(session, id)
  if (!listing) return null
  Object.assign(listing, input, {
    price: input.price || null,
    bedrooms: numberOrNull(input.bedrooms),
    bathrooms: numberOrNull(input.bathrooms),
    parkingSpaces: numberOrNull(input.parkingSpaces),
    area: numberOrNull(input.area),
  })
  return listing
}

function remove(session, id) {
  const listings = initialize(session)
  const index = listings.findIndex((listing) => listing.id === id)
  if (index < 0) return false
  listings.splice(index, 1)
  return true
}

function numberOrNull(value) {
  if (value === '' || value === undefined || value === null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

module.exports = { initialize, featured, create, find, update, remove }
