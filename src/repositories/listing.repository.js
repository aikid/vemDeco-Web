const { getPrisma } = require('../database/prisma')
const crypto = require('node:crypto')

const publicInclude = {
  location: true,
  property: true,
  service: true,
  product: true,
  owner: { select: { name: true, email: true, phone: true } },
  images: {
    orderBy: { position: 'asc' },
    select: { id: true, publicUrl: true, mimeType: true, altText: true, position: true },
  },
}

function toViewModel(listing) {
  return {
    ...listing,
    price: listing.price?.toString() ?? null,
    city: listing.location?.city || '',
    state: listing.location?.state || '',
    neighborhood: listing.location?.neighborhood || '',
    propertyType: listing.property?.propertyType || '',
    purpose: listing.property?.purpose || 'SALE',
    bedrooms: listing.property?.bedrooms ?? null,
    bathrooms: listing.property?.bathrooms ?? null,
    parkingSpaces: listing.property?.parkingSpaces ?? null,
    area: listing.property?.area?.toString() ?? null,
    productCondition: listing.product?.condition || null,
    stock: listing.product?.stock ?? null,
    deliveryDetails: listing.product?.deliveryDetails || null,
    serviceType: listing.service?.serviceType || '',
    serviceArea: listing.service?.serviceArea || '',
    href: `/anuncios/${listing.slug}`,
    ownerName: listing.owner.name,
    ownerPhone: listing.owner.phone,
    ownerEmail: listing.owner.email,
    image: listing.images[0] ? {
      ...listing.images[0],
      publicUrl: listing.images[0].publicUrl || `/media/anuncios/${listing.images[0].id}`,
    } : null,
  }
}

async function findPublished({ search = '', category = '', limit = 12 } = {}) {
  const where = {
    status: 'PUBLISHED',
    deletedAt: null,
  }

  if (category) where.category = { slug: category }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { is: { city: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  const listings = await getPrisma().listing.findMany({
    where,
    include: publicInclude,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })

  return listings.map(toViewModel)
}

async function findPublishedBySlug(slug) {
  const listing = await getPrisma().listing.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    include: publicInclude,
  })

  return listing ? toViewModel(listing) : null
}

async function findByOwnerId(ownerId) {
  const listings = await getPrisma().listing.findMany({
    where: { ownerId, deletedAt: null },
    include: publicInclude,
    orderBy: { updatedAt: 'desc' },
  })

  return listings.map(toViewModel)
}

async function findOwnedById(id, ownerId) {
  const listing = await getPrisma().listing.findFirst({
    where: { id, ownerId, deletedAt: null },
    include: publicInclude,
  })
  return listing ? toViewModel(listing) : null
}

async function createForOwner(ownerId, input, imageFile = null) {
  const prisma = getPrisma()
  const category = await prisma.category.findFirst({
    where: { kind: input.kind, isActive: true },
    include: { subcategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 1 } },
  })

  if (!category) throw new Error(`Categoria ${input.kind} não encontrada. Execute o seed do banco.`)

  const slugBase = input.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 150) || 'anuncio'
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`

  const listing = await prisma.listing.create({
    data: {
      ownerId,
      categoryId: category.id,
      subcategoryId: category.subcategories[0]?.id || null,
      kind: input.kind,
      title: input.title,
      slug,
      description: input.description,
      price: input.price === '' || input.price == null ? null : input.price,
      priceType: input.priceType,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      location: { create: { city: input.city, state: input.state } },
      property: input.kind === 'PROPERTY' ? {
        create: {
          propertyType: input.propertyType,
          purpose: input.purpose,
          bedrooms: input.bedrooms === '' || input.bedrooms == null ? null : input.bedrooms,
          bathrooms: input.bathrooms === '' || input.bathrooms == null ? null : input.bathrooms,
          parkingSpaces: input.parkingSpaces === '' || input.parkingSpaces == null ? null : input.parkingSpaces,
          area: input.area === '' || input.area == null ? null : input.area,
        },
      } : undefined,
      service: input.kind === 'SERVICE' ? {
        create: {
          serviceType: input.serviceType,
          serviceArea: input.serviceArea || null,
        },
      } : undefined,
      product: input.kind === 'PRODUCT' ? {
        create: {
          condition: input.productCondition,
          stock: input.stock,
          deliveryDetails: input.deliveryDetails || null,
        },
      } : undefined,
      images: imageFile ? {
        create: {
          storageKey: `database/${crypto.randomUUID()}`,
          publicUrl: null,
          data: imageFile.buffer,
          mimeType: imageFile.detectedMimeType,
          altText: input.title,
          position: 0,
        },
      } : undefined,
    },
    include: publicInclude,
  })

  return toViewModel(listing)
}

async function updateForOwner(id, ownerId, input, imageFile = null) {
  const prisma = getPrisma()
  const existing = await prisma.listing.findFirst({
    where: { id, ownerId, deletedAt: null },
    select: { id: true, kind: true },
  })
  if (!existing) return null
  if (existing.kind !== input.kind) throw new Error('A categoria do anúncio não pode ser alterada durante a edição.')

  const data = {
    title: input.title,
    description: input.description,
    price: input.price === '' || input.price == null ? null : input.price,
    priceType: input.priceType,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    location: {
      upsert: {
        update: { city: input.city, state: input.state },
        create: { city: input.city, state: input.state },
      },
    },
  }

  if (input.kind === 'PROPERTY') {
    const details = {
      propertyType: input.propertyType,
      purpose: input.purpose,
      bedrooms: input.bedrooms === '' || input.bedrooms == null ? null : input.bedrooms,
      bathrooms: input.bathrooms === '' || input.bathrooms == null ? null : input.bathrooms,
      parkingSpaces: input.parkingSpaces === '' || input.parkingSpaces == null ? null : input.parkingSpaces,
      area: input.area === '' || input.area == null ? null : input.area,
    }
    data.property = { upsert: { update: details, create: details } }
  }
  if (input.kind === 'SERVICE') {
    const details = { serviceType: input.serviceType, serviceArea: input.serviceArea || null }
    data.service = { upsert: { update: details, create: details } }
  }
  if (input.kind === 'PRODUCT') {
    const details = { condition: input.productCondition, stock: input.stock, deliveryDetails: input.deliveryDetails || null }
    data.product = { upsert: { update: details, create: details } }
  }

  if (imageFile) {
    data.images = {
      deleteMany: {},
      create: {
        storageKey: `database/${crypto.randomUUID()}`,
        data: imageFile.buffer,
        mimeType: imageFile.detectedMimeType,
        altText: input.title,
        position: 0,
      },
    }
  }

  const listing = await prisma.listing.update({
    where: { id, ownerId, deletedAt: null },
    data,
    include: publicInclude,
  })

  return listing ? toViewModel(listing) : null
}

async function archiveForOwner(id, ownerId) {
  const result = await getPrisma().listing.updateMany({
    where: { id, ownerId, deletedAt: null },
    data: { status: 'ARCHIVED', deletedAt: new Date() },
  })
  return result.count === 1
}

function findPublicImage(id) {
  return getPrisma().listingImage.findFirst({
    where: { id, listing: { status: 'PUBLISHED', deletedAt: null } },
    select: { data: true, mimeType: true },
  })
}

module.exports = {
  findPublished,
  findPublishedBySlug,
  findByOwnerId,
  findOwnedById,
  createForOwner,
  updateForOwner,
  archiveForOwner,
  findPublicImage,
}
