const AppError = require('../errors/app-error')
const { getPrisma } = require('../database/prisma')

async function create(listingId, user, input) {
  const prisma = getPrisma()
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
      kind: { in: ['PROPERTY', 'SERVICE'] },
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: { id: true, ownerId: true },
  })

  if (!listing) throw new AppError('Este anúncio não está disponível para receber interesses.', 404, 'LISTING_UNAVAILABLE')
  if (listing.ownerId === user.id) throw new AppError('Você não pode demonstrar interesse no próprio anúncio.', 403, 'OWN_LISTING')

  const existing = await prisma.listingInterest.findFirst({
    where: {
      listingId,
      userId: user.id,
      status: { in: ['NEW', 'READ', 'CONTACTED'] },
    },
    orderBy: { createdAt: 'desc' },
  })
  if (existing) return existing

  return prisma.listingInterest.create({
    data: {
      listingId,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: input.phone || null,
      message: input.message,
    },
  })
}

function countNewForOwner(ownerId) {
  return getPrisma().listingInterest.count({
    where: { status: 'NEW', listing: { ownerId, deletedAt: null } },
  })
}

async function findReceivedByOwner(ownerId) {
  const prisma = getPrisma()
  const received = await prisma.listingInterest.findMany({
    where: { listing: { ownerId, deletedAt: null } },
    include: {
      listing: { select: { title: true, slug: true, kind: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const newIds = received.filter((interest) => interest.status === 'NEW').map((interest) => interest.id)
  if (newIds.length) {
    await prisma.listingInterest.updateMany({ where: { id: { in: newIds } }, data: { status: 'READ' } })
  }

  return received
}

function findSentByUser(id, userId) {
  return getPrisma().listingInterest.findFirst({
    where: { id, userId },
    include: { listing: { select: { title: true, slug: true, owner: { select: { name: true } } } } },
  })
}

module.exports = { create, countNewForOwner, findReceivedByOwner, findSentByUser }
